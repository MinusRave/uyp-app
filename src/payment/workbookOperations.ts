import { HttpError } from "wasp/server";
import type { CreateWorkbookCheckoutSession, GetWorkbookDownloadUrl } from "wasp/server/operations";
import { stripeClient } from "./stripe/stripeClient";
import { getDownloadFileSignedURLFromS3 } from "../file-upload/s3Utils";

export const WORKBOOK_PRICE = 11.00;
export const WORKBOOK_PRODUCT_NAME = "Should I Stay or Leave My Partner? — The Workbook + Bonus";
export const WORKBOOK_S3_KEY = "products/should-i-stay-or-leave-workbook.pdf";
export const WORKBOOK_BONUS_S3_KEY = "products/what-if-i-regret-it.pdf";

export type CreateWorkbookCheckoutArgs = {
  eventID?: string;
};

export type WorkbookCheckoutResult = {
  sessionUrl: string | null;
};

export const createWorkbookCheckoutSession: CreateWorkbookCheckoutSession<
  CreateWorkbookCheckoutArgs,
  WorkbookCheckoutResult
> = async ({ eventID }, context) => {
  const testSession = await context.entities.TestSession.create({
    data: {
      testType: "workbook",
      userId: context.user?.id ?? null,
      email: context.user?.email ?? null,
    },
  });

  let session;
  try {
    session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      submit_type: "pay",
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: WORKBOOK_PRODUCT_NAME,
              description: "27 questions. 5 sections. ~25 pages. Built to be done in one evening.",
            },
            unit_amount: Math.round(WORKBOOK_PRICE * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000"}/workbook/download?session=${testSession.id}`,
      cancel_url: `${process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000"}/workbook`,
      customer_email: context.user?.email || undefined,
      metadata: {
        testSessionId: testSession.id,
        type: "workbook_purchase",
        capiEventId: eventID || "",
      },
    });
  } catch (error) {
    console.error("Stripe Checkout Creation Failed (Workbook):", error);
    const message = error instanceof Error ? error.message : String(error);
    throw new HttpError(500, `Stripe Error: ${message}`);
  }

  if (!session?.url) throw new HttpError(500, "Failed to create checkout session");

  await context.entities.TestSession.update({
    where: { id: testSession.id },
    data: {
      stripeCheckoutSessionId: session.id,
      checkoutStartedAt: new Date(),
    },
  });

  return { sessionUrl: session.url };
};

export type GetWorkbookDownloadUrlArgs = {
  sessionId: string;
};

export type WorkbookDownloadUrlResult = {
  workbookUrl: string;
  bonusUrl: string;
};

export const getWorkbookDownloadUrl: GetWorkbookDownloadUrl<
  GetWorkbookDownloadUrlArgs,
  WorkbookDownloadUrlResult
> = async ({ sessionId }, context) => {
  const testSession = await context.entities.TestSession.findUnique({
    where: { id: sessionId },
  });

  if (!testSession) throw new HttpError(404, "Session not found");
  if (testSession.testType !== "workbook") throw new HttpError(400, "Invalid session type");
  if (!testSession.isPaid) throw new HttpError(403, "Payment not confirmed yet");

  const [workbookUrl, bonusUrl] = await Promise.all([
    getDownloadFileSignedURLFromS3({ s3Key: WORKBOOK_S3_KEY }),
    getDownloadFileSignedURLFromS3({ s3Key: WORKBOOK_BONUS_S3_KEY }),
  ]);

  return { workbookUrl, bonusUrl };
};
