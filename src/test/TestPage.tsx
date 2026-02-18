import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { startTest, submitAnswer, completeTest, getTestSession, useQuery, captureLead, updateConflictDescription, updateWizardProgress, updateSessionActivity, generateQuickOverview, assessNarcissism, getSystemConfig } from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { Loader2, Mail, MessageSquare, ChevronLeft, BadgeCheck, AlertTriangle, Activity, ShieldCheck, Lock as LockIcon } from "lucide-react";
import { cn } from "../client/utils";
import { ProcessingOverlay } from "./ProcessingOverlay";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";
import { getDeviceInfo } from "../client/utils/deviceDetection";
// import { useSessionTracking } from "../client/hooks/useSessionTracking"; // DISABLED - causing excessive DB writes

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

    // 3. Query for System Config
    const { data: systemConfig } = useQuery(getSystemConfig);
    const enableSoftGate = systemConfig?.enableSoftGate ?? false;
    // Hard Gate is ENABLED if Soft Gate is DISABLED.
    const isHardGateEnabled = !enableSoftGate;

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

    // NEW: Lead Magnet Optimization
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<{ quickOverview?: any, narcissism?: any } | null>(null);

    // Session tracking - DISABLED due to excessive database writes
    // TODO: Optimize this to batch updates or reduce frequency
    /*
    const { trackPageView, getTrackingData } = useSessionTracking({
        sessionId: sessionId || '',
        onUpdate: async (data) => {
            if (sessionId) {
                try {
                    await updateSessionActivity({
                        sessionId,
                        sessionDuration: data.sessionDuration,
                        pageViews: data.pageViews,
                        interactionEvents: data.interactionEvents,
                    });
                } catch (e) {
                    console.error('Failed to update session activity', e);
                }
            }
        },
        updateInterval: 30000, // 30 seconds
    });
    */

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
    // Guard against double-advance
    const isAdvancing = React.useRef(false);

    useEffect(() => {
        const handleSessionCheck = async () => {
            if (isSessionLoading) return;

            if (existingSession) {
                // If session exists
                if (existingSession.isCompleted) {
                    // Lead Magnet Optimization:
                    // Only redirect if we have everything we need (Email provided OR Gate Disabled)
                    // Or if they already paid.
                    const hasEmail = !!existingSession.email;
                    const isPaid = !!existingSession.isPaid;

                    // Logic Update: If Hard Gate is ENABLED, we force email.
                    // If Hard Gate is DISABLED (Soft Gate ON), we allow through if completed.
                    const canProceed = isPaid || hasEmail || !isHardGateEnabled;

                    if (canProceed) {
                        navigate(routes.ProcessingRoute.build());
                        return;
                    }
                    // Otherwise: Stay here to show Email Gate
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
                        // Hydrate analysis data if available
                        if (existingSession.quickOverview || existingSession.narcissismAnalysis) {
                            setAnalysisData({
                                quickOverview: existingSession.quickOverview,
                                narcissism: existingSession.narcissismAnalysis
                            });
                        }
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

                    // Capture device information
                    const deviceInfo = getDeviceInfo();

                    const newSession = await startTest({
                        fbclid: fbclid || undefined,
                        ...utms,
                        ...deviceInfo
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

    const handleOptionClick = (answerId: number) => {
        if (isSubmitting || isAdvancing.current) return;

        setSelectedAnswer(answerId);
        isAdvancing.current = true;

        // Auto-advance after small delay for visual feedback
        setTimeout(() => {
            handleNext(answerId);
        }, 250);
    };

    const handleNext = async (answerIdOverride?: number) => {
        // Use override if provided (for auto-advance), otherwise state
        const answerId = answerIdOverride ?? selectedAnswer;

        if (!sessionId || answerId === null) {
            isAdvancing.current = false;
            return;
        }
        if (!currentQuestion) {
            isAdvancing.current = false;
            return;
        }

        setIsSubmitting(true);
        try {
            const answerObj = ANSWERS.find(a => a.id === answerId);

            await submitAnswer({
                sessionId,
                questionId: currentQuestion.id,
                answerId: answerId,
                score: answerObj?.score || 3, // Raw score 1-5
                dimension: currentQuestion.dimension,
                type: currentQuestion.type
            });

            if (currentQIndex < QUESTIONS.length - 1) {
                setCurrentQIndex(prev => prev + 1);
                setSelectedAnswer(null);
            } else {
                // Finished Questions -> Trigger Analysis IMMEDIATELY
                await triggerAnalysis();
            }

        } catch (e) {
            console.error("Error submitting answer", e);
            alert("Errore di connessione. Riprova.");
        } finally {
            setIsSubmitting(false);
            isAdvancing.current = false;
        }
    };

    const triggerAnalysis = async () => {
        setIsAnalyzing(true);
        setShowConflictGate(false); // Ensure this is hidden
        // Ensure email gate is hidden until analysis is done
        setShowEmailGate(false);

        try {
            // NEW: Lead Magnet Optimization - Trigger Analysis on Quiz Completion
            const startTime = Date.now();

            if (!sessionId) {
                console.error("No sessionId available for analysis");
                setShowEmailGate(true); // Fallback
                return;
            }

            // Lead Magnet Optimization:
            // 1. Mark test as complete and Calculate Metrics FIRST
            // This ensures 'advancedMetrics' are popualared in the DB so the AI has data to work with.
            await completeTest({ sessionId });

            // 2. Run parallel AI requests
            const [quickOverviewRes, narcissismRes] = await Promise.allSettled([
                generateQuickOverview({ sessionId }),
                assessNarcissism({ sessionId })
            ]);

            const quickOverview = quickOverviewRes.status === 'fulfilled' ? quickOverviewRes.value : null;
            const narcissism = narcissismRes.status === 'fulfilled' ? narcissismRes.value?.json : null;

            setAnalysisData({
                quickOverview: quickOverview?.json,
                narcissism: narcissism
            });

            // Ensure minimum display time for the "Analyzing..." effect (e.g. 4 seconds)
            const elapsedTime = Date.now() - startTime;
            const minTime = 4000;
            if (elapsedTime < minTime) {
                await new Promise(resolve => setTimeout(resolve, minTime - elapsedTime));
            }

            // Track Test Completion (Pixel)
            trackPixelEvent('SubmitApplication', { status: 'completed' });

            if (isHardGateEnabled) {
                setShowEmailGate(true);
            } else {
                // If gate disabled (Soft Gate Mode), go straight to results (we already waited)
                navigate(routes.TeaserRoute.build());
            }

        } catch (err) {
            console.error("Analysis failed:", err);
            // Fallback: Show email gate anyway if enabled
            if (isHardGateEnabled) {
                setShowEmailGate(true);
            } else {
                navigate(routes.TeaserRoute.build());
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Removed handleConflictSubmit as it's no longer used
    /*
    const handleConflictSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) return;

        // Validation: Min 50 chars (Relationship Spec)
        if (conflictText.length < 50) {
            alert("Please describe the situation in more detail (at least 50 characters) so our AI can analyze it accurately.");
            return;
        }

        setIsSubmitting(true);
        setIsAnalyzing(true); // Show Overlay

        try {
            await updateConflictDescription({ sessionId, description: conflictText });

            // RUN ANALYSIS NOW (Lead Magnet Optimization)
            const startTime = Date.now();

            // Run parallel requests
            const [quickOverviewRes, narcissismRes] = await Promise.allSettled([
                generateQuickOverview({ sessionId }),
                assessNarcissism({ sessionId })
            ]);

            const quickOverview = quickOverviewRes.status === 'fulfilled' ? quickOverviewRes.value : null;
            const narcissism = narcissismRes.status === 'fulfilled' ? narcissismRes.value?.json : null;

            setAnalysisData({
                quickOverview: quickOverview?.json,
                narcissism: narcissism
            });

            // Ensure minimum display time for the "Analyzing..." effect (e.g. 4 seconds)
            const elapsedTime = Date.now() - startTime;
            const minTime = 4000;
            if (elapsedTime < minTime) {
                await new Promise(resolve => setTimeout(resolve, minTime - elapsedTime));
            }

            setShowConflictGate(false);
            setShowEmailGate(true);
        } catch (err) {
            console.error(err);
            // Even if analysis fails, we still want to move to email gate (just without juicy data)
            setShowConflictGate(false);
            setShowEmailGate(true);
        } finally {
            setIsSubmitting(false);
            setIsAnalyzing(false);
        }
    };
    */

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !sessionId) return;
        setIsSubmitting(true);

        // Generate Event ID for deduplication
        const eventID = generateEventId();

        try {
            await captureLead({ sessionId, email, eventID });
            // completeTest was already called in triggerAnalysis
            // await completeTest({ sessionId });

            // Add Client Pixel Event (was missing)
            trackPixelEvent('Lead', { eventID });

            // Small delay to ensure Pixel event has time to fire before navigation
            await new Promise(resolve => setTimeout(resolve, 300));

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
            <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    // Global Processing Overlay (for when analysis is triggered after quiz)
    if (isAnalyzing) {
        return <ProcessingOverlay isVisible={isAnalyzing} />;
    }

    // PROFILE FORM UI (Now QuizWizard)
    if (showProfileForm) {
        return <QuizWizard onSubmit={handleProfileSubmit} isSubmitting={isSubmitting} sessionId={sessionId} />;
    }

    // CONFLICT GATE UI (Removed per user request)

    // EMAIL GATE UI
    if (showEmailGate || (!currentQuestion && !isLoading && sessionId)) {
        return (
            <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-start pt-8 md:pt-12 p-4 md:p-6 animate-fade-in overflow-y-auto">
                <div className="max-w-lg w-full bg-card p-6 md:p-8 rounded-2xl shadow-xl border border-border">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Mail size={32} />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
                        {analysisData?.quickOverview ? "Your Relationship Profile is Ready" : "Generating Your Relationship Profile"}
                    </h2>


                    {analysisData?.quickOverview ? (
                        <div className="animate-fade-in space-y-6">
                            {/* Analysis Complete Badge */}
                            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 py-2 px-4 rounded-full w-fit mx-auto mb-4 border border-green-200">
                                <BadgeCheck size={18} className="fill-green-100 dark:fill-green-900" />
                                <span className="font-bold text-sm tracking-wide uppercase">Analysis Complete</span>
                            </div>

                            {/* Primary Result Card */}
                            <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-lg transform transition-all hover:scale-[1.01] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500"></div>

                                <div className="text-center mb-6">
                                    {/* Headline */}
                                    <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">
                                        "{analysisData.quickOverview.hero.headline}"
                                    </h3>

                                    {/* Primary Diagnosis */}
                                    <div className="text-3xl md:text-4xl font-black text-foreground leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-4">
                                        {analysisData.quickOverview.pulse.primary_diagnosis}
                                    </div>

                                    {/* Result Badge */}
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider border border-primary/20">
                                        {analysisData.quickOverview.hero.result_badge}
                                    </div>
                                </div>

                                {/* Risk Level & Red Flags Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {analysisData.narcissism?.partner_analysis?.risk_level && (
                                        <div className={cn("p-3 rounded-xl border text-center flex flex-col items-center justify-center",
                                            (analysisData.narcissism.partner_analysis.risk_level === "High" || analysisData.narcissism.partner_analysis.risk_level === "Severe")
                                                ? "bg-red-50 border-red-200 text-red-700"
                                                : "bg-blue-50 border-blue-200 text-blue-700"
                                        )}>
                                            <div className="text-[10px] font-bold uppercase opacity-75 mb-1">Toxicity Risk</div>
                                            <div className="font-black text-lg flex items-center justify-center gap-1">
                                                {analysisData.narcissism.partner_analysis.risk_level === "High" || analysisData.narcissism.partner_analysis.risk_level === "Severe" ? <AlertTriangle size={16} /> : <Activity size={16} />}
                                                {analysisData.narcissism.partner_analysis.risk_level}
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-3 rounded-xl border bg-orange-50 border-orange-200 text-orange-800 text-center flex flex-col items-center justify-center">
                                        <div className="text-[10px] font-bold uppercase opacity-75 mb-1">Red Flags Detected</div>
                                        <div className="font-black text-lg flex items-center gap-1">
                                            <AlertTriangle size={16} />
                                            {analysisData.narcissism?.relationship_health?.red_flags?.length || 0} Critical
                                        </div>
                                    </div>
                                </div>

                                {/* Value Prop Teaser */}
                                <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed border border-border/50">
                                    <p className="font-medium text-foreground mb-1">Your Full Report is Ready.</p>
                                    <p>
                                        We've mapped out exactly how this pattern started, why it's escalating, and the <strong>specific roadmap</strong> to break free before it's too late.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
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
                    )}

                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground block mb-2 text-left">
                                Enter your email to access your confidential report:
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
                                    {isSubmitting ? "Unlocking..." : "Unlock Full Report Now"}
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

    const handleBack = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex((prev) => prev - 1);
            setSelectedAnswer(null); // Clear selection or we could try to reload previous answer from session if available locally
        }
    };

    if (!currentQuestion) return null;

    return (
        <div className="min-h-[100dvh] bg-background text-foreground flex flex-col justify-between">
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

            {/* Hidden Footer Space to ensure scrolling if needed, but no button to save vertical space */}
            <div className="h-6 w-full md:hidden"></div>

            {/* Desktop-only back/next controls if we wanted them, but for now we hide completely for mobile-first focus */}
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


