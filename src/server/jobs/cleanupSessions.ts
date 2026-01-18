import { type TestSession } from "wasp/entities";

// Job to archive old unpaid sessions (Soft Deletion)
// Runs daily
export async function cleanupSessions(args: any, context: any) {
    console.log("Running session cleanup job...");

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Find sessions that are:
        // 1. Not paid
        // 2. Updated more than 7 days ago
        // 3. Not already archived
        const updateResult = await context.entities.TestSession.updateMany({
            where: {
                isPaid: false,
                updatedAt: {
                    lt: sevenDaysAgo,
                },
                isArchived: false,
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
