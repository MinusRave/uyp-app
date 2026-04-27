import { HttpError } from "wasp/server";
import type {
  CompleteStayOrLeaveTest,
  GenerateStayOrLeaveAssessment,
  CreateStayOrLeaveCheckoutSession,
  StartStayOrLeaveSession,
  TrackMetaCapiEvent,
  SaveStayOrLeaveAnswers,
} from "wasp/server/operations";
import { computeSoLResult, type SoLAnswers } from "../test/stayOrLeaveScoring";
import { generateVerdictLine, generateAssessment, type SoLAiCommentary } from "../server/stayOrLeaveAi";
import { stripeClient } from "./stripe/stripeClient";
import { sendCapiEvent } from "../server/analytics/metaCapi";
import { STAY_OR_LEAVE_QUESTIONS } from "../test/stayOrLeaveQuestions";

export const STAY_OR_LEAVE_PRICE = 13.90;
export const STAY_OR_LEAVE_PRODUCT_NAME = "Stay or Leave Test — Full Professional Assessment";

// ============================================================================
// completeStayOrLeaveTest
//   - Called from the client when the user finishes question 30.
//   - Computes scores + verdict deterministically (no AI).
//   - Fires the small Haiku call to generate the personalized verdict line
//     for the sales page.
//   - Idempotent: if the assessment is already cached or the verdict line is
//     already present, returns the cached value.
// ============================================================================

export type CompleteStayOrLeaveArgs = {
  sessionId: string;
  // Optional: when present, overwrites the answers stored on the session.
  // Sent at the end of the quiz so we don't rely on save-as-you-go state.
  answers?: SoLAnswers;
};

// Index signature required for SuperJSON serialization through Wasp.
export type SoLPublicData = {
  scores: { [k: string]: number };
  overall: number;
  verdict: string;
  recommendation: string;
  finalAnswer: string;
  weakestDimension: string;
  strongestDimension: string;
  verdictLine: string | null;
  isPaid: boolean;
  aiCommentary: SoLAiCommentary | null;
  [key: string]: any;
};

export const completeStayOrLeaveTest: CompleteStayOrLeaveTest<
  CompleteStayOrLeaveArgs,
  SoLPublicData
> = async ({ sessionId, answers: providedAnswers }, context) => {
  const testSession = await context.entities.TestSession.findUnique({
    where: { id: sessionId },
  });
  if (!testSession) throw new HttpError(404, "Session not found");

  if (context.user && testSession.userId && testSession.userId !== context.user.id) {
    throw new HttpError(403, "Invalid session ownership.");
  }

  // Use provided answers if present, else read from session.
  const answers = (providedAnswers ?? (testSession.answers as unknown)) as SoLAnswers;
  if (!answers || typeof answers !== "object") {
    throw new HttpError(400, "No answers found on session.");
  }

  // Persist answers if they were sent in the call.
  if (providedAnswers) {
    await context.entities.TestSession.update({
      where: { id: sessionId },
      data: { answers: providedAnswers as any },
    });
  }

  const result = computeSoLResult(answers);

  const existing = (testSession.stayOrLeaveData as any) || {};
  let verdictLine: string | null = existing.verdictLine ?? null;

  if (!verdictLine) {
    try {
      const out = await generateVerdictLine(answers, result);
      verdictLine = out.text;
    } catch (e) {
      console.error("[completeStayOrLeaveTest] verdict line failed:", e);
      // Fall back to a templated line so the sales page can still render.
      verdictLine = `Your verdict is ${humanize(result.verdict)}. Your overall score is ${result.overall} out of 100.`;
    }
  }

  const updatedData = {
    scores: result.scores,
    overall: result.overall,
    verdict: result.verdict,
    recommendation: result.recommendation,
    finalAnswer: result.finalAnswer,
    weakestDimension: result.weakestDimension,
    strongestDimension: result.strongestDimension,
    verdictLine,
    aiCommentary: existing.aiCommentary ?? null,
    completedAt: existing.completedAt ?? new Date().toISOString(),
  };

  await context.entities.TestSession.update({
    where: { id: sessionId },
    data: {
      stayOrLeaveData: updatedData,
      isCompleted: true,
      // Move them off the abandon sequence onto the completer sequence.
      // Reset retention stage so the new sequence starts at stage 1.
      emailSequenceType: "sol_test_completed_no_purchase",
      retentionEmailStage: 0,
      lastRetentionEmailSentAt: null,
    },
  });

  return {
    scores: result.scores,
    overall: result.overall,
    verdict: result.verdict,
    recommendation: result.recommendation,
    finalAnswer: result.finalAnswer,
    weakestDimension: result.weakestDimension,
    strongestDimension: result.strongestDimension,
    verdictLine,
    isPaid: testSession.isPaid,
    aiCommentary: updatedData.aiCommentary,
  };
};

