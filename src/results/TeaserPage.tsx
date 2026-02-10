import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, BadgeCheck, Zap, ArrowRight, Shield, Clock, TrendingUp, Heart, Brain, Activity, Play, X, MessageCircle, Compass, TrendingDown, Star, Quote } from "lucide-react";
import { useQuery, generateQuickOverview, generateFullReport, createCheckoutSession, getTestSession } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import GaugeChart from "../components/GaugeChart";
import Confetti from "react-confetti";
import { CheckoutModal } from './CheckoutModal';
import { trackPixelEvent } from '../analytics/pixel';
import { NarcissismSection } from "./sections/NarcissismSection";


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
        name: "Alessa",
        info: "42, married for 15 years",
        quote: "I did it after a fight about money where I felt like his mother again instead of his wife. The term 'Manager-Employee dynamic' pissed me off because it was EXACTLY that. I printed that section and left it on his nightstand without saying anything. Two days later he asked me 'is this how you feel?' and we could finally talk about it. Before, I didn't have the words."
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
        name: "Claire",
        info: "31, living together for 4 years",
        quote: "I took it after he shut down during another fight and I spiraled into panic. The piece on 'situational anxiety vs constant anxiety' made me realize I wasn't crazy—it was a specific trigger, not my personality. I printed it and left it for him to read. He came to me later and said 'I didn't know my silence felt like abandonment to you'. We haven't fixed everything, but at least now he understands what happens in my head."
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

    // Generate Event ID for consistent InitiateCheckout deduplication
    const [checkoutEventID, setCheckoutEventID] = useState<string | null>(null);

    const handleUnlock = async () => {
        // Track unlock intent with AddToCart event
        trackPixelEvent('AddToCart', {
            content_name: 'Full Relationship Report',
            content_category: 'Report',
            value: 47,
            currency: 'USD',
            content_ids: ['relationship_report'],
            content_type: 'product'
        });

        // Show modal
        setShowCheckoutModal(true);
    };

    const handleCheckout = async () => {
        if (!session) return;
        setIsCheckoutLoading(true);

        // Generate event ID and fire InitiateCheckout when user commits to checkout
        const { generateEventId } = await import("../analytics/eventId");
        const eventID = generateEventId();
        setCheckoutEventID(eventID);

        // Track InitiateCheckout when user actually commits
        trackPixelEvent('InitiateCheckout', {
            content_name: 'Full Relationship Report',
            content_category: 'Report',
            value: 47,
            currency: 'USD',
            eventID: eventID // Crucial for deduplication with Purchase event
        });

        try {
            // Pass the generated eventID to the server for CAPI 
            const checkout = await createCheckoutSession({
                sessionId: session.id,
                eventID: eventID
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
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-16 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                        <Activity size={14} /> Analysis Complete
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {headline}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        We have compared your answers against 5 core psychological dimensions to determine the health of your relationship.
                    </p>

                    <div className={`inline-block px-6 py-3 rounded-xl border-2 text-xl font-black uppercase tracking-wider shadow-lg transform rotate-1 ${badge.includes("STUCK") || badge.includes("RISK") ? "bg-red-50 border-red-500 text-red-600" : "bg-green-50 border-green-500 text-green-600"}
                        } `}>
                        [{badge}]
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 -mt-8 space-y-8 relative z-10">

                {/* 2. OVERVIEW DASHBOARD (FREE) */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            <Activity className="text-primary" size={20} />
                            The 5 Core Pillars
                        </h2>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase">Free Analysis</span>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            A high-level overview of the relationship’s current health. It translates complex data into "Weather Icons" so you immediately understand the stakes.
                        </p>
                    </div>

                    {/* Scores Section - Always Visible */}
                    <div className="p-6 md:p-8 pb-4">
                        <div className="space-y-4">
                            <ScoreRow label="Communication" score={metrics.repair_efficiency || 40} />
                            <ScoreRow label="Trust & Safety" score={metrics.betrayal_vulnerability || 65} />
                            <ScoreRow label="Sex & Intimacy" score={metrics.erotic_death_spiral || 20} />
                            <ScoreRow label="Fairness & Balance" score={metrics.ceo_vs_intern || 45} />
                            <ScoreRow label="Shared Future" score={metrics.compatibility_quotient || 90} />
                        </div>
                    </div>

                    {/* Summary Section - Separate container for overlay */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                        {isPaid ? (
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">
                                    "{summary}"
                                </p>
                            </div>
                        ) : (
                            <div className="relative min-h-[280px] md:min-h-[320px]">
                                {/* Blurred Summary */}
                                <div className="bg-slate-50 dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-700 blur-[6px] opacity-40 select-none pointer-events-none">
                                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">
                                        "{fullReport?.chapter1_pulse?.summary || "These scores reveal a specific pattern that's quietly eroding your relationship. You're not broken—you're stuck in a loop with a clinical name, a predictable trajectory, and a clear way out. But first, you need to see what you can't see from inside it. The pattern has been running for months, maybe years. It's creating distance where there should be intimacy, resentment where there should be trust, and silence where there should be conversation. Every fight feels different, but they're all symptoms of the same core dynamic. And that dynamic has a name, a cause, and most importantly—a solution."}"
                                    </p>
                                </div>

                                {/* Unlock Overlay - Only covers this summary div */}
                                <div className="absolute inset-0 flex items-center justify-center p-4 pt-8 sm:pt-12 pb-8 sm:pb-12">
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-2 border-indigo-400/30 rounded-2xl p-4 sm:p-6 w-full max-w-md text-center space-y-3 sm:space-y-4 shadow-xl">
                                        <Lock size={28} className="mx-auto text-indigo-600 dark:text-indigo-400" />
                                        <div className="space-y-2">
                                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                                See What These Scores Mean
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                                These numbers show WHAT is broken. The full report shows WHY it keeps happening—and the exact conversation to have tonight.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleUnlock}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl group"
                                        >
                                            <span className="hidden sm:inline">UNLOCK YOUR PERSONALIZED REPORT</span>
                                            <span className="sm:hidden">UNLOCK REPORT</span>
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. FORECAST (MIXED) */}
                <section className="space-y-4">
                    <div className="px-2">
                        <h2 className="font-bold text-xl text-slate-900 dark:text-white">Future Forecast</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            A clinical prediction of where the relationship is headed in the next 1–5 years if nothing changes.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Short Term - FREE from Quick Overview */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                                <Clock size={14} /> 6-Month Forecast
                            </h3>
                            <p className="text-slate-900 dark:text-white text-base leading-relaxed max-w-prose">
                                {quickOverview?.forecast?.short_term || "Based on your current patterns, the next 6 months will be challenging without intervention."}
                            </p>
                        </div>

                        {/* Long Term - PAID */}
                        {isPaid ? (
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                                    <Clock size={14} /> 5-Year Forecast
                                </h3>
                                <p className="text-slate-900 dark:text-white text-base leading-relaxed max-w-prose">
                                    {fullReport?.chapter1_pulse?.long_term_forecast || "If this pattern continues, specifically the lack of repair..."}
                                </p>
                            </div>
                        ) : (
                            <div className="relative bg-slate-900 text-white p-6 rounded-3xl shadow-sm overflow-hidden group cursor-pointer" onClick={handleUnlock}>
                                {/* Background pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />

                                <div className="relative z-10 opacity-40 blur-[2px] select-none">
                                    <h3 className="text-xs font-bold opacity-70 uppercase mb-4">5-Year Forecast</h3>
                                    <p className="font-bold text-lg">
                                        If this pattern continues, specifically the lack of repair...
                                    </p>
                                </div>

                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[1px] group-hover:bg-black/10 transition px-6">
                                    <p className="text-white text-sm mb-3 text-center max-w-xs font-medium">
                                        Most breakups are predictable. See the trajectory now—before the damage is permanent.
                                    </p>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-2xl">
                                        <Lock size={14} /> Unlock Your Personalized Report
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3.5 NARCISSISM / TOXICITY ANALYSIS (NEW) */}
                <NarcissismSection
                    analysis={session.narcissismAnalysis as any}
                    isPaid={isPaid}
                    onUnlock={handleUnlock}
                />

                {/* 4. DIMENSION BREAKDOWN (DEEP DIVE) */}
                <div className="space-y-6">
                    <div className="text-center py-6 space-y-2">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Detailed Diagnostic</h3>
                        <p className="text-slate-500 max-w-lg mx-auto text-sm">
                            Deep dive into the 5 Core Dimensions.
                        </p>
                    </div>

                    {/* A. Communication (Chapter 2 - MIXED) */}
                    <DimensionCard
                        title="How You Communicate"
                        description="This section analyzes how information and emotion flow between you. It focuses on how you handle friction and whether you can 'reset' after a fight."
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
                    />

                    {/* B. Emotional Safety (Chapter 3 - PAID) */}
                    <DimensionCard
                        title="Emotional Safety"
                        description="This explores the 'Invisible Net' of the relationship. It measures if you feel safe enough to be vulnerable or if you are living in a state of 'high alert.'"
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
                    />

                    {/* C. Sex & Intimacy (Chapter 4 - MIXED) */}
                    <DimensionCard
                        title="The Spark: Sex & Intimacy"
                        description="This moves beyond 'how many times a week' to analyze the emotional mechanics of desire and physical affection."
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
                    />

                    {/* D. Power & Fairness (Chapter 5 - PAID) */}
                    <DimensionCard
                        title="Power & Fairness"
                        description="This chapter audits the 'Social Contract.' It looks at who carries the burden of planning, worrying, and managing life."
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
                    />

                    {/* E. Shared Future (Chapter 6 - FREE) */}
                    <DimensionCard
                        title="Your Shared Future"
                        description="This section determines if you are traveling the same road. It's about meaning, dreams, and long-term compatibility."
                        icon={<Compass />}
                        status={quickOverview?.dimensions?.compass?.status || "Analyzing..."}
                        teaser={quickOverview?.dimensions?.compass?.teaser}
                        metricInsight={quickOverview?.dimensions?.compass?.metric_insight}
                        blurredText={fullReport?.chapter6_compass?.detachment_warning || "You're traveling parallel roads that are slowly diverging. The question isn't if you want the same things—it's whether you're willing to build them together."}
                        onUnlock={handleUnlock}
                        visible={isPaid}
                        metricName="Soulmate Sync"
                        metricScore={metrics.soulmate_sync || 90}
                        deepDive={fullReport?.chapter6_compass?.deep_dive}
                        specificItems={[fullReport?.chapter6_compass?.vision_compatibility, fullReport?.chapter6_compass?.dream_erosion, fullReport?.chapter6_compass?.trajectory_warning].filter(Boolean)}
                        specificItemsLabel="Vision & Trajectory"
                        impactText={fullReport?.chapter6_compass?.impact_on_daily_life}
                        unlockCopy="Are you building the same future—or are you wasting your best years? See where your visions diverge and whether this is fixable."
                    />
                </div>

                {/* 5. ADVANCED DIAGNOSTICS (12 MRI Metrics) */}
                <section className={`bg-slate-900 dark:bg-slate-950 rounded-3xl shadow-2xl mt-12 border border-slate-800 relative overflow-hidden ${isPaid ? 'p-8' : 'p-4 md:p-6'}`}>
                    <div className={`text-center space-y-4 ${isPaid ? 'mb-8' : 'mb-4'}`}>
                        <h2 className="text-2xl md:text-3xl font-black text-white">
                            🔬 Advanced Diagnostics
                        </h2>
                        {isPaid && (
                            <p className="text-slate-300 max-w-2xl mx-auto">
                                The 12 "Vital Signs" that reveal the hidden mechanics of your relationship. These metrics go beyond surface-level symptoms to measure the underlying health of your bond.
                            </p>
                        )}
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!isPaid ? 'blur-[4px] opacity-50 select-none pointer-events-none' : ''}`}>
                        {/* Metric Cards */}
                        {(isPaid ? [
                            {
                                name: "Crystal Ball",
                                subtitle: "Sustainability Forecast",
                                description: "Predicts if your current path leads to long-term growth or a dead end.",
                                score: metrics.sustainability_forecast || 65,
                                lowMeaning: "Your current path leads to a dead end. Without intervention, this relationship will erode within 2-3 years.",
                                highMeaning: "Strong foundation for long-term growth. You have the resilience to weather storms together.",
                                isGood: true
                            },
                            {
                                name: "Bounce Back",
                                subtitle: "Repair Efficiency",
                                description: "Your relationship's 'immune system'—how quickly you recover after a fight.",
                                score: metrics.repair_efficiency || 35,
                                lowMeaning: "Your relationship's 'immune system' is broken. Fights leave lasting damage that never fully heals.",
                                highMeaning: "You recover quickly after conflict. Apologies work, and you can reset the emotional temperature.",
                                isGood: true
                            },
                            {
                                name: "Open Door",
                                subtitle: "Betrayal Vulnerability",
                                description: "How likely an outside emotional or physical connection could disrupt the bond.",
                                score: metrics.betrayal_vulnerability || 72,
                                lowMeaning: "Strong emotional bond. Low risk of outside interference disrupting your connection.",
                                highMeaning: "High risk of emotional or physical affairs. Unmet needs create vulnerability to external validation.",
                                isGood: false
                            },
                            {
                                name: "Parent-Trap",
                                subtitle: "Erotic Death Spiral",
                                description: "Measures how much 'managing' your partner is killing your sex life.",
                                score: metrics.erotic_death_spiral || 68,
                                lowMeaning: "Healthy balance of autonomy and interdependence. Intimacy flows naturally.",
                                highMeaning: "One partner is 'managing' the other like a child. This kills desire and creates resentment.",
                                isGood: false
                            },
                            {
                                name: "Tactical Truce",
                                subtitle: "Duty Sex Index",
                                description: "Are you having sex because you want to, or just to keep the peace?",
                                score: metrics.duty_sex_index || 55,
                                lowMeaning: "Sex is driven by genuine desire and connection, not obligation or peacekeeping.",
                                highMeaning: "Sex has become transactional—a chore to keep the peace rather than an expression of passion.",
                                isGood: false
                            },
                            {
                                name: "Office Manager",
                                subtitle: "CEO vs Intern Gap",
                                description: "Measures the imbalance of 'worrying and planning' vs. just 'showing up.'",
                                score: metrics.ceo_vs_intern || 58,
                                lowMeaning: "Balanced partnership. Both carry equal mental load and responsibility.",
                                highMeaning: "Severe power imbalance. One partner is the 'Manager,' the other just 'shows up.' This breeds contempt.",
                                isGood: false
                            },
                            {
                                name: "Quiet Quit",
                                subtitle: "Silent Divorce Risk",
                                description: "High risk for couples who 'never fight' but have emotionally checked out.",
                                score: metrics.silent_divorce_risk || 42,
                                lowMeaning: "You're emotionally engaged. Conflict exists, but it's a sign of investment, not detachment.",
                                highMeaning: "High risk of 'roommate syndrome.' You never fight because you've emotionally checked out.",
                                isGood: false
                            },
                            {
                                name: "Soulmate Sync",
                                subtitle: "Compatibility Quotient",
                                description: "Measures if your core life values and 'future dreams' actually match.",
                                score: metrics.compatibility_quotient || 85,
                                lowMeaning: "Fundamental misalignment on life values, goals, or vision. You're building different futures.",
                                highMeaning: "Deep alignment on what matters. You're traveling the same road, even if execution differs.",
                                isGood: true
                            },
                            {
                                name: "Enemy Within",
                                subtitle: "Internalized Malice",
                                description: "Are you starting to see your partner as a 'bad person' rather than a teammate?",
                                score: metrics.internalized_malice || 48,
                                lowMeaning: "You see your partner as a teammate, even during conflict. Disagreements don't erode core trust.",
                                highMeaning: "CRITICAL: You've started to see your partner as a 'bad person' rather than a good person having a bad moment.",
                                isGood: false
                            },
                            {
                                name: "Burnout Rate",
                                subtitle: "Nervous System Load",
                                description: "The physical and mental toll this relationship is taking on your body.",
                                score: metrics.nervous_system_load || 61,
                                lowMeaning: "The relationship is a source of calm and safety. Your body relaxes around your partner.",
                                highMeaning: "This relationship is taking a physical toll. You're in a constant state of hypervigilance and stress.",
                                isGood: false
                            },
                            {
                                name: "Hidden Spark",
                                subtitle: "Erotic Potential",
                                description: "Tells you if the 'fire' is still there but just covered by domestic stress.",
                                score: metrics.erotic_potential || 52,
                                lowMeaning: "The chemistry is gone. Intimacy feels forced or non-existent, even with effort.",
                                highMeaning: "The fire is still there, just buried under domestic stress. Remove the blocks, and desire will return.",
                                isGood: true
                            },
                            {
                                name: "Anchor Score",
                                subtitle: "Resilience Battery",
                                description: "How much 'shared history' and core trust you have to survive a crisis.",
                                score: metrics.resilience_battery || 70,
                                lowMeaning: "Fragile foundation. Little shared history or trust reserves to survive a major crisis.",
                                highMeaning: "Strong resilience. Years of shared history and deep trust create a buffer against storms.",
                                isGood: true
                            }
                        ] : [
                            // Show only 3 cards for unpaid users to reduce scroll height
                            {
                                name: "Crystal Ball",
                                subtitle: "Sustainability Forecast",
                                description: "Predicts if your current path leads to long-term growth or a dead end.",
                                score: metrics.sustainability_forecast || 65,
                                lowMeaning: "Your current path leads to a dead end.",
                                highMeaning: "Strong foundation for long-term growth.",
                                isGood: true
                            },
                            {
                                name: "Erotic Death Spiral",
                                subtitle: "Parent-Trap",
                                description: "Measures how much 'managing' your partner is killing your sex life.",
                                score: metrics.erotic_death_spiral || 68,
                                lowMeaning: "Healthy balance of autonomy.",
                                highMeaning: "One partner is 'managing' the other like a child.",
                                isGood: false
                            },
                            {
                                name: "Soulmate Sync",
                                subtitle: "Compatibility Quotient",
                                description: "Measures if your core life values and 'future dreams' actually match.",
                                score: metrics.compatibility_quotient || 85,
                                lowMeaning: "Fundamental misalignment on life values.",
                                highMeaning: "Deep alignment on what matters.",
                                isGood: true
                            }
                        ]).map((metric, idx) => {
                            const getColor = (score: number, isGood: boolean) => {
                                if (isGood) {
                                    if (score >= 70) return "bg-green-500";
                                    if (score >= 40) return "bg-yellow-500";
                                    return "bg-red-500";
                                } else {
                                    if (score >= 70) return "bg-red-500";
                                    if (score >= 40) return "bg-yellow-500";
                                    return "bg-green-500";
                                }
                            };

                            const getStatus = (score: number, isGood: boolean) => {
                                if (isGood) {
                                    if (score >= 70) return { label: "Strong", color: "text-green-400" };
                                    if (score >= 40) return { label: "Moderate", color: "text-yellow-400" };
                                    return { label: "At Risk", color: "text-red-400" };
                                } else {
                                    if (score >= 70) return { label: "Critical", color: "text-red-400" };
                                    if (score >= 40) return { label: "Caution", color: "text-yellow-400" };
                                    return { label: "Healthy", color: "text-green-400" };
                                }
                            };

                            const status = getStatus(metric.score, metric.isGood);

                            return (
                                <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 space-y-3">
                                    {/* Header with Name and Score */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-indigo-100 font-bold text-lg">{metric.name}</h3>
                                            <p className="text-indigo-300/60 text-xs">{metric.subtitle}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-2xl font-black text-white flex items-center justify-end gap-1">
                                                {isPaid ? `${Math.round(metric.score)}% ` : <Lock size={20} className="opacity-60" />}
                                            </div>
                                            <div className={`text-xs font-bold ${status.color}`}>{status.label}</div>
                                        </div>
                                    </div>

                                    {/* Description - Full Width */}
                                    <p className="text-indigo-200/80 text-sm italic">{metric.description}</p>

                                    {/* Progress Bar - Only visible if paid */}
                                    {isPaid && (
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
                                            <div
                                                className={`h-full rounded-full ${getColor(metric.score, metric.isGood)} transition-all duration-1000`}
                                                style={{ width: `${metric.score}%` }}
                                            ></div>
                                        </div>
                                    )}

                                    {/* Spectrum Explanation */}
                                    <div className="space-y-2 text-xs">
                                        <div className="flex gap-2">
                                            <span className="text-red-400 font-bold shrink-0">LOW:</span>
                                            <span className="text-indigo-200/70">{metric.lowMeaning}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-green-400 font-bold shrink-0">HIGH:</span>
                                            <span className="text-indigo-200/70">{metric.highMeaning}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Unlock Overlay for Non-Paid Users */}
                    {!isPaid && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm z-10">
                            <div className="max-w-lg mx-auto px-4 md:px-6 text-center space-y-4">
                                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400/30 rounded-2xl p-6 md:p-8 space-y-4">
                                    <Lock size={48} className="mx-auto text-indigo-300" />
                                    <h3 className="text-2xl font-black text-white">
                                        Unlock Your Complete MRI Scan
                                    </h3>
                                    <p className="text-indigo-100 text-sm leading-relaxed">
                                        See your scores for: Repair Efficiency, Betrayal Vulnerability, Erotic Death Spiral, CEO vs Intern, Soulmate Sync, and 7 more clinical markers
                                    </p>

                                    <div className="text-left space-y-2 pt-4">
                                        <p className="text-indigo-200 font-bold text-sm mb-3">🔓 WHAT YOU'LL GET:</p>
                                        <div className="space-y-2 text-sm text-indigo-100">
                                            <div className="flex gap-2 items-start">
                                                <span className="text-green-400 shrink-0">✓</span>
                                                <span>Your exact scores on all 12 "vital signs"</span>
                                            </div>
                                            <div className="flex gap-2 items-start">
                                                <span className="text-green-400 shrink-0">✓</span>
                                                <span>What each score means for your relationship's future</span>
                                            </div>
                                            <div className="flex gap-2 items-start">
                                                <span className="text-green-400 shrink-0">✓</span>
                                                <span>Which metrics are in the "danger zone" and why</span>
                                            </div>
                                            <div className="flex gap-2 items-start">
                                                <span className="text-green-400 shrink-0">✓</span>
                                                <span>The hidden connections between your scores</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUnlock}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                                    >
                                        UNLOCK YOUR PERSONALIZED REPORT
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

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
                                        <span className="text-2xl shrink-0">✓</span>
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">WHY it's happening</h3>
                                            <p className="text-indigo-200 text-sm">The hidden pattern with a clinical name</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl shrink-0">✓</span>
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">HOW to fix it</h3>
                                            <p className="text-indigo-200 text-sm">Exact scripts and actionable steps</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl shrink-0">✓</span>
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">WHEN it will break</h3>
                                            <p className="text-indigo-200 text-sm">5-year trajectory if nothing changes</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl shrink-0">✓</span>
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">WHETHER it's worth saving</h3>
                                            <p className="text-indigo-200 text-sm">Clinical prognosis and honest assessment</p>
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
                                <p className="text-indigo-300 text-sm mt-4">30-Day Money Back Guarantee • Secure SSL Payment</p>
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
            {!isPaid && (
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
                                UNLOCK NOW
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onCheckout={handleCheckout}
                isLoading={isCheckoutLoading}
            />
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
    unlockCopy // NEW: custom unlock copy per card
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
            if (score >= 70) return "High";
            if (score >= 40) return "Medium";
            return "Low";
        } else {
            // For bad metrics: high score = critical
            if (score >= 70) return "Critical";
            if (score >= 40) return "Caution";
            return "Healthy";
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* HEADER SECTION */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex gap-4 items-start">
                    <div className="bg-primary p-3 rounded-xl text-primary-foreground shrink-0">
                        {React.cloneElement(icon, { size: 24 })}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
                    </div>
                </div>

                {/* MRI METRIC - FREE */}
                {metricName && metricScore !== undefined && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{metricName}</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                                {Math.round(metricScore)}% <span className="text-xs text-slate-500">({getMetricStatus(metricScore, isGoodMetric)})</span>
                            </span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${getMetricColor(metricScore, isGoodMetric)} transition-all duration-1000`} style={{ width: `${metricScore}%` }}></div>
                        </div>
                    </div>
                )}

                {/* STATUS BADGE */}
                <div className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {status}
                </div>
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
                    <div className="flex gap-2 items-start">
                        <div className="text-indigo-500 mt-0.5 shrink-0">
                            <TrendingUp size={16} />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                            {metricInsight}
                        </p>
                    </div>
                )}
            </div>

            {/* BLURRED PAID PREVIEW - Always show if blurredText exists and user hasn't paid */}
            {blurredText && !visible && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="relative cursor-pointer group" onClick={onUnlock}>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed blur-[6px] opacity-60 select-none transition group-hover:blur-[4px]">
                            {blurredText}
                        </p>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-lg group-hover:scale-105 transition-transform">
                                <Lock size={14} /> Unlock Your Personalized Report
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PAID CONTENT SECTION */}
            {visible && (deepDive || specificItems?.length > 0 || impactText) && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 space-y-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                        <Lock size={12} /> Full Analysis
                    </div>

                    {/* Deep Dive */}
                    {deepDive && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">The Complete Pattern</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {deepDive}
                            </p>
                        </div>
                    )}

                    {/* Specific Items (Triggers/Blockers) */}
                    {specificItems && specificItems.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                {specificItemsLabel || "Specific Triggers"}
                            </h4>
                            <ul className="space-y-2">
                                {specificItems.map((item: string, idx: number) => (
                                    <li key={idx} className="flex gap-2 items-start text-sm text-slate-600 dark:text-slate-400">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Impact on Other Dimensions */}
                    {impactText && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                <TrendingUp size={14} /> How This Affects Other Areas
                            </h4>
                            <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">
                                {impactText}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* UNLOCK CTA (for non-paid users) - Always show if not paid, even while loading */}
            {!visible && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 space-y-4">
                    <div className="text-center space-y-3">
                        <Lock size={32} className="mx-auto text-indigo-600 dark:text-indigo-400" />
                        <p className="text-base text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                            {unlockCopy || "You'll discover what's really causing this, the specific triggers that set it off, and how it's affecting everything else in your relationship"}
                        </p>
                    </div>
                    <button
                        onClick={onUnlock}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl group"
                    >
                        UNLOCK YOUR PERSONALIZED REPORT
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
