import { type MiddlewareConfigFn } from "wasp/server"; // removed Api import
import { config } from "wasp/server";
import express, { Request, Response } from "express";
import { stripeClient } from "./stripe/stripeClient";
import { emailSender } from "wasp/server/email";
import { getPaymentConfirmationEmail } from "../server/email/templates/paymentConfirmation";
import { buildPersonalizationData } from "../server/email/personalization";
import { sendCapiEvent } from "../server/analytics/metaCapi";
import { ADDON_IDS } from "./addons";
import { computeSoLResult, type SoLAnswers } from "../test/stayOrLeaveScoring";
import { generateAssessment } from "../server/stayOrLeaveAi";
import { STAY_OR_LEAVE_PRICE, STAY_OR_LEAVE_PRODUCT_NAME } from "./stayOrLeaveOperations";

// ... middleware config ...
export const stripeMiddlewareConfigFn: MiddlewareConfigFn = (
  middlewareConfig,
) => {
  middlewareConfig.delete("express.json");
  middlewareConfig.set(
    "express.raw",
    express.raw({ type: "application/json" }),
  );
  return middlewareConfig;
};

export const stripeWebhook = async (
  request: Request,
  response: Response,
  context: any,
) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      request.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    console.error("Webhook Error: " + err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const metadata = session.metadata;

    if (metadata && metadata.type === "report_unlock" && metadata.testSessionId) {
      console.log(`Unlocking session: ${metadata.testSessionId}`);

      // Get the test session to access email and other data
      const testSession = await context.entities.TestSession.findUnique({
        where: { id: metadata.testSessionId },
      });

      // Send Meta CAPI Purchase Event
      // Using stripe session ID as the duplicate key eventID
      try {
        const eventId = session.id; // cs_test_...
        const userEmail = testSession?.email || session.customer_details?.email;
        const amountTotal = session.amount_total ? session.amount_total / 100 : parseFloat(process.env.REPORT_PRICE || "9.99");

        // Import dynamically if needed or assume it's available. 
        // Since this is a server file, we can import from metaCapi.
        // But wait, imports in Wasp must be from src path.
        // We need to add the import at the top. 

        await sendCapiEvent({
          eventName: 'Purchase',
          eventId: eventId,
          eventSourceUrl: 'https://understandyourpartner.com/report',
          userData: {
            email: userEmail,
            fbp: testSession?.fbp || metadata.fbp,
            fbc: testSession?.fbc,
          },
          customData: {
            currency: 'usd',
            value: amountTotal,
            content_name: 'Full Relationship Report',
            content_type: 'product',
            order_id: session.id
          }
        });
      } catch (e) {
        console.error("Failed to send CAPI Purchase event:", e);
      }

      // Update session to mark as paid and stop retention emails
      // Update session to mark as paid and stop retention emails
      // AND Capture email if we didn't have it (from Stripe)
      const dataToUpdate: any = {
        isPaid: true,
        emailSequenceType: null, // Stop sequences
      };

      // Parse purchased addons from metadata.
      // If bundle was selected, seed all addon IDs; otherwise use the comma list.
      const bundleSelected = metadata.bundleSelected === 'true';
      const rawAddonIds = (metadata.addonIds || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      const addonIds = bundleSelected
        ? [...ADDON_IDS]
        : rawAddonIds.filter((id: string) => ADDON_IDS.includes(id));

      if (addonIds.length > 0) {
        dataToUpdate.purchasedAddons = addonIds;
      }

      if (metadata.hasOrderBump === 'true' || addonIds.includes('workbook')) {
        dataToUpdate.hasPurchasedOrderBump = true; // Legacy field
      }

      if (!testSession.email && session.customer_details?.email) {
        console.log(`[Webhook] Capturing missing email from Stripe: ${session.customer_details.email}`);
        dataToUpdate.email = session.customer_details.email;
      }

      await context.entities.TestSession.update({
        where: { id: metadata.testSessionId },
        data: dataToUpdate
      });

      // Send payment confirmation email
      if (testSession && testSession.email) {
        try {
          const appUrl = process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000";
          const apiUrl = process.env.WASP_API_SERVER_URL || "http://localhost:3001";
          const personalizationData = buildPersonalizationData(testSession, appUrl, apiUrl);
          const emailContent = getPaymentConfirmationEmail(personalizationData);

          await emailSender.send({
            to: testSession.email,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html,
          });

          console.log(`Sent payment confirmation email to ${testSession.email}`);
        } catch (emailError) {
          console.error(`Failed to send payment confirmation email:`, emailError);
          // Don't fail the webhook if email fails
        }
      }
    }

    // === STAY OR LEAVE PRODUCT ===
    if (metadata && metadata.type === "stay_or_leave_unlock" && metadata.testSessionId) {
      console.log(`Unlocking S-o-L assessment: ${metadata.testSessionId}`);

      const testSession = await context.entities.TestSession.findUnique({
        where: { id: metadata.testSessionId },
      });
      if (!testSession) {
        console.error(`[Webhook] S-o-L: session not found: ${metadata.testSessionId}`);
        return response.json({ received: true });
      }

      // Meta CAPI Purchase event
      try {
        const userEmail = testSession.email || session.customer_details?.email;
        const amountTotal = session.amount_total ? session.amount_total / 100 : STAY_OR_LEAVE_PRICE;
        await sendCapiEvent({
          eventName: "Purchase",
          eventId: session.id,
          eventSourceUrl: "https://understandyourpartner.com/assessment",
          userData: {
            email: userEmail,
            fbp: testSession.fbp || metadata.fbp,
            fbc: testSession.fbc,
          },
          customData: {
            currency: "usd",
            value: amountTotal,
            content_name: STAY_OR_LEAVE_PRODUCT_NAME,
            content_type: "product",
            order_id: session.id,
          },
        });
      } catch (e) {
        console.error("[Webhook] S-o-L CAPI failed:", e);
      }

      // Mark paid + capture email if missing
      const dataToUpdate: any = {
        isPaid: true,
        emailSequenceType: null,
      };
      if (!testSession.email && session.customer_details?.email) {
        dataToUpdate.email = session.customer_details.email;
      }
      await context.entities.TestSession.update({
        where: { id: metadata.testSessionId },
        data: dataToUpdate,
      });

      // Fire AI assessment generation (3 parallel Sonnet calls).
      // Don't block the webhook response: do it but catch errors.
      try {
        const refreshed = await context.entities.TestSession.findUnique({
          where: { id: metadata.testSessionId },
        });
        if (refreshed) {
          const answers = refreshed.answers as unknown as SoLAnswers;
          const existingData = (refreshed.stayOrLeaveData as any) || {};
          if (!existingData.aiCommentary && answers && typeof answers === "object") {
            const result = computeSoLResult(answers);
            const { commentary } = await generateAssessment(answers, result);
            await context.entities.TestSession.update({
              where: { id: metadata.testSessionId },
              data: {
                stayOrLeaveData: {
                  ...existingData,
                  scores: result.scores,
                  overall: result.overall,
                  verdict: result.verdict,
                  recommendation: result.recommendation,
                  finalAnswer: result.finalAnswer,
                  weakestDimension: result.weakestDimension,
                  strongestDimension: result.strongestDimension,
                  aiCommentary: commentary,
                  assessmentGeneratedAt: new Date().toISOString(),
                },
              },
            });
            console.log(`[Webhook] S-o-L assessment generated for ${metadata.testSessionId}`);
          }
        }
      } catch (aiError) {
        console.error("[Webhook] S-o-L AI generation failed (will retry on page load):", aiError);
        // The assessment page will call generateStayOrLeaveAssessment as a fallback.
      }
    }
  }

  response.json({ received: true });
};
