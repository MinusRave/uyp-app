import { type MiddlewareConfigFn } from "wasp/server"; // removed Api import
import { config } from "wasp/server";
import express, { Request, Response } from "express";
import { stripeClient } from "./stripe/stripeClient";
import { emailSender } from "wasp/server/email";
import { getPaymentConfirmationEmail } from "../server/email/templates/paymentConfirmation";
import { buildPersonalizationData } from "../server/email/personalization";
import { sendCapiEvent } from "../server/analytics/metaCapi";

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
            value: 15.00,
            content_name: 'Full Relationship Report',
            content_type: 'product',
            order_id: session.id
          }
        });
      } catch (e) {
        console.error("Failed to send CAPI Purchase event:", e);
      }

      // Update session to mark as paid and stop retention emails
      await context.entities.TestSession.update({
        where: { id: metadata.testSessionId },
        data: {
          isPaid: true,
          // Clear email sequence to stop retention emails
          emailSequenceType: null,
        }
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
  }

  response.json({ received: true });
};
