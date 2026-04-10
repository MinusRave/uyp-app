import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { saveCompletedTest, trackQuizEvent, getTestSession, useQuery, generateQuickOverview, assessNarcissism } from "wasp/client/operations";
import { login, useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { Loader2, Mail, ChevronLeft, BadgeCheck, Activity, ShieldCheck, Lock as LockIcon } from "lucide-react";
import { cn } from "../client/utils";
import { ProcessingOverlay } from "./ProcessingOverlay";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";
import { getDeviceInfo } from "../client/utils/deviceDetection";

import { TEST_CONFIG } from "./testConfig";

const QUESTIONS = TEST_CONFIG.questions;
const ANSWERS = TEST_CONFIG.answerOptions;

export default function TestPage() {
    const navigate = useNavigate();
    const { data: user } = useAuth();

    // Check if logged-in user already has an active session → redirect
    const { data: existingSession, isLoading: isSessionLoading } = useQuery(
        getTestSession,
        {},
        { enabled: !!user }
    );

    // Phase: loading → wizard → questions → email-gate → analyzing
    const [phase, setPhase] = useState<'loading' | 'wizard' | 'questions' | 'email-gate' | 'analyzing'>(user ? 'loading' : 'wizard');

    // Client-side quiz state (NO DB writes until email submission)
    const [wizardData, setWizardData] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<number, { answerId: number; score: number; dimension: string; type: string }>>({});
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [localAnswers, setLocalAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState("");

    // Attribution & device info (captured once on mount)
    const [attribution] = useState(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            return {
                fbclid: params.get('fbclid') || localStorage.getItem('uyp_fbclid') || undefined,
                utm_source: params.get('utm_source') || localStorage.getItem('uyp_utm_source') || undefined,
                utm_medium: params.get('utm_medium') || localStorage.getItem('uyp_utm_medium') || undefined,
                utm_campaign: params.get('utm_campaign') || localStorage.getItem('uyp_utm_campaign') || undefined,
                utm_content: params.get('utm_content') || localStorage.getItem('uyp_utm_content') || undefined,
                utm_term: params.get('utm_term') || localStorage.getItem('uyp_utm_term') || undefined,
                referrer: document.referrer || undefined,
            };
        } catch { return {}; }
    });
    const [deviceInfo] = useState(() => getDeviceInfo());

    const isAdvancing = useRef(false);
    const quizStartTracked = useRef(false);

    // Track ViewContent on mount
    useEffect(() => {
        trackPixelEvent('ViewContent', { content_name: 'Relationship Test' });
    }, []);

    // Redirect logged-in user with existing session
    useEffect(() => {
        if (!user) { setPhase('wizard'); return; }
        if (isSessionLoading) return;
        if (existingSession) {
            if (existingSession.isPaid) {
                navigate('/report');
            } else {
                navigate('/results');
            }
        } else {
            setPhase('wizard');
        }
    }, [user, existingSession, isSessionLoading, navigate]);

    // Track quiz abandon on page unload
    useEffect(() => {
        if (phase !== 'questions') return;
        const handleUnload = () => {
            trackQuizEvent({
                type: 'quiz_abandon',
                questionIndex: currentQIndex,
                deviceType: deviceInfo?.deviceType,
                referrer: attribution?.referrer,
                utm_source: attribution?.utm_source,
                utm_medium: attribution?.utm_medium,
            }).catch(() => {});
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [phase, currentQIndex, deviceInfo, attribution]);

    // Wizard completed → start questions
    const handleProfileSubmit = (data: any) => {
        setWizardData(data);
        setPhase('questions');

        if (!quizStartTracked.current) {
            quizStartTracked.current = true;
            trackPixelEvent('CustomEvent', { content_name: 'QuizStart' });
            trackQuizEvent({
                type: 'quiz_start',
                deviceType: deviceInfo?.deviceType,
                referrer: attribution?.referrer,
                utm_source: attribution?.utm_source,
                utm_medium: attribution?.utm_medium,
            }).catch(() => {});
        }
    };

    const currentQuestion = QUESTIONS[currentQIndex];
    const progressPercentage = ((currentQIndex) / QUESTIONS.length) * 100;

    const handleOptionClick = (answerId: number) => {
        if (isSubmitting || isAdvancing.current) return;
        setSelectedAnswer(answerId);
        isAdvancing.current = true;
        setTimeout(() => { handleNext(answerId); }, 250);
    };

    const handleNext = (answerIdOverride?: number) => {
        const answerId = answerIdOverride ?? selectedAnswer;
        if (answerId === null || !currentQuestion) {
            isAdvancing.current = false;
            return;
        }

        const answerObj = ANSWERS.find(a => a.id === answerId);

        // Store answer in local state (NO DB call)
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: {
                answerId,
                score: answerObj?.score || 3,
                dimension: currentQuestion.dimension,
                type: currentQuestion.type,
            }
        }));
        setLocalAnswers(prev => ({ ...prev, [currentQIndex]: answerId }));

        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setPhase('email-gate');
        }

        isAdvancing.current = false;
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !wizardData) return;
        setIsSubmitting(true);
        setPhase('analyzing');

        const eventID = generateEventId();
        trackPixelEvent('Lead', { eventID });

        try {
            const startTime = Date.now();

            // Single atomic server call: create user + session + scores
            const result = await saveCompletedTest({
                email,
                profile: wizardData,
                answers,
                attribution: attribution as any,
                deviceInfo: deviceInfo as any,
                eventID,
            });

            // Store session ID for downstream pages
            localStorage.setItem("uyp-session-id", result.sessionId);

            // Auto-login the user
            await login({ email: result.email, password: result.loginToken });

            // Fire-and-forget AI analysis
            Promise.allSettled([
                generateQuickOverview({ sessionId: result.sessionId }),
                assessNarcissism({ sessionId: result.sessionId }),
            ]);

            // Minimum display time for processing overlay
            const elapsed = Date.now() - startTime;
            if (elapsed < 4000) {
                await new Promise(resolve => setTimeout(resolve, 4000 - elapsed));
            }

            trackPixelEvent('SubmitApplication', { status: 'completed' });
            navigate(routes.TeaserRoute.build());
        } catch (err) {
            console.error("Failed to save test:", err);
            setPhase('email-gate');
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentQIndex > 0) {
            const prevIndex = currentQIndex - 1;
            setCurrentQIndex(prevIndex);
            setSelectedAnswer(localAnswers[prevIndex] ?? null);
        }
    };

    // --- RENDER ---

    if (phase === 'loading') {
        return (
            <div className="flex h-dvh w-full items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (phase === 'analyzing') {
        return <ProcessingOverlay isVisible={true} />;
    }

    if (phase === 'wizard') {
        return <QuizWizard onSubmit={handleProfileSubmit} isSubmitting={isSubmitting} />;
    }

    if (phase === 'email-gate') {
        return (
            <div className="min-h-dvh bg-background flex flex-col items-center justify-start pt-8 md:pt-12 p-4 md:p-6 animate-fade-in overflow-y-auto">
                <div className="max-w-lg w-full bg-card p-6 md:p-8 rounded-2xl shadow-xl border border-border">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Mail size={32} />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
                        Your Relationship Profile is Ready
                    </h2>

                    <div className="bg-muted/30 rounded-xl p-6 mb-8 text-center space-y-4 border border-border">
                        <h3 className="text-xl font-bold">Your Profile is Ready</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We've analyzed your answers against 5 key relationship dimensions. Your results include a detailed breakdown of your conflict style, hidden emotional needs, and a personalized roadmap to connection.
                        </p>
                        <div className="flex justify-center gap-4 text-sm font-medium text-muted-foreground">
                            <span className="flex items-center gap-1"><BadgeCheck size={16} className="text-green-500" /> Confidential</span>
                            <span className="flex items-center gap-1"><Activity size={16} className="text-primary" /> Clinical-Grade</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground block mb-2 text-left">
                                Where should we send your results?
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                className="w-full p-4 rounded-xl border border-input bg-background text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <LockIcon size={20} />}
                                    {isSubmitting ? "Unlocking..." : "Reveal My Analysis"}
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                            <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5 opacity-80">
                                <ShieldCheck size={12} className="text-green-600" />
                                100% Secure. We respect your privacy & zero spam.
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-left space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-100">
                                <span className="text-blue-600 dark:text-blue-400">✓</span>
                                <span className="font-medium">Fully encrypted & confidential</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-100">
                                <span className="text-blue-600 dark:text-blue-400">✓</span>
                                <span className="font-medium">Never shared with third parties</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-100">
                                <span className="text-blue-600 dark:text-blue-400">✓</span>
                                <span className="font-medium">Delete anytime from your account</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // QUESTIONS PHASE
    if (!currentQuestion) return null;

    return (
        <div className="min-h-dvh bg-background text-foreground flex flex-col justify-between">
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-3xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {currentQIndex > 0 && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-1 pl-0 pr-3 py-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Go back"
                            >
                                <ChevronLeft size={20} />
                                <span className="text-sm font-medium">Back</span>
                            </button>
                        )}
                        <div className="font-bold text-lg text-primary">UYP Test</div>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                        {currentQIndex + 1}/{QUESTIONS.length}
                    </div>
                </div>
                <div className="h-1.5 w-full bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start pt-8 md:pt-12 p-4 md:p-6 max-w-2xl mx-auto w-full overflow-y-auto">
                <div key={currentQIndex} className="w-full flex flex-col items-center animate-in slide-in-from-right-8 fade-in duration-300 fill-mode-both">
                    <div className="mb-6 md:mb-10 text-center">
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold leading-snug mb-2 md:mb-4 text-foreground">
                            {currentQuestion.text}
                        </h2>
                        <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-wide">
                            Answer instinctively
                        </p>
                    </div>

                    <div className="w-full space-y-3 md:space-y-4">
                        {ANSWERS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionClick(option.id)}
                                className={cn(
                                    "w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200 flex items-center group touch-manipulation",
                                    selectedAnswer === option.id
                                        ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary transform scale-[0.98]"
                                        : "border-border hover:border-primary/50 bg-card hover:bg-muted active:scale-[0.98]"
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 md:w-6 md:h-6 rounded-full border-2 mr-3 md:mr-4 flex items-center justify-center transition-colors shrink-0",
                                    selectedAnswer === option.id
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground/30 group-hover:border-primary"
                                )}>
                                    {selectedAnswer === option.id && (
                                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white" />
                                    )}
                                </div>
                                <span className="text-base md:text-lg font-medium leading-tight">{option.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            <div className="h-6 w-full md:hidden"></div>
        </div>
    );
}


// --- Wizard Components ---

function QuizWizard({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void, isSubmitting: boolean }) {
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

        fightFrequency: "",
        partnerConflictStyle: "",
        repairFrequency: "",
        partnerHurtfulBehavior: "",
        biggestFear: ""
    });

    const totalSteps = 7;

    const updateData = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = (currentStepData?: any) => {
        if (currentStepData) {
            setFormData(prev => ({ ...prev, ...currentStepData }));
        }
        setStep(prev => Math.min(prev + 1, totalSteps));

        // Track wizard step (pixel only, no DB)
        trackPixelEvent("CustomEvent", {
            content_name: "WizardStep",
            step_number: step,
            step_name: `Step_${step}`
        });
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleFinalSubmit = () => {
        trackPixelEvent("CustomEvent", {
            content_name: "WizardStep",
            step_number: totalSteps,
            step_name: "BiggestFear"
        });
        onSubmit(formData);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg">
                <div className="mb-8 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
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
                    <Step2_Context
                        data={formData}
                        updateData={updateData}
                        onNext={() => nextStep()}
                        onBack={prevStep}
                    />
                )}

                {step === 3 && (
                    <Step3_Frequency
                        data={formData}
                        updateData={updateData}
                        onNext={() => nextStep()}
                        onBack={prevStep}
                    />
                )}

                {step === 4 && (
                    <Step4_Style
                        data={formData}
                        updateData={updateData}
                        onNext={() => nextStep()}
                        onBack={prevStep}
                    />
                )}

                {step === 5 && (
                    <Step5_Repair
                        data={formData}
                        updateData={updateData}
                        onNext={() => nextStep()}
                        onBack={prevStep}
                    />
                )}

                {step === 6 && (
                    <Step6_Demographics
                        data={formData}
                        updateData={updateData}
                        onNext={() => nextStep()}
                        onBack={prevStep}
                    />
                )}

                {step === 7 && (
                    <Step7_Fear
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

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function Step1_Status({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const options = [
        { id: "In Crisis", label: "In crisis", icon: "💔", desc: "Breaking up, separated, or barely holding on" },
        { id: "Unstable", label: "Unstable", icon: "⚠️", desc: "Frequent fights, emotional distance, or chronic tension" },
        { id: "Stable but Stuck", label: "Stable but stuck", icon: "😐", desc: "No major issues, but missing something important" },
        { id: "Healthy", label: "Healthy", icon: "✨", desc: "We're good; we want to understand our patterns better" },
    ];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Where is your relationship right now?</h2>
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

function Step2_Context({ data, updateData, onNext, onBack }: { data: any, updateData: any, onNext: () => void, onBack: () => void }) {
    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">A few quick details</h2>
                <p className="text-muted-foreground">To set the context for your analysis.</p>
            </div>

            <div className="space-y-5 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="space-y-3">
                    <label className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Time Together</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: '0-6mo', label: '< 6 Mo' },
                            { id: '6mo-2yr', label: '6 Mo-2 Yr' },
                            { id: '2-5yr', label: '2-5 Yrs' },
                            { id: '5-10yr', label: '5-10 Yrs' },
                            { id: '10+yr', label: '10+ Yrs' },
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => updateData('relationshipDuration', opt.id)}
                                className={cn(
                                    "p-3 rounded-xl border text-sm font-bold transition-all",
                                    data.relationshipDuration === opt.id
                                        ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-[1.02]"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-border/50"></div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => updateData('livingTogether', !data.livingTogether)}
                        className={cn(
                            "p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                            data.livingTogether ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/50"
                        )}
                    >
                        <span className="text-2xl">🏠</span>
                        <div className="leading-tight">
                            <div className="font-bold text-sm">Living</div>
                            <div className="text-xs text-muted-foreground">Together</div>
                        </div>
                        {data.livingTogether && <CheckIcon className="w-4 h-4 ml-auto text-primary" />}
                    </button>

                    <button
                        onClick={() => updateData('hasChildren', !data.hasChildren)}
                        className={cn(
                            "p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                            data.hasChildren ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/50"
                        )}
                    >
                        <span className="text-2xl">👶</span>
                        <div className="leading-tight">
                            <div className="font-bold text-sm">Have</div>
                            <div className="text-xs text-muted-foreground">Children</div>
                        </div>
                        {data.hasChildren && <CheckIcon className="w-4 h-4 ml-auto text-primary" />}
                    </button>
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onBack} className="px-6 py-3 rounded-full font-medium text-muted-foreground hover:bg-muted">Back</button>
                <button
                    onClick={onNext}
                    disabled={!data.relationshipDuration}
                    className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

function Step3_Frequency({ data, updateData, onNext, onBack }: { data: any, updateData: any, onNext: () => void, onBack: () => void }) {
    const options = [
        { id: "daily", label: "Daily" },
        { id: "weekly", label: "Weekly" },
        { id: "monthly", label: "Monthly" },
        { id: "rarely", label: "Rarely" },
    ];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">How often do you fight?</h2>
                <p className="text-muted-foreground">Be honest, we don't judge.</p>
            </div>
            <div className="grid gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => {
                            updateData('fightFrequency', opt.id);
                            onNext();
                        }}
                        className={cn(
                            "w-full text-left p-5 rounded-xl border-2 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]",
                            data.fightFrequency === opt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                        )}
                    >
                        <div className="font-bold text-lg">{opt.label}</div>
                    </button>
                ))}
            </div>
            <button onClick={onBack} className="w-full py-3 text-muted-foreground hover:text-foreground text-sm font-medium">Back</button>
        </div>
    );
}