// ============================================================================
// generateStayOrLeaveAssessment
//   - Called from the Stripe webhook after payment is confirmed.
//   - Fires the 3 parallel Sonnet calls to build the full assessment.
//   - Idempotent: if aiCommentary is already present, does nothing.
//   - Also safe to call from the assessment page itself as a fallback if the
//     webhook is delayed (it will just no-op when cached).
// ============================================================================

export type GenerateAssessmentArgs = { sessionId: string };

export const generateStayOrLeaveAssessment: GenerateStayOrLeaveAssessment<
  GenerateAssessmentArgs,
  { ok: true; cached: boolean }
> = async ({ sessionId }, context) => {
  const testSession = await context.entities.TestSession.findUnique({
    where: { id: sessionId },
  });
  if (!testSession) throw new HttpError(404, "Session not found");
  if (!testSession.isPaid) throw new HttpError(403, "Session is not paid.");

  if (context.user && testSession.userId && testSession.userId !== context.user.id) {
    throw new HttpError(403, "Invalid session ownership.");
  }

  const existing = (testSession.stayOrLeaveData as any) || {};
  if (existing.aiCommentary) return { ok: true, cached: true };

  const answers = testSession.answers as unknown as SoLAnswers;
  if (!answers || typeof answers !== "object") {
    throw new HttpError(400, "No answers found on session.");
  }

  const result = computeSoLResult(answers);
  const { commentary } = await generateAssessment(answers, result);

  const updatedData = {
    ...existing,
    scores: result.scores,
    overall: result.overall,
    verdict: result.verdict,
    recommendation: result.recommendation,
    finalAnswer: result.finalAnswer,
    weakestDimension: result.weakestDimension,
    strongestDimension: result.strongestDimension,
    aiCommentary: commentary,
    assessmentGeneratedAt: new Date().toISOString(),
  };

  await context.entities.TestSession.update({
    where: { id: sessionId },
    data: { stayOrLeaveData: updatedData },
  });

  return { ok: true, cached: false };
};

// ============================================================================
// startStayOrLeaveSession
//   - Called from the client at the mid-quiz email gate (after Q15).
//   - Creates a TestSession with testType="stay-or-leave", email, and the
//     partial answers collected so far.
//   - If the session already exists (returning user), updates email + answers.
//   - Returns { sessionId }.
// ============================================================================

export type StartStayOrLeaveArgs = {
  sessionId?: string; // pass to update existing; omit to create new
  email: string;
  partialAnswers: SoLAnswers;
};

export const startStayOrLeaveSession: StartStayOrLeaveSession<
  StartStayOrLeaveArgs,
  { sessionId: string }
