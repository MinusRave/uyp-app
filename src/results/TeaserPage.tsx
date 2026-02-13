import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, CheckCircle, AlertTriangle, TrendingUp, Shield, Heart, BadgeCheck, Compass, Zap, X, Activity, ChevronDown, Check, Eye, Microscope, ListChecks, ShieldAlert, Clock, MessageCircle, Brain, Quote, Star, Play, TrendingDown, Battery, Thermometer, FileWarning } from "lucide-react";
import { useQuery, generateQuickOverview, generateFullReport, createCheckoutSession, getTestSession } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import GaugeChart from "../components/GaugeChart";
import Confetti from "react-confetti";
import { trackPixelEvent } from '../analytics/pixel';
import { NarcissismSection } from "./sections/NarcissismSection";
import { FutureForecastSection } from "./sections/FutureForecastSection";
import { PulseSection } from "./sections/PulseSection";


// --- COMPONENTS ---
const BiomarkerStrip = ({ label, score, description, doubtQuestion, isPaid, icon, color = "red" }: any) => {
    // Score logic: 0-100. High = Bad.
    const level = score >= 80 ? "Critical" : score >= 50 ? "High" : "Elevated";
    const barWidth = `${score}%`;
    const themeColor = color === "red" ? "bg-red-500" : color === "orange" ? "bg-orange-500" : "bg-amber-500";
    const textColor = color === "red" ? "text-red-500" : color === "orange" ? "text-orange-500" : "text-amber-500";
    const bgTint = color === "red" ? "bg-red-50" : color === "orange" ? "bg-orange-50" : "bg-amber-50";

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden group">
            <div className="flex gap-4 items-center relative z-10">
                {/* ICON & GAUGE */}
                <div className={`shrink-0 flex flex-col items-center gap-2 w-16 text-center`}>
                    <div className={`p-2 rounded-full ${bgTint} ${textColor}`}>
                        {icon}
                    </div>
                    <span className={`text-xs font-bold ${textColor}`}>{score}%</span>
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{label}</h4>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${bgTint} ${textColor}`}>
                            {level}
                        </span>
                    </div>

                    {/* BAR */}
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div className={`h-full rounded-full ${themeColor} transition-all duration-1000`} style={{ width: barWidth }}></div>
                    </div>

                    {/* TEXT / DOUBT */}
                    {isPaid ? (
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {description}
                        </p>
                    ) : (
                        <div className="relative">
                            <p className="text-xs text-slate-400 dark:text-slate-600 blur-[3px] select-none">
                                {description}
                            </p>
                            <div className="absolute inset-0 flex items-center">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 italic flex items-center gap-2">
                                    <Lock size={12} className="text-indigo-500" /> "{doubtQuestion}"
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- TYPES (Mirroring AI Output) ---
type QuickOverviewData = {
    hero: { headline: string; subheadline: string; result_badge: string };
    pulse: { summary: string };
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

// --- DATA ---
const TESTIMONIALS = [
    {
        name: "James",
        info: "43, married for 14 years",
        quote: "The Narcissist Detection guide scored my partner at 18/21. It was terrifying but validating. I finally stopped blaming myself for her rage and understood I was dealing with a disorder, not just 'communication issues'."
    },
    {
        name: "Alessa",
        info: "42, married for 15 years",
        quote: "I did it after a fight about money where I felt like his mother again instead of his wife. The term 'Manager-Employee dynamic' pissed me off because it was EXACTLY that. I printed that section and left it on his nightstand without saying anything. Two days later he asked me 'is this how you feel?' and we could finally talk about it. Before, I didn't have the words."
    },
    {
        name: "Claire",
        info: "31, living together for 4 years",
        quote: "I took it after he shut down during another fight and I spiraled into panic. The piece on 'situational anxiety vs constant anxiety' made me realize I wasn't crazy—it was a specific trigger, not my personality. I printed it and left it for him to read. He came to me later and said 'I didn't know my silence felt like abandonment to you'. We haven't fixed everything, but at least now he understands what happens in my head."
    },
    {
        name: "Sarah",
        info: "34, living together for 5 years",
        quote: "I did it alone after another fight where he shut himself in the bedroom. When I read 'Pursuer-Shutdown Cycle' I had this lightbulb moment—I finally understood why it always ended the same way. I only showed him the report a week later, when I was ready to talk about it without blaming him. Knowing WHAT was happening gave me the calm to approach it differently."
    },
    {
        name: "Mark",
        info: "41, married for 12 years",
        quote: "I did it alone, didn't tell her. I didn't want it to sound like an accusation, like 'I found what's wrong with you'. When we went to therapy later, I brought the report and the therapist said 'usually it takes 4-5 sessions just to understand the pattern, you've already done the work'. Taking the test first saved me money and gave me the right words."
    },
    {
        name: "Julia",
        info: "38, together for 9 years",
        quote: "I did it one night when I couldn't sleep after saying yes to sex when I didn't really want to. The part about 'duty sex' made me cry because it was exactly what I was doing. I haven't shown it to him yet, but I started saying no when I don't actually feel like it. He was confused at first, but now after 3 weeks I feel like I'm starting to desire him for real again."
    },
    {
        name: "Luke",
        info: "36, living together for 7 years",
        quote: "I was convinced she didn't desire me anymore. I took the test to figure out if it was over or if there was still hope. The piece on sexual rejection sensitivity opened my eyes—it was ME loading every no with meaning. I didn't show her the report, but I changed how I react when she says no. Ironically now she initiates more often, probably because I'm less desperate."
    },
    {
        name: "David",
        info: "39, living together for 8 years",
        quote: "I took the test thinking I was a good partner because I did half the chores. The report explained the difference between 'doing' and 'carrying the mental load' and I realized she was the CEO while I was just the employee. I showed it to her and said 'I finally get it'. We're still figuring it out, but at least now I understand what she means when she says she feels alone in the worrying."
    },
    {
        name: "Elena",
        info: "35, dating for 6 years",
        quote: "I did it because we kept having the same fight: 'we want the same things but I'm miserable'. The report said we scored 100% on values but 'you're managing your life together, not living it'. I cried reading that because it was so accurate. I showed it to him that same night. We made a rule: one fun activity per week, zero productivity. After 3 months we feel like a couple again, not project managers."
    },
    {
        name: "Simon",
        info: "44, married for 18 years",
        quote: "I did it at 1am after another pointless argument. $19 to finally understand what was actually broken. I kept the report to myself for a few days, just reading and re-reading it. When I finally showed it to her, she said 'you're reading my mind'. Now we have 3 specific problems to work on instead of just feeling hopeless."
    },
    {
        name: "Rachel",
        info: "37, together for 10 years",
        quote: "I bought it thinking 'I already know what's wrong'. Then the chapter on connections between problems blew my mind. I didn't have 5 separate problems—I had 2 patterns causing 5 symptoms. I haven't shown him the full report yet, but just understanding the connections changed how I approach our conversations. I'm not reacting to symptoms anymore, I'm addressing patterns."
    },
    {
        name: "Emma",
        info: "33, living together for 5 years",
        quote: "I did it alone after scrolling Instagram at 2am, feeling like I was going crazy. The report gave me words for things I felt but couldn't explain. I left it open on my laptop and he read it while I was at work. When I came home he said 'is this really how you feel?' Best $19 I ever spent—not because it fixed us, but because it gave us a shared language to finally talk about what's broken."
    }
];

export default function TeaserPage() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    const localSessionId = typeof window !== "undefined" ? localStorage.getItem("uyp-session-id") : null;

    // 1. Fetch Session
    const { data: session, isLoading: isSessionLoading } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

    // 2. Local State for AI Results
    const [quickOverview, setQuickOverview] = useState<QuickOverviewData | null>(null);
    const [fullReport, setFullReport] = useState<FullReportData | null>(null);
    const [loadingQuick, setLoadingQuick] = useState(false);
    const [loadingFull, setLoadingFull] = useState(false);

    // Guards to prevent duplicate AI calls (React Strict Mode + re-renders)
    const quickOverviewInitiated = useRef(false);
    const fullReportInitiated = useRef(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    // 3. Trigger AI Calls on Load
    useEffect(() => {

        if (!session || !session.id) return;

        // Quick Overview (Fast Model)
        // First check if session already has cached data
        if (session.quickOverview && Object.keys(session.quickOverview as object).length > 0) {
            setQuickOverview(session.quickOverview as any);
            quickOverviewInitiated.current = true; // Mark as done
        } else if (!quickOverviewInitiated.current && !loadingQuick) {
            // Use ref guard to prevent duplicate calls
            quickOverviewInitiated.current = true;
            setLoadingQuick(true);
            generateQuickOverview({ sessionId: session.id })
                .then((res: any) => {
                    setQuickOverview(res.json);
                })
                .catch((err: any) => {
                    console.error("Quick Overview Error", err);
                    quickOverviewInitiated.current = false; // Reset on error to allow retry
                })
                .finally(() => setLoadingQuick(false));
        }

        // Full Report (Background Generation)
        // First check if session already has cached data
        if (session.fullReport && Object.keys(session.fullReport as object).length > 0) {
            setFullReport(session.fullReport as any);
            fullReportInitiated.current = true; // Mark as done
        } else if (!fullReportInitiated.current && !loadingFull) {
            // Use ref guard to prevent duplicate calls
            fullReportInitiated.current = true;
            setLoadingFull(true);
            generateFullReport({ sessionId: session.id })
                .then((res: any) => {
                    setFullReport(res.json);
                })
                .catch((err: any) => {
                    console.error("Full Report Error", err);
                    fullReportInitiated.current = false; // Reset on error to allow retry
                })
                .finally(() => setLoadingFull(false));
        }
    }, [session?.id]); // Only depend on session.id to prevent infinite loops



    const handleUnlock = async () => {
        if (!session) return;
        setIsCheckoutLoading(true);

        // 1. Generate unique event ID for CAPI deduplication
        const { generateEventId } = await import("../analytics/eventId");
        const eventID = generateEventId();


        // 2. Track InitiateCheckout (Standard Pixel + CAPI)
        trackPixelEvent('InitiateCheckout', {
            content_name: 'Full Relationship Report',
            content_category: 'Report',
            value: 29, // Updated price
            currency: 'EUR',
            eventID: eventID
        });

        try {
            // 3. Create Stripe Session
            const checkout = await createCheckoutSession({
                sessionId: session.id,
                eventID: eventID
            });

            // 4. Redirect
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

    if (isSessionLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Activity className="animate-spin text-primary" /></div>;
    if (!session) return <div className="min-h-screen flex items-center justify-center">Session not found.</div>;



    // Render Logic
    const isPaid = session.isPaid;
    const metrics = (session.advancedMetrics as any) || {};

    // Use Overview data or Fallbacks
    const headline = quickOverview?.hero?.headline || "Analysis Complete";
    const badge = quickOverview?.hero?.result_badge || "CALCULATING...";
    const summary = quickOverview?.pulse?.summary || "We are synthesizing your data against 45 emotional markers...";



    // Metrics for Dashboard
    const dimensionScores = {
        comm: metrics.repair_efficiency ? Math.min(100, Math.max(0, 100 - metrics.repair_efficiency + 20)) : 50, // rough heuristics if direct mapping missing
        // Actually, let's use the explicit calculated metrics if available, or fallbacks.
        // The user prompt had "Communication: 40% (Low)". 
        // In our metricsConfig: "Repair Efficiency" is a good proxy for Communication/Conflict.
        // "Betrayal Vulnerability" -> Trust.
        // "Erotic Death Spiral" -> Sex.
        // "CEO vs Intern" -> Fairness.
        // "Compatibility Quotient" -> Future.
    };

    // Helper to get Metric Status
    const getStatus = (val: number) => {
        if (val > 80) return { label: "High", color: "text-green-600 bg-green-50 border-green-200" };
        if (val > 50) return { label: "Medium", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
        return { label: "Critical", color: "text-red-600 bg-red-50 border-red-200" };
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24">
            {isPaid && <Confetti recycle={false} numberOfPieces={500} />}

            {/* 1. HERO SECTION */}
            {/* 1. HERO SECTION: THE DASHBOARD OF TRUTH */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-16 px-6 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-6 relative z-10">

                    {/* Visual Pills / Badges */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
                        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <ShieldAlert size={12} className="text-orange-500" /> Toxicity Screen: COMPLETE
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <Clock size={12} className="text-blue-500" /> 5-Year Forecast: READY
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <Activity size={12} className="text-purple-500" /> Breakup Risk: CALCULATED
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        The Honest Truth About<br className="hidden md:block" /> Your Relationship.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Whether it's hidden manipulation or just growing apart, we've analyzed exactly <strong>what's happening</strong>—and <strong>where you'll be in 5 years</strong>.
                    </p>

                    {/* Primary Status Badge - Dynamic based on Risk */}
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 text-lg font-black uppercase tracking-wider shadow-lg transform rotate-1 mt-4 ${badge.includes("STUCK") || badge.includes("RISK") ? "bg-red-50 border-red-500 text-red-600 dark:bg-red-950/30" : "bg-green-50 border-green-500 text-green-600 dark:bg-green-950/30"
                        } `}>
                        {badge.includes("RISK") && <AlertTriangle size={20} className="stroke-[3px]" />}
                        {badge.includes("STUCK") && <Activity size={20} className="stroke-[3px]" />}
                        {badge.includes("HEALTHY") && <BadgeCheck size={20} className="stroke-[3px]" />}
                        [{badge}]
                    </div>
                </div>

                {/* Subtle Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-5">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[100px]" />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 -mt-8 space-y-8 relative z-10">

                {/* 2. CRITICAL INSIGHTS: NARCISSISM & SAFETY (Moved to Top) */}
                <div className="space-y-4">
                    <div className="px-2">
                        <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldAlert size={20} className="text-orange-500" />
                            First: Let's Check For Toxicity
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Before we look at communication or intimacy, we need to rule out any "Red Flags" that make the relationship unsafe.
                        </p>
                    </div>

                    <NarcissismSection
                        analysis={session.narcissismAnalysis as any}
                        isPaid={isPaid}
                        onUnlock={handleUnlock}
                    />
                </div>

                {/* 3. RELATIONSHIP PULSE (New & Improved) */}
                <PulseSection
                    analysis={fullReport?.chapter1_pulse}
                    quickOverview={quickOverview}
                    metrics={metrics}
                    isPaid={isPaid}
                    onUnlock={handleUnlock}
                />



                {/* 4. FUTURE FORECAST (New & Improved) */}
                <FutureForecastSection
                    analysis={fullReport?.chapter1_pulse}
                    quickOverview={quickOverview}
                    isPaid={isPaid}
                    onUnlock={handleUnlock}
                />

                {/* 5. DIMENSION BREAKDOWN (DEEP DIVE) */}
                <div className="space-y-6">
                    <div className="text-center py-6 space-y-2">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Detailed Diagnostic</h3>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm">
                            Deep dive into the 5 Core Dimensions.
                        </p>
                    </div>

                    {/* A. Communication (Chapter 2 - MIXED) */}
                    <DimensionCard
                        title={(metrics.repair_efficiency || 40) < 60 ? "Why You Feel Unheard" : "Your Connection Engine"}
                        description={(metrics.repair_efficiency || 40) < 60
                            ? "It’s not just 'fighting.' It’s the loop where you say one thing, they hear another, and you end up apologizing for your own feelings."
                            : "You have a rare ability to repair conflict quickly. This is your greatest asset."}
                        icon={<TrendingUp />}
                        status={quickOverview?.dimensions?.communication?.status || "Analyzing..."}
                        teaser={quickOverview?.dimensions?.communication?.teaser}
                        metricInsight={quickOverview?.dimensions?.communication?.metric_insight}
                        blurredText={fullReport?.chapter2_communication?.repeat_loop?.[0] || "You're stuck in the same fight on repeat. It has a name, a script, and a 24-hour fix—but first you need to see the pattern you can't see from inside it."}
                        onUnlock={handleUnlock}
                        visible={isPaid}
                        metricName="Repair Efficiency"
                        metricScore={metrics.repair_efficiency || 40}
                        deepDive={fullReport?.chapter2_communication?.deep_dive}
                        specificItems={fullReport?.chapter2_communication?.specific_triggers}
                        specificItemsLabel="Specific Triggers"
                        impactText={fullReport?.chapter2_communication?.impact_on_other_dimensions}
                        unlockCopy="You've had this exact fight 47 times. It has a clinical name, a predictable script, and a 24-hour fix. See the loop you're trapped in—and the one sentence that breaks it."
                        isSymptom={(metrics.repair_efficiency || 40) < 60}
                    />

                    {/* B. Emotional Safety (Chapter 3 - PAID) */}
                    <DimensionCard
                        title={(metrics.betrayal_vulnerability || 65) > 40 ? "Why You Walk on Eggshells" : "Your Safety Net"}
                        description={(metrics.betrayal_vulnerability || 65) > 40
                            ? "The constant, low-level anxiety of monitoring your words. You edit yourself to keep the peace, but the silence is getting louder."
                            : "You feel safe, seen, and secure. This solid foundation allows you to be vulnerable without fear of rejection."}
                        icon={<Shield />}
                        status={quickOverview?.dimensions?.security?.status || "Analyzing..."}
                        teaser={quickOverview?.dimensions?.security?.teaser}
                        metricInsight={quickOverview?.dimensions?.security?.metric_insight}
                        blurredText={fullReport?.chapter3_security?.silent_secret || "There's something you haven't said out loud—a fear so deep you've built your entire relationship around avoiding it. It's costing you more than you know."}
                        onUnlock={handleUnlock}
                        visible={isPaid}
                        metricName="Betrayal Vulnerability"
                        metricScore={metrics.betrayal_vulnerability || 65}
                        isGoodMetric={false}
                        deepDive={fullReport?.chapter3_security?.deep_dive}
                        specificItems={fullReport?.chapter3_security?.hypervigilance_triggers}
                        specificItemsLabel="Hypervigilance Triggers"
                        impactText={fullReport?.chapter3_security?.impact_on_daily_life}
                        unlockCopy="Why do you replay conversations for hours? Why does your chest tighten when you hear their key in the door? See what's hijacking your nervous system—and what it's costing you."
                        isSymptom={(metrics.betrayal_vulnerability || 65) > 40}
                    />

                    {/* INTERSTITIAL CTA - The "One High Quality Card" */}
                    {!isPaid && (
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-center text-white shadow-xl transform md:scale-105 my-8 relative z-10 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-50 pointer-events-none"></div>
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl md:text-3xl font-black">Stop Guessing. Start Knowing.</h3>
                                <p className="text-indigo-100 text-lg max-w-lg mx-auto leading-relaxed">
                                    You've seen the symptoms. Now get the cure. Unlock the full breakdown for all 5 dimensions, plus your 30-day action plan.
                                </p>
                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={handleUnlock}
                                        className="bg-white text-indigo-600 hover:bg-indigo-50 font-black text-lg py-4 px-10 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        UNLOCK FULL REPORT - €29 <ArrowRight size={20} />
                                    </button>
                                    <p className="text-xs text-indigo-200 font-medium opacity-80">Less than one therapy session (€150)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* C. Sex & Intimacy (Chapter 4 - MIXED) */}
                    <DimensionCard
                        title={(metrics.erotic_death_spiral || 68) > 40 ? "Why The Spark Died" : "Your Erotic Connection"}
                        description={(metrics.erotic_death_spiral || 68) > 40
                            ? "It wasn't a choice. It was a slow drift. You stopped reaching out because you got tired of the subtle rejection."
                            : "The spark is alive. You have a strong physical bond that buffers against stress and keeps you connected."}
                        icon={<Heart />}
                        status={quickOverview?.dimensions?.erotic?.status || "Analyzing..."}
                        teaser={quickOverview?.dimensions?.erotic?.teaser}
                        metricInsight={quickOverview?.dimensions?.erotic?.metric_insight}
                        blurredText={fullReport?.chapter4_erotic?.desire_gap || "The desire gap isn't about frequency—it's about what's killing the spark. There's a specific blocker, and it's not what you think."}
                        onUnlock={handleUnlock}
                        visible={isPaid}
                        metricName="Erotic Death Spiral"
                        metricScore={metrics.erotic_death_spiral || 20}
                        isGoodMetric={false}
                        deepDive={fullReport?.chapter4_erotic?.deep_dive}
                        specificItems={fullReport?.chapter4_erotic?.specific_blockers}
                        specificItemsLabel="Desire Blockers"
                        impactText={fullReport?.chapter4_erotic?.polarity_analysis}
                        unlockCopy="When did you stop wanting them? See the exact moment desire died—and whether you can resurrect it or need to let go."
                        isSymptom={(metrics.erotic_death_spiral || 68) > 40}
                    />

                    {/* D. Power & Fairness (Chapter 5 - PAID) */}
                    <DimensionCard
                        title={(metrics.ceo_vs_intern || 58) > 40 ? "Why You're Exhausted" : "Your Power Balance"}
                        description={(metrics.ceo_vs_intern || 58) > 40
                            ? "You're not just a partner; you're the project manager. You carry the mental load, and it's killing your desire."
                            : "You operate as true teammates. No 'CEO vs Intern' dynamic here. You carry the load together."}
                        icon={<BadgeCheck />}
                        status={quickOverview?.dimensions?.balance?.status || "Analyzing..."}
                        teaser={quickOverview?.dimensions?.balance?.teaser}
                        metricInsight={quickOverview?.dimensions?.balance?.metric_insight}
                        blurredText={fullReport?.chapter5_balance?.parent_child_dynamic || "One of you is managing the relationship like a CEO manages an intern. This power imbalance is quietly destroying your attraction—and neither of you sees it."}
                        onUnlock={handleUnlock}
                        visible={isPaid}
                        metricName="CEO vs Intern"
                        metricScore={metrics.ceo_vs_intern || 45}
                        isGoodMetric={false}
                        deepDive={fullReport?.chapter5_balance?.deep_dive}
                        specificItems={[fullReport?.chapter5_balance?.mental_load_breakdown, fullReport?.chapter5_balance?.resentment_pattern].filter(Boolean)}
                        specificItemsLabel="Mental Load & Resentment"
                        impactText={fullReport?.chapter5_balance?.impact_on_attraction}
                        unlockCopy="You can't desire someone you have to manage. See the invisible scorecard destroying your attraction—and the one boundary that resets it."
                        isSymptom={(metrics.ceo_vs_intern || 58) > 40}
                    />

                    {/* E. Shared Future (Chapter 6 - FREE) */}

                    <DimensionCard
                        title={(metrics.compatibility_quotient || 90) < 60 ? "Why You Feel Alone Together" : "Your Shared Vision"}
                        description={(metrics.compatibility_quotient || 90) < 60
                            ? "You're in the same house, but living different lives. The silence isn't peace—it's distance."
                            : "You are moving in the same direction with a unified purpose. Your dreams are aligned."}
                        icon={<Compass />}
                        status={quickOverview?.dimensions?.compass?.status || "Analyzing..."}
                        teaser={quickOverview?.dimensions?.compass?.teaser}
                        metricInsight={quickOverview?.dimensions?.compass?.metric_insight}
                        blurredText={fullReport?.chapter6_compass?.detachment_warning || "You're traveling parallel roads that are slowly diverging. The question isn't if you want the same things—it's whether you're willing to build them together."}
                        onUnlock={handleUnlock}
                        visible={isPaid}
                        metricName="Soulmate Sync"
                        metricScore={metrics.compatibility_quotient || 90}
                        deepDive={fullReport?.chapter6_compass?.deep_dive}
                        specificItems={[fullReport?.chapter6_compass?.vision_compatibility, fullReport?.chapter6_compass?.dream_erosion, fullReport?.chapter6_compass?.trajectory_warning].filter(Boolean)}
                        specificItemsLabel="Future Alignment"
                        impactText={fullReport?.chapter6_compass?.impact_on_longevity}
                        unlockCopy="Are you growing together or just growing old together? See the 5-year projection of your current path—and if it leads to the same place."
                        isSymptom={(metrics.compatibility_quotient || 90) < 60}
                    />
                </div>

                {/* 5A. HIDDEN PATHOLOGY REPORT (Lab Results) */}
                <section className="mt-12 mb-12">
                    <div className="text-center space-y-2 mb-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            <Activity size={16} /> Clinical Pathology
                        </h3>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            Silent Answers to Your Hardest Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {/* 1. Silent Divorce Risk */}
                        <BiomarkerStrip
                            label="Silent Divorce Risk"
                            score={metrics.silent_divorce_risk || 72}
                            color="red"
                            icon={<FileWarning size={20} />}
                            isPaid={isPaid}
                            doubtQuestion="Is it too late? Are we already done?"
                            description="Your 'peace' is actually emotional detachment. High risk of sudden separation initiated by the quiet partner."
                        />

                        {/* 2. Internalized Malice */}
                        <BiomarkerStrip
                            label="Internalized Malice"
                            score={metrics.internalized_malice || 65}
                            color="orange"
                            icon={<ShieldAlert size={20} />}
                            isPaid={isPaid}
                            doubtQuestion="Am I a bad person for resenting them?"
                            description="You've started viewing your partner as an antagonist. This biological stress response triggers 'fight or flight' just by being in the same room."
                        />

                        {/* 3. Nervous System Load */}
                        <BiomarkerStrip
                            label="Nervous System Load"
                            score={metrics.nervous_system_load || 88}
                            color="amber"
                            icon={<Battery size={20} />}
                            isPaid={isPaid}
                            doubtQuestion="Why am I so exhausted all the time?"
                            description="Your relationship is consuming 88% of your daily emotional battery. This is why you feel physically drained even after sleep."
                        />
                    </div>
                </section>



                {/* 5B. THE BRIDGE (Connecting Dots) */}
                <div className="max-w-3xl mx-auto text-center mb-16 px-6">
                    <div className="h-16 w-0.5 bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 mx-auto mb-8"></div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                        "If you ignore these 3 hidden signals, they don't just go away. <br className="hidden md:block" />
                        They compound into <span className="text-indigo-600 dark:text-indigo-400">The Silent Drift.</span>"
                    </h3>
                    <div className="mt-6 flex justify-center">
                        <ArrowRight className="text-slate-400 rotate-90" size={24} />
                    </div>
                </div>

                {/* 6. SYSTEMIC ANALYSIS (Chapter 7 - FULLY PAID) */}
                <section className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-1 shadow-2xl overflow-hidden mt-12 relative border border-slate-800">
                    <div className="bg-slate-900/50 backdrop-blur-sm p-8 text-center space-y-8 relative">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-white">
                                Connecting The Dots
                            </h2>
                            <p className="text-slate-300">
                                This is the "PhD Insight." It explains how your dimensions interact. This is the most valuable section.
                            </p>
                        </div>

                        <div className={`space-y-4 text-left max-w-2xl mx-auto ${!isPaid ? 'blur-sm opacity-50' : ''}`}>
                            <div className="flex gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
                                <div className="bg-primary/20 p-2 rounded h-fit shrink-0"><Zap size={18} /></div>
                                <p className="text-slate-100 text-sm leading-relaxed">{fullReport?.chapter7_synthesis?.connection_1 || "How your 'Manager Dynamic' is directly causing your 'Low Libido'."}</p>
                            </div>
                            <div className="flex gap-4 p-5 bg-white/5 rounded-xl border border-white/10">
                                <div className="bg-primary/20 p-2 rounded h-fit shrink-0"><Zap size={18} /></div>
                                <p className="text-slate-100 text-sm leading-relaxed">{fullReport?.chapter7_synthesis?.connection_2 || "How your 'Deepest Fear' is sabotaging your 'Conflict Repair'."}</p>
                            </div>
                        </div>

                        {!isPaid && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/20 backdrop-blur-[1px] px-6">
                                <p className="text-white text-base mb-4 text-center max-w-md font-semibold leading-snug">
                                    You'll see the hidden pattern connecting your fights, your sex life, and why the same problems keep happening
                                </p>
                                <button
                                    onClick={handleUnlock}
                                    className="group relative inline-flex items-center justify-center gap-3 bg-white text-indigo-950 font-black text-lg px-8 py-4 rounded-full shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] hover:scale-105 transition-all"
                                >
                                    <Lock size={20} />
                                    Unlock Your Personalized Report
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* 6. ACTION PLAN (Chapter 8 - FULLY PAID) */}
                <section className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden mt-12">
                    <div className="bg-slate-900/50 backdrop-blur-sm p-8 text-center space-y-8 relative">
                        <div className="space-y-4">
                            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200 text-3xl font-black">
                                How To Fix It
                            </h2>
                            <p className="text-emerald-100/80">
                                The exact roadmap: what to stop doing, what to start saying, and your 30-day reconnection plan.
                            </p>
                        </div>

                        {isPaid ? (
                            <div className="space-y-6 text-left max-w-2xl mx-auto">
                                {/* Stop Doing */}
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <h3 className="text-emerald-200 font-bold mb-4 flex items-center gap-2">
                                        <X size={20} /> The 3 Things to Stop Doing Today
                                    </h3>
                                    <ul className="space-y-2 text-emerald-100/90">
                                        {fullReport?.chapter8_roadmap?.stop_doing?.map((item: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-red-400 font-bold mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        )) || (
                                                <>
                                                    <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-1">•</span><span>Stop trying to "win" arguments</span></li>
                                                    <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-1">•</span><span>Stop bringing up past mistakes</span></li>
                                                    <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-1">•</span><span>Stop expecting them to read your mind</span></li>
                                                </>
                                            )}
                                    </ul>
                                </div>

                                {/* Scripts */}
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <h3 className="text-emerald-200 font-bold mb-4 flex items-center gap-2">
                                        <MessageCircle size={20} /> Exact Conversation Scripts
                                    </h3>
                                    <div className="space-y-3 text-emerald-100/90 text-sm">
                                        {fullReport?.chapter8_roadmap?.scripts?.map((script: string, idx: number) => (
                                            <p key={idx} className="italic bg-white/5 p-3 rounded border-l-2 border-emerald-400">"{script}"</p>
                                        )) || (
                                                <p className="italic bg-white/5 p-3 rounded border-l-2 border-emerald-400">"I notice I'm getting defensive. Can we pause for 10 minutes and try again?"</p>
                                            )}
                                    </div>
                                </div>

                                {/* Calendar */}
                                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                    <h3 className="text-emerald-200 font-bold mb-4 flex items-center gap-2">
                                        <Clock size={20} /> Your 30-Day Reconnection Calendar
                                    </h3>
                                    <div className="text-emerald-100/90 text-sm space-y-3">
                                        {fullReport?.chapter8_roadmap?.calendar ? (
                                            <p className="leading-relaxed">{fullReport.chapter8_roadmap.calendar}</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                                                    <span><strong>Week 1:</strong> Focus on repair rituals</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                                                    <span><strong>Week 2:</strong> Implement daily check-ins</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                                                    <span><strong>Week 3:</strong> Practice vulnerability</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                                                    <span><strong>Week 4:</strong> Celebrate progress</span>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 opacity-50 blur-[4px] select-none text-left max-w-lg mx-auto">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <div className="bg-emerald-500/20 p-2 rounded h-fit"><X size={16} /></div>
                                        <p className="text-emerald-100 text-sm">Stop trying to "win" arguments. Stop bringing up past mistakes...</p>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <div className="bg-emerald-500/20 p-2 rounded h-fit"><MessageCircle size={16} /></div>
                                        <p className="text-emerald-100 text-sm">"I notice I'm getting defensive. Can we pause for 10 minutes..."</p>
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
                                    <p className="text-white text-base mb-4 text-center max-w-md font-semibold leading-snug">
                                        Get the exact words to say tonight, what to stop doing immediately, and your week-by-week plan to fix this
                                    </p>
                                    <button
                                        onClick={handleUnlock}
                                        className="group relative inline-flex items-center justify-center gap-3 bg-white text-emerald-950 font-black text-lg px-8 py-4 rounded-full shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] hover:scale-105 transition-all"
                                    >
                                        {isCheckoutLoading ? "Loading..." : "Unlock Your Personalized Report"}
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* VALUE STACKING SECTION - "What You're Missing" */}
                {!isPaid && (
                    <section className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 md:p-12 shadow-2xl mt-16 border-2 border-indigo-500/30 relative overflow-hidden">
                        {/* Decorative gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 pointer-events-none"></div>

                        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
                            <div className="space-y-4">
                                <div className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full">
                                    <span className="text-indigo-300 font-bold text-sm uppercase tracking-wider">🔒 What You're Missing</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                    The free analysis showed you WHAT is broken.
                                </h2>
                                <p className="text-xl text-indigo-200 font-semibold">
                                    The full report shows you:
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-left">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="text-orange-500 shrink-0" size={24} />
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">IS THIS NARCISSISM?</h3>
                                            <p className="text-indigo-200 text-sm">21-point clinical assessment with scoring system</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <Shield className="text-purple-500 shrink-0" size={24} />
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">ARE YOU SAFE?</h3>
                                            <p className="text-indigo-200 text-sm">Abuse risk level and what to do next</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <Brain className="text-blue-500 shrink-0" size={24} />
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">CAN THEY CHANGE?</h3>
                                            <p className="text-indigo-200 text-sm">Honest prognosis based on pattern severity</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <Heart className="text-emerald-500 shrink-0" size={24} />
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">WHAT TO SAY</h3>
                                            <p className="text-indigo-200 text-sm">Exact words to break the cycle tonight</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleUnlock}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xl px-12 py-5 rounded-xl shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-3 mx-auto group"
                                >
                                    UNLOCK FULL ANALYSIS
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                                </button>
                                <p className="text-indigo-300 text-sm mt-4">Less than one therapy session (€150) • Instant access • 30-Day Money Back Guarantee</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* 7. TESTIMONIALS (Social Proof) */}
                <section className="mt-16 mb-8">
                    <div className="text-center space-y-4 mb-10">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                            Stories from our Couples
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Real people who stopped guessing and started understanding.
                        </p>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {TESTIMONIALS.map((t, idx) => (
                            <div key={idx} className="break-inside-avoid bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative">
                                <div className="absolute top-6 left-6 text-slate-200 dark:text-slate-800">
                                    <Quote size={40} className="stroke-[3px]" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                        "{t.quote}"
                                    </p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                                        <div className="flex text-yellow-500 gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            <span className="text-slate-900 dark:text-white font-bold">{t.name}</span>, {t.info}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center py-12 text-slate-400 text-sm">
                    <p>Secure SSL Payment • 30-Day Money Back Guarantee</p>
                </div>

            </main>

            {/* STICKY CTA BAR (Mobile & Desktop) */}
            {
                !isPaid && (
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 shadow-2xl">
                        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3 text-white">
                                    <Lock size={20} className="text-indigo-400 shrink-0" />
                                    <div className="text-sm md:text-base">
                                        <span className="font-bold">You're viewing 30% of your report.</span>
                                        <span className="hidden md:inline text-slate-300 ml-2">Unlock: Root causes, action plans, and exact scripts to fix this</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUnlock}
                                    className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm md:text-base px-6 md:px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg group shrink-0"
                                >
                                    UNLOCK NOW - €29
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

// --- SUBCOMPONENTS ---

function ScoreRow({ label, score }: { label: string, score: number }) {
    const getColor = (s: number) => {
        if (s < 40) return "bg-red-500";
        if (s < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-slate-900 dark:text-white font-bold">{Math.round(score)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getColor(score)} transition-all duration-1000`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

function DimensionCard({
    title,
    description,
    icon,
    status,
    teaser,
    blurredText,
    onUnlock,
    visible = false,
    metricName,
    metricScore,
    isGoodMetric = true,
    // NEW: enriched content props
    metricInsight,
    deepDive,
    specificItems,
    specificItemsLabel,
    impactText,
    unlockCopy, // NEW: custom unlock copy per card
    isSymptom = false // NEW: specific prop to force "bad" styling
}: any) {
    const getMetricColor = (score: number, isGoodMetric: boolean = true) => {
        if (isGoodMetric) {
            // For good metrics: high score = good (green)
            if (score >= 70) return "bg-green-500";
            if (score >= 40) return "bg-yellow-500";
            return "bg-red-500";
        } else {
            // For bad metrics: high score = bad (red)
            if (score >= 70) return "bg-red-500";
            if (score >= 40) return "bg-yellow-500";
            return "bg-green-500";
        }
    };

    const getMetricStatus = (score: number, isGoodMetric: boolean = true) => {
        if (isGoodMetric) {
            if (score >= 70) return "Optimal";
            if (score >= 40) return "Stable";
            return "Critical";
        } else {
            // For bad metrics: high score = critical
            if (score >= 60) return "Critical"; // Lower threshold for "bad" metrics to show urgency
            if (score >= 40) return "Caution";
            return "Optimal";
        }
    };

    // Determine card theme based on isSymptom prop
    const cardBorderColor = isSymptom ? "border-red-200 dark:border-red-900/50" : "border-emerald-200 dark:border-emerald-900/50";
    const headerBg = isSymptom ? "bg-red-50/50 dark:bg-red-950/20" : "bg-emerald-50/50 dark:bg-emerald-950/20";
    const iconBg = isSymptom ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    const titleColor = isSymptom ? "text-red-900 dark:text-red-100" : "text-emerald-900 dark:text-emerald-100";
    const statusBadgeColor = isSymptom ? "bg-red-100 text-red-700 border-red-200" : "bg-emerald-100 text-emerald-700 border-emerald-200";

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm border ${cardBorderColor} overflow-hidden transition-all hover:shadow-md`}>
            {/* HEADER SECTION */}
            <div className={`p-6 border-b border-slate-100 dark:border-slate-800 ${headerBg}`}>
                <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
                        {isSymptom ? <AlertTriangle size={24} /> : React.cloneElement(icon, { size: 24 })}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold text-xl ${titleColor}`}>{title}</h3>
                            {isSymptom && <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
                    </div>
                </div>

                {/* MRI METRIC - FREE */}
                {metricName && metricScore !== undefined && (
                    <div className="mt-4 p-3 bg-white/60 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{metricName}</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                                {Math.round(metricScore)}% <span className={`text-xs ml-1 px-1.5 py-0.5 rounded ${isSymptom ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {getMetricStatus(metricScore, isGoodMetric)}
                                </span>
                            </span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${getMetricColor(metricScore, isGoodMetric)} transition-all duration-1000`} style={{ width: `${metricScore}%` }}></div>
                        </div>
                    </div>
                )}

                {/* STATUS BADGE */}
                {/* Removed as per new design, status is now part of metric score */}
                {/* <div className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {status}
                </div> */}
            </div>

            {/* FREE CONTENT SECTION */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                {/* Free Teaser - use new field or fallback to old */}
                {teaser && (
                    <div>
                        <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                            {teaser}
                        </p>
                    </div>
                )}

                {/* Metric Insight - FREE (new field from AI) */}
                {metricInsight && (
                    <div className="flex gap-2 items-start p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                        <div className="text-indigo-500 mt-0.5 shrink-0">
                            <TrendingUp size={16} />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                            {metricInsight}
                        </p>
                    </div>
                )}
            </div>

            {/* BLURRED PAID PREVIEW - COMPACT MODE (High Signal, Low Height) */}
            {blurredText && !visible && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 relative">
                    <div className="relative cursor-pointer group" onClick={onUnlock}>
                        <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/30">
                            {/* Blurred Text Background */}
                            <p className="text-slate-400 dark:text-slate-500 blur-[5px] select-none leading-relaxed p-6 opacity-50">
                                {blurredText} {blurredText}
                            </p>

                            {/* NEW: High-Signal Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 max-w-md leading-snug drop-shadow-md">
                                    "{unlockCopy || "See the hidden pattern that is silently eroding your connection."}"
                                </p>
                                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-xl group-hover:scale-105 transition-transform uppercase tracking-wider">
                                    <Lock size={12} /> Unlock Analysis
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FULL CONTENT (Revealed) */}
            {visible && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-6">
                        {/* 1. The Deep Dive (Diagnosis) */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-600 dark:text-indigo-400">
                                    <Microscope size={16} />
                                </div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                                    Clinical Diagnosis
                                </h4>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm tablet:text-base border-l-2 border-indigo-500 pl-4 py-1">
                                {deepDive || blurredText || "Your communication style indicates a 'Pursuer-Distancer' dynamic. One partner pushes for resolution while the other withdraws to avoid conflict, creating an endless loop of frustration."}
                            </p>
                        </div>

                        {/* 2. Specific Items (The Evidence) */}
                        {specificItems && specificItems.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 space-y-3">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <ListChecks size={16} className="text-slate-500" />
                                    {specificItemsLabel || "Identified Patterns"}
                                </h4>
                                <ul className="space-y-2">
                                    {specificItems.map((item: string, idx: number) => (
                                        <li key={idx} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="text-indigo-500 font-bold">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 3. Impact (The "So What?") */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <Zap size={16} className="text-amber-500" />
                                The Ripple Effect
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                "{impactText || "This dynamic doesn't just stay in this area—it bleeds into your intimacy, trust, and future planning, creating a silent erosion of the relationship foundation."}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
