import { type TestSession } from "wasp/entities";
import { sendRetentionEmail, getDelayForStage } from "../email/emailService";

// Main job function that runs every 15 minutes
export async function sendRetentionEmails(args: any, context: any) {
    console.log("Running retention email job (Mirror Strategy)...");

    try {
        // Find all sessions eligible for retention emails
        // We only care about sessions that have an emailSequenceType (which should only be 'teaser_viewer' now)
        const sessions = await context.entities.TestSession.findMany({
            where: {
                isPaid: false,
                email: { not: null },
                emailSequenceType: "teaser_viewer", // Filter directly in DB for efficiency
                unsubscribedFromEmails: false,
                isArchived: false,
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
                    // Start of sequence: check time since updatedAt (when they finished/updated the test)
                    timeSinceLastEmail = now.getTime() - new Date(session.updatedAt).getTime();
                } else {
                    // Subsequent emails - check time since last email sent
                    if (!session.lastRetentionEmailSentAt) {
                        continue;
                    }
                    timeSinceLastEmail =
                        now.getTime() - new Date(session.lastRetentionEmailSentAt).getTime();
                }

                // Check if enough time has passed (with 2-hour tolerance window to prevent double sends if job lags, though updated status prevents it too)
                // Actually tolerance isn't needed for prevention, it's just to say "if it's been ready for a while, send it"
                // But we don't want to send if it's WAY too late? No, usually we do want to catch up.
                // The original code had a tolerance, likely to avoid sending old emails? 
                // Let's keep a reasonable check: if time >= requiredDelay, send it.
                // The only risk is if the job runs every 15 mins, and requiredDelay is 1 hour.

                if (timeSinceLastEmail >= requiredDelay) {
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
