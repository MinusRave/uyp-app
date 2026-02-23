import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, CheckCircle, AlertTriangle, TrendingUp, Shield, Heart, BadgeCheck, Compass, Zap, X, Activity, ChevronDown, Check, Eye, Microscope, ListChecks, ShieldAlert, Clock, MessageCircle, Brain, Quote, Star, Play, TrendingDown, Battery, Thermometer, FileWarning, BookOpen, Users, FileText, ShieldCheck, Info, ChevronUp, Link, Repeat, Ghost } from "lucide-react";
import { useQuery, generateQuickOverview, generateFullReport, createCheckoutSession, getTestSession, getSystemConfig, captureLead } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";

import { trackPixelEvent } from '../analytics/pixel';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay, FaGooglePay } from "react-icons/fa";

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

// 1. HERO SECTION COMPONENT (Refactored "Value First")
const HeroSection = ({
    badge,
    onUnlock,
    quickOverview,
    narcissismAnalysis,
    advancedMetrics,
    session
}: {
    badge: string,
    onUnlock: (location: string) => void,
    quickOverview?: QuickOverviewData | null,
    narcissismAnalysis?: any,
    advancedMetrics?: any,
    session?: any
}) => {
    // Determine Risk Level & Sustainability
    const isHighRisk = narcissismAnalysis?.risk_level === "High" || narcissismAnalysis?.risk_level === "Severe";
    const isSevere = narcissismAnalysis?.risk_level === "Severe";

    // Risk Labeling
    const riskLabel = isSevere ? "CRITICAL TOXICITY DETECTED" : isHighRisk ? "High Risk Pattern" : "Analysis Complete";
    const riskColor = isSevere ? "text-red-600 bg-red-50 border-red-200 animate-pulse" : isHighRisk ? "text-orange-600 bg-orange-50 border-orange-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";

    // Dynamic Background
    const bgGradient = isHighRisk
        ? "from-orange-500/10 via-background to-background"
        : "from-primary/5 via-background to-background";

    // CORE DATA (UNLOCKED)
    const diagnosis = quickOverview?.pulse?.primary_diagnosis || "The Pursuer-Withdrawer Cycle";
    const patternDescription = "One partner pushes for connection (often feeling anxious) while the other pulls away to protect themselves (often feeling overwhelmed). This creates a spiral of increasing conflict and distance.";

    // FORECAST DATA (BLURRED/LOCKED)
    const sustainabilityScore = advancedMetrics?.sustainability_score || 45;
    const sustainabilityLabel = sustainabilityScore < 50 ? "Critical" : sustainabilityScore < 75 ? "At Risk" : "Stable";
    const sustainabilityColor = sustainabilityScore < 50 ? "text-red-500" : sustainabilityScore < 75 ? "text-orange-500" : "text-green-500";
    const sustainabilityWidth = `${sustainabilityScore}%`;

    // Dynamic Forecast Text
    let forecastText = quickOverview?.forecast?.short_term || "High probability of emotional detachment if intervention does not occur within 6 months...";
    let forecastLabel = "6-Month Forecast";

    // Override if High Toxicity Detected (Value-First: Truth bomb)
    if (isHighRisk) {
        forecastLabel = "Projected Trajectory: The Cycle Escalates";
        forecastText = `With a toxicity score of ${narcissismAnalysis?.relationship_health?.toxicity_score}/100, the current pattern of '${diagnosis}' typically evolves into emotional burnout or volatile separation within 3-6 months without a pattern-break.`;
    }

    // Intelligent Headline Logic
    const isHighConflict = badge.toLowerCase().includes("gridlock") || badge.toLowerCase().includes("pursuer") || badge.toLowerCase().includes("volatile") || badge.toLowerCase().includes("chaos");

    return (
        <header className="bg-background text-foreground pt-8 pb-16 px-6 relative overflow-hidden border-b border-border/40">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} -z-10`} />

            <div className="max-w-4xl mx-auto text-center space-y-6">

                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${riskColor} mb-4`}>
                    {isSevere ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                    {riskLabel}
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4">
                    {isHighRisk ? (
                        <>
                            Your relationship is displaying clear signs of <span className="text-primary underline decoration-wavy">toxic interaction</span>.
                        </>
                    ) : isHighConflict ? (
                        <>
                            You aren't just fighting. You're trapped in the <span className="text-primary">High-Conflict</span> loop.
                            <div className="text-lg md:text-xl font-medium text-muted-foreground mt-4 leading-relaxed">
                                Your answers confirm it: the arguments are escalating, the resentment is building, and the cycle isn't breaking itself.
                            </div>
                        </>
                    ) : (
                        <>
                            You aren't fighting. You're fading into the <span className="text-primary">Silent Drift</span>.
                            <div className="text-lg md:text-xl font-medium text-muted-foreground mt-4 leading-relaxed">
                                Based on your data, the emotional distance between you is widening. This is statistically the hardest pattern to reverse once the apathy sets in.
                            </div>
                        </>
                    )}
                </h1>

                {/* VISUAL RISK DASHBOARD (High Risk OR Red Flags) - Matches Email Gate */}
                {(isHighRisk || (narcissismAnalysis?.relationship_health?.red_flags?.length || 0) > 0) && (
                    <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        {isHighRisk ? (
                            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30 p-4 rounded-xl shadow-sm">
                                <p className="text-xs font-bold text-red-600/70 uppercase tracking-wider mb-1">Toxicity Score</p>
                                <div className="text-3xl font-black text-red-600">
                                    {narcissismAnalysis?.relationship_health?.toxicity_score || "High"}<span className="text-lg text-red-400 font-bold">/100</span>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-xs font-bold text-red-500 mt-1">
                                    <AlertTriangle size={12} fill="currentColor" /> Critical Level
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-100 dark:border-yellow-900/30 p-4 rounded-xl shadow-sm">
                                <p className="text-xs font-bold text-yellow-700/70 dark:text-yellow-600/70 uppercase tracking-wider mb-1">Toxicity Score</p>
                                <div className="text-3xl font-black text-yellow-600">
                                    {narcissismAnalysis?.relationship_health?.toxicity_score || "Moderate"}
                                    <span className="text-lg text-yellow-500 font-bold">/100</span>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-xs font-bold text-yellow-600 mt-1">
                                    <AlertTriangle size={12} fill="currentColor" className="text-yellow-500" /> Elevated Risk
                                </div>
                            </div>
                        )}

                        <div className="bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-100 dark:border-orange-900/30 p-4 rounded-xl shadow-sm">
                            <p className="text-xs font-bold text-orange-600/70 uppercase tracking-wider mb-1">Red Flags</p>
                            <div className="text-3xl font-black text-orange-600">
                                {narcissismAnalysis?.relationship_health?.red_flags?.length || "0"} <span className="text-lg text-orange-400 font-bold">Detected</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-xs font-bold text-orange-500 mt-1">
                                <ShieldAlert size={12} /> Action Required
                            </div>
                        </div>
                    </div>
                )}

                {/* Personalized Generation Anchor */}
                <div className="max-w-xl mx-auto mb-8 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-4 rounded-xl flex items-center gap-3">
                    <div className="shrink-0 relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                        <div className="relative h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        <strong className="font-bold">Your report is already generated.</strong> 847 words written specifically about your relationship dynamics.
                    </p>
                </div>

                {/* Dimensions Scores (Show Numbers, Block Meaning) */}
                {(session?.advancedMetrics as any)?.dimensions && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                        {['communication', 'security', 'erotic', 'balance'].map((dimKey, idx) => {
                            const score = (session?.advancedMetrics as any)?.dimensions?.[dimKey]?.score || 0;
                            const dimNames: Record<string, string> = { communication: "Communication", security: "Trust & Safety", erotic: "Intimacy", balance: "Fairness" };
                            return (
                                <div key={idx} className="bg-card border border-border/50 p-4 rounded-xl text-center shadow-sm relative overflow-hidden group">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{dimNames[dimKey]}</h4>
                                    <div className={`text-3xl font-black mb-2 ${score < 40 ? 'text-red-500' : score < 70 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                        {score}<span className="text-sm opacity-50">/100</span>
                                    </div>
                                    <div className="bg-muted p-2 rounded flex items-center justify-center gap-1">
                                        <Lock size={10} className="text-muted-foreground" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Meaning Locked</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Diagnosis Card (PARTIAL REVEAL / BLURRED) */}
                <div className="bg-card border-2 border-primary/20 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mb-8 relative overflow-hidden group cursor-pointer" onClick={() => onUnlock('diagnosis_lock')}>
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Your Pattern</p>
                    <h2 className="text-3xl font-black text-primary mb-6">"{diagnosis}"</h2>

                    {/* Blurred Body */}
                    <div className="relative">
                        <div className="filter blur-md opacity-40 select-none">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                This relationship dynamic is characterized by a cyclical pursuit and withdrawal interaction pattern. It usually forms when one partner feels unheard or unappreciated, while the other feels constantly pressured or criticized, leading to a predictable sequence of conflict that rarely resolves the underlying core issues...
                            </p>
                        </div>
                        {/* Lock Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[1px]">
                            <div className="bg-background/95 border border-primary/20 shadow-lg px-6 py-4 rounded-xl text-center transform group-hover:scale-105 transition-transform">
                                <Lock className="mx-auto text-primary mb-2 h-6 w-6" />
                                <p className="text-sm font-bold text-foreground">Why this pattern forms and the exact cycle you're stuck in — unlocked in your report</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THE BLURRED TRIGGERS */}
                <div className="max-w-2xl mx-auto mb-16 mt-8">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-foreground">We identified 3 specific conflict triggers in your relationship.</h3>
                    </div>
                    <div className="space-y-3 bg-secondary/10 border border-border/50 p-6 rounded-2xl relative">
                        {/* Redacted lines */}
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center gap-4">
                                <div className="shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{num}</div>
                                <div className="h-6 bg-foreground/90 rounded-sm w-full animate-pulse-slow max-w-sm" style={{ width: `${Math.random() * 40 + 50}%` }}></div>
                            </div>
                        ))}
                        {/* Overlay CTA */}
                        <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 justify-center text-primary font-bold text-sm">
                            <Lock size={14} /> Your exact de-escalation scripts for each — Chapter 8
                        </div>
                    </div>
                </div>

                {/* Locked Forecast Section */}
                <div className="max-w-xl mx-auto relative group">
                    {/* Blurred Content */}
                    <div className="filter blur-sm select-none opacity-50 transition-all duration-500">
                        <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-4 text-left">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm">Sustainability Score</span>
                                <span className={`font-bold ${sustainabilityColor}`}>{sustainabilityLabel}</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: sustainabilityWidth }}></div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">{forecastLabel}</p>
                                <p className="text-sm text-foreground">{forecastText}</p>
                                <p className="text-sm text-foreground my-2">Without intervention, the pattern will evolve into...</p>
                            </div>
                            <div className="p-3 bg-indigo-50 text-indigo-900 rounded-lg">
                                <p className="font-bold text-sm">Recommended Action Plan available.</p>
                            </div>
                        </div>
                    </div>

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[1px]">
                        <div className="bg-background/95 border border-red-500/20 shadow-2xl p-6 rounded-2xl text-center max-w-sm mx-4 transform hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => onUnlock('hero_lock')}>
                            <Lock className="mx-auto text-primary mb-3 h-8 w-8" />
                            <h3 className="font-bold text-lg text-foreground mb-1 uppercase tracking-wide text-red-500">Warning: Forecast Locked</h3>
                            <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">
                                Our algorithm has predicted where this trajectory leads in 6 months. Unlock your <strong>Clinical Report</strong> to view your risk forecast and the exact protocols to begin de-escalation today.
                            </p>
                            <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-3 px-6 rounded-full w-full shadow-lg">
                                Unlock My Analysis Now &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-text below card */}
                <p className="text-sm text-muted-foreground max-w-lg mx-auto pt-4 leading-relaxed">
                    <span className="text-foreground font-bold">This is a turning point.</span> The data proves your relationship dynamics aren't just random. They are deeply predictable, which means they are solvable.
                </p>

            </div>
        </header>
    );
};


// 2. MIRROR SECTION (Identification)
const MirrorSection = ({ narcissismAnalysis, badge }: { narcissismAnalysis?: any, badge?: string }) => {
    // Determine Risk & Pattern Type
    const isHighRisk = narcissismAnalysis?.risk_level === "High" || narcissismAnalysis?.risk_level === "Severe";
    const isHighConflict = badge?.toLowerCase().includes("gridlock") || badge?.toLowerCase().includes("pursuer") || badge?.toLowerCase().includes("volatile") || badge?.toLowerCase().includes("chaos");

    // 1. Fallback / Low Risk Symptoms (Silent Drift)
    const genericSymptoms = [
        {
            title: "The Logistical Truce",
            desc: "Your communications are entirely about groceries, schedules, and kids. You run a household together flawlessly, but the thought of having a deep, vulnerable conversation feels exhausting."
        },
        {
            title: "The Intimacy Void",
            desc: "It's not just a physical disconnect. It's the profound loneliness of sitting right next to them on the couch and feeling like you're oceans apart."
        },
        {
            title: "The Eggshell Silence",
            desc: "You've learned exactly what topics not to bring up. You bite your tongue to keep the peace, but that unsaid resentment is quietly killing your attraction to them."
        },
        {
            title: "The Boredom Guilt",
            desc: "You catch yourself feeling suffocated or bored, and then immediately feel guilty because 'nothing is actually wrong.' But a lack of conflict is not the same as connection."
        }
    ];

    // 2. Use Dynamic Data if Available (High Risk Priority)
    let displaySymptoms = genericSymptoms;
    let sectionTitle = "We Detect the 'Silent Drift'";
    let sectionDesc = "Your answers reveal a pattern of gradual emotional starvation. You aren't fighting—you're fading.";

    // High Conflict Override (If not toxic but volatile)
    if (isHighConflict && !isHighRisk) {
        sectionTitle = "We Detected a Cyclic Conflict Pattern";
        sectionDesc = "You aren't drifting apart quietly—you are caught in a loop. The conflict has become your main form of connection.";
        displaySymptoms = [
            {
                title: "The Scripted Fight",
                desc: "You already know how the fight will go before it starts. The topic changes, but the dance is the same: one pursues, the other withdraws. Nothing ever gets resolved."
            },
            {
                title: "The Vault of Past Sins",
                desc: "During an argument, things from 6 months ago are weaponized. Neither of you feels truly forgiven, so you both stay armed, defensive, and ready for war."
            },
            {
                title: "The Exhaustion Loop",
                desc: "You argue over something tiny, it escalates out of control, you both withdraw to lick your wounds, and then you sweep it under the rug until the next time."
            },
            {
                title: "The Competitor Trap",
                desc: "Instead of being teammates attacking a problem, you've become competitors. Every disagreement turns into a zero-sum game of who is 'right' and who is 'wrong'."
            }
        ];
    }


    if (isHighRisk) {
        const flagCount = narcissismAnalysis?.relationship_health?.red_flags?.length || "Multiple";
        sectionTitle = `We Detected ${flagCount} Critical Red Flags`;
        sectionDesc = "Your unique answers align with a specific profile of emotional control and toxicity. You reported:";

        // Map detected traits to symptoms layout
        const traits = narcissismAnalysis?.partner_analysis?.traits_detected || [];
        const redFlags = narcissismAnalysis?.relationship_health?.red_flags || [];

        if (traits.length > 0) {
            displaySymptoms = [
                ...traits.slice(0, 3).map((trait: string) => ({
                    title: `Pattern: ${trait}`,
                    desc: "You indicated specific behaviors associated with this trait. This is not 'normal conflict'—it is a structural control dynamic."
                })),
                ...redFlags.slice(0, 2).map((flag: string) => ({
                    title: "Critical Warning Sign",
                    desc: flag
                }))
            ];
        }
    }

    return (
        <section className="py-24 px-6 bg-muted/30 border-y border-border/50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                        Clinical Observation
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                        {sectionTitle}
                    </h2>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        {sectionDesc}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {displaySymptoms.map((symptom, idx) => (
                        <div key={idx} className="bg-card p-8 rounded-2xl shadow-sm border border-border/60 relative overflow-hidden group hover:border-primary/40 hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>
                            <h3 className="font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                                {narcissismAnalysis?.risk_level === "High" || narcissismAnalysis?.risk_level === "Severe" ?
                                    <AlertTriangle className="text-red-500 shrink-0" size={20} /> :
                                    <Activity className="text-primary shrink-0" size={20} />
                                }
                                {symptom.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-[15px]">
                                {symptom.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* TOXICITY ASSESSMENT CALLOUT */}
                {(narcissismAnalysis?.risk_level === "High" || narcissismAnalysis?.risk_level === "Severe") && (
                    <div className="mt-12 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-6 md:p-8 rounded-2xl shadow-sm text-center">
                        <h4 className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400 font-black text-xl mb-3">
                            <ShieldAlert size={24} /> Use Caution
                        </h4>
                        <p className="text-foreground text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                            Your <strong>Toxicity Score is {narcissismAnalysis?.relationship_health?.toxicity_score}/100</strong>.
                            This level indicates a cycle that cannot be fixed by "trying harder" alone.
                            The full report includes a safety plan and specific "Grey Rock" communication scripts.
                        </p>
                    </div>
                )}

                {/* NORMAL/CONFLICT Assessment Callout */}
                {!(narcissismAnalysis?.risk_level === "High" || narcissismAnalysis?.risk_level === "Severe") && (
                    <div className="mt-12 bg-primary/5 border border-primary/20 p-8 rounded-2xl shadow-sm text-center max-w-2xl mx-auto">
                        <p className="text-foreground font-medium text-lg leading-relaxed">
                            <strong className="text-primary text-xl block mb-2">You're not imagining it.</strong>
                            Your relationship HAS a pattern. And that pattern has a name, a structure, and a predicted trajectory. The problem isn't that you're broken—it's that you're stuck in a system you can't see.
                        </p>
                    </div>
                )}
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
            value: addOrderBump ? 59 : 47,
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


            <HeroSection
                badge={badge}
                onUnlock={handleScrollToOffer}
                quickOverview={quickOverview}
                narcissismAnalysis={session?.narcissismAnalysis}
                advancedMetrics={session?.advancedMetrics}
                session={session}
            />

            <MirrorSection narcissismAnalysis={session?.narcissismAnalysis} badge={quickOverview?.hero?.result_badge} />

            {/* TESTIMONIAL A: LAURA (Relatability) */}
            <div className="bg-secondary/5 border-y border-border py-12 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="flex justify-center gap-1 text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-xl italic font-serif text-muted-foreground mb-6 leading-relaxed">
                        "I read this thing crying because finally someone put into words what I've been feeling for years and couldn't explain. idk if we'll stay together but at least now I KNOW I'm not crazy"
                    </p>
                    <div className="font-bold text-foreground">â€” Laura, 34, Chicago</div>
                </div>
            </div>

            {/* 2.5 SILENT DIVORCE WARNING (Urgency Injection) */}
            {
                (session?.advancedMetrics as any)?.silent_divorce_risk > 70 && (
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
                )
            }

            {/* 3. COST OF INACTION (The Forecast) */}
            {/* 2.7 CLINICAL WARNING (High Impact Full Width Band) */}
            <section className={`py-16 px-6 relative overflow-hidden border-y border-border/50 ${((session?.narcissismAnalysis as any)?.risk_level === "High" || (session?.narcissismAnalysis as any)?.risk_level === "Severe") ? "bg-red-50 dark:bg-red-950/20" : "bg-orange-50 dark:bg-orange-950/20"}`}>
                <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
                    {
                        (session?.narcissismAnalysis as any)?.risk_level === "High" || (session?.narcissismAnalysis as any)?.risk_level === "Severe" ? (
                            <>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-bold uppercase tracking-widest text-sm border border-red-200 dark:border-red-800">
                                    <AlertTriangle size={18} />
                                    Accelerated Decay Detected
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-red-950 dark:text-red-50 leading-tight">
                                    This Isn't Just a Drift.<br /><span className="text-red-600 dark:text-red-500">It's a Structural Collapse.</span>
                                </h2>
                                <p className="text-xl text-red-800/80 dark:text-red-200/80 max-w-2xl mx-auto leading-relaxed">
                                    Based on <strong>{(session?.narcissismAnalysis as any)?.relationship_health?.red_flags?.length} clinical red flags</strong>, your relationship is deteriorating 3x faster than average. Without immediate intervention, the cycle will escalate.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-bold uppercase tracking-widest text-sm border border-orange-200 dark:border-orange-800">
                                    <TrendingDown size={18} />
                                    Risk of "Grey Divorce"
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-orange-950 dark:text-orange-50 leading-tight">
                                    Patterns Do Not Fix Themselves.<br /><span className="text-orange-600 dark:text-orange-500">They Compound.</span>
                                </h2>
                                <p className="text-xl text-orange-800/80 dark:text-orange-200/80 max-w-2xl mx-auto leading-relaxed">
                                    Couples with this profile report ~40% less intimacy year-over-year. You are currently on track for a "convenience marriage" that quietly ends when the kids leave.
                                </p>
                            </>
                        )
                    }
                </div>
            </section>

            {/* 3. COST OF INACTION (The Forecast) */}
            <section className="py-24 px-6 bg-card border-b border-border/50">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                            Clinical Trajectory
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Where This Leads in 5 Years</h2>
                        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
                            Without intervention, here are the 3 statistical trajectories for your specific relationship profile based on current data:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Path 1: Dynamic based on Risk */}
                        {(session?.narcissismAnalysis as any)?.risk_level === "High" || (session?.narcissismAnalysis as any)?.risk_level === "Severe" ? (
                            <div className="p-8 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/60 rounded-xl flex items-center justify-center mb-6 text-red-600 dark:text-red-400">
                                    <Link size={24} />
                                </div>
                                <h3 className="font-bold text-2xl mb-3 text-foreground">The Trauma Bond</h3>
                                <p className="text-[15px] text-muted-foreground leading-relaxed font-medium">
                                    You leave and return, over and over. Each cycle erodes more of your self-worth until you feel unable to function without them. It becomes an addiction, not a relationship.
                                </p>
                            </div>
                        ) : (
                            <div className="p-8 rounded-2xl bg-secondary/10 border border-border/60 relative overflow-hidden group hover:border-primary/40 hover:shadow-md transition-all duration-300">
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30 group-hover:bg-primary transition-colors duration-300"></div>
                                <div className="h-12 w-12 bg-secondary/50 rounded-xl flex items-center justify-center mb-6 text-foreground">
                                    <Repeat size={24} />
                                </div>
                                <h3 className="font-bold text-2xl mb-3 text-foreground">The Roommate Trap</h3>
                                <p className="text-[15px] text-muted-foreground leading-relaxed">
                                    It's safe, but it's dead. You stay together for convenience or the kids, but the passion is gone forever. You become excellent co-managers of a household, but strangers in bed.
                                </p>
                            </div>
                        )}

                        {/* Path 2 */}
                        <div className="p-8 rounded-2xl bg-secondary/10 border border-border/60 relative overflow-hidden group hover:border-orange-400 hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-orange-400/30 group-hover:bg-orange-400 transition-colors duration-300"></div>
                            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-950/40 rounded-xl flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-bold text-2xl mb-3 text-foreground">The Explosion</h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                The quiet resentment finally boils over. A small fight turns into "I want a divorce." It's messy, expensive, and leaves you wondering why you didn't act sooner.
                            </p>
                        </div>

                        {/* Path 3 */}
                        <div className="p-8 rounded-2xl bg-secondary/10 border border-border/60 relative overflow-hidden group hover:border-gray-500 hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gray-400/30 group-hover:bg-gray-500 transition-colors duration-300"></div>
                            <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 text-gray-600 dark:text-gray-400">
                                <Ghost size={24} />
                            </div>
                            <h3 className="font-bold text-2xl mb-3 text-foreground">The Fade</h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                You lose yourself. You stop fighting because you've stopped caring. You become a shadow of who you used to be, slowly sacrificing your happiness to just keep the peace.
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
                            Love is not enough
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Stop Guessing. Start Knowing.</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The "Relationship User Manual" you wish you had 5 years ago.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Visual Representation of Report (Abstract) */}
                        <div className="relative aspect-square md:aspect-[3/4] max-w-sm mx-auto w-full bg-primary/90 rounded-2xl shadow-2xl p-6 md:p-8 transform md:rotate-[-2deg] border border-primary/50 overflow-hidden group hover:rotate-0 transition-all duration-500">
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
                                <div className="space-y-3 pt-4 md:pt-8 opacity-80">
                                    <div className="flex gap-3 items-center"><div className="w-6 h-6 shrink-0 rounded-full border border-white/50 flex items-center justify-center text-xs">1</div><div className="h-2 w-full bg-gradient-to-r from-white/40 to-transparent rounded"></div></div>
                                    <div className="flex gap-3 items-center"><div className="w-6 h-6 shrink-0 rounded-full border border-white/50 flex items-center justify-center text-xs">2</div><div className="h-2 w-3/4 bg-gradient-to-r from-white/40 to-transparent rounded"></div></div>
                                    <div className="flex gap-3 items-center"><div className="w-6 h-6 shrink-0 rounded-full border border-white/50 flex items-center justify-center text-xs">3</div><div className="h-2 w-5/6 bg-gradient-to-r from-white/40 to-transparent rounded"></div></div>
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
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">4. Word-For-Word Custom Scripts</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Stop guessing what to say. We give you <strong>exact phrases</strong> mathematically designed for your partner's specific psychological profile to instantly de-escalate fights and bypass their defenses.
                                    </p>
                                </div>
                            </div>

                            {/* Component 5 (Biomarkers) */}
                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">5. The 12-Point Clinical Biomarker Dashboard</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Unlock your exact clinical scores across 12 hidden drivers of relationship decay, including: <em>The Erotic Death Spiral</em>, <em>CEO vs Intern Imbalance</em>, and <em>The Silent Divorce Risk</em>.
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
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Included For Free Today</span>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground">The Emergency Intervention Toolkit</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Therapists normally charge $200+/hr to teach these frameworks. You get the exact clinical PDF protocols included securely in your dashboard today.
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
                                    <span className="text-xs font-mono text-muted-foreground">Value: $47.00</span>
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
                                            If your Toxicity Score is 60+, you need to know if you're dealing with narcissism specificallyâ€”because the exit strategy is different. Covert narcissists are harder to detect (they play victim, use passive aggression).
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
                                    <span className="text-xs font-mono text-muted-foreground">Value: $47.00</span>
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
                                            If your Betrayal Vulnerability is 60%+, unmet needs are creating an opening for affairs. Emotional affairs are often MORE painful than physical onesâ€”they involve the heart, not just the body.
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
                                    <span className="text-xs font-mono text-muted-foreground">Value: $47.00</span>
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
                    <div className="flex justify-center gap-1 text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
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
                            <div className="flex justify-center gap-1 text-yellow-500 mb-4"> {/* Added missing stars for Alexis/Claire consistency if desired, or skip */}
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
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
                            <div className="flex justify-center gap-1 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
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

            {/* 6.2 A NOTE FROM THE AUTHORS */}
            <section className="bg-background py-24 px-6 border-b border-border/50">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="text-center mb-12">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">A Note From The Creators</h3>
                    </div>

                    <div className="space-y-6 text-xl md:text-2xl text-foreground font-medium leading-relaxed opacity-90">
                        <p>Maybe you feel like you're managing your partner instead of being with them.</p>
                        <p>Maybe you're questioning if it's toxic... or just complicated.</p>
                        <p>Or maybe nothing is "wrong" — and that's what scares you most.</p>
                    </div>

                    <div className="h-px w-24 bg-primary/20 mx-auto my-12 hidden md:block"></div>
                    <div className="h-px w-16 bg-primary/20 my-8 md:hidden"></div>

                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                        <p>We built this analysis for that in-between space.</p>
                        <p>The place where love exists — but something isn't working.</p>
                        <p>This isn't about blaming you. And it's not about labeling your partner.</p>
                        <p className="text-foreground font-bold">It's about giving you solid ground under your feet.</p>
                    </div>

                    <div className="bg-primary/5 p-8 rounded-2xl mt-12 border border-primary/20 text-center">
                        <p className="text-xl md:text-2xl font-serif italic text-primary font-medium leading-relaxed">
                            "Whatever is happening in your relationship, you deserve to see it clearly — before you decide what comes next."
                        </p>
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

                            {/* Streamlined Value Stack */}
                            <div className="max-w-xl mx-auto bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 mb-10 text-left">
                                <h3 className="font-black text-foreground mb-6 text-center text-xl uppercase tracking-wider">What You're Getting Securely Today</h3>
                                <ul className="space-y-5 text-sm md:text-base text-foreground mb-8">
                                    <li className="flex items-start gap-4">
                                        <CheckCircle className="text-primary shrink-0 mt-1" size={24} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-lg leading-tight">The Full Relationship Analysis</span>
                                                <div className="text-right">
                                                    <span className="text-sm line-through text-red-500 opacity-80 mr-2">$99.00</span>
                                                    <span className="font-bold text-lg">${import.meta.env.REACT_APP_REPORT_PRICE || "47.00"}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">Includes: Core Diagnosis, 5 Dimension Scores & Communication Breakdown</p>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-4 pt-5 border-t border-border/50">
                                        <CheckCircle className="text-green-500 shrink-0 mt-1" size={24} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-lg leading-tight">5-Year Trajectory Forecast</span>
                                                <div className="text-right">
                                                    <span className="text-sm line-through text-red-500 opacity-80 mr-2">$49.00</span>
                                                    <span className="font-bold text-green-600">Included</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-4 pt-5 border-t border-border/50 bg-red-50/50 dark:bg-red-950/10 -mx-4 px-4 py-4 rounded-lg border border-red-100/50 dark:border-red-900/30">
                                        <ShieldAlert className="text-red-500 shrink-0 mt-1" size={24} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-lg leading-tight text-red-700 dark:text-red-400">CRITICAL: Toxic & Narcissistic Screen</span>
                                                <div className="text-right">
                                                    <span className="text-sm line-through text-red-500 opacity-80 mr-2">$49.00</span>
                                                    <span className="font-bold text-red-600 dark:text-red-500 uppercase">Free</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">Includes: The Danger Score & Gaslighting Counter-Scripts</p>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-4 pt-5 border-t border-border/50">
                                        <CheckCircle className="text-green-500 shrink-0 mt-1" size={24} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-lg leading-tight">The Emergency Intervention Toolkit</span>
                                                <div className="text-right">
                                                    <span className="text-sm line-through text-red-500 opacity-80 mr-2">$126.00</span>
                                                    <span className="font-bold text-green-600">Included</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">Includes: 5 Premium Clinical PDF Guides</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="pt-6 border-t border-border flex justify-between items-center bg-secondary/10 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-5 rounded-b-2xl">
                                    <span className="font-black uppercase tracking-wider text-foreground text-lg">Total Real Value</span>
                                    <span className="text-2xl font-black text-foreground line-through decoration-red-500 opacity-70">$323.00</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <div className="space-y-4 text-center max-w-lg mx-auto">
                                    <p className="text-base font-medium text-foreground">
                                        You already know something is wrong. <span className="text-primary font-bold">That's why you took the test.</span>
                                    </p>
                                    <p className="text-base font-medium text-foreground pb-2">
                                        The pattern identified in your analysis doesn't wait. <span className="text-red-500 font-bold dark:text-red-400">Every day without clarity, the pattern gets stronger.</span>
                                    </p>

                                    <div className="pt-2 border-t border-border mt-4">
                                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-2 text-center rounded text-sm font-medium text-green-800 dark:text-green-300 mb-4">
                                            <strong>Your report is already generated.</strong> 847 words written specifically about your relationship dynamics.
                                        </div>
                                        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Price Today</p>
                                        <p className="text-6xl font-black text-primary">${import.meta.env.REACT_APP_REPORT_PRICE || "47.00"}</p>
                                    </div>
                                </div>

                                {/* ORDER BUMP */}
                                <div className="w-full bg-yellow-50 dark:bg-yellow-900/10 border-2 border-dashed border-yellow-400 p-4 rounded-xl text-left cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors mb-8" onClick={() => setAddOrderBump(!addOrderBump)}>
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 h-5 w-5 shrink-0 rounded border flex items-center justify-center transition-colors ${addOrderBump ? 'bg-primary border-primary text-white' : 'bg-white border-gray-400'}`}>
                                            {addOrderBump && <Check size={14} strokeWidth={4} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm leading-tight mb-2">
                                                YES! Add the <span className="text-primary">30-Day Reconnection Workbook</span> for just $12.
                                            </p>
                                            <p className="text-xs text-muted-foreground leading-relaxed mb-2 font-medium">
                                                The report tells you <em>what's wrong.</em> This daily workbook forces you to actually <em>fix it</em>.
                                            </p>
                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                <li className="flex items-start gap-2"><CheckCircle size={12} className="text-primary mt-0.5 shrink-0" /> <span className="leading-tight">Accountability: Just 5 minutes a day</span></li>
                                                <li className="flex items-start gap-2"><CheckCircle size={12} className="text-primary mt-0.5 shrink-0" /> <span className="leading-tight">Conversation practice templates</span></li>
                                            </ul>
                                            <div className="mt-3 inline-block bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                                Highly Recommended
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <button
                                onClick={() => handleCheckout('offer_cta')}
                                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold py-5 px-12 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 animate-pulse-slow"
                            >
                                {isCheckoutLoading ? "Processing..." : `Get Instant Access Now - $${addOrderBump ? 59 : 47}`} <ArrowRight size={24} />
                            </button>
                            <div className="flex items-center justify-center gap-4 mt-6 text-slate-400">
                                <FaCcVisa className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                <FaCcMastercard className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                <FaCcPaypal className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                <FaApplePay className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                <FaGooglePay className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">Secure One-Time Payment • Instant PDF Download</p>
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
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mb-3"
                    >
                        Get Your Report <ArrowRight size={20} />
                    </button>
                    <div className="flex items-center justify-center gap-3 text-slate-400">
                        <FaCcVisa className="h-6 w-auto opacity-80" />
                        <FaCcMastercard className="h-6 w-auto opacity-80" />
                        <FaCcPaypal className="h-6 w-auto opacity-80" />
                        <FaApplePay className="h-6 w-auto opacity-80" />
                        <FaGooglePay className="h-6 w-auto opacity-80" />
                    </div>
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
                                <td className="p-4"><span className="font-black text-2xl text-primary">$47</span></td>
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
            <div className="bg-background py-12 px-6 mb-12 rounded-2xl border border-border shadow-sm">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="flex justify-center gap-1 text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-xl italic font-serif text-muted-foreground mb-6 leading-relaxed">
                        "I cried a lot. For the first time someone said 'you are not the problem, you are in a pattern'. And this sentence freed me from 5 years of guilt. I don't know if we stay together but at least now I can breathe."
                    </p>
                    <div className="font-bold text-foreground">— Marta, 38, Paris</div>
                </div>
            </div>

            {/* FAQ */}
            < div className="max-w-3xl mx-auto space-y-8 mt-16" >
                <h3 className="text-2xl font-bold text-center mb-12 text-foreground">Common Questions & Concerns</h3>

                <div className="space-y-4">
                    {/* Q1 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"Can't I just figure this out on my own?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            You've been trying. That's why you took the test. The problem isn't intelligenceâ€”it's perspective. <strong>You can't read the label from inside the bottle.</strong> This analysis gives you the outside viewâ€”the clinical lens that cuts through emotions and shows you the STRUCTURE.
                        </p>
                    </div>

                    {/* Q2 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"What if my partner refuses to read it?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            <strong>47% of our users never show it to their partner.</strong> They use it to change their OWN behaviorâ€”which inevitably forces the dynamic to shift. You don't need their permission to understand the pattern.
                        </p>
                    </div>

                    {/* Q3 */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-lg text-foreground">"What if it tells me something I don't want to hear?"</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            Then you NEED to hear it. The worst thing isn't a painful truthâ€”it's wasting 5 more years on a comfortable lie. Look: You already KNOW something is wrong. That's why you took the test. The analysis doesn't create problemsâ€”it NAMES them.
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
                            That's actually the most empowering discovery possible. Because you can control YOUR behavior. Most people discover they're BOTH part of the problemâ€”one pattern triggering another. That means you can BOTH fix it.
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
                    <p>Â© 2026 UnderstandYourPartner.com â€¢ All Rights Reserved</p>
                    <div className="flex justify-center gap-4">
                        <span className="cursor-pointer hover:text-white">Privacy Policy</span>
                        <span>â€¢</span>
                        <span className="cursor-pointer hover:text-white">Terms of Service</span>
                        <span>â€¢</span>
                        <span className="cursor-pointer hover:text-white">Contact Support</span>
                    </div>
                    <p className="max-w-xl mx-auto text-xs opacity-50 mt-6">
                        Disclaimer: This analysis is based on psychological frameworks (Gottman, Attachment Theory) but is not a substitute for professional clinical therapy. If you are in immediate danger, please contact local authorities.
                    </p>
                </div>
            </footer>



            <EmailCaptureModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSubmit={handleEmailSubmit}
                isSubmitting={isEmailSubmitting}
            />

        </div >
    );
}
