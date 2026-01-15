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

export type CreateCheckoutSessionArgs = {
  sessionId: string;
};

export const createCheckoutSession: CreateCheckoutSession<
  CreateCheckoutSessionArgs,
  CheckoutSession
> = async ({ sessionId }, context) => {
  // 1. Fetch Session
  console.log("[createCheckoutSession] SessionId:", sessionId);
  console.log("[createCheckoutSession] User Context:", context.user?.id);

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
      throw new HttpError(403, "Invalid session ownership.");
    }
  }

  // If NOT logged in, we MUST have a captured lead email on the session
  const customerEmail = context.user?.email || testSession.email;
  console.log("[createCheckoutSession] Determined Email:", customerEmail);

  if (!customerEmail) {
    console.warn("[createCheckoutSession] Missing email for session:", sessionId);
    throw new HttpError(401, "Email required. Please log in or provide email at end of test.");
  }

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "UnderstandYourPartner - Full Report",
            description: "Detailed analysis of your relationship dynamics.",
          },
          unit_amount: 1500, // $15.00
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${config.frontendUrl}/report?success=true`,
    cancel_url: `${config.frontendUrl}/results`,
    customer_email: customerEmail,
    metadata: {
      testSessionId: sessionId,
      userId: context.user?.id || "", // Empty if anonymous
      type: "report_unlock"
    },
  });

  if (!session.url) {
    throw new HttpError(500, "Failed to create checkout session");
  }

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
