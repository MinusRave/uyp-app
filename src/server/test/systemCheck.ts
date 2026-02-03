import { type SystemCheck } from "wasp/server/api";
import { type TestSession } from "wasp/entities";
import { stripeWebhook } from "../../payment/reportWebhook";
import { sendgridWebhook } from "../webhooks/sendgrid";
import Stripe from "stripe";

// Helper to mock Express Request/Response
class MockResponse {
    statusCode: number = 200;
    headers: any = {};
    body: any = null;

    status(code: number) {
        this.statusCode = code;
        return this;
    }
    json(data: any) {
        this.body = data;
        return this;
    }
    send(data: any) {
        this.body = data;
        return this;
    }
}

export const systemCheck: SystemCheck = async (req, res, context) => {
    const logs: string[] = [];
    const log = (msg: string) => {
        console.log(`[SystemCheck] ${msg}`);
        logs.push(msg);
    };

    try {
        log("🚀 Starting System Check...");

        // 1. Create a Test Session
        log("1. Creating Test Session...");
        const testSession = await context.entities.TestSession.create({
            data: {
                answers: { "1": 1 }, // Dummy answer
                email: `test_e2e_${Date.now()}@example.com`,
                scores: {
                    scoreSpouse: 50,
                    scoreMoney: 50,
                    scoreFamily: 50,
                    scoreSex: 50,
                    scoreGrowth: 50,
                },
            } as any,
        });
        log(`✅ Session Created: ${testSession.id}`);

        // 2. Simulate Stripe Webhook (Payment)
        log("2. Simulating Stripe Payment...");
        const stripe = new Stripe(process.env.STRIPE_KEY || "sk_test_dummy", { apiVersion: "2024-06-20" as any }); // Using strict version or default? Package.json says 18.1.0? 
        // Actually we don't need the client here, just the webhook signature generator.
        // The Stripe library version in package.json is 18.1.0.

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            log("❌ SKIPPING Stripe Test: STRIPE_WEBHOOK_SECRET not set.");
        } else {
            const payload = {
                id: "evt_test_system_check",
                object: "event",
                type: "checkout.session.completed",
                created: Math.floor(Date.now() / 1000),
                data: {
                    object: {
                        id: "cs_test_dummy_123",
                        metadata: {
                            type: "report_unlock",
                            testSessionId: testSession.id
                        },
                        customer_details: { email: testSession.email }
                    }
                }
            };

            const payloadString = JSON.stringify(payload);
            // Generate valid signature
            const header = stripe.webhooks.generateTestHeaderString({
                payload: payloadString,
                secret: webhookSecret,
            });

            const mockReq = {
                headers: { "stripe-signature": header },
                body: Buffer.from(payloadString), // Stripe middleware expects raw body buffer often, or parsed?
                // Middleware in reportWebhook.ts sets express.raw({ type: "application/json" }).
                // So logic uses `request.body`.
            } as any;

            const mockRes = new MockResponse() as any;

            await stripeWebhook(mockReq, mockRes, context);

            if (mockRes.statusCode !== 200) {
                log(`❌ Stripe Webhook Failed: ${mockRes.body}`);
            } else {
                // Verify DB Update
                const updatedSession = await context.entities.TestSession.findUnique({ where: { id: testSession.id } });
                if (updatedSession?.isPaid) {
                    log("✅ Stripe Verification Passed: isPaid = true");
                } else {
                    log("❌ Stripe Verification Failed: isPaid is false");
                }
            }
        }

        // 3. Simulate SendGrid Webhook (Tracking)
        log("3. Simulating SendGrid Tracking...");

        // Seed some history first so we have something to match
        await context.entities.TestSession.update({
            where: { id: testSession.id },
            data: {
                emailSentHistory: [
                    {
                        emailId: "B1",
                        stage: 1,
                        templateId: "d-123",
                        sentAt: new Date().toISOString(),
                        opened: false
                    }
                ]
            }
        });

        const sgPayload = [
            {
                email: testSession.email!,
                timestamp: Math.floor(Date.now() / 1000),
                event: "open",
                session_id: testSession.id,
                email_id: "B1", // Matching our seeded history
                sg_event_id: "evt_123"
            }
        ];

        const mockSgReq = { body: sgPayload } as any;
        const mockSgRes = new MockResponse() as any;

        await sendgridWebhook(mockSgReq, mockSgRes, context);

        // Verify DB Update
        const finalSession = await context.entities.TestSession.findUnique({ where: { id: testSession.id } });
        const history = finalSession?.emailSentHistory as any[];
        const entry = history.find(e => e.emailId === "B1");

        if (entry && entry.opened) {
            log("✅ SendGrid Verification Passed: Email marked as OPENED");
        } else {
            log("❌ SendGrid Verification Failed: Email not marked opened");
            log(`Debug: ${JSON.stringify(history)}`);
        }

        // Cleanup
        log("4. Cleanup...");
        // await context.entities.TestSession.delete({ where: { id: testSession.id } }); // verify clean up? Maybe keep for inspection.
        log("✅ Cleanup Skipped (Keep for inspection).");

        res.json({ success: true, logs });

    } catch (error: any) {
        log(`❌ FATAL ERROR: ${error.message}`);
        log(error.stack);
        res.status(500).json({ success: false, logs, error: error.message });
    }
};
