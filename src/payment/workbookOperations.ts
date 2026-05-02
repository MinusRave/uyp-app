import { HttpError } from "wasp/server";
import type { CreateWorkbookCheckoutSession, GetWorkbookDownloadUrl } from "wasp/server/operations";
import { stripeClient } from "./stripe/stripeClient";
import { getDownloadFileSignedURLFromS3 } from "../file-upload/s3Utils";
import { sendCapiEvent } from "../server/analytics/metaCapi";

export const WORKBOOK_PRICE = 17.00;
export const COMPANION_PRICE = 7.00;
export const WORKBOOK_PRODUCT_NAME = "Should I Stay or Leave My Partner? — The Workbook";
export const COMPANION_PRODUCT_NAME = '"What If I Regret It?" — The Decision Companion';
export const WORKBOOK_CONTENT_ID = "workbook";
export const COMPANION_CONTENT_ID = "companion";
export const WORKBOOK_CONTENT_CATEGORY = "Workbook";
export const WORKBOOK_S3_KEY = "products/should-i-stay-or-leave-workbook.pdf";
export const WORKBOOK_BONUS_S3_KEY = "products/what-if-i-regret-it.pdf";

export type CreateWorkbookCheckoutArgs = {
  eventID?: string;
  includeCompanion?: boolean;
};

export type WorkbookCheckoutResult = {
  sessionUrl: string | null;
};

export const createWorkbookCheckoutSession: CreateWorkbookCheckoutSession<
  CreateWorkbookCheckoutArgs,
  WorkbookCheckoutResult
> = async ({ eventID, includeCompanion }, context) => {
  const wantsCompanion = !!includeCompanion;
  const totalValue = WORKBOOK_PRICE + (wantsCompanion ? COMPANION_PRICE : 0);

  const testSession = await context.entities.TestSession.create({
    data: {
      testType: "workbook",
      userId: context.user?.id ?? null,
      email: context.user?.email ?? null,
    },
  });

  // Fire-and-forget Meta CAPI InitiateCheckout (paired with the client Pixel via eventID)
  if (eventID) {
    sendCapiEvent({
      eventName: "InitiateCheckout",
      eventId: eventID,
      eventSourceUrl:
        (context as any).req?.headers?.referer ||
        "https://understandyourpartner.com/workbook",
      userData: {
        email: context.user?.email || undefined,
        clientIp: (context as any).req?.ip,
        userAgent: (context as any).req?.headers?.["user-agent"],
        fbp: (context as any).req?.cookies?.["_fbp"],
        fbc: (context as any).req?.cookies?.["_fbc"],
      },
      customData: {
        currency: "usd",
        value: totalValue,
        content_name: WORKBOOK_PRODUCT_NAME,
        content_category: WORKBOOK_CONTENT_CATEGORY,
        content_ids: wantsCompanion
          ? [WORKBOOK_CONTENT_ID, COMPANION_CONTENT_ID]
          : [WORKBOOK_CONTENT_ID],
        content_type: "product",
      },
    });
  }

  const lineItems: any[] = [
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
  ];

  if (wantsCompanion) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: COMPANION_PRODUCT_NAME,
          description: "A short manual to read after the workbook. Helps you tell real regret from the pain of any hard choice.",
        },
        unit_amount: Math.round(COMPANION_PRICE * 100),
      },
      quantity: 1,
    });
  }

  let session;
  try {
    session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      submit_type: "pay",
      allow_promotion_codes: true,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000"}/workbook/download?session=${testSession.id}`,
      cancel_url: `${process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000"}/workbook`,
      customer_email: context.user?.email || undefined,
      metadata: {
        testSessionId: testSession.id,
        type: "workbook_purchase",
        capiEventId: eventID || "",
        includeCompanion: wantsCompanion ? "true" : "false",
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
  bonusUrl: string | null;
  stripeCheckoutSessionId: string | null;
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

  const hasCompanion = testSession.purchasedAddons.includes(COMPANION_CONTENT_ID);

  const workbookUrl = await getDownloadFileSignedURLFromS3({ s3Key: WORKBOOK_S3_KEY });
  const bonusUrl = hasCompanion
    ? await getDownloadFileSignedURLFromS3({ s3Key: WORKBOOK_BONUS_S3_KEY })
    : null;

  return {
    workbookUrl,
    bonusUrl,
    stripeCheckoutSessionId: testSession.stripeCheckoutSessionId ?? null,
  };
};
