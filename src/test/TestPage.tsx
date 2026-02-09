import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { startTest, submitAnswer, completeTest, getTestSession, useQuery, captureLead, updateConflictDescription, updateWizardProgress } from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { Loader2, Mail, MessageSquare, ChevronLeft } from "lucide-react";
import { cn } from "../client/utils";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";

// --- Data: Questions ---
// Imported from config
import { TEST_CONFIG } from "./testConfig";

const QUESTIONS = TEST_CONFIG.questions;
const ANSWERS = TEST_CONFIG.answerOptions;

export default function TestPage() {
    const navigate = useNavigate();

    // 1. Get Session ID from LocalStorage if available
    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;

    // 2. Query for existing session
    const { data: existingSession, isLoading: isSessionLoading } = useQuery(getTestSession, {
        sessionId: localSessionId || undefined
    });

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Gates
    const [email, setEmail] = useState("");
    const [showEmailGate, setShowEmailGate] = useState(false);

    // NEW: Conflict Gate
    const [conflictText, setConflictText] = useState("");
    const [showConflictGate, setShowConflictGate] = useState(false);

    // Sync session ID to local storage whenever it changes
    useEffect(() => {
        if (sessionId) {
            localStorage.setItem("uyp-session-id", sessionId);
        }
    }, [sessionId]);

    // Track ViewContent on mount
    useEffect(() => {
        trackPixelEvent('ViewContent', { content_name: 'Relationship Test' });
    }, []);

    // State for Profile Form
    const [showProfileForm, setShowProfileForm] = useState(false);

    // Guard against double-initialization
    const isCreatingSession = React.useRef(false);

    useEffect(() => {
        const handleSessionCheck = async () => {
            if (isSessionLoading) return;

            if (existingSession) {
                // If session exists
                if (existingSession.isCompleted) {
                    navigate(routes.ProcessingRoute.build());
                    return;
                }
                setSessionId(existingSession.id);

                // If we have a session, assume we might be resuming
                // Check if wizard is done (we can infer this from profile data being present, e.g., gender)
                const isWizardDone = !!existingSession.userGender;

                if (isWizardDone) {
                    setShowProfileForm(false);
                    // Set Q index
                    const savedIndex = existingSession.currentQuestionIndex || 0;
                    if (savedIndex >= QUESTIONS.length) {
                        setShowEmailGate(true);
                    } else {
                        setCurrentQIndex(savedIndex);
                    }
                } else {
                    // Wizard not done, show it (with pre-filled data if any)
                    setShowProfileForm(true);
                }

            } else {
                // No session found.
                // If we had a localSessionId but query returned null, it's invalid.
                if (localSessionId) {
                    localStorage.removeItem("uyp-session-id");
                }

                // Create "Guest Session" IMMEDIATELY
                if (isCreatingSession.current) return;
                isCreatingSession.current = true;

                try {
                    // Get fbclid and UTMs from local storage if available
                    const { getFbclid, getUtmParams } = await import("../analytics/utils");
                    const fbclid = getFbclid();
                    const utms = getUtmParams();

                    const newSession = await startTest({
                        fbclid: fbclid || undefined,
                        ...utms
                    } as any);
                    setSessionId(newSession.id);
                    localStorage.setItem("uyp-session-id", newSession.id);
                    setShowProfileForm(true);
                } catch (e) {
                    console.error("Failed to create guest session", e);
                } finally {
                    isCreatingSession.current = false;
                }
            }
        };

        handleSessionCheck();
    }, [existingSession, isSessionLoading, navigate]);

    // Wizard is now just updating the DB
    const handleProfileSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (!sessionId) return;
            // Final save of demographics
            await updateWizardProgress({ sessionId, ...data });
            setShowProfileForm(false);
        } catch (e) {
            console.error("Failed to save wizard data", e);
            alert("Error initializing test.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = isSessionLoading && !showProfileForm; // Don't show loader if form is ready

    const currentQuestion = QUESTIONS[currentQIndex];
    const progressPercentage = ((currentQIndex) / QUESTIONS.length) * 100;

    const handleNext = async () => {
        if (!sessionId || selectedAnswer === null) return;
        if (!currentQuestion) return;

        setIsSubmitting(true);
        try {
            const answerObj = ANSWERS.find(a => a.id === selectedAnswer);

            await submitAnswer({
                sessionId,
                questionId: currentQuestion.id,
                answerId: selectedAnswer,
                score: answerObj?.score || 3, // Raw score 1-5
                dimension: currentQuestion.dimension,
                type: currentQuestion.type
            });

            if (currentQIndex < QUESTIONS.length - 1) {
                setCurrentQIndex(prev => prev + 1);
                setSelectedAnswer(null);
            } else {
                // Finished Questions -> Go STRAIGHT to Email Gate (Conflict Gate Removed)
                setShowEmailGate(true);
            }

        } catch (e) {
            console.error("Error submitting answer", e);
            alert("Errore di connessione. Riprova.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConflictSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) return;

        // Validation: Min 50 chars (Relationship Spec)
        if (conflictText.length < 50) {
            alert("Please describe the situation in more detail (at least 50 characters) so our AI can analyze it accurately.");
            return;
        }

        setIsSubmitting(true);
        try {
            await updateConflictDescription({ sessionId, description: conflictText });
            setShowConflictGate(false);
            setShowEmailGate(true);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                alert("Error saving: " + err.message);
            } else {
                alert("Error saving. Please try again or skip.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !sessionId) return;
        setIsSubmitting(true);

        // Generate Event ID for deduplication
        const eventID = generateEventId();

        try {
            await captureLead({ sessionId, email, eventID });
            // Add Client Pixel Event (was missing)
            trackPixelEvent('Lead', { eventID });

            // Small delay to ensure Pixel event has time to fire before navigation
            await new Promise(resolve => setTimeout(resolve, 300));

            await completeTest({ sessionId });
            navigate(routes.ProcessingRoute.build());
        } catch (err) {
            console.error(err);
            alert("Errore. Riprova");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    // PROFILE FORM UI (Now QuizWizard)
    if (showProfileForm) {
        return <QuizWizard onSubmit={handleProfileSubmit} isSubmitting={isSubmitting} sessionId={sessionId} />;
    }

    // CONFLICT GATE UI (New)
    if (showConflictGate && sessionId) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-fade-in">
                <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border border-border">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                        <MessageSquare size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-center">One Last Thing...</h2>
                    <p className="text-muted-foreground mb-6 text-center text-sm">
                        To generate your <strong>"Conflict Autopsy"</strong>, briefly describe the last argument or moment of tension you had.
                    </p>

                    {/* Privacy Notice */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 text-sm">
                        <div className="flex items-start gap-2">
                            <MessageSquare className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={16} />
                            <div className="text-blue-900 dark:text-blue-100">
                                <strong>Privacy Note:</strong> Your conflict description is used ONLY to personalize
                                your AI analysis. It's encrypted, never shared, and you can delete it anytime from
                                your account settings.
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleConflictSubmit} className="space-y-4">
                        <textarea
                            required
                            placeholder="e.g., 'We were arguing about cleaning. I felt ignored when he walked away...'"
                            className="w-full p-4 rounded-xl border border-input bg-background min-h-[150px] focus:ring-2 ring-primary/20 outline-none resize-none"
                            value={conflictText}
                            onChange={(e) => setConflictText(e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {conflictText.length < 50 ?
                                <span className="text-red-400">Too short ({conflictText.length}/50 chars)</span> :
                                <span className="text-green-500">Good length!</span>
                            }
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Analyze This Conflict →"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowConflictGate(false); setShowEmailGate(true); }}
                            className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
                        >
                            Skip this step (I just want the standard report)
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // EMAIL GATE UI
    if (showEmailGate || (!currentQuestion && !isLoading && sessionId)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-fade-in">
                <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border border-border text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Almost done!</h2>
                    <p className="text-muted-foreground mb-8">
                        Enter your email to save results and calculate compatibility.
                    </p>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="w-full p-4 rounded-xl border border-input bg-background"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <MessageSquare size={12} />
                            We won't spam you. Promise. Unsubscribe anytime.
                        </p>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSubmitting ? "Calculating..." : "See Results →"}
                        </button>
                        <p className="text-xs text-muted-foreground">
                            We won't spam you. Promise.
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    const handleBack = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex((prev) => prev - 1);
            setSelectedAnswer(null); // Clear selection or we could try to reload previous answer from session if available locally
        }
    };

    if (!currentQuestion) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {currentQIndex > 0 && (
                            <button
                                onClick={handleBack}
                                className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                                aria-label="Go back"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <div className="font-bold text-lg text-primary">UYP Test</div>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                        Question {currentQIndex + 1}/{QUESTIONS.length}
                    </div>
                </div>
                <div className="h-1.5 w-full bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-foreground">
                        {currentQuestion.text}
                    </h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-wide">
                        Answer instinctively
                    </p>
                </div>

                <div className="w-full space-y-3">
                    {ANSWERS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSelectedAnswer(option.id)}
                            className={cn(
                                "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center group",
                                selectedAnswer === option.id
                                    ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                                    : "border-border hover:border-primary/50 bg-card hover:bg-muted"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors",
                                selectedAnswer === option.id
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground/30 group-hover:border-primary"
                            )}>
                                {selectedAnswer === option.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                )}
                            </div>
                            <span className="text-lg font-medium">{option.text}</span>
                        </button>
                    ))}
                </div>
            </main>

            <footer className="p-6 border-t border-border bg-background/50 max-w-3xl mx-auto w-full">
                <button
                    onClick={handleNext}
                    disabled={selectedAnswer === null || isSubmitting}
                    className={cn(
                        "w-full py-4 rounded-full text-lg font-bold shadow-lg transition-all transform",
                        selectedAnswer === null
                            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            : "bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                    )}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={20} /> Saving...
                        </span>
                    ) : (
                        currentQIndex < QUESTIONS.length - 1 ? "NEXT →" : "COMPLETE TEST"
                    )}
                </button>
            </footer>
        </div>
    );
}


// --- Wizard Components ---

function QuizWizard({ onSubmit, isSubmitting, sessionId }: { onSubmit: (data: any) => void, isSubmitting: boolean, sessionId: string | null }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        userGender: "",
        partnerGender: "",
        userAgeRange: "",
        partnerAgeRange: "",
        relationshipStatus: "",
        relationshipDuration: "",
        livingTogether: false,
        hasChildren: false,

        partnerHurtfulBehavior: "",
        biggestFear: "" // NEW
    });

    const updateData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = async (currentStepData?: any) => {
        setStep(prev => prev + 1);

        // Save progress to DB if we have a session
        if (sessionId) {
            try {
                // We save whatever data we have so far, plus the step we just finished
                // If valid currentStepData is passed (e.g. from Step1), merge it
                const payload = { ...formData, ...currentStepData, sessionId, onboardingStep: step };
                await updateWizardProgress(payload);

                // Track Pixel Event for Step Completion
                const stepNames = ["Status", "History", "Conflict"];
                import("../analytics/pixel").then(({ trackPixelEvent }) => {
                    trackPixelEvent("CustomEvent", {
                        content_name: "WizardStep",
                        step_number: step,
                        step_name: stepNames[step - 1]
                    });
                });

            } catch (e) {
                console.error("Background save failed", e);
            }
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleFinalSubmit = async () => {
        // Track final step
        import("../analytics/pixel").then(({ trackPixelEvent }) => {
            trackPixelEvent("CustomEvent", {
                content_name: "WizardStep",
                step_number: 5,
                step_name: "BiggestFear"
            });
        });
        onSubmit(formData);
    };

    // Wizard Steps
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg">
                {/* Progress Bar (Subtle) */}
                <div className="mb-8 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={cn("h-1.5 w-12 rounded-full transition-all duration-500", step >= s ? "bg-primary" : "bg-muted")} />
                    ))}
                </div>

                {step === 1 && (
                    <Step1_Status
                        value={formData.relationshipStatus}
                        onChange={(val) => {
                            updateData('relationshipStatus', val);
                            nextStep({ relationshipStatus: val });
                        }}
                    />
                )}

                {step === 2 && (
                    <Step2_History
                        data={formData}
                        updateData={updateData}
                        onNext={() => nextStep()}
                        onBack={prevStep}
                    // Only auto-advance if specific conditions met inside if complex, but simple enough to have a "Next" button here as it has multiple fields
                    />
                )}

                {step === 3 && (
                    <Step3_Conflict
                        data={formData}
                        updateData={updateData}
                        onNext={() => nextStep()}
                        onBack={prevStep}
                    />
                )}

                {step === 4 && (
                    <Step4_Demographics
                        data={formData}
                        updateData={updateData}
                        onNext={() => nextStep()} // Now goes to Step 5
                        onBack={prevStep}
                    />
                )}

                {step === 5 && (
                    <Step5_Fear
                        data={formData}
                        updateData={updateData}
                        onSubmit={handleFinalSubmit}
                        onBack={prevStep}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}

// -- Step Components --

function Step1_Status({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const options = [
        { id: "In Crisis", label: "In Crisis", icon: "💔", desc: "We're on the brink of breaking up" },
        { id: "Unstable", label: "Unstable", icon: "⚠️", desc: "Frequent fights or emotional distance" },
        { id: "Together", label: "Stable but Stuck", icon: "😐", desc: "We're okay, but something is missing" },
        { id: "Recently Separated", label: "Recently Separated", icon: "🏚️", desc: "Trying to understand what happened" },
    ];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">First, how would you describe your relationship right now?</h2>
                <p className="text-muted-foreground">Select the one that fits best.</p>
            </div>
            <div className="grid gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        className="w-full text-left p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-4xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                            <div>
                                <div className="font-bold text-lg">{opt.label}</div>
                                <div className="text-muted-foreground text-sm">{opt.desc}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function Step2_History({ data, updateData, onNext, onBack }: { data: any, updateData: any, onNext: () => void, onBack: () => void }) {
    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">A few quick details</h2>
                <p className="text-muted-foreground">To benchmark your results against similar couples.</p>
            </div>

            <div className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="space-y-3">
                    <label className="text-sm font-medium block">How long have you been together?</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['0-6mo', '6mo-2yr', '2-5yr', '5-10yr', '10+yr'].map(val => (
                            <button
                                key={val}
                                onClick={() => updateData('relationshipDuration', val)}
                                className={cn(
                                    "p-3 rounded-lg border text-sm transition-all",
                                    data.relationshipDuration === val ? "border-primary bg-primary/10 text-primary font-bold" : "border-border hover:border-primary/50"
                                )}
                            >
                                {val === '0-6mo' ? '< 6 Months' : val === '6mo-2yr' ? '6 Months - 2 Years' : val === '10+yr' ? '10+ Years' : val + ' Years'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={data.livingTogether}
                            onChange={(e) => updateData('livingTogether', e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="font-medium">We live together</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={data.hasChildren}
                            onChange={(e) => updateData('hasChildren', e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="font-medium">We have children</span>
                    </label>
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onBack} className="px-6 py-3 rounded-full font-medium text-muted-foreground hover:bg-muted">Back</button>
                <button
                    onClick={onNext}
                    disabled={!data.relationshipDuration}
                    className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

function Step3_Conflict({ data, updateData, onNext, onBack }: { data: any, updateData: any, onNext: () => void, onBack: () => void }) {
    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">Conflict Dynamics</h2>
                <p className="text-muted-foreground">Understanding how you fight is key.</p>
            </div>

            <div className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">How often do you have conflicts?</label>
                    <select
                        value={data.fightFrequency}
                        onChange={(e) => updateData('fightFrequency', e.target.value)}
                        className="w-full p-3 rounded-lg border bg-background"
                    >
                        <option value="">Select...</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="rarely">Rarely</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">When you fight, your partner typically:</label>
                    <select
                        value={data.partnerConflictStyle}
                        onChange={(e) => updateData('partnerConflictStyle', e.target.value)}
                        className="w-full p-3 rounded-lg border bg-background"
                    >
                        <option value="">Select...</option>
                        <option value="withdraws">Withdraws / Goes silent</option>
                        <option value="escalates">Escalates / Gets intense</option>
                        <option value="deflects">Deflects / Blames you</option>
                        <option value="engages">Tries to resolve it calmly</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Do you successfully repair afterwards?</label>
                    <select
                        value={data.repairFrequency}
                        onChange={(e) => updateData('repairFrequency', e.target.value)}
                        className="w-full p-3 rounded-lg border bg-background"
                    >
                        <option value="">Select...</option>
                        <option value="always">Always - We make up quickly</option>
                        <option value="sometimes">Sometimes - It takes time</option>
                        <option value="rarely">Rarely - We brush it under the rug</option>
                        <option value="never">Never - Resentment builds up</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onBack} className="px-6 py-3 rounded-full font-medium text-muted-foreground hover:bg-muted">Back</button>
                <button
                    onClick={onNext}
                    disabled={!data.fightFrequency || !data.partnerConflictStyle || !data.repairFrequency}
                    className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

function Step4_Demographics({ data, updateData, onNext, onBack }: { data: any, updateData: any, onNext: () => void, onBack: () => void }) {
    const isValid = data.userGender && data.partnerGender && data.userAgeRange && data.partnerAgeRange;

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">Last Step</h2>
                <p className="text-muted-foreground">Demographics for statistical accuracy.</p>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Gender</label>
                        <div className="flex flex-col gap-2">
                            {['Male', 'Female'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => updateData('userGender', g)}
                                    className={cn("p-2 rounded border text-sm", data.userGender === g ? "bg-primary text-primary-foreground border-primary" : "border-border")}
                                >
                                    {g}
                                </button>
                            ))}
                            {/* Other option could be added but keeping simple for speed */}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Partner's Gender</label>
                        <div className="flex flex-col gap-2">
                            {['Male', 'Female'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => updateData('partnerGender', g)}
                                    className={cn("p-2 rounded border text-sm", data.partnerGender === g ? "bg-primary text-primary-foreground border-primary" : "border-border")}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Age</label>
                        <select
                            value={data.userAgeRange}
                            onChange={(e) => updateData('userAgeRange', e.target.value)}
                            className="w-full p-2 rounded border bg-background"
                        >
                            <option value="">Select...</option>
                            <option value="<25">Under 25</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45+">45+</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Partner's Age</label>
                        <select
                            value={data.partnerAgeRange}
                            onChange={(e) => updateData('partnerAgeRange', e.target.value)}
                            className="w-full p-2 rounded border bg-background"
                        >
                            <option value="">Select...</option>
                            <option value="<25">Under 25</option>
                            <option value="25-34">25-34</option>
                            <option value="35-44">35-44</option>
                            <option value="45+">45+</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onBack} className="px-6 py-3 rounded-full font-medium text-muted-foreground hover:bg-muted">Back</button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

function Step5_Fear({ data, updateData, onSubmit, onBack, isSubmitting }: { data: any, updateData: any, onSubmit: () => void, onBack: () => void, isSubmitting: boolean }) {
    const options = [
        "That I'm not happy",
        "That I don't trust them",
        "That I'm attracted to someone else",
        "That I don't love them anymore",
        "That I'm afraid of them"
    ];

    const [isOther, setIsOther] = useState(false);
    const [customFear, setCustomFear] = useState("");

    const handleSelect = (val: string) => {
        setIsOther(false);
        updateData('biggestFear', val);
    };

    const handleOther = () => {
        setIsOther(true);
        updateData('biggestFear', customFear);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setCustomFear(val);
        updateData('biggestFear', val);
    };

    // Valid if selected from options OR (Other is selected AND text > 3 chars)
    const isValid = !!data.biggestFear && (isOther ? data.biggestFear.length > 3 : true);

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">One last difficult question...</h2>
                <p className="text-muted-foreground">What is the one thing you are most afraid to tell your partner?</p>
            </div>

            <div className="space-y-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all",
                            data.biggestFear === opt && !isOther
                                ? "border-primary bg-primary/5 text-primary font-bold"
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        {opt}
                    </button>
                ))}

                <button
                    onClick={handleOther}
                    className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all",
                        isOther
                            ? "border-primary bg-primary/5 text-primary font-bold"
                            : "border-border hover:border-primary/50"
                    )}
                >
                    Something else...
                </button>

                {isOther && (
                    <textarea
                        autoFocus
                        placeholder="Type here..."
                        className="w-full p-4 rounded-xl border border-input bg-background min-h-[100px] resize-none animate-in fade-in zoom-in-95 duration-200"
                        value={customFear}
                        onChange={handleCustomChange}
                    />
                )}
            </div>

            <div className="flex gap-3 pt-4">
                <button onClick={onBack} className="px-6 py-3 rounded-full font-medium text-muted-foreground hover:bg-muted">Back</button>
                <button
                    onClick={onSubmit}
                    disabled={!isValid || isSubmitting}
                    className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {isSubmitting ? <Loader2 className="animate-spin inline mr-2" /> : null}
                    {isSubmitting ? "Starting Test..." : "Start Assessment"}
                </button>
            </div>
        </div>
    );
}


