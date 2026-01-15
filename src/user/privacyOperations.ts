import type { ExportUserData, DeleteUserAccount } from 'wasp/server/operations';

// Export all user data in GDPR-compliant JSON format
export const exportUserData: ExportUserData<void, any> = async (_args, context) => {
    if (!context.user) {
        throw new Error('Not authenticated');
    }

    const userId = context.user.id;

    // Fetch all user data
    const user = await context.entities.User.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            isAdmin: true,
            paymentProcessorUserId: true,
            lemonSqueezyCustomerPortalUrl: true,
            subscriptionStatus: true,
            subscriptionPlan: true,
            datePaid: true,
            credits: true,
            scheduledForDeletion: true,
            deletionDate: true,
        },
    });

    const testSessions = await context.entities.TestSession.findMany({
        where: { userId: userId },
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            currentQuestionIndex: true,
            isCompleted: true,
            isPaid: true,
            email: true,
            userGender: true,
            partnerGender: true,
            userAgeRange: true,
            partnerAgeRange: true,
            relationshipStatus: true,
            answers: true,
            scores: true,
            conflictDescription: true,
        },
    });

    return {
        exportedData: {
            user,
            testSessions,
            exportGeneratedAt: new Date().toISOString(),
        },
    };
};

// Delete user account and all associated data (30-day grace period)
export const deleteUserAccount: DeleteUserAccount<{ confirmationText: string; reason?: string }, any> = async (
    args,
    context
) => {
    if (!context.user) {
        throw new Error('Not authenticated');
    }

    // Verify confirmation text
    if (args.confirmationText !== 'DELETE') {
        throw new Error('Confirmation text must be exactly "DELETE"');
    }

    const userId = context.user.id;
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30); // 30-day grace period

    // Mark user for deletion (actual deletion happens via background job)
    await context.entities.User.update({
        where: { id: userId },
        data: {
            scheduledForDeletion: true,
            deletionDate: deletionDate,
        },
    });

    // TODO: Send confirmation email
    // TODO: Log deletion request for GDPR compliance

    return {
        success: true,
        message: 'Your account has been scheduled for deletion',
        scheduledDeletionDate: deletionDate.toISOString(),
    };
};
