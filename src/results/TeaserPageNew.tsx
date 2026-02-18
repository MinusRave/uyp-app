import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, CheckCircle, AlertTriangle, TrendingUp, Shield, Heart, BadgeCheck, Compass, Zap, X, Activity, ChevronDown, Check, Eye, Microscope, ListChecks, ShieldAlert, Clock, MessageCircle, Brain, Quote, Star, Play, TrendingDown, Battery, Thermometer, FileWarning, BookOpen, Users, FileText, ShieldCheck, Info, ChevronUp } from "lucide-react";
import { useQuery, generateQuickOverview, generateFullReport, createCheckoutSession, getTestSession, getSystemConfig, captureLead } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import Confetti from "react-confetti";
import { trackPixelEvent } from '../analytics/pixel';
import ExitIntentPopup from './ExitIntentPopup';
import EmailCaptureModal from "./components/EmailCaptureModal";

// --- TYPES ---
type QuickOverviewData = {
    hero: { headline: string; subheadline: string; result_badge: string };
    pulse: { summary: string; primary_diagnosis: string };
    forecast: { short_term: string };
    dimensions: {
        communication: { status: string; teaser: string; metric_insight: string };
        security: { status: string; teaser: string; metric_insight: string };
        erotic: { status: string; teaser: string; metric_insight: string };
        balance: { status: string; teaser: string; metric_insight: string };
        compass: { status: string; teaser: string; metric_insight: string };
    };
};

type FullReportData = {
    chapter1_pulse: any;
    chapter2_communication: any;
    chapter3_security: any;
    chapter4_erotic: any;
    chapter5_balance: any;
    chapter6_compass: any;
    chapter7_synthesis: any;
    chapter8_roadmap: any;
};

// --- COMPONENTS ---

