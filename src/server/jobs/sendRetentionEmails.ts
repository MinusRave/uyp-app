import { type TestSession } from "wasp/entities";
import { sendRetentionEmail, getDelayForStage } from "../email/emailService";

// Main job function that runs every 15 minutes
export async function sendRetentionEmails(args: any, context: any) {
    console.log("Running retention email job...");

    try {
        // Find all sessions eligible for retention emails
        const sessions = await context.entities.TestSession.findMany({
            where: {
                isPaid: false,
                email: { not: null },
                emailSequenceType: { not: null },
                unsubscribedFromEmails: false,
            },
        });

        console.log(`Found ${sessions.length} sessions to check`);

        let emailsSent = 0;

        for (const session of sessions) {
            try {
                // Determine next stage
                const currentStage = session.retentionEmailStage || 0;
                const nextStage = currentStage + 1;

                // Get required delay for next stage
                const requiredDelay = getDelayForStage(session.emailSequenceType!, nextStage);

                if (requiredDelay === 0 && nextStage > 1) {
                    // No more emails for this scenario
                    continue;
                }

                // Calculate time since last email (or session creation for first email)
                const now = new Date();
                let timeSinceLastEmail: number;

                if (currentStage === 0) {
                    // First email - check time since session creation or completion
                    if (session.emailSequenceType === "teaser_viewer") {
                        // For teaser viewers, send immediately after completion
                        timeSinceLastEmail = now.getTime() - new Date(session.updatedAt).getTime();
                    } else if (session.emailSequenceType === "test_abandonment") {
                        // For test abandoners, wait 2 hours after last activity
                        timeSinceLastEmail = now.getTime() - new Date(session.updatedAt).getTime();
                    } else if (session.emailSequenceType === "checkout_abandonment") {
                        // For checkout abandoners, wait 15 minutes after checkout started
                        if (session.checkoutStartedAt) {
                            timeSinceLastEmail =
                                now.getTime() - new Date(session.checkoutStartedAt).getTime();
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                } else {
                    // Subsequent emails - check time since last email sent
                    if (!session.lastRetentionEmailSentAt) {
                        continue;
                    }
                    timeSinceLastEmail =
                        now.getTime() - new Date(session.lastRetentionEmailSentAt).getTime();
                }

                // Check if enough time has passed (with 2-hour tolerance window)
                const TOLERANCE = 2 * 60 * 60 * 1000; // 2 hours
                if (
                    timeSinceLastEmail >= requiredDelay &&
                    timeSinceLastEmail < requiredDelay + TOLERANCE
                ) {
                    // Send email
                    const success = await sendRetentionEmail(session, nextStage, context);
                    if (success) {
                        emailsSent++;
                    }
                }
            } catch (error) {
                console.error(`Error processing session ${session.id}:`, error);
            }
        }

        console.log(`Retention email job complete. Sent ${emailsSent} emails.`);
    } catch (error) {
        console.error("Error in retention email job:", error);
    }
}
