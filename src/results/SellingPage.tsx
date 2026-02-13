import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Activity, Star, CheckCircle } from "lucide-react";
import { useQuery, generateQuickOverview, generateFullReport, createCheckoutSession, getTestSession } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import Confetti from "react-confetti";
import { CheckoutModal } from './CheckoutModal';
import { trackPixelEvent } from '../analytics/pixel';
import { NarcissismSection } from "./sections/NarcissismSection";

// --- TYPES ---
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
        quote: "I did it alone after another fight where they shut themselves in the bedroom. When I read 'Pursuer-Shutdown Cycle' I had this lightbulb moment—I finally understood why it always ended the same way. I showed them the report a week later, when I was ready to talk without blame. Knowing WHAT was happening gave me the calm to approach it differently."
    },
    {
        name: "Mark",
        info: "41, married for 12 years",
        quote: "I didn't want it to sound like an accusation. When we went to therapy later, I brought the report and the therapist said 'usually it takes 4-5 sessions just to understand the pattern, you've already done the work'. Taking the test first saved money and gave me the right words."
    },
    {
        name: "David",
        info: "38, together for 10 years",
        quote: "We hadn't had sex in 8 months. I read the Dead Bedroom guide and realized we were both waiting to 'feel desire' instead of creating it. The sensate focus exercises felt awkward at first, but by week 6 we were actually connecting again. Not just physically—emotionally."
    },
    {
        name: "Alessa",
        info: "42, married for 15 years",
        quote: "The 'Manager-Employee dynamic' section pissed me off because it was EXACTLY us. I printed that page and left it where they'd see it. Two days later they said 'is this really how you feel?' We divided up the mental load that week. Three months later, I actually want them again."
    },
    {
        name: "James",
        info: "36, dated for 4 years",
        quote: "The Narcissist Detection guide scored my partner at 18/21. I'd been doubting myself for years. Seeing it laid out clinically—no emotion, just facts—gave me permission to leave. I'm out now and rebuilding."
    }
];