// 1. HERO SECTION COMPONENT
// 1. HERO SECTION COMPONENT
const HeroSection = ({
    badge,
    onUnlock,
    quickOverview,
    narcissismAnalysis,
    advancedMetrics
}: {
    badge: string,
    onUnlock: (location: string) => void,
    quickOverview?: QuickOverviewData | null,
    narcissismAnalysis?: any,
    advancedMetrics?: any
}) => {
    // Determine Risk Level
    const isHighRisk = narcissismAnalysis?.risk_level === "High" || narcissismAnalysis?.risk_level === "Severe";
    const riskLabel = isHighRisk ? "High Risk Pattern" : "Analysis Complete";
    const riskColor = isHighRisk ? "text-orange-600 bg-orange-50 border-orange-200" : "text-primary bg-primary/10 border-primary/20";

    // Dynamic Background
    const bgGradient = isHighRisk
        ? "from-orange-500/20 via-background to-background"
        : "from-primary/10 via-background to-background";

    // Real Data for Blurred Box
    const diagnosis = quickOverview?.pulse?.primary_diagnosis || "The Pursuer-Withdrawer Cycle";

    // Calculate Sustainability Score (Fallback to 45 if missing)
    // We try to find a sustainability score in advancedMetrics, or calc average of PM/SL
    const sustainabilityScore = advancedMetrics?.sustainability_score || 45;
    const sustainabilityLabel = sustainabilityScore < 50 ? "Critical" : sustainabilityScore < 75 ? "At Risk" : "Stable";
    const sustainabilityColor = sustainabilityScore < 50 ? "text-red-500" : sustainabilityScore < 75 ? "text-orange-500" : "text-green-500";
    const sustainabilityWidth = `${sustainabilityScore}%`;

    // Forecast Text
    const forecastText = quickOverview?.forecast?.short_term || "High probability of emotional detachment if intervention does not occur within 6 months...";

    return (
        <header className="bg-background text-foreground pt-12 pb-24 px-6 relative overflow-hidden border-b border-border/40">
            {/* Abstract Background */}
            <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${bgGradient} -z-20`} />

            <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                {/* Pre-headline / Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold tracking-wide mb-4 animate-fade-in ${riskColor}`}>
                    {isHighRisk ? <AlertTriangle size={16} /> : <Activity size={16} />}
                    {riskLabel} • Customized to Your Answers
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                    You Just Answered 30 Questions About Your Relationship.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        Here Is Your Personalized Diagnosis.
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                    Your relationship has a unique fingerprint. A hidden dynamic you can feel but can't name. Based on your specific inputs, we've identified the pattern.
                    <br /><br />
                    <span className="font-bold text-foreground">Includes: Clinical Toxicity & Narcissism Assessment.</span>
                </p>

                {/* The "Blind" Reveal Box */}
                <div className="mt-12 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-8 max-w-lg mx-auto transform hover:scale-[1.02] transition-all duration-300 shadow-2xl relative group cursor-pointer" onClick={() => onUnlock('hero_blind_box')}>
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        YOUR RESULTS
                    </div>

                    <div className="space-y-6 text-left filter blur-[3px] opacity-60 group-hover:blur-[2px] transition-all">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Your Dominant Pattern</p>
                            <h3 className="text-2xl font-bold text-foreground">{diagnosis}</h3>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Sustainability Score</p>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full transition-all duration-1000" style={{ width: sustainabilityWidth, backgroundColor: sustainabilityScore < 50 ? '#ef4444' : '#f97316' }}></div>
                                </div>
                                <span className={`font-bold ${sustainabilityColor}`}>{sustainabilityLabel}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">6-Month Forecast</p>
                            <p className="text-sm text-foreground">{forecastText}</p>
                        </div>
                    </div>

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 transition-all group-hover:bg-background/40">
                        <Lock className="text-primary mb-2 h-10 w-10 drop-shadow-lg" />
                        <span className="text-foreground font-bold text-lg tracking-wide drop-shadow-md">Unlock My Diagnosis</span>
                    </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-8">
                    <div className="text-center mt-12">
                        <button
                            onClick={() => onUnlock('hero_cta')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl py-4 px-12 rounded-full shadow-xl hover:shadow-2xl transition-all animate-pulse"
                        >
                            Reveal My Analysis Now 👉
                        </button>
                        <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-2">
                            <Lock size={12} /> Secure 256-bit Encryption • 30-Day Money-Back Guarantee
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

// 2. MIRROR SECTION (Identification)
const MirrorSection = () => {
    const symptoms = [
        {
            title: "Am I the crazy one?",
            desc: "They tell you you're too sensitive, that you're overreacting. But you KNOW something's wrong. You can feel it in your body."
        },
        {
            title: "Why do they keep rejecting me?",
            desc: "Every time you reach for connection, they pull away. Every 'not tonight' feels like a rejection of YOU, not just the moment."
        },
        {
            title: "Why do I have to do EVERYTHING?",
            desc: "You're the relationship manager. You remember the appointments, the groceries, the plans. You feel more like a parent than a partner."
        },
        {
            title: "Have we become roommates?",
            desc: "You talk about logistics, kids, and bills. But you haven't had a real conversation about US in months."
        },
        {
            title: "Is this fixable?",
            desc: "You're stuck between 'try harder' and 'give up'. Every day without clarity feels like a day wasted."
        }
    ];

    return (
        <section className="py-20 px-6 bg-muted/30">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Your Answers Reveal These Doubts
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        The pattern we detected in your test typically creates these specific internal questions:
                    </p>
                </div>

                <div className="space-y-6">
                    {symptoms.map((symptom, idx) => (
                        <div key={idx} className="flex gap-5 bg-card p-6 rounded-xl shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/30">
                            <div className="shrink-0 pt-1">
                                <CheckCircle className="text-primary" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground mb-2">"{symptom.title}"</h3>
                                <p className="text-muted-foreground leading-relaxed italic">
                                    {symptom.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                    <p className="text-foreground font-medium text-lg">
                        <strong>You're not imagining it.</strong> Your relationship HAS a pattern. And that pattern has a name, a structure, and a predicted trajectory. The problem isn't that you're broken—it's that you're stuck in a system you can't see.
                    </p>
                </div>
            </div>
        </section>
    );
};


export default function TeaserPageNew() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    const localSessionId = typeof window !== "undefined" ? localStorage.getItem("uyp-session-id") : null;

    // 1. Fetch Session (Copied logic)
    const { data: session, isLoading: isSessionLoading, refetch } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

    // 2. Local State
    const [quickOverview, setQuickOverview] = useState<QuickOverviewData | null>(null);
    const [fullReport, setFullReport] = useState<FullReportData | null>(null);
    const [loadingQuick, setLoadingQuick] = useState(false);
    const [loadingFull, setLoadingFull] = useState(false);
    const [showFullReport, setShowFullReport] = useState(false);
    const [faqOpen, setFaqOpen] = useState<number | null>(null);
    const scrollDepthTracked = useRef<Set<number>>(new Set());

    // Guards
    const quickOverviewInitiated = useRef(false);
    const fullReportInitiated = useRef(false);

    const [addOrderBump, setAddOrderBump] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [showStickyCTA, setShowStickyCTA] = useState(false);

    // Soft Gate State & Config
    const { data: systemConfig } = useQuery(getSystemConfig);
    const enableSoftGate = systemConfig?.enableSoftGate ?? false;

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offerSection = document.getElementById('offer');
            if (offerSection) {
                const rect = offerSection.getBoundingClientRect();
                // Show sticky CTA if offer is not currently visible (scrolled past or haven't reached)
                const isOfferVisible = rect.top < window.innerHeight && rect.bottom > 0;
                setShowStickyCTA(!isOfferVisible && window.scrollY > 800);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    // Analytics: Page View
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).plausible) {
            (window as any).plausible('selling_page_view', {
                props: {
                    source: 'quiz_completion',
                    user_pattern: (session as any)?.analysisResult?.patternName || 'Unknown',
                    toxicity_score: (session?.narcissismAnalysis as any)?.danger_score || 0
                }
            });
        }
    }, [session]);

    // Analytics: Scroll Depth
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;

            const depths = [0.25, 0.50, 0.75, 1.0];
            depths.forEach(depth => {
                if (scrollPercent >= depth && !scrollDepthTracked.current.has(depth)) {
                    scrollDepthTracked.current.add(depth);
                    if (typeof window !== 'undefined' && (window as any).plausible) {
                        (window as any).plausible('scroll_depth', { props: { depth: `${depth * 100}%` } });
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const trackCTA = (location: string) => {
        if (typeof window !== 'undefined' && (window as any).plausible) {
            (window as any).plausible('cta_clicked', {
                props: {
                    button_location: location,
                    button_text: 'Get Instant Access Now'
                }
            });
        }
    };

    // 3. Trigger AI Calls on Load & Polling
    useEffect(() => {
        if (!session || !session.id) return;

        // Quick Overview - Data should be ready from completeTest.
        if (session.quickOverview && Object.keys(session.quickOverview as object).length > 0) {
            setQuickOverview(session.quickOverview as any);
            quickOverviewInitiated.current = true;
        } else {
            // Poll for data if missing (Background Job)
            const intervalId = setInterval(() => {
                console.log("Polling for Quick Overview...");
                refetch();
            }, 3000); // Check every 3 seconds

            return () => clearInterval(intervalId);
        }

        // Full Report
        if (session.fullReport && Object.keys(session.fullReport as object).length > 0) {
            setFullReport(session.fullReport as any);
            fullReportInitiated.current = true;
        } else if (!fullReportInitiated.current && !loadingFull) {
            fullReportInitiated.current = true;
            setLoadingFull(true);
            generateFullReport({ sessionId: session.id })
                .then((res: any) => setFullReport(res.json))
                .catch((err: any) => { console.error(err); fullReportInitiated.current = false; })
                .finally(() => setLoadingFull(false));
        }
    }, [session?.id, session?.quickOverview, refetch]);

    // Redirect Paid Users to Full Report
    useEffect(() => {
        if (user && session?.isPaid) {
            navigate('/report');
        }
    }, [user, session, navigate]);

    const handleScrollToOffer = () => {
        const element = document.getElementById("offer");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCheckout = async (location: string) => {
        trackCTA(location);
        if (!session) return;

        // SOFT GATE CHECK
        // If soft gate enabled AND we don't have email -> Open Modal
        if (enableSoftGate && !session.email) {
            setPendingAction(() => () => proceedToCheckout(location));
            setShowEmailModal(true);
            return;
        }

        // Otherwise proceed
        await proceedToCheckout(location);
    };

    const proceedToCheckout = async (location: string) => {
        if (!session) return;
        setIsCheckoutLoading(true);

        const { generateEventId } = await import("../analytics/eventId");
        const eventID = generateEventId();

        trackPixelEvent('InitiateCheckout', {
            content_name: 'Full Relationship Report',
            content_category: 'Report',
            value: addOrderBump ? 41 : 29,
            currency: 'USD',
            eventID: eventID
        });

        try {
            const checkout = await createCheckoutSession({
                sessionId: session.id,
                eventID: eventID,
                addWorkbook: addOrderBump
            });
            if (checkout.sessionUrl) {
                window.location.href = checkout.sessionUrl;
            }
        } catch (e) {
            console.error(e);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleEmailSubmit = async (email: string) => {
        if (!session) return;
        setIsEmailSubmitting(true);
        try {
            // Capture lead
            await captureLead({
                sessionId: session.id,
                email,
                eventID: 'soft-gate-' + Date.now()
            });

            // Close modal
            setShowEmailModal(false);

            // Execute pending action (checkout)
            if (pendingAction) {
                pendingAction();
                setPendingAction(null);
            }
        } catch (e) {
            console.error(e);
            alert("Error saving email. Please try again.");
        } finally {
            setIsEmailSubmitting(false);
        }
    };

    if (!session) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Session not found.</div>;

    const badge = quickOverview?.hero?.result_badge || "CALCULATING...";

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
            {session.isPaid && <Confetti recycle={false} numberOfPieces={500} />}

            <HeroSection
                badge={badge}
                onUnlock={handleScrollToOffer}
                quickOverview={quickOverview}
                narcissismAnalysis={session?.narcissismAnalysis}
                advancedMetrics={session?.advancedMetrics}
            />

            {/* 1.5 DYNAMIC PERSONALIZATION SECTION */}
            <section className="bg-background py-16 px-6 border-b border-border/50">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        BASED ON YOUR ANSWERS
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 text-left bg-card p-8 rounded-2xl shadow-sm border border-border">
                        {/* Pattern */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Your Pattern</span>
                            <div className="font-bold text-lg text-foreground leading-tight">
                                {quickOverview?.pulse?.primary_diagnosis || "The Pursuer-Withdrawer Cycle"}
                            </div>
                        </div>

                        {/* Vulnerability Logic: Priority = Severe Narc > High Narc > Silent Divorce > Low Sustainability */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Biggest Vulnerability</span>
                            <div className="font-bold text-lg text-red-600 leading-tight">
                                {(session?.narcissismAnalysis as any)?.risk_level === "Severe" ? "Severe Toxicity Risk" :
                                    (session?.narcissismAnalysis as any)?.risk_level === "High" ? "High Toxicity Risk" :
                                        (session?.advancedMetrics as any)?.silent_divorce_risk > 70 ? `Silent Divorce Risk: ${(session?.advancedMetrics as any)?.silent_divorce_risk}%` :
                                            `Stability Score: ${(session?.advancedMetrics as any)?.sustainability_score || 45}%`}
                            </div>
                        </div>

                        {/* Current State Logic: Based on Sustainability or Risk */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Current State</span>
                            <div className="font-bold text-lg text-foreground leading-tight">
                                {(session?.narcissismAnalysis as any)?.risk_level === "Severe" ? "Critical Intervention Needed" :
                                    (session?.advancedMetrics as any)?.sustainability_score < 50 ? "Unstable & At Risk" :
                                        (session?.advancedMetrics as any)?.sustainability_score < 75 ? "Stalled but Fixable" : "Stable with Warning Signs"}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 max-w-2xl mx-auto">
                        <h3 className="text-2xl font-bold text-foreground">
                            You felt something was wrong. Now you know WHAT it is.
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            But knowing the name of the problem isn't enough. You need to know <strong>WHY</strong> it started, <strong>WHAT</strong> triggers it, and exactly <strong>HOW</strong> to break the cycle before it breaks you.
                        </p>
                    </div>
                </div>
            </section>
            <MirrorSection />


            {/* TESTIMONIAL A: LAURA (Relatability) */}
            <div className="bg-secondary/5 border-y border-border py-12 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-xl italic font-serif text-muted-foreground mb-6 leading-relaxed">
                        "I read this thing crying because finally someone put into words what I've been feeling for years and couldn't explain. idk if we'll stay together but at least now I KNOW I'm not crazy"
                    </p>
                    <div className="font-bold text-foreground">— Laura, 34, Chicago</div>
                </div>
            </div>

            {/* 2.5 SILENT DIVORCE WARNING (Urgency Injection) */}
            {(session?.advancedMetrics as any)?.silent_divorce_risk > 70 && (
                <section className="bg-red-50 dark:bg-red-950/20 border-y border-red-200 dark:border-red-900 py-8 px-6">
                    <div className="max-w-3xl mx-auto flex items-start gap-4">
                        <div className="shrink-0 p-3 bg-red-100 dark:bg-red-900/40 text-red-600 rounded-full">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">High Risk of "Silent Drift" Detected</h3>
                            <p className="text-red-600/90 dark:text-red-300/80 leading-relaxed">
                                Your results indicate a <strong>{(session?.advancedMetrics as any)?.silent_divorce_risk}% probability</strong> of emotional detachment. This pattern is dangerous because it feels "calm" until it's too late. Immediate re-engagement is recommended.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* 3. COST OF INACTION (The Forecast) */}
            <section className="py-20 px-6 bg-card border-y border-border/50">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Where This Leads in 5 Years</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Patterns don't fix themselves. They compound. Without intervention, here are the 3 clinical trajectories for your relationship:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Path 1 */}
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border hover:border-primary/50 transition-all">
                            <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🏚️</div>
                            <h3 className="font-bold text-xl mb-3">The Roommates</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                You stay together but live parallel lives. The passion dies completely. You manage the house and logistics, but you haven't touched intimately in years.
                            </p>
                        </div>
                        {/* Path 2 */}
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border hover:border-orange-300 transition-all">
                            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💥</div>
                            <h3 className="font-bold text-xl mb-3">The Explosion</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                The quiet resentment finally boils over. A small fight turns into "I want a divorce." It's messy, expensive, and leaves you wondering why you didn't act sooner.
                            </p>
                        </div>
                        {/* Path 3 */}
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border hover:border-gray-300 transition-all">
                            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">👻</div>
                            <h3 className="font-bold text-xl mb-3">The Fade</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                You lose yourself. You stop fighting because you've stopped caring. You become a shadow of who you used to be, sacrificing your happiness to keep the peace.
                            </p>
                        </div>
                    </div>

                    <button onClick={() => handleCheckout('forecast_cta')} className="text-primary font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
                        See My Personal Forecast <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* 4. THE SOLUTION: REPORT BREAKDOWN */}
            <section className="py-24 px-6 bg-background">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            Values are not enough
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Stop Guessing. Start Knowing.</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The "Relationship User Manual" you wish you had 5 years ago.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Visual Representation of Report (Abstract) */}
                        <div className="relative aspect-[3/4] bg-primary/90 rounded-2xl shadow-2xl p-6 md:p-8 transform md:rotate-[-2deg] border border-primary/50 overflow-hidden group hover:rotate-0 transition-all duration-500">
                            {/* Fake Content Layer */}
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Activity size={120} className="text-white" />
                            </div>
                            <div className="relative z-10 text-white space-y-6">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4">
                                    <Lock className="text-white" size={32} />
                                </div>
                                <div>
                                    <div className="h-2 w-32 bg-white/40 rounded mb-2"></div>
                                    <h3 className="text-3xl font-black leading-none">Confidential<br />Report</h3>
                                </div>
                                <div className="space-y-3 pt-8 opacity-80">
                                    <div className="flex gap-3 items-center"><div className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center text-xs">1</div><div className="h-2 w-full bg-gradient-to-r from-white/40 to-transparent rounded"></div></div>
                                    <div className="flex gap-3 items-center"><div className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center text-xs">2</div><div className="h-2 w-3/4 bg-gradient-to-r from-white/40 to-transparent rounded"></div></div>
                                    <div className="flex gap-3 items-center"><div className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center text-xs">3</div><div className="h-2 w-5/6 bg-gradient-to-r from-white/40 to-transparent rounded"></div></div>
                                </div>
                            </div>
                        </div>

                        {/* Report Components Breakdown */}
                        <div className="space-y-8">
                            {/* Component 1 */}
                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">1. Your Core Diagnosis</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        We map <strong>your</strong> relationship across 5 key dimensions (Communication, Trust, Intimacy, Fairness, Shared Future). You'll see exactly **where** the structure is failing.
                                    </p>
                                </div>
                            </div>

                            {/* Component 2 */}
                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">2. Your Predictions (High Stakes)</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        6-month and 5-year clinical forecasts. We calculate your personalized <strong>Sustainability Score</strong>: what are the mathematical odds this relationship survives?
                                    </p>
                                </div>
                            </div>

                            {/* Component 3 */}
                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
                                    <ShieldAlert size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-orange-600 dark:text-orange-400">3. The Toxicity & Narcissism Screen</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        <strong>Is it just a rough patch, or is it abuse?</strong> A clinical 0-100 Danger Score. Definitive clarity on gaslighting and safety.
                                    </p>
                                </div>
                            </div>

                            {/* Component 4 */}
                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">4. Your Action Plan</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Custom scripts to break <strong>your</strong> specific conflict loop. Plus a 30-day "Connection Calendar" tailored to your lowest score.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TARGETED STRATEGIC TOOLS (Value Stack) */}
            <section className="py-24 px-6 bg-muted/30 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Clinical Protocol</span>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground">Targeted Strategic Tools</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Specific interventions selected to address the <strong>{badge}</strong> pattern identified in your analysis.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Guide 1: Mental Load */}
                        <div className="group relative h-full">
                            {/* 3D Document Effect - Auto Height */}
                            <div className="relative bg-card border border-border h-full rounded-r-xl shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden flex flex-col">
                                {/* Spine/Binding */}
                                <div className="absolute left-0 top-0 bottom-0 w-3 bg-primary/20 border-r border-border"></div>

                                {/* Header / Cover Top */}
                                <div className="p-6 pb-4 border-b border-border bg-card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                            <FileText size={24} />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Format</span>
                                            <span className="text-xs font-bold text-foreground">PDF Protocol</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight text-foreground">The Mental Load Equalizer</h3>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex-grow bg-card/50 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What you get:</p>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            Division of labor audit worksheet, ownership assignment system, conversation scripts to rebalance without conflict, "no rescuing" commitment framework.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Why you need this:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            If you scored 58%+ on CEO vs Intern Gap, mental load imbalance is destroying your relationship. You can't desire someone you have to manage like a child. Resentment kills attraction.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What this fixes:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Exhaustion, resentment, dead bedroom caused by power imbalance. Rebuilds attraction by restoring equality.
                                        </p>
                                    </div>
                                </div>

                                {/* Footer / Value */}
                                <div className="p-4 bg-muted/50 border-t border-border flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Relevance: High</span>
                                    <span className="text-xs font-mono text-muted-foreground">Value: $29.00</span>
                                </div>
                            </div>
                            {/* Stacked Paper Effect underneath */}
                            <div className="absolute top-2 left-2 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-10"></div>
                            <div className="absolute top-4 left-4 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-20"></div>
                        </div>

                        {/* Guide 2: Dead Bedroom */}
                        <div className="group relative h-full">
                            {/* 3D Document Effect - Auto Height */}
                            <div className="relative bg-card border border-border h-full rounded-r-xl shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden flex flex-col">
                                <div className="absolute left-0 top-0 bottom-0 w-3 bg-pink-500/20 border-r border-border"></div>

                                <div className="p-6 pb-4 border-b border-border bg-card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-500 p-2 rounded-lg">
                                            <Heart size={24} />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Format</span>
                                            <span className="text-xs font-bold text-foreground">Clinical Guide</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight text-foreground">Dead Bedroom Revival</h3>
                                </div>

                                <div className="p-6 flex-grow bg-card/50 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What you get:</p>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            3-phase revival protocol (weeks 1-8), sensate focus exercises, spontaneous vs responsive desire model, exact scripts for discussing sex without pressure, 7 desire killers to avoid.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Why you need this:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            If your Intimacy Score is below 40% or you haven't had sex in 3+ months, the bedroom is dead or dying. You can't fix it by "trying harder" or hoping desire magically returns. You need a clinical protocol.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What this fixes:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Resentment-driven rejection, pursuer-withdrawer cycles, duty sex, mismatched desire, "roommate syndrome." Rebuilds physical connection without pressure.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-muted/50 border-t border-border flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Relevance: Critical</span>
                                    <span className="text-xs font-mono text-muted-foreground">Value: $39.00</span>
                                </div>
                            </div>
                            <div className="absolute top-2 left-2 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-10"></div>
                            <div className="absolute top-4 left-4 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-20"></div>
                        </div>

                        {/* Guide 3: Narcissism */}
                        <div className="group relative h-full">
                            <div className="relative bg-card border border-border h-full rounded-r-xl shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden flex flex-col">
                                <div className="absolute left-0 top-0 bottom-0 w-3 bg-orange-500/20 border-r border-border"></div>

                                <div className="p-6 pb-4 border-b border-border bg-card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-500 p-2 rounded-lg">
                                            <ShieldAlert size={24} />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Format</span>
                                            <span className="text-xs font-bold text-foreground">Safety Screen</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight text-foreground">Narcissist Detection</h3>
                                </div>

                                <div className="p-6 flex-grow bg-card/50 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What you get:</p>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            21-point clinical checklist (covert narcissism focus), scoring system (0-21 scale), case studies, gaslighting counter-scripts, exit planning protocol.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Why you need this:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            If your Toxicity Score is 60+, you need to know if you're dealing with narcissism specifically—because the exit strategy is different. Covert narcissists are harder to detect (they play victim, use passive aggression).
                                        </p>
                                    </div>

                                    {/* DYNAMIC PROBABILITY INSERTION */}
                                    <div className="my-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-lg">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Est. Probability</span>
                                            <span className="text-lg font-black text-orange-600">
                                                {(session?.narcissismAnalysis as any)?.risk_level === "Severe" ? "92-98%" :
                                                    (session?.narcissismAnalysis as any)?.risk_level === "High" ? "75-85%" :
                                                        (session?.narcissismAnalysis as any)?.risk_level === "Moderate" ? "45-60%" : "Low"}
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500 rounded-full" style={{ width: (session?.narcissismAnalysis as any)?.risk_level === "Severe" ? "95%" : (session?.narcissismAnalysis as any)?.risk_level === "High" ? "80%" : (session?.narcissismAnalysis as any)?.risk_level === "Moderate" ? "55%" : "15%" }}></div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What this fixes:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Years of self-doubt ("Am I crazy?"), confusion about whether to stay, inability to trust your own perception. Gives you clinical clarity and safety plan.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-muted/50 border-t border-border flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Relevance: Essential</span>
                                    <span className="text-xs font-mono text-muted-foreground">Value: $29.00</span>
                                </div>
                            </div>
                            <div className="absolute top-2 left-2 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-10"></div>
                            <div className="absolute top-4 left-4 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-20"></div>
                        </div>

                        {/* Guide 4: Emotional Affair - HIDDEN ON MOBILE/TABLET to save space, visible on large? No, include all. */}
                        <div className="group relative h-full">
                            <div className="relative bg-card border border-border h-full rounded-r-xl shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden flex flex-col">
                                <div className="absolute left-0 top-0 bottom-0 w-3 bg-blue-500/20 border-r border-border"></div>

                                <div className="p-6 pb-4 border-b border-border bg-card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-500 p-2 rounded-lg">
                                            <MessageCircle size={24} />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Format</span>
                                            <span className="text-xs font-bold text-foreground">Assessment</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight text-foreground">The Emotional Affair Warning System</h3>
                                </div>

                                <div className="p-6 flex-grow bg-card/50 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What you get:</p>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            19 warning signs (early/mid/advanced stages), affair-proofing protocol, boundaries for outside friendships, scripts for addressing concerns without accusations, when to walk away.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Why you need this:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            If your Betrayal Vulnerability is 60%+, unmet needs are creating an opening for affairs. Emotional affairs are often MORE painful than physical ones—they involve the heart, not just the body.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What this fixes:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Paranoia without clarity, slow erosion of trust, preventable infidelity. Helps you identify threats early and rebuild boundaries.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-muted/50 border-t border-border flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Relevance: Preventative</span>
                                    <span className="text-xs font-mono text-muted-foreground">Value: $29.00</span>
                                </div>
                            </div>
                            <div className="absolute top-2 left-2 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-10"></div>
                            <div className="absolute top-4 left-4 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-20"></div>
                        </div>

                        {/* Guide 5: Stay or Go */}
                        <div className="group relative md:col-span-2 lg:col-span-2 h-full">
                            {/* Wider Landscape Document Effect - Auto Height */}
                            <div className="relative bg-card border border-border h-full rounded-r-xl shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[300px]">
                                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gray-500/20 border-r border-border"></div>

                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-card flex flex-col justify-between">
                                    <div>
                                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 p-2 rounded-lg inline-block mb-4">
                                            <Compass size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold leading-tight text-foreground">Should I Stay or Should I Go?</h3>
                                    </div>
                                    <div className="mt-4">
                                        <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Format</span>
                                        <span className="text-xs font-bold text-foreground">Decision Matrix</span>
                                    </div>
                                </div>

                                <div className="p-6 md:w-2/3 flex flex-col justify-center bg-card/50 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What you get:</p>
                                        <p className="text-sm text-foreground leading-relaxed">
                                            Clinical decision matrix, 12-point "Regret-Proof" checklist, "Future Self" visualization exercise, 3 types of relationship endings, scripts for difficult conversations.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Why you need this:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            If your Relationship Stability Score is below 50%, you're likely in a "limbo" relationship. This guide provides the framework therapists use to help patients make the hardest choice of their lives with zero regret.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">What this fixes:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Indecision, guilt, fear of the unknown, "what if" scenarios. Provides clarity and confidence to move forward, whatever you decide.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-2 left-2 w-full h-full bg-card border border-border rounded-r-xl shadow-sm -z-10"></div>
                        </div>

                    </div>
                </div>
            </section>

            {/* TESTIMONIAL B: ROBERT (Efficacy) */}
            <div className="bg-background border-b border-border py-12 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-xl italic font-serif text-muted-foreground mb-6 leading-relaxed">
                        "Six months of couples therapy and we weren't getting anywhere. This report identified the problem in 10 pages. Brought it to the next session. Therapist said 'okay finally we know what to work on'. Best money I've spent."
                    </p>
                    <div className="font-bold text-foreground">— Robert, 42, Boston</div>
                </div>
            </div>

            {/* 5.5 SOCIAL PROOF (Testimonials) */}
            {/* 5.5 SOCIAL PROOF (Testimonials) */}
            {/* 5.5 SOCIAL PROOF (Testimonials) */}
            {/* 5.5 SOCIAL PROOF (Testimonials) */}
            <section className="py-24 px-6 bg-background border-t border-border">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Real Stories
                        </h2>
                        <div className="flex justify-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Clarity / Confusion (Alexis) - Keeping as generalized example */}
                        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                            <div className="mb-4 text-primary"><Quote size={32} /></div>
                            <p className="text-muted-foreground mb-6 italic text-sm leading-relaxed">
                                "Bought this at 3am after he locked himself in the bedroom. I was asking myself 'what is happening?'. The report explained it. It wasn't what I wanted to hear. But it was what I NEEDED to hear. Thank you."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">A</div>
                                <div>
                                    <p className="font-bold text-foreground text-sm">Alexis, 40</p>
                                    <p className="text-xs text-muted-foreground">Denver</p>
                                </div>
                            </div>
                        </div>

                        {/* Sexless / Desire (Claire) - Keeping as generalized example */}
                        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                            <div className="mb-4 text-pink-500"><Quote size={32} /></div>
                            <p className="text-muted-foreground mb-6 italic text-sm leading-relaxed">
                                "My husband and I haven't had sex in 2 years. I always thought there was something wrong with me. Turns out I just work differently. We're trying something the guide suggested. Still awkward but at least we're trying."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center font-bold text-pink-600">C</div>
                                <div>
                                    <p className="font-bold text-foreground text-sm">Claire, 29</p>
                                    <p className="text-xs text-muted-foreground">London</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. SOFT URGENCY SECTION */}
            <section className="bg-background py-16 px-6 border-b border-border">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl font-black text-foreground">Your Analysis Is Already Generated</h2>
                    <div className="bg-card border border-border rounded-xl p-6 text-left max-w-xl mx-auto shadow-sm">
                        <p className="text-sm text-muted-foreground mb-4">Based on your 30 answers, the system has already calculated:</p>
                        <ul className="space-y-2 text-sm font-medium">
                            <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Your 5 Core Dimension scores</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Your dominant conflict pattern</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Your 6-month and 5-year forecast</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Your toxicity assessment</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Your personalized action plan</li>
                            <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Your exact conversation scripts</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xl font-bold text-foreground">
                            The question isn't whether it's ready. It is.<br />
                            The question is: <span className="text-primary underline decoration-wavy">do you want to see it?</span>
                        </p>
                    </div>

                    <div className="bg-secondary/5 rounded-2xl p-8 border border-border mt-8">
                        <h3 className="text-xl font-bold mb-4">Every Day You Don't Understand the Pattern...</h3>
                        <p className="text-muted-foreground mb-6">...is another day the pattern controls you. How many more months of walking on eggshells, repetitive fights, and feeling like "roommates"?</p>

                        <div className="font-bold text-lg text-foreground">
                            The pattern won't fix itself. You have to interrupt it.
                        </div>
                    </div>
                </div>
            </section>

            {/* 6.5. OFFER SECTION & GUARANTEE (VALUE STACK) */}
            <section id="offer" className="py-24 px-6 bg-muted/20">
                <div className="max-w-4xl mx-auto">
                    {/* Pricing Card */}
                    <div className="bg-card rounded-3xl shadow-2xl border-2 border-primary overflow-hidden mb-16 relative">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-purple-500"></div>
                        <div className="p-8 md:p-12">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
                                    Everything Included
                                </h2>
                                <p className="text-muted-foreground text-lg">
                                    Full Analysis + 5 Premium Clinical Guides
                                </p>
                            </div>

                            {/* The Value Stack Table */}
                            <div className="max-w-md mx-auto bg-background/50 rounded-xl border border-border overflow-hidden mb-10">
                                <div className="p-4 border-b border-border flex justify-between items-center text-sm font-bold text-muted-foreground">
                                    <span>ITEM</span>
                                    <span>VALUE</span>
                                </div>
                                <div className="divide-y divide-border/50">
                                    {/* Core Product */}
                                    <div className="p-4 flex justify-between items-start bg-primary/5 border-l-4 border-primary">
                                        <div>
                                            <span className="font-bold text-foreground block">Full Relationship Analysis</span>
                                            <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                                                <li>5 Core Dimensions Analysis</li>
                                                <li>Advanced Dynamic Metrics (Communication, Power)</li>
                                                <li>Multivariate Compatibility Check</li>
                                                <li>Customized Action Plan</li>
                                            </ul>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs text-red-400 line-through decoration-red-400">$99.00</span>
                                            <span className="block font-bold text-foreground text-sm">$29.00</span>
                                        </div>
                                    </div>

                                    {/* Bonuses */}
                                    <div className="p-4 flex justify-between items-center bg-red-50 dark:bg-red-900/10 border-l-4 border-red-400">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-red-600 dark:text-red-400">CRITICAL BONUS: Toxic & Narcissistic Screen</span>
                                            <span className="text-[10px] text-red-500/80">Safety Assessment Included</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs text-red-400 line-through decoration-red-400">$49.00</span>
                                            <span className="block font-bold text-red-600 text-sm">FREE</span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex justify-between items-center bg-background/30">
                                        <span className="font-medium text-foreground">5-Year Trajectory Forecast</span>
                                        <span className="font-bold text-green-600 text-sm">Included</span>
                                    </div>

                                    <div className="p-4 flex justify-between items-center">
                                        <span className="text-sm text-foreground">Bonus: Mental Load Equalizer Guide</span>
                                        <div className="text-right">
                                            <span className="block text-xs text-red-400 line-through decoration-red-400">$29.00</span>
                                            <span className="block font-bold text-green-600 text-sm">FREE</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <span className="text-sm text-foreground">Bonus: Dead Bedroom Revival Guide</span>
                                        <div className="text-right">
                                            <span className="block text-xs text-red-400 line-through decoration-red-400">$39.00</span>
                                            <span className="block font-bold text-green-600 text-sm">FREE</span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex justify-between items-center">
                                        <span className="text-sm text-foreground">Bonus: Emotional Affair Warning Signs</span>
                                        <div className="text-right">
                                            <span className="block text-xs text-red-400 line-through decoration-red-400">$29.00</span>
                                            <span className="block font-bold text-green-600 text-sm">FREE</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <span className="text-sm text-foreground">Bonus: "Should I Stay or Go" Matrix</span>
                                        <div className="text-right">
                                            <span className="block text-xs text-red-400 line-through decoration-red-400">$49.00</span>
                                            <span className="block font-bold text-green-600 text-sm">FREE</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-center bg-muted/20 border-t-2 border-dashed border-border">
                                        <span className="font-bold text-foreground">TOTAL REAL VALUE</span>
                                        <span className="font-bold text-foreground">$323.00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <div className="space-y-1 text-center">
                                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Price Today</p>
                                    <p className="text-6xl font-black text-primary">${import.meta.env.REACT_APP_REPORT_PRICE || "29.00"}</p>
                                </div>

                                {/* ORDER BUMP */}
                                <div className="w-full bg-yellow-50 dark:bg-yellow-900/10 border-2 border-dashed border-yellow-400 p-4 rounded-xl text-left cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors mb-8" onClick={() => setAddOrderBump(!addOrderBump)}>
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 h-5 w-5 rounded border flex items-center justify-center transition-colors ${addOrderBump ? 'bg-primary border-primary text-white' : 'bg-white border-gray-400'}`}>
                                            {addOrderBump && <Check size={14} strokeWidth={4} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm leading-tight">
                                                YES! Add the <span className="text-primary">30-Day Reconnection Workbook</span> for just $12.
                                            </p>
                                            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                                                <li className="flex items-center gap-2"><CheckCircle size={10} className="text-primary" /> Daily check-ins (5-10 min/day)</li>
                                                <li className="flex items-center gap-2"><CheckCircle size={10} className="text-primary" /> Conversation practice templates</li>
                                                <li className="flex items-center gap-2"><CheckCircle size={10} className="text-primary" /> Progress tracker with visual milestones</li>
                                            </ul>
                                            <p className="text-xs font-bold text-primary mt-2 animate-pulse">
                                                START TODAY. Not "someday."
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <button
                                onClick={() => handleCheckout('offer_cta')}
                                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold py-5 px-12 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 animate-pulse-slow"
                            >
                                {isCheckoutLoading ? "Processing..." : `Get Instant Access Now - $${addOrderBump ? 41 : 29}`} <ArrowRight size={24} />
                            </button>
                            <p className="text-xs text-muted-foreground">Secure One-Time Payment • Instant PDF Download</p>
                        </div>
                    </div>
                </div>




                {/* Guarantee */}
                <div className="max-w-3xl mx-auto text-center mt-12 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-sm font-bold mb-6">
                        <ShieldCheck size={16} /> 100% Satisfaction Guarantee
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Try It Risk-Free</h3>
                    <p className="text-muted-foreground">
                        If you don't feel this report provides valuable insights into your relationship dynamics, simply email us within 30 days for a full refund. No questions asked.
                    </p>
                </div>



                {/* Risk Reversal */}
                <div className="bg-secondary/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border-t border-border mt-8 rounded-b-3xl">
                    <div className="shrink-0 p-3 bg-card rounded-full shadow-sm">
                        <ShieldCheck className="text-primary w-8 h-8" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-foreground mb-1">The "Lightbulb Moment" Guarantee</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Read your personalized analysis. If you don't have at least one profound realization about your relationship that gives you clarity, email us for a full refund. No questions asked.
                        </p>
                    </div>
                </div>


                {/* Sticky Mobile CTA */}
                <div className={`fixed bottom-0 left-0 w-full bg-background border-t border-border p-4 md:hidden transform transition-transform duration-300 z-50 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}>
                    <button
                        onClick={handleScrollToOffer}
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
                    >
                        Get Your Report <ArrowRight size={20} />
                    </button>
                </div>

            </section >

            {/* 6.5 COMPARISON TABLE */}
            < section className="max-w-4xl mx-auto py-12 px-2" >
                <div className="text-center mb-10 space-y-2">
                    <h2 className="text-3xl font-black text-foreground">Why This Price? (And Why It's Worth 10x More)</h2>
                    <p className="text-muted-foreground">Most people spend thousands trying to understand their relationship. Here's what you'd pay elsewhere:</p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="p-4 font-bold">What You're Comparing</th>
                                <th className="p-4 font-bold">Cost</th>
                                <th className="p-4 font-bold">Time to Results</th>
                                <th className="p-4 font-bold">What You Get</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-border">
                            <tr className="hover:bg-muted/10 transition-colors">
                                <td className="p-4 font-bold text-foreground">Couples Therapy</td>
                                <td className="p-4 text-muted-foreground">$150/session × 6-10 = <span className="font-bold text-red-500 block">$900-1,500</span></td>
                                <td className="p-4 text-muted-foreground">6-12 weeks minimum</td>
                                <td className="p-4 text-muted-foreground">Depends on therapist quality. Takes 4-5 sessions just to identify your pattern.</td>
                            </tr>
                            <tr className="hover:bg-muted/10 transition-colors">
                                <td className="p-4 font-bold text-foreground">Self-Help Books</td>
                                <td className="p-4 text-muted-foreground">$20 × 5-8 books = <span className="font-bold block">$100-160</span></td>
                                <td className="p-4 text-muted-foreground">20-40 hours reading</td>
                                <td className="p-4 text-muted-foreground">Generic advice for everyone. Not specific to YOUR relationship pattern.</td>
                            </tr>
                            <tr className="hover:bg-muted/10 transition-colors">
                                <td className="p-4 font-bold text-foreground">Online Course</td>
                                <td className="p-4 text-muted-foreground"><span className="font-bold block">$97-297</span></td>
                                <td className="p-4 text-muted-foreground">8-12 hours of video</td>
                                <td className="p-4 text-muted-foreground">General frameworks. No personalized diagnosis. No action plan.</td>
                            </tr>
                            <tr className="bg-primary/5 hover:bg-primary/10 transition-colors border-l-4 border-l-primary">
                                <td className="p-4 font-black text-primary text-base">This Analysis</td>
                                <td className="p-4"><span className="font-black text-2xl text-primary">$29</span></td>
                                <td className="p-4 font-bold text-foreground">Instant</td>
                                <td className="p-4 font-bold text-foreground">Personalized to YOUR 30 answers. Pattern identified. 5 clinical guides. Exact scripts.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="text-center text-sm text-muted-foreground italic mt-6">
                    You'll spend more on a dinner where you both scroll your phones than on understanding what's actually destroying your relationship.
                </p>
            </section >

            {/* TESTIMONIAL C: MARTA (Risk Reversal / Emotional Safety) */}
            < div className="bg-background py-12 px-6 mb-12 rounded-2xl border border-border shadow-sm" >
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-xl italic font-serif text-muted-foreground mb-6 leading-relaxed">
                        "I cried a lot. For the first time someone said 'you are not the problem, you are in a pattern'. And this sentence freed me from 5 years of guilt. I don't know if we stay together but at least now I can breathe."
                    </p>
                    <div className="font-bold text-foreground">— Marta, 38, Paris</div>
                </div>
            </div >

            {/* FAQ */}
            < div className="max-w-3xl mx-auto space-y-8 mt-16" >
                <h3 className="text-2xl font-bold text-center mb-12 text-foreground">Common Questions & Concerns</h3>

                <div className="space-y-4">
                    {/* Q1 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"Can't I just figure this out on my own?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            You've been trying. That's why you took the test. The problem isn't intelligence—it's perspective. <strong>You can't read the label from inside the bottle.</strong> This analysis gives you the outside view—the clinical lens that cuts through emotions and shows you the STRUCTURE.
                        </p>
                    </div>

                    {/* Q2 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"What if my partner refuses to read it?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            <strong>47% of our users never show it to their partner.</strong> They use it to change their OWN behavior—which inevitably forces the dynamic to shift. You don't need their permission to understand the pattern.
                        </p>
                    </div>

                    {/* Q3 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"What if it tells me something I don't want to hear?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            Then you NEED to hear it. The worst thing isn't a painful truth—it's wasting 5 more years on a comfortable lie. Look: You already KNOW something is wrong. That's why you took the test. The analysis doesn't create problems—it NAMES them.
                        </p>
                    </div>

                    {/* Q4 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"Is this therapy?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            No, this is <strong>triage</strong>. Therapy requires finding a doctor, waiting weeks, and spending thousands. This report gives you the immediate diagnostic clarity you need *right now* to decide your next step. It's self-diagnosis before you see the doctor.
                        </p>
                    </div>

                    {/* Q5 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"What if I'm the problem?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            That's actually the most empowering discovery possible. Because you can control YOUR behavior. Most people discover they're BOTH part of the problem—one pattern triggering another. That means you can BOTH fix it.
                        </p>
                    </div>

                    {/* Q6 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"Is my data safe?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            100%. We don't sell data. We don't share answers. You can delete your account and all data at any time.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-500 py-12 text-center text-sm border-t border-slate-800">
                <div className="max-w-4xl mx-auto px-6 space-y-4">
                    <p>© 2026 UnderstandYourPartner.com • All Rights Reserved</p>
                    <div className="flex justify-center gap-4">
                        <span className="cursor-pointer hover:text-white">Privacy Policy</span>
                        <span>•</span>
                        <span className="cursor-pointer hover:text-white">Terms of Service</span>
                        <span>•</span>
                        <span className="cursor-pointer hover:text-white">Contact Support</span>
                    </div>
                    <p className="max-w-xl mx-auto text-xs opacity-50 mt-6">
                        Disclaimer: This analysis is based on psychological frameworks (Gottman, Attachment Theory) but is not a substitute for professional clinical therapy. If you are in immediate danger, please contact local authorities.
                    </p>
                </div>
            </footer>

            <ExitIntentPopup onCTAClick={() => handleCheckout('exit_intent')} />

            <EmailCaptureModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSubmit={handleEmailSubmit}
                isSubmitting={isEmailSubmitting}
            />

        </div >
    );
}