> = async ({ sessionId, email, partialAnswers }, context) => {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
    throw new HttpError(400, "Please enter a valid email.");
  }

  if (sessionId) {
    const existing = await context.entities.TestSession.findUnique({
      where: { id: sessionId },
    });
    if (!existing) throw new HttpError(404, "Session not found");
    if (context.user && existing.userId && existing.userId !== context.user.id) {
      throw new HttpError(403, "Invalid session ownership.");
    }
    await context.entities.TestSession.update({
      where: { id: sessionId },
      data: {
        email: normalizedEmail,
        answers: partialAnswers as any,
        testType: "stay-or-leave",
        // Tentative: assume abandon. Will be flipped to completer by completeStayOrLeaveTest.
        emailSequenceType: existing.emailSequenceType ?? "sol_test_abandoned",
      },
    });
    return { sessionId };
  }

  const created = await context.entities.TestSession.create({
    data: {
      email: normalizedEmail,
      answers: partialAnswers as any,
      testType: "stay-or-leave",
      currentQuestionIndex: Object.keys(partialAnswers).length,
      userId: context.user?.id,
      emailSequenceType: "sol_test_abandoned",
    },
  });
  return { sessionId: created.id };
};

function humanize(s: string): string {
  return s
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// ============================================================================
// createStayOrLeaveCheckoutSession
//   - Builds a Stripe Checkout Session for the $13.90 assessment.
//   - Single inline price_data line item, no addons in v1.
//   - Metadata.type = "stay_or_leave_unlock" so the webhook routes correctly.
// ============================================================================

export type CreateStayOrLeaveCheckoutArgs = {
  sessionId: string;
  eventID?: string;
};

export type StayOrLeaveCheckoutResult = {
  sessionUrl: string | null;
  sessionId: string;
};

export const createStayOrLeaveCheckoutSession: CreateStayOrLeaveCheckoutSession<
  CreateStayOrLeaveCheckoutArgs,
  StayOrLeaveCheckoutResult
> = async ({ sessionId, eventID }, context) => {
  const testSession = await context.entities.TestSession.findUnique({
    where: { id: sessionId },
  });
  if (!testSession) throw new HttpError(404, "Session not found.");

  if (context.user) {
    if (!testSession.userId) {
      await context.entities.TestSession.update({
        where: { id: sessionId },
        data: { userId: context.user.id },
      });
    } else if (testSession.userId !== context.user.id) {
      throw new HttpError(403, "Invalid session ownership.");
    }
  }

  const customerEmail = context.user?.email || testSession.email;

  // Fire-and-forget Meta CAPI InitiateCheckout
  if (eventID) {
    sendCapiEvent({
      eventName: "InitiateCheckout",
      eventId: eventID,
      eventSourceUrl:
        (context as any).req?.headers?.referer ||
        "https://understandyourpartner.com/sol-results",
      userData: {
        email: customerEmail || undefined,
        clientIp: (context as any).req?.ip,
        userAgent: (context as any).req?.headers?.["user-agent"],
        fbp: (context as any).req?.cookies?.["_fbp"],
        fbc: (context as any).req?.cookies?.["_fbc"],
      },
      customData: {
        currency: "usd",
        value: STAY_OR_LEAVE_PRICE,
        content_name: STAY_OR_LEAVE_PRODUCT_NAME,
        content_category: "Assessment",
        content_ids: ["stay-or-leave-assessment"],
        content_type: "product",
      },
    });
  }

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: STAY_OR_LEAVE_PRODUCT_NAME,
          description:
            "6 dimension scores, full written analysis, your final result, and a clear recommendation.",
        },
        unit_amount: Math.round(STAY_OR_LEAVE_PRICE * 100),
      },
      quantity: 1,
    },
  ];

  let session;
  try {
    session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      submit_type: "pay",
      allow_promotion_codes: true,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000"}/assessment?session_id=${sessionId}&success=true`,
      cancel_url: `${process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000"}/sol-results?session=${sessionId}`,
      customer_email: customerEmail || undefined,
      metadata: {
        testSessionId: sessionId,
        userId: context.user?.id || "",
        type: "stay_or_leave_unlock",
        capiEventId: eventID || "",
      },
    });
  } catch (error) {
    console.error("Stripe Checkout Creation Failed (S-o-L):", error);
    const message = error instanceof Error ? error.message : String(error);
    throw new HttpError(500, `Stripe Error: ${message}`);
  }

  if (!session || !session.url) {
    throw new HttpError(500, "Failed to create checkout session");
  }

  await context.entities.TestSession.update({
    where: { id: sessionId },
    data: {
      stripeCheckoutSessionId: session.id,
      checkoutStartedAt: new Date(),
      fbp: (context as any).req?.cookies?.["_fbp"] || undefined,
      fbc: (context as any).req?.cookies?.["_fbc"] || undefined,
    },
  });

  return {
    sessionUrl: session.url,
    sessionId: session.id,
  };
};

