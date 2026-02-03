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
            <div className="text-6xl text-primary">⚡</div>
            <h2 className="text-3xl font-bold">Your Profile is Ready.</h2>
            <p className="text-lg text-muted-foreground">
                We have analyzed the 5 dimensions of your relationship. Here is what we found:
            </p>
            <ul className="text-left space-y-4 max-w-md mx-auto bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
                <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">01.</span>
                    <span className="font-medium"><strong>The Executive Analysis:</strong> The "Cold Truth" diagnosis of why you are stuck.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">02.</span>
                    <span className="font-medium"><strong>Deep Dive:</strong> Detailed breakdown of Communication, Intimacy, and Trust.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">03.</span>
                    <span className="font-medium"><strong>The Protocol:</strong> Your specific scripts to stop the fighting.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">04.</span>
                    <span className="font-medium"><strong>The Bottom Line:</strong> A final verdict on your relationship's future.</span>
                </li>
            </ul>
            <p className="text-sm text-muted-foreground italic">
                Step 1 of 3: Orientation
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
        <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">⚠️ The Circuit Breaker</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
                This is the most critical tool in your report. When you are flooded (heart racing), you cannot think. <strong>Save this now.</strong>
            </p>

            {/* Script 1 */}
            <div className="bg-card border rounded-xl p-6 space-y-3 text-left shadow-lg">
                <h3 className="font-bold text-sm uppercase tracking-wider text-red-500">Emergency Protocol (Read Verbatim)</h3>
                <div className="bg-secondary/20 p-4 rounded-lg text-lg italic font-serif leading-relaxed border-l-4 border-red-500">
                    "{scripts.inTheMoment}"
                </div>
                <div className="flex gap-2 justify-end">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(scripts.inTheMoment)}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                    </Button>
                </div>
            </div>

            <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                <label className="flex items-center gap-3 cursor-pointer justify-center">
                    <input
                        type="checkbox"
                        checked={savedChecked}
                        onChange={(e) => setSavedChecked(e.target.checked)}
                        className="h-5 w-5 accent-primary"
                    />
                    <span className="font-medium">I have saved this script to my phone.</span>
                </label>
            </div>
        </div>
    );
}

function CompleteStep({ dominantPattern }: { dominantPattern: string }) {
    return (
        <div className="text-center space-y-8">
            <div className="text-6xl">🔒</div>
            <h2 className="text-3xl font-bold">Access Granted</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                You are about to see the full analysis. Be warned: this report is designed to be a mirror, not a hug. It may be uncomfortable to read.
            </p>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 max-w-md mx-auto">
                <h4 className="font-bold text-primary mb-2">Before you begin:</h4>
                <p className="text-sm">
                    Read the "Executive Analysis" first. Do not skip to the score.
                    Understand the <strong>why</strong> before you judge the <strong>what</strong>.
                </p>
            </div>

            <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Session ID Encrypted & Saved
            </p>
        </div>
    );
}