function Step4_Style({ data, updateData, onNext, onBack }: { data: any, updateData: any, onNext: () => void, onBack: () => void }) {
    const options = [
        { id: "withdraws", label: "Withdraws / Goes silent", icon: "😶" },
        { id: "escalates", label: "Escalates / Gets intense", icon: "🔥" },
        { id: "deflects", label: "Deflects / Blames you", icon: "🛡️" },
        { id: "engages", label: "Tries to resolve it calmly", icon: "🤝" },
    ];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">When you fight, your partner typically...</h2>
            </div>
            <div className="grid gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => {
                            updateData('partnerConflictStyle', opt.id);
                            onNext();
                        }}
                        className={cn(
                            "w-full text-left p-5 rounded-xl border-2 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]",
                            data.partnerConflictStyle === opt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-2xl">{opt.icon}</span>
                            <div className="font-bold text-lg">{opt.label}</div>
                        </div>
                    </button>
                ))}
            </div>
            <button onClick={onBack} className="w-full py-3 text-muted-foreground hover:text-foreground text-sm font-medium">Back</button>
        </div>
    );
}

function Step5_Repair({ data, updateData, onNext, onBack }: { data: any, updateData: any, onNext: () => void, onBack: () => void }) {
    const options = [
        { id: "always", label: "Always", desc: "We make up quickly" },
        { id: "sometimes", label: "Sometimes", desc: "It takes time" },
        { id: "rarely", label: "Rarely", desc: "We brush it under the rug" },
        { id: "never", label: "Never", desc: "Resentment builds up" },
    ];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Do you repair afterwards?</h2>
                <p className="text-muted-foreground">Can you reconnect after a conflict?</p>
            </div>
            <div className="grid gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => {
                            updateData('repairFrequency', opt.id);
                            onNext();
                        }}
                        className={cn(
                            "w-full text-left p-5 rounded-xl border-2 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]",
                            data.repairFrequency === opt.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                        )}
                    >
                        <div>
                            <div className="font-bold text-lg">{opt.label}</div>
                            <div className="text-muted-foreground text-sm">{opt.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
            <button onClick={onBack} className="w-full py-3 text-muted-foreground hover:text-foreground text-sm font-medium">Back</button>
        </div>
    );
}

