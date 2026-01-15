import { useState } from "react";
import { updateOnboardingStep, skipOnboarding } from "wasp/client/operations";
import { Button } from "../../client/components/ui/button";
import { X, ArrowLeft, ArrowRight, Copy, Share2, Download, MessageSquare } from "lucide-react";
import { useToast } from "../../client/hooks/use-toast";

interface OnboardingWizardProps {
    sessionId: string;
    dominantPattern: string;
    scripts: {
        inTheMoment: string;
        repair: string;
    };
    onComplete: () => void;
}

export function OnboardingWizard({
    sessionId,
    dominantPattern,
    scripts,
    onComplete,
}: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [savedChecked, setSavedChecked] = useState(false);
    const { toast } = useToast();

    const totalSteps = 3; // Simplified: Welcome, Save Scripts, Complete

    const handleNext = async () => {
        if (currentStep === 3) {
            // Complete onboarding
            await updateOnboardingStep({
                sessionId,
                step: 5,
                actions: { savedScripts: savedChecked },
            });
            onComplete();
        } else {
            setCurrentStep(currentStep + 1);
            await updateOnboardingStep({ sessionId, step: currentStep + 1 });
        }
    };

    const handleSkip = async () => {
        await skipOnboarding({ sessionId });
        onComplete();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Script copied to clipboard",
        });
    };

    const shareToPhone = (text: string) => {
        if (navigator.share) {
            navigator.share({ text });
        } else {
            copyToClipboard(text);
            toast({
                title: "Copied!",
                description: "Now paste into your Notes app or text yourself",
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
            {/* Progress Bar */}
            <div className="h-2 bg-muted">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>

            {/* Header */}
            <header className="p-4 border-b flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                </div>
                <button
                    onClick={handleSkip}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    <X size={20} />
                </button>
            </header>

            {/* Step Content */}
            <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    {currentStep === 1 && <WelcomeStep />}
                    {currentStep === 2 && (
                        <SaveScriptsStep
                            scripts={scripts}
                            savedChecked={savedChecked}
                            setSavedChecked={setSavedChecked}
                            copyToClipboard={copyToClipboard}
                            shareToPhone={shareToPhone}
                        />
                    )}
                    {currentStep === 3 && <CompleteStep dominantPattern={dominantPattern} />}
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="p-6 border-t flex justify-between">
                {currentStep > 1 && (
                    <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                )}
                <div className="ml-auto">
                    <Button onClick={handleNext} disabled={currentStep === 2 && !savedChecked}>
                        {currentStep === 3 ? "View Full Report" : "Next"}
                        {currentStep < 3 && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </footer>
        </div>
    );
}

function WelcomeStep() {
    return (
        <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold">Welcome to Your Results</h2>
            <p className="text-lg text-muted-foreground">
                Your analysis is ready. Here's what you just unlocked:
            </p>
            <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Your dominant sensitivity pattern</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>The "Mirror" executive profile</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>De-escalation scripts</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>The Translator Tool</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Downloadable resources</span>
                </li>
            </ul>
            <p className="text-sm text-muted-foreground italic">
                This quick tour will show you how to use them. Most users who skip this never come back—don't be that person.
            </p>
        </div>
    );
}

function SaveScriptsStep({
    scripts,
    savedChecked,
    setSavedChecked,
    copyToClipboard,
    shareToPhone,
}: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Save These 2 Scripts</h2>
            <p className="text-muted-foreground">
                When you feel panic rising, you won't have time to open an app. Save these NOW.
            </p>

            {/* Script 1 */}
            <div className="bg-card border rounded-xl p-6 space-y-3">
                <h3 className="font-semibold">When you feel panic rising:</h3>
                <div className="bg-muted p-4 rounded-lg text-sm italic">
                    "{scripts.inTheMoment}"
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(scripts.inTheMoment)}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToPhone(scripts.inTheMoment)}
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share to Phone
                    </Button>
                </div>
            </div>

            {/* Script 2 */}
            <div className="bg-card border rounded-xl p-6 space-y-3">
                <h3 className="font-semibold">For repair after conflict:</h3>
                <div className="bg-muted p-4 rounded-lg text-sm italic">
                    "{scripts.repair}"
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(scripts.repair)}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToPhone(scripts.repair)}
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share to Phone
                    </Button>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm">
                    💡 <strong>Pro Tip:</strong> Save these to your Notes app RIGHT NOW. Your future self will thank you.
                </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={savedChecked}
                    onChange={(e) => setSavedChecked(e.target.checked)}
                    className="h-4 w-4"
                />
                <span>I saved these (or will right after this)</span>
            </label>
        </div>
    );
}

function CompleteStep({ dominantPattern }: { dominantPattern: string }) {
    return (
        <div className="text-center space-y-6">
            <div className="text-6xl">✨</div>
            <h2 className="text-3xl font-bold">You're All Set!</h2>
            <p className="text-lg text-muted-foreground">
                Your full report is ready to explore. You'll find:
            </p>
            <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span><strong>The Mirror:</strong> Your personalized AI analysis</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span><strong>Visual Analytics:</strong> Your distortion graph</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span><strong>Care Package:</strong> Downloadable PDFs</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span><strong>The Translator:</strong> Rewrite messages safely</span>
                </li>
            </ul>
            <p className="text-sm text-muted-foreground">
                Remember: You can always come back to this report. It's saved in your account.
            </p>
        </div>
    );
}
