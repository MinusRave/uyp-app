import { type TestSession } from "wasp/entities";

// Job to archive unpaid sessions after retention email sequence ends
// Runs daily
export async function cleanupSessions(args: any, context: any) {
    console.log("Running session cleanup job...");

    try {
        const now = new Date();
        const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        const nineDaysAgo = new Date();
        nineDaysAgo.setDate(nineDaysAgo.getDate() - 9);

        // Archive sessions where:
        // a) Email sequence completed (stage >= 7) AND 48h since last email
        // b) OR: safety net — session older than 9 days without purchase
        const updateResult = await context.entities.TestSession.updateMany({
            where: {
                isPaid: false,
                isArchived: false,
                OR: [
                    // Rule A: 48h after last retention email (stage 7 = final)
                    {
                        retentionEmailStage: { gte: 7 },
                        lastRetentionEmailSentAt: { lt: fortyEightHoursAgo },
                    },
                    // Rule B: Safety net — no email sequence progressed, older than 9 days
                    {
                        updatedAt: { lt: nineDaysAgo },
                    },
                ],
            },
            data: {
                isArchived: true,
            },
        });

        console.log(`Cleanup job complete. Archived ${updateResult.count} sessions.`);
    } catch (error) {
        console.error("Error in session cleanup job:", error);
    }
}