export default function SellingPage() {
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

    const handleUnlock = async () => {
        // Track unlock intent with AddToCart event
        trackPixelEvent('AddToCart', {
            content_name: 'Full Relationship Report + 5 Guides',
            content_category: 'Report',
            value: 47,
            currency: 'USD',
            content_ids: ['relationship_report_bundle'],
            content_type: 'product'
        });

        // Show modal
        setShowCheckoutModal(true);
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

    // Determine highest risk metric for "Your Biggest Vulnerability"
    const riskMetrics = [
        { name: "Betrayal Risk", value: metrics.betrayal_vulnerability || 0 },
        { name: "Intimacy Death Spiral", value: metrics.erotic_death_spiral || 0 },
        { name: "Silent Divorce Risk", value: metrics.silent_divorce_risk || 0 },
        { name: "Burnout Rate", value: metrics.nervous_system_load || 0 }
    ];
    const topMetric = riskMetrics.reduce((prev, current) => (prev.value > current.value) ? prev : current);

    // Derived content placeholders
    const conflictPattern = fullReport?.chapter2_communication?.repeat_loop?.[0] || "Pursuer-Withdrawer Cycle";
    const userProfile = (session.narcissismAnalysis as any)?.user_analysis?.likely_profile || "The Safety-Starved Partner";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24">
            {isPaid && <Confetti recycle={false} numberOfPieces={500} />}

            {/* 1. HERO SECTION */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-16 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                        ✨ Analysis Complete • Based on Your 30 Answers
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        "You Just Answered 30 Questions About Your Relationship. <br className="hidden md:block" />
                        <span className="text-indigo-600 dark:text-indigo-400">Now Discover What Your Answers Actually Mean."</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Your relationship has a pattern. A cycle. A hidden dynamic you can feel but can't name.
                        We've analyzed your responses against 12 psychological dimensions based on clinical frameworks.
                    </p>

                    <p className="font-bold text-slate-900 dark:text-white text-lg">
                        The diagnosis is ready. The question is: do you want to see it?
                    </p>

                    <div className="pt-4">
                        <button
                            onClick={handleUnlock}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-lg md:text-xl py-4 px-8 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
                        >
                            Get My Complete Analysis - $47 <Lock size={20} />
                        </button>
                        <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-4">
                            <span>✓ Instant Access</span>
                            <span>✓ 30-Day Money-Back Guarantee</span>
                            <span>🔒 Secure Checkout</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-6 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">✓ 52,847 Couples Analyzed</span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">✓ Based on Clinical Psychology</span>
                    </div>

                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 -mt-8 space-y-12 relative z-10">

                {/* 2. PERSONALIZED TEASER SECTION */}
                <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Based on your answers, we've identified your relationship's <span className="text-indigo-600">dominant pattern</span>.
                        </h2>

                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-indigo-500 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Your Relationship Status</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white">{badge}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Your Conflict Pattern</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white">{conflictPattern}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Your Biggest Vulnerability</div>
                                    <div className="text-xl font-black text-red-600 dark:text-red-400">
                                        {topMetric.name}: <span className="text-2xl">{Math.round(topMetric.value)}%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Your Role in This</div>
                                    <div className="text-xl font-black text-slate-900 dark:text-white">{userProfile}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                            <p className="font-bold text-lg text-slate-900 dark:text-white">
                                You felt something was wrong. Now you know WHAT it is.
                            </p>
                            <p>
                                But knowing the name of the problem isn't enough. You need to know:
                            </p>
                            <ul className="space-y-2 list-disc pl-5">
                                <li><strong>WHY</strong> this pattern started in the first place</li>
                                <li><strong>WHAT</strong> triggers it every single time</li>
                                <li><strong>WHERE</strong> it's taking you (6 months from now, 5 years from now)</li>
                                <li><strong>HOW</strong> to break the cycle before it breaks you</li>
                            </ul>
                            <p>That's what the complete analysis gives you.</p>
                        </div>
                    </div>
                </section>

                {/* 3. MIRROR EFFECT SECTION (Identification) */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white">"Does This Sound Familiar?"</h2>

                    <div className="grid gap-4">
                        {[
                            { title: "Am I the crazy one?", text: "They tell you you're too sensitive, that you're overreacting. But you KNOW something's wrong. You can feel it in your body—the tension, the walking on eggshells, the constant second-guessing." },
                            { title: "Why do they keep rejecting me?", text: "Every time you reach for connection—physical, emotional, any kind—they pull away. And every 'not tonight' or turned back feels like a rejection of YOU, not just the moment." },
                            { title: "Why do I have to do EVERYTHING?", text: "You're the one remembering appointments, planning life, carrying the mental load. You feel like their parent, not their partner. And you can't remember the last time they anticipated YOUR needs." },
                            { title: "Have we become roommates?", text: "You talk about groceries, bills, whose turn it is to take out the trash. But you haven't talked about YOUR RELATIONSHIP in months. You coordinate logistics. You don't connect." },
                            { title: "Is this fixable, or am I just delaying the inevitable?", text: "You don't know if you're fighting for something worth saving or just scared to let go. You're stuck between 'try harder' and 'give up.' And every day that passes without clarity feels like a day wasted." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4">
                                <div className="shrink-0 text-indigo-500 pt-1">
                                    <CheckCircle size={24} fill="currentColor" className="text-indigo-100 dark:text-indigo-900" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 italic">"{item.text}"</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-50 dark:bg-slate-800 p-8 rounded-2xl text-center space-y-4 border-2 border-indigo-100 dark:border-indigo-900/50">
                        <div>
                            <p className="font-black text-xl text-slate-900 dark:text-white">You're not imagining it.</p>
                            <p className="font-black text-xl text-slate-900 dark:text-white">Your relationship HAS a pattern.</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                            And that pattern has a name. A structure. A predictable trajectory.
                            The problem isn't that you're broken—it's that you're stuck in a SYSTEM.
                            Your complete analysis shows you EXACTLY how the cycle works, WHY repair attempts fail, and THE SPECIFIC TRIGGERS that activate it.
                        </p>
                    </div>
                </section>

                {/* 4. VALUE STACK - WHAT YOU GET */}
                <section className="space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                            Your Complete Relationship Analysis <br /> + 5 Essential Guides
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">Everything You Need to Understand Your Relationship—And What To Do Next</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        {/* COMPONENT 1: ANALYSIS */}
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl">📊</span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide">Component 1: YOUR PERSONALIZED RELATIONSHIP ANALYSIS</h3>
                            </div>

                            <div className="space-y-8">
                                <FeatureBlock
                                    title="The 5 Core Dimensions Analysis"
                                    desc="You'll FINALLY see which dimension is killing the others. (Spoiler: It's rarely the one you think.) The scores show you WHERE the real damage is happening."
                                />
                                <FeatureBlock
                                    title="Future Forecast (6-Month + 5-Year)"
                                    desc="A clinical prediction of where your relationship is headed if nothing changes. Know if you're on a path toward reconnection or slow erosion."
                                />
                                <FeatureBlock
                                    title="Narcissism & Toxicity Screen"
                                    desc="Abuse Risk Assessment. You'll know if you're walking on eggshells because of YOUR anxiety or because of THEIR manipulation."
                                />
                                <FeatureBlock
                                    title="The Complete Pattern Breakdown"
                                    desc="The step-by-step cycle of YOUR specific conflict pattern. Once you see the pattern, you can interrupt it. You're fighting the PATTERN, not the PERSON."
                                />
                                <FeatureBlock
                                    title="Specific Triggers & Scripts"
                                    desc="Concrete triggers extracted from your answers and word-for-word scripts to handle them. No more 'I don't know what to say.'"
                                />
                                <FeatureBlock
                                    title="The 12 Advanced 'Vital Signs'"
                                    desc="Deeper metrics like 'Erotic Death Spiral', 'Betrayal Vulnerability', and 'Silent Divorce Risk'. Diagnostic tools therapists charge HUGE sums to uncover."
                                />
                            </div>
                        </div>

                        {/* COMPONENT 2: GUIDES */}
                        <div className="p-8 bg-slate-50 dark:bg-slate-950/30">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl">📚</span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide">Component 2: THE 5 ESSENTIAL RELATIONSHIP GUIDES</h3>
                            </div>

                            <div className="space-y-6">
                                <GuideBlock
                                    number={1}
                                    title="The Covert Narcissist Detection Manual"
                                    subtitle="21 Red Flags You Can't Ignore"
                                    value="€19"
                                    desc="21-point checklist to identify narcissistic patterns. Shows you if that toxicity is NARCISSISM specifically—and what to do about it."
                                />
                                <GuideBlock
                                    number={2}
                                    title="The Dead Bedroom Revival Guide"
                                    subtitle="Why You Stopped Having Sex (And the 3-Phase Plan to Fix It)"
                                    value="€21"
                                    desc="A complete roadmap to rebuild sexual intimacy—even if it's been months. The EXACT protocol to fix the 'Intimacy Death Spiral'."
                                />
                                <GuideBlock
                                    number={3}
                                    title="The Emotional Affair Warning System"
                                    subtitle="19 Signs It's Already Started"
                                    value="€19"
                                    desc="Complete guide to recognizing and preventing emotional infidelity. Essential if your 'Betrayal Vulnerability' score is high."
                                />
                                <GuideBlock
                                    number={4}
                                    title="Should I Stay or Should I Go?"
                                    subtitle="The Clinical Decision Matrix (No More Guessing)"
                                    value="€17"
                                    desc="A logical, emotion-free framework for making THE hardest relationship decision. Includes the 90-Day Test."
                                />
                                <GuideBlock
                                    number={5}
                                    title="The Mental Load Equalizer"
                                    subtitle="How to Stop Being the Relationship Manager"
                                    value="€19"
                                    desc="How to rebalance the invisible labor that's destroying your connection and killing your desire. Fixes the 'Manager-Employee' dynamic."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. SUMMARY & CTA */}
                <section className="bg-indigo-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-6">Total Value: <span className="line-through text-indigo-300">€142</span> <span className="text-white ml-2">Today: $47</span></h2>
                        <div className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
                            You Save: $95 (67% OFF) • Instant Access • 30-Day Guarantee
                        </div>

                        <button
                            onClick={handleUnlock}
                            className="w-full md:w-auto bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xl py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto"
                        >
                            Get Complete Analysis + 5 Guides <ArrowRight size={24} />
                        </button>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(0,0,0,0)_60%)]"></div>
                    </div>
                </section>

                {/* 6. SOCIAL PROOF */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white">"What Others Discovered"</h2>
                    <div className="grid gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex gap-1 text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 italic mb-4">"{t.quote}"</p>
                                <div className="font-bold text-slate-900 dark:text-white text-sm">— {t.name}, <span className="font-normal text-slate-500">{t.info}</span></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. VALUE COMPARISON */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white">Why $47? (And Why It's Actually Worth $1,500+)</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="p-4 font-bold text-slate-900 dark:text-white">Option</th>
                                    <th className="p-4 font-bold text-slate-900 dark:text-white">Cost</th>
                                    <th className="p-4 font-bold text-slate-900 dark:text-white hidden md:table-cell">Time</th>
                                    <th className="p-4 font-bold text-slate-900 dark:text-white">Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr>
                                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">Couples Therapy</td>
                                    <td className="p-4 text-slate-500">$1,500+</td>
                                    <td className="p-4 text-slate-500 hidden md:table-cell">10 weeks</td>
                                    <td className="p-4 text-slate-500">Dependent on therapist</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">Self-Help Books</td>
                                    <td className="p-4 text-slate-500">$100+</td>
                                    <td className="p-4 text-slate-500 hidden md:table-cell">20+ hours</td>
                                    <td className="p-4 text-slate-500">Generic advice</td>
                                </tr>
                                <tr className="bg-indigo-50/50 dark:bg-indigo-900/10">
                                    <td className="p-4 font-black text-indigo-700 dark:text-indigo-400">This Complete Analysis</td>
                                    <td className="p-4 font-black text-indigo-700 dark:text-indigo-400">$47</td>
                                    <td className="p-4 font-black text-indigo-700 dark:text-indigo-400 hidden md:table-cell">Instant</td>
                                    <td className="p-4 font-black text-indigo-700 dark:text-indigo-400">Personalized to YOUR patterns</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center max-w-2xl mx-auto text-slate-600 dark:text-slate-400 italic">
                        "It's the roadmap therapists spend 4-5 sessions creating. For the price of a dinner you'll both scroll through on your phones."
                    </div>
                </section>

                {/* 8. FAQ */}
                <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FaqItem
                            q="Can't I just figure this out on my own?"
                            a="You've been trying. That's why you took the test. The problem isn't intelligence—it's perspective. You can't read the label from inside the bottle. This report gives you the clinical, objective view you need."
                        />
                        <FaqItem
                            q="Is my data safe?"
                            a="Yes. Your data is encrypted and anonymized. We use bank-level security for payment. We never share your individual answers with anyone—not even your partner, unless YOU choose to show them."
                        />
                        <FaqItem
                            q="What if it doesn't help?"
                            a="We offer a 30-day, no-questions-asked money-back guarantee. If you don't feel the analysis gave you clarity, just email us and we'll refund you immediately."
                        />
                    </div>
                </section>

            </main>

            {/* CHECKOUT MODAL */}
            {showCheckoutModal && (
                <CheckoutModal
                    isOpen={showCheckoutModal}
                    onClose={() => setShowCheckoutModal(false)}
                    onCheckout={handleCheckout}
                    isLoading={isCheckoutLoading}
                />
            )}
        </div>
    );
}

// --- SUBCOMPONENTS ---

function FeatureBlock({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="shrink-0 mt-1 text-indigo-600 dark:text-indigo-400">
                <CheckCircle size={20} />
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </div>
        </div>
    );
}

function GuideBlock({ number, title, subtitle, value, desc }: { number: number, title: string, subtitle: string, value: string, desc: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Guide #{number}</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">Value: {value}</span>
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h4>
            <p className="text-sm font-medium text-slate-500 mb-3">{subtitle}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
        </div>
    );
}

function FaqItem({ q, a }: { q: string, a: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">{q}</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{a}</p>
        </div>
    );
}
