import { type MiddlewareConfigFn } from "wasp/server"; // removed Api import
import { config } from "wasp/server";
import express, { Request, Response } from "express";
import { stripeClient } from "./stripe/stripeClient";

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
      await context.entities.TestSession.update({
        where: { id: metadata.testSessionId },
        data: { isPaid: true }
      });
    }
  }

  response.json({ received: true });
};
