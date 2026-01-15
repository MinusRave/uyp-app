import type { UpdateOnboardingStep, SkipOnboarding } from 'wasp/server/operations';

// Update onboarding progress
export const updateOnboardingStep: UpdateOnboardingStep<
    {
        sessionId: string;
        step: number;
        actions?: {
            savedScripts?: boolean;
            downloadedPDF?: boolean;
            triedTranslator?: boolean;
        };
    },
    any
> = async (args, context) => {
    const { sessionId, step, actions } = args;

    const updateData: any = {
        onboardingStep: step,
    };

    // If completing onboarding (step 5)
    if (step === 5) {
        updateData.onboardingCompleted = true;
        updateData.onboardingCompletedAt = new Date();
    }

    // Update action flags if provided
    if (actions) {
        if (actions.savedScripts !== undefined) {
            updateData.savedScriptsToPhone = actions.savedScripts;
        }
        if (actions.downloadedPDF !== undefined) {
            updateData.downloadedFridgeSheet = actions.downloadedPDF;
        }
        if (actions.triedTranslator !== undefined) {
            updateData.triedTranslatorTool = actions.triedTranslator;
        }
    }

    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: updateData,
    });

    return {
        success: true,
        currentStep: step,
    };
};

// Skip onboarding
export const skipOnboarding: SkipOnboarding<{ sessionId: string }, any> = async (args, context) => {
    await context.entities.TestSession.update({
        where: { id: args.sessionId },
        data: {
            onboardingCompleted: true,
            onboardingStep: 5,
            // Note: No completedAt timestamp when skipped (differentiates from completed)
        },
    });

    return {
        success: true,
    };
};
