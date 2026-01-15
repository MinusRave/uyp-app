import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { startTest, submitAnswer, completeTest, getTestSession, useQuery, captureLead, updateConflictDescription } from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { Loader2, Mail, MessageSquare, ChevronLeft } from "lucide-react";
import { cn } from "../client/utils";
import { trackPixelEvent } from "../analytics/pixel";

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
                const savedIndex = existingSession.currentQuestionIndex || 0;
                if (savedIndex >= QUESTIONS.length) {
                    // Check if conflict desc is done
                    if (existingSession.conflictDescription) {
                        setShowConflictGate(false);
                        setShowEmailGate(true);
                    } else {
                        setShowConflictGate(true);
                    }
                } else {
                    setCurrentQIndex(savedIndex);
                }

            } else {
                // No session? Show Profile Form first.
                setShowProfileForm(true);
            }
        };

        handleSessionCheck();
    }, [existingSession, isSessionLoading, navigate]);

    const handleProfileSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const newSession = await startTest(data);
            setSessionId(newSession.id);
            setShowProfileForm(false);
        } catch (e) {
            console.error("Failed to start test", e);
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
                // Finished Questions -> Go to Conflict Gate
                setShowConflictGate(true);
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

        // Validation: Min 10 chars (simple check against "bullshit")
        if (conflictText.length < 10) {
            alert("Please describe the situation in at least a few words so we can analyze it accurately.");
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
        try {
            await captureLead({ sessionId, email });
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

    // PROFILE FORM UI
    if (showProfileForm) {
        return <UserProfileForm onSubmit={handleProfileSubmit} isSubmitting={isSubmitting} />;
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
                            {conflictText.length < 10 ?
                                <span className="text-red-400">Too short ({conflictText.length}/10 chars)</span> :
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

function UserProfileForm({ onSubmit, isSubmitting }: { onSubmit: (data: any) => void, isSubmitting: boolean }) {
    const [formData, setFormData] = useState({
        userGender: "",
        partnerGender: "",
        userAgeRange: "",
        partnerAgeRange: "",
        relationshipStatus: "",
        // Relationship history
        relationshipDuration: "",
        livingTogether: false,
        hasChildren: false,
        previousRelationships: "",
        previousMarriage: false,
        majorLifeTransition: "",
        // Partner behavior (for compatibility)
        partnerConflictStyle: "",
        fightFrequency: "",
        repairFrequency: "",
        partnerHurtfulBehavior: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Only require basic fields for validation
    const isValid = formData.userGender && formData.partnerGender && formData.userAgeRange &&
        formData.partnerAgeRange && formData.relationshipStatus && formData.relationshipDuration &&
        formData.partnerConflictStyle && formData.fightFrequency && formData.repairFrequency;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) onSubmit(formData);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-lg w-full bg-card p-8 rounded-2xl shadow-xl border border-border">
                <h2 className="text-2xl font-bold mb-2 text-center text-primary">About You & Your Partner</h2>
                <p className="text-center text-muted-foreground mb-8">Help us personalize your analysis.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Your Gender</label>
                            <select name="userGender" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Partner's Gender</label>
                            <select name="partnerGender" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Your Age</label>
                            <select name="userAgeRange" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                                <option value="">Select...</option>
                                <option value="<25">Under 25</option>
                                <option value="25-34">25-34</option>
                                <option value="35-44">35-44</option>
                                <option value="45+">45+</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Partner's Age</label>
                            <select name="partnerAgeRange" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                                <option value="">Select...</option>
                                <option value="<25">Under 25</option>
                                <option value="25-34">25-34</option>
                                <option value="35-44">35-44</option>
                                <option value="45+">45+</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Relationship Status</label>
                        <select name="relationshipStatus" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                            <option value="">Select...</option>
                            <option value="Together">Together</option>
                            <option value="In Crisis">In Crisis</option>
                            <option value="Recently Separated">Recently Separated</option>
                        </select>
                    </div>

                    {/* Relationship History */}
                    <div className="border-t border-border pt-6 mt-6 space-y-4">
                        <h3 className="font-semibold text-lg">About Your Relationship</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">How long have you been together?</label>
                            <select name="relationshipDuration" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                                <option value="">Select...</option>
                                <option value="0-6mo">Less than 6 months</option>
                                <option value="6mo-2yr">6 months to 2 years</option>
                                <option value="2-5yr">2 to 5 years</option>
                                <option value="5-10yr">5 to 10 years</option>
                                <option value="10+yr">10+ years</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="livingTogether" onChange={handleChange} className="h-4 w-4" />
                                <span className="text-sm">Living together</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="hasChildren" onChange={handleChange} className="h-4 w-4" />
                                <span className="text-sm">Have children</span>
                            </label>
                        </div>
                    </div>

                    {/* Partner Behavior */}
                    <div className="border-t border-border pt-6 mt-6 space-y-4">
                        <h3 className="font-semibold text-lg">About Conflicts</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">How does your partner typically react during conflicts?</label>
                            <select name="partnerConflictStyle" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                                <option value="">Select...</option>
                                <option value="withdraws">Withdraws / Goes silent</option>
                                <option value="engages">Engages / Wants to talk it out</option>
                                <option value="escalates">Escalates / Gets more intense</option>
                                <option value="deflects">Deflects / Changes subject</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">How often do you have conflicts?</label>
                            <select name="fightFrequency" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                                <option value="">Select...</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="rarely">Rarely</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">How often do you successfully repair after conflicts?</label>
                            <select name="repairFrequency" onChange={handleChange} className="w-full p-2 rounded-md border bg-background" required>
                                <option value="">Select...</option>
                                <option value="always">Always - We always make up</option>
                                <option value="sometimes">Sometimes - It depends</option>
                                <option value="rarely">Rarely - We stay distant</option>
                                <option value="never">Never - Issues pile up</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">What does your partner do that hurts you most? (Optional)</label>
                            <textarea
                                name="partnerHurtfulBehavior"
                                onChange={handleChange}
                                className="w-full min-h-[80px] p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g., Goes silent for days, dismisses my feelings, brings up past mistakes..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="w-full py-3 mt-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50"
                    >
                        {isSubmitting ? "Starting..." : "Start Test →"}
                    </button>
                </form>
            </div>
        </div>
    );
}


