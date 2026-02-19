import { HttpError } from "wasp/server"; // Import Action type correctly
import type {
  GenerateCheckoutSession,
  CreateCheckoutSession,
  GetCustomerPortalUrl,
} from "wasp/server/operations";
import * as z from "zod";
import { PaymentPlanId, paymentPlans } from "../payment/plans";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
import { paymentProcessor } from "./paymentProcessor";
import { stripeClient } from "./stripe/stripeClient";
import { config } from "wasp/server";

export type CheckoutSession = {
  sessionUrl: string | null;
  sessionId: string;
};

const generateCheckoutSessionSchema = z.nativeEnum(PaymentPlanId);

type GenerateCheckoutSessionInput = z.infer<
  typeof generateCheckoutSessionSchema
>;

export const generateCheckoutSession: GenerateCheckoutSession<
  GenerateCheckoutSessionInput,
  CheckoutSession
> = async (rawPaymentPlanId, context) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  const paymentPlanId = ensureArgsSchemaOrThrowHttpError(
    generateCheckoutSessionSchema,
    rawPaymentPlanId,
  );
  const userId = context.user.id;
  const userEmail = context.user.email;
  if (!userEmail) {
    // If using the usernameAndPassword Auth method, switch to an Auth method that provides an email.
    throw new HttpError(403, "User needs an email to make a payment.");
  }

  const paymentPlan = paymentPlans[paymentPlanId];
  const { session } = await paymentProcessor.createCheckoutSession({
    userId,
    userEmail,
    paymentPlan,
    prismaUserDelegate: context.entities.User,
  });

  return {
    sessionUrl: session.url,
    sessionId: session.id,
  };
};

import { sendCapiEvent } from "../server/analytics/metaCapi";

export type CreateCheckoutSessionArgs = {
  sessionId: string;
  eventID?: string;
  addWorkbook?: boolean; // NEW: Order bump
};

export const createCheckoutSession: CreateCheckoutSession<
  CreateCheckoutSessionArgs,
  CheckoutSession
> = async ({ sessionId, eventID, addWorkbook }, context) => {
  // 1. Fetch Session
  console.log("[createCheckoutSession] SessionId:", sessionId);
  console.log("[createCheckoutSession] User Context:", context.user?.id);
  console.log("[createCheckoutSession] Add Workbook:", addWorkbook);

  const testSession = await context.entities.TestSession.findUnique({
    where: { id: sessionId },
  });

  if (!testSession) {
    console.error("[createCheckoutSession] Session not found:", sessionId);
    throw new HttpError(404, "Session not found.");
  }

  console.log("[createCheckoutSession] TestSession Email:", testSession.email);

  // 2. Determine User / Email
  // If logged in, ensure ownership or claim.
  if (context.user) {
    if (!testSession.userId) {
      // Claim
      await context.entities.TestSession.update({
        where: { id: sessionId },
        data: { userId: context.user.id }
      });
    } else if (testSession.userId !== context.user.id) {
      console.error(`[createCheckoutSession] 403 Mismatch! TestSession UserId: ${testSession.userId} vs Context UserId: ${context.user.id}`);
      throw new HttpError(403, "Invalid session ownership.");
    }
  }

  // If NOT logged in, we MUST have a captured lead email on the session
  const customerEmail = context.user?.email || testSession.email;
  console.log("[createCheckoutSession] Determined Email:", customerEmail);

  // NOTE: If customerEmail is missing, we allow it (Stripe will ask for it)
  // This supports the "Skip Email Gate" A/B test case.

  // 3. Send Meta CAPI InitiateCheckout Event
  const reportPrice = parseFloat(process.env.REPORT_PRICE || "29.00");
  const workbookPrice = 12.00;
  let totalPrice = reportPrice;
  if (addWorkbook) totalPrice += workbookPrice;

  if (eventID) {
    // Run in background
    sendCapiEvent({
      eventName: 'InitiateCheckout',
      eventId: eventID,
      eventSourceUrl: (context as any).req?.headers?.referer || 'https://understandyourpartner.com/results',
      userData: {
        email: customerEmail || undefined, // Allow undefined
        clientIp: (context as any).req?.ip,
        userAgent: (context as any).req?.headers?.['user-agent'],
        fbp: (context as any).req?.cookies?.['_fbp'],
        fbc: (context as any).req?.cookies?.['_fbc'],
      },
      customData: {
        currency: 'usd',
        value: totalPrice,
        content_name: 'Full Relationship Report', // Stick to main product for name
        content_category: 'Report',
        content_ids: ['report-full'],
        content_type: 'product',
      }
    });
  }

  // 4. Log price for verification
  console.log(`[createCheckoutSession] Charging price: $${totalPrice}`);

  // 5. Create Stripe Checkout Session
  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Understand Your Partner - Full Analysis",
          description: "Complete Relationship Diagnosis, 5-Year Forecast, and 5 Targeted Strategic Protocol Guides.",
        },
        unit_amount: Math.round(reportPrice * 100),
      },
      quantity: 1,
    }
  ];

  if (addWorkbook) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "The 30-Day Reconnection Workbook",
          description: "Daily guided exercises to rebuild connection.",
        },
        unit_amount: Math.round(workbookPrice * 100),
      },
      quantity: 1,
    });
  }

  let session;
  try {
    session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: 'auto', // Reduces friction
      phone_number_collection: { enabled: false }, // Don't ask for phone
      submit_type: 'pay', // Button says "Pay" not "Subscribe"
      line_items: lineItems,
      mode: "payment",
      success_url: `${config.frontendUrl}/report?success=true&session_id=${sessionId}`,
      cancel_url: `${config.frontendUrl}/results?checkout_cancelled=true`,
      // customer_email: customerEmail || undefined, // COMMENTED OUT: Makes email editable. Stripe will ask for it.
      metadata: {
        testSessionId: sessionId,
        userId: context.user?.id || "", // Empty if anonymous
        type: "report_unlock",
        capiEventId: eventID || "", // Pass it just in case we need it
        hasOrderBump: addWorkbook ? "true" : "false", // Track if they bought it
      },
    });
  } catch (error) {
    console.error("Stripe Checkout Creation Failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    throw new HttpError(500, `Stripe Error: ${message}`);
  }

  if (!session || !session.url) {
    throw new HttpError(500, "Failed to create checkout session");
  }

  // UPDATE: Save checkout session details to DB so we can track abandonment
  await context.entities.TestSession.update({
    where: { id: sessionId },
    data: {
      stripeCheckoutSessionId: session.id,
      checkoutStartedAt: new Date(),
      // Also persist cookies here in case they were missed or updated
      fbp: (context as any).req?.cookies?.['_fbp'] || undefined,
      fbc: (context as any).req?.cookies?.['_fbc'] || undefined,
    }
  });

  return {
    sessionUrl: session.url,
    sessionId: session.id,
  };
};

export const getCustomerPortalUrl: GetCustomerPortalUrl<
  void,
  string | null
> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  return null;
};