// ============================================================================
// saveStayOrLeaveAnswers
//   - Fire-and-forget answer-sync called from the quiz UI after each Q.
//   - Idempotent: overwrites the full answers JSON (last-write-wins).
//   - Lets the user resume on a different device via the email link, since
//     the server is the source of truth for in-progress sessions.
// ============================================================================

export type SaveStayOrLeaveAnswersArgs = {
  sessionId: string;
  answers: SoLAnswers;
  currentQuestionIndex?: number;
};

export const saveStayOrLeaveAnswers: SaveStayOrLeaveAnswers<
  SaveStayOrLeaveAnswersArgs,
  { ok: true }
> = async ({ sessionId, answers, currentQuestionIndex }, context) => {
  const testSession = await context.entities.TestSession.findUnique({
    where: { id: sessionId },
    select: { id: true, userId: true, isPaid: true, isCompleted: true },
  });
  if (!testSession) throw new HttpError(404, "Session not found");
  if (context.user && testSession.userId && testSession.userId !== context.user.id) {
    throw new HttpError(403, "Invalid session ownership.");
  }
  if (testSession.isPaid || testSession.isCompleted) {
    // Don't overwrite answers after the test is locked in.
    return { ok: true };
  }

  await context.entities.TestSession.update({
    where: { id: sessionId },
    data: {
      answers: answers as any,
      ...(typeof currentQuestionIndex === "number"
        ? { currentQuestionIndex }
        : {}),
    },
  });
  return { ok: true };
};

// ============================================================================
// trackMetaCapiEvent
//   - Server-side companion to client-side Pixel events.
//   - Reads identity signals (email, fbp, fbc, ip, ua) from session + request.
//   - Pass the SAME eventID used in trackPixelEvent on the client → Meta dedups.
// ============================================================================

export type TrackMetaCapiEventArgs = {
  sessionId?: string;
  eventName: string;
  eventID: string;
  eventSourceUrl?: string;
  customData?: { [key: string]: any };
};

export const trackMetaCapiEvent: TrackMetaCapiEvent<
  TrackMetaCapiEventArgs,
  { ok: true }
> = async ({ sessionId, eventName, eventID, eventSourceUrl, customData }, context) => {
  const userData: any = {
    clientIp: (context as any).req?.ip,
    userAgent: (context as any).req?.headers?.["user-agent"],
    fbp: (context as any).req?.cookies?.["_fbp"],
    fbc: (context as any).req?.cookies?.["_fbc"],
  };

  if (sessionId) {
    const testSession = await context.entities.TestSession.findUnique({
      where: { id: sessionId },
      select: { email: true, fbp: true, fbc: true, userId: true },
    });
    if (testSession) {
      if (testSession.email) userData.email = testSession.email;
      if (testSession.fbp) userData.fbp = userData.fbp || testSession.fbp;
      if (testSession.fbc) userData.fbc = userData.fbc || testSession.fbc;
    }
  }

  // Fire-and-forget but await to surface errors in dev.
  try {
    await sendCapiEvent({
      eventName,
      eventId: eventID,
      eventSourceUrl: eventSourceUrl || "https://understandyourpartner.com",
      userData,
      customData: customData || {},
    });
  } catch (e) {
    console.error("[trackMetaCapiEvent] CAPI send failed:", e);
  }

  return { ok: true };
};