function Step6_Demographics({ data, updateData, onNext, onBack }: { data: any, updateData: any, onNext: () => void, onBack: () => void }) {
    const isValid = data.userGender && data.partnerGender && data.userAgeRange && data.partnerAgeRange;
    const ageRanges = [
        { id: "<25", label: "< 25" },
        { id: "25-34", label: "25-34" },
        { id: "35-44", label: "35-44" },
        { id: "45+", label: "45+" }
    ];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">Final Details</h2>
                <p className="text-muted-foreground">For accurate caching & benchmarks.</p>
            </div>

            <div className="bg-card p-5 rounded-2xl border border-border shadow-sm space-y-6">
                {/* User Row */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase text-muted-foreground bg-muted px-2 py-1 rounded">You</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex bg-muted/30 p-1 rounded-lg">
                            {['Male', 'Female'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => updateData('userGender', g)}
                                    className={cn("flex-1 py-2 rounded-md text-sm font-bold transition-all",
                                        data.userGender === g ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {g === 'Male' ? 'Man' : 'Woman'}
                                </button>
                            ))}
                        </div>
                        <select
                            value={data.userAgeRange}
                            onChange={(e) => updateData('userAgeRange', e.target.value)}
                            className="w-full p-2 rounded-lg border bg-background text-sm font-medium"
                        >
                            <option value="">Age...</option>
                            {ageRanges.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="h-px bg-border/50"></div>

                {/* Partner Row */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase text-muted-foreground bg-muted px-2 py-1 rounded">Partner</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex bg-muted/30 p-1 rounded-lg">
                            {['Male', 'Female'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => updateData('partnerGender', g)}
                                    className={cn("flex-1 py-2 rounded-md text-sm font-bold transition-all",
                                        data.partnerGender === g ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {g === 'Male' ? 'Man' : 'Woman'}
                                </button>
                            ))}
                        </div>
                        <select
                            value={data.partnerAgeRange}
                            onChange={(e) => updateData('partnerAgeRange', e.target.value)}
                            className="w-full p-2 rounded-lg border bg-background text-sm font-medium"
                        >
                            <option value="">Age...</option>
                            {ageRanges.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onBack} className="px-6 py-3 rounded-full font-medium text-muted-foreground hover:bg-muted">Back</button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

function Step7_Fear({ data, updateData, onSubmit, onBack, isSubmitting }: { data: any, updateData: any, onSubmit: () => void, onBack: () => void, isSubmitting: boolean }) {
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
        onSubmit();
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
                        disabled={isSubmitting}
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
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <textarea
                            autoFocus
                            placeholder="Type here..."
                            className="w-full p-4 rounded-xl border border-input bg-background min-h-[100px] resize-none"
                            value={customFear}
                            onChange={handleCustomChange}
                        />
                        <button
                            onClick={onSubmit}
                            disabled={!isValid || isSubmitting}
                            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin inline mr-2" /> : null}
                            {isSubmitting ? "Starting Test..." : "Start Assessment"}
                        </button>
                    </div>
                )}
            </div>

            {!isOther && (
                <div className="flex gap-3 pt-4">
                    <button onClick={onBack} className="w-full py-3 text-muted-foreground hover:text-foreground text-sm font-medium">Back</button>
                </div>
            )}
        </div>
    );
}
