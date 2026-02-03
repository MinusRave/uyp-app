import { type SendgridWebhook } from "wasp/server/api";
import { type TestSession } from "wasp/entities";

type SendGridEvent = {
    email: string;
    timestamp: number;
    event: string;
    url?: string;
    session_id?: string;
    email_id?: string;
    stage?: string;
    scenario?: string;
    [key: string]: any;
};

export const sendgridWebhook: SendgridWebhook = async (req, res, context) => {
    try {
        const events = req.body as SendGridEvent[];

        if (!Array.isArray(events)) {
            return res.status(400).json({ error: "Invalid payload" });
        }

        // Process events in parallel
        await Promise.all(
            events.map(async (event) => {
                // We only care about opens and clicks
                if (event.event !== "open" && event.event !== "click") return;

                // We need session_id to find the record
                if (!event.session_id) return;

                const sessionId = event.session_id;

                try {
                    const session = await context.entities.TestSession.findUnique({
                        where: { id: sessionId },
                    });

                    if (!session) return;

                    // Update email history
                    // We need to find the entry in the array and update it
                    let history = (session.emailSentHistory as any[]) || [];
                    let updated = false;

                    history = history.map((entry) => {
                        // Match by email_id (e.g., "B1") or stage+scenario
                        // If we have email_id in the event (passed via custom_args), use it
                        // Otherwise try to match casually (risky)
                        const isMatch = event.email_id
                            ? entry.emailId === event.email_id
                            : entry.stage === parseInt(event.stage || "0");

                        if (isMatch) {
                            updated = true;
                            if (event.event === "open") {
                                entry.opened = true;
                                entry.openedAt = new Date(event.timestamp * 1000).toISOString();
                            }
                            if (event.event === "click") {
                                entry.clicked = true;
                                entry.clickedAt = new Date(event.timestamp * 1000).toISOString();
                                entry.clickedUrl = event.url;
                            }
                        }
                        return entry;
                    });

                    if (updated) {
                        await context.entities.TestSession.update({
                            where: { id: sessionId },
                            data: { emailSentHistory: history },
                        });
                        console.log(`[SendGrid] Tracked ${event.event} for session ${sessionId} (Email: ${event.email_id || "unknown"})`);
                    }
                } catch (err) {
                    console.error(`[SendGrid] Error processing event for ${sessionId}:`, err);
                }
            })
        );

        return res.json({ success: true });
    } catch (error) {
        console.error("[SendGrid] Webhook error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
