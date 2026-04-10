import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Lock, CheckCircle, AlertTriangle, TrendingUp, Shield, Heart, BadgeCheck, Compass, Zap, X, Activity, ChevronDown, Check, Eye, Microscope, ListChecks, ShieldAlert, Clock, MessageCircle, Brain, Quote, Star, Play, TrendingDown, Battery, Thermometer, FileWarning, BookOpen, Users, FileText, ShieldCheck, Info, ChevronUp, Link, Repeat, Ghost } from "lucide-react";
import { useQuery, generateQuickOverview, generateFullReportV2, createCheckoutSession, getTestSession, getSystemConfig, deactivateSession } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";

import { trackPixelEvent } from '../analytics/pixel';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay, FaGooglePay } from "react-icons/fa";

// EmailCaptureModal removed — users always have email in new session model

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
    // ── DATA LAYER ──
    const scores = session?.scores as any;
    const metrics = session?.advancedMetrics as any;
    const narc = narcissismAnalysis;

    const isHighRisk = narc?.partner_analysis?.risk_level === "High" || narc?.partner_analysis?.risk_level === "Severe";
    const isSevere = narc?.partner_analysis?.risk_level === "Severe";
    const toxicityScore = narc?.relationship_health?.toxicity_score;
    const redFlagCount = narc?.relationship_health?.red_flags?.length || 0;

    const diagnosis = quickOverview?.pulse?.primary_diagnosis || scores?.dominantLens?.replace('_', ' ') || "Identified";
    const attachmentStyle = scores?.attachmentStyle || "";
    const phase = scores?.phase || "";
    const dominantLens = scores?.dominantLens || "";

    // Metrics (algorithmic — always available, instant)
    const sustainability = metrics?.sustainability_forecast ?? 0;
    const repairEff = metrics?.repair_efficiency ?? 0;
    const burnout = metrics?.nervous_system_load ?? 0;
    const eroticSpiral = metrics?.erotic_death_spiral ?? 0;
    const eroticPotential = metrics?.erotic_potential ?? 0;
    const silentDivorce = metrics?.silent_divorce_risk ?? 0;
    const betrayalVuln = metrics?.betrayal_vulnerability ?? 0;
    const malice = metrics?.internalized_malice ?? 0;
    const resilience = metrics?.resilience_battery ?? 0;

    const sustainabilityLabel = sustainability < 40 ? "Critical" : sustainability < 60 ? "At Risk" : sustainability < 80 ? "Moderate" : "Stable";
    const sustainabilityColor = sustainability < 40 ? "text-red-500" : sustainability < 60 ? "text-orange-500" : "text-emerald-500";

    // Forecast text (Haiku)
    const forecastText = quickOverview?.forecast?.short_term || "";

    // Headline logic — use actual data instead of badge string matching
    const isHighConflict = (metrics?.repair_efficiency ?? 50) < 40 && (session?.fightFrequency === "daily" || session?.fightFrequency === "weekly");

    // ── RENDER ──
    return (
        <header className="bg-background text-foreground pt-8 pb-16 px-6 relative overflow-hidden border-b border-border/40">
            <div className={`absolute inset-0 bg-linear-to-b ${isHighRisk ? "from-orange-500/10" : "from-primary/5"} via-background to-background -z-10`} />

            <div className="max-w-4xl mx-auto text-center space-y-6">

                {/* Badge — no animate-pulse per design system */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                    isSevere ? "text-red-600 bg-red-50 border-red-200" :
                    isHighRisk ? "text-orange-600 bg-orange-50 border-orange-200" :
                    "text-emerald-600 bg-emerald-50 border-emerald-200"
                }`}>
                    {isSevere ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                    {isSevere ? "Critical Pattern Detected" : isHighRisk ? "High Risk Pattern" : "Analysis Complete"}
                </div>

                {/* Headline — uses diagnosis + phase */}
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
                    {isHighRisk ? (
                        <>Your relationship is trapped in a <span className="text-primary">{diagnosis}</span> cycle.</>
                    ) : isHighConflict ? (
                        <>You aren't just fighting. You're trapped in <span className="text-primary">{diagnosis}</span>.</>
                    ) : (
                        <>You aren't fighting. You're fading into <span className="text-primary">{diagnosis}</span>.</>
                    )}
                </h1>
                <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    {quickOverview?.pulse?.summary || (isHighConflict
                        ? "Your answers confirm it: the arguments are escalating, the resentment is building, and the cycle isn't breaking itself."
                        : "The emotional distance between you is widening. This is statistically the hardest pattern to reverse once the apathy sets in."
                    )}
                </p>

                {/* ── CLINICAL SNAPSHOT — 6 key numbers from algorithmic data ── */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
                    {[
                        { label: "Sustainability", val: sustainability, invert: false },
                        { label: "Repair Rate", val: repairEff, invert: false },
                        { label: "Burnout", val: burnout, invert: true },
                        { label: "Intimacy Risk", val: eroticSpiral, invert: true },
                        { label: "Resentment", val: malice, invert: true },
                        { label: "Resilience", val: resilience, invert: false },
                    ].map((m) => {
                        const isGood = m.invert ? m.val < 40 : m.val >= 60;
                        const isBad = m.invert ? m.val >= 60 : m.val < 40;
                        const severityLabel = isBad ? "Critical" : isGood ? "Healthy" : "At Risk";
                        return (
                            <div key={m.label} className={`bg-card border p-3 rounded-xl text-center transition-colors ${isBad ? 'border-red-200/60' : isGood ? 'border-emerald-200/60' : 'border-border/50'}`}>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{m.label}</p>
                                <p className={`text-xl font-black ${isBad ? 'text-red-500' : isGood ? 'text-emerald-500' : 'text-orange-500'}`}>
                                    {m.val}<span className="text-[10px] opacity-50">%</span>
                                </p>
                                <div className={`flex items-center justify-center gap-1 mt-1`}>
                                    {isBad ? <AlertTriangle size={9} className="text-red-500" /> : isGood ? <CheckCircle size={9} className="text-emerald-500" /> : <Info size={9} className="text-orange-500" />}
                                    <p className={`text-[8px] font-bold uppercase tracking-wider ${isBad ? 'text-red-500' : isGood ? 'text-emerald-500' : 'text-orange-500'}`}>
                                        {severityLabel}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── PROFILE CARD — attachment style + phase + dominant lens ── */}
                <div className="max-w-2xl mx-auto bg-card border border-border/50 rounded-2xl p-6 text-left space-y-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {attachmentStyle && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Attachment Pattern</p>
                                <p className="text-sm font-bold text-foreground">{attachmentStyle}</p>
                            </div>
                        )}
                        {phase && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Relationship Phase</p>
                                <p className="text-sm font-bold text-foreground">{phase}</p>
                            </div>
                        )}
                        {dominantLens && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Critical Dimension</p>
                                <p className="text-sm font-bold text-primary">{dominantLens.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                            </div>
                        )}
                    </div>

                    {/* The user's own fear — quoted back */}
                    {session?.biggestFear && (
                        <div className="border-t border-border/50 pt-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">You told us your biggest fear is</p>
                            <p className="text-sm italic text-foreground leading-relaxed">"{session.biggestFear}"</p>
                        </div>
                    )}
                </div>

                {/* ── DIMENSION HEALTH SCORES + HAIKU TEASERS ── */}
                {scores?.dimensions && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {([
                            { key: 'communication', overviewKey: 'communication', label: 'Communication' },
                            { key: 'emotional_safety', overviewKey: 'security', label: 'Trust & Safety' },
                            { key: 'physical_intimacy', overviewKey: 'erotic', label: 'Intimacy' },
                            { key: 'power_fairness', overviewKey: 'balance', label: 'Fairness' },
                        ]).map((dim) => {
                            const dimData = scores.dimensions[dim.key];
                            const health = dimData?.health || 0;
                            const state = dimData?.state || "";
                            const dimTeaser = (quickOverview?.dimensions as any)?.[dim.overviewKey]?.teaser || "";
                            return (
                                <div key={dim.key} className="bg-card border border-border/50 p-4 rounded-xl text-center shadow-sm">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{dim.label}</h4>
                                    <div className={`text-3xl font-black mb-1 ${health < 40 ? 'text-red-500' : health < 70 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                        {health}<span className="text-sm opacity-50">/100</span>
                                    </div>
                                    {state && <p className="text-[10px] font-bold text-muted-foreground mb-1">{state}</p>}
                                    {dimTeaser && <p className="text-[11px] text-muted-foreground leading-snug">{dimTeaser}</p>}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── DIAGNOSIS CARD — pattern name + Haiku summary ── */}
                <div className="bg-card border-2 border-primary/20 p-8 rounded-2xl shadow-sm max-w-2xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Your Pattern</p>
                    <h2 className="text-3xl font-black text-primary mb-4">"{diagnosis}"</h2>
                    <p className="text-base text-muted-foreground leading-relaxed mb-4">
                        {quickOverview?.pulse?.summary || "Your relationship has a structure — a predictable cycle that repeats regardless of the topic. Understanding this cycle is the first step to breaking it."}
                    </p>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
                        <p className="text-sm font-medium text-foreground">
                            This is the pattern. <strong className="text-primary">The full report explains why it formed, what triggers it, and the exact protocol to break it.</strong>
                        </p>
                    </div>
                </div>

                {/* ── ACTIONABLE TIP — real HVCO value delivery ── */}
                <div className="max-w-2xl mx-auto mt-8">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-foreground">What You Can Do Right Now</h3>
                        <p className="text-sm text-muted-foreground mt-2">Based on your pattern, here's one thing that will make an immediate difference:</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</div>
                            <div>
                                <p className="font-bold text-foreground mb-1">Name the pattern out loud to yourself.</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Next time the cycle starts, say: "This is the {diagnosis} pattern happening right now."
                                    This alone interrupts the automatic escalation by activating your prefrontal cortex instead of your fight-or-flight response.
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-primary/10 pt-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Your full report includes 5 specific scripts</strong> designed for a partner who {session?.partnerConflictStyle === "Shuts down / Stonewalls" ? "shuts down" : session?.partnerConflictStyle === "Escalates / Yells" ? "escalates" : session?.partnerConflictStyle === "Deflects / Blames you" ? "deflects blame" : "avoids conflict"}.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── FORECAST — sustainability bar + Haiku forecast ── */}
                <div className="max-w-xl mx-auto">
                    <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-4 text-left">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm text-foreground">Sustainability Score</span>
                            <span className={`font-bold ${sustainabilityColor}`}>{sustainabilityLabel}</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-700" style={{ width: `${sustainability}%` }}></div>
                        </div>

                        {/* Positive signal if it exists */}
                        {eroticPotential >= 60 && (
                            <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                                <Heart size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                                    <strong>Hidden Spark detected ({eroticPotential}%).</strong> The desire isn't gone — it's buried under stress and routine. This is recoverable.
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">6-Month Forecast</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {forecastText || (sustainability < 40
                                    ? `With a sustainability score of ${sustainability}%, this trajectory leads to emotional disengagement within 6 months if the pattern isn't interrupted.`
                                    : `Your current trajectory shows declining connection. Without intervention, the distance between you will continue to widen.`
                                )}
                            </p>
                        </div>

                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                            <p className="text-sm font-bold text-foreground mb-1">Your full report includes:</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                The complete 5-year trajectory, the specific intervention window for your situation, and a 30-day action plan designed for "{diagnosis}."
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground max-w-lg mx-auto pt-4 leading-relaxed">
                    <span className="text-foreground font-bold">This is a turning point.</span> Your relationship dynamics aren't random. They are deeply predictable — which means they are solvable.
                </p>

            </div>
        </header>
    );
};


// 2. MIRROR SECTION (Identification) — data-driven, not hardcoded
const MirrorSection = ({ narcissismAnalysis, session, quickOverview }: { narcissismAnalysis?: any, session?: any, quickOverview?: QuickOverviewData | null }) => {
    const scores = session?.scores as any;
    const metrics = session?.advancedMetrics as any;
    const narc = narcissismAnalysis;

    const isHighRisk = narc?.partner_analysis?.risk_level === "High" || narc?.partner_analysis?.risk_level === "Severe";

    // ── BUILD SYMPTOM CARDS FROM REAL DATA ──
    // Each card is driven by a metric threshold — the user sees their actual dynamics described
    const dataSymptoms: { title: string; desc: string; score: number; icon: "danger" | "warning" | "insight" }[] = [];

    // Repair failure
    const repairEff = metrics?.repair_efficiency ?? 50;
    if (repairEff < 50) {
        dataSymptoms.push({
            title: "The Groundhog Day Fight",
            desc: `Your Repair Rate is ${repairEff}%. You apologize, you move on — but the same fight comes back. It's not that you can't make up. It's that the underlying issue never actually gets addressed.`,
            score: repairEff,
            icon: "warning"
        });
    }

    // Silent divorce risk
    const silentDivorce = metrics?.silent_divorce_risk ?? 0;
    if (silentDivorce > 55) {
        dataSymptoms.push({
            title: "The Quiet Quit",
            desc: `Your Silent Divorce Risk is ${silentDivorce}%. You've stopped fighting — but you've also stopped trying. The absence of conflict isn't peace. It's surrender.`,
            score: silentDivorce,
            icon: "warning"
        });
    }

    // Erotic death spiral
    const eroticSpiral = metrics?.erotic_death_spiral ?? 0;
    if (eroticSpiral > 50) {
        dataSymptoms.push({
            title: "The Parent Trap",
            desc: `Your intimacy erosion score is ${eroticSpiral}%. You can't desire someone you have to manage. The more you carry, the less you want — and neither of you knows how to talk about it.`,
            score: eroticSpiral,
            icon: "warning"
        });
    }

    // Mental load imbalance
    const ceoIntern = metrics?.ceo_vs_intern ?? 0;
    if (ceoIntern > 55) {
        dataSymptoms.push({
            title: "The Invisible Manager",
            desc: `Your power imbalance score is ${ceoIntern}%. One of you tracks everything — groceries, appointments, emotions, logistics. The other just "shows up." This kills attraction and breeds resentment.`,
            score: ceoIntern,
            icon: "warning"
        });
    }

    // Burnout
    const burnout = metrics?.nervous_system_load ?? 0;
    if (burnout > 55) {
        dataSymptoms.push({
            title: "The Burnout",
            desc: `Your nervous system load is ${burnout}%. This relationship is physically draining you. The hypervigilance, the walking on eggshells, the constant monitoring of their mood — your body is keeping score.`,
            score: burnout,
            icon: "danger"
        });
    }

    // Resentment / Malice
    const malice = metrics?.internalized_malice ?? 0;
    if (malice > 50) {
        dataSymptoms.push({
            title: "The Enemy Within",
            desc: `Your resentment index is ${malice}%. You're starting to interpret their actions through the worst possible lens. They're not just forgetful — they "don't care." They're not just tired — they're "selfish."`,
            score: malice,
            icon: "danger"
        });
    }

    // Betrayal vulnerability
    const betrayalVuln = metrics?.betrayal_vulnerability ?? 0;
    if (betrayalVuln > 55) {
        dataSymptoms.push({
            title: "The Open Door",
            desc: `Your Betrayal Vulnerability is ${betrayalVuln}%. When emotional needs go unmet long enough, the risk of outside connection grows. Not because anyone is "bad" — because unmet needs seek an outlet.`,
            score: betrayalVuln,
            icon: "danger"
        });
    }

    // Take the top 4 most alarming, sorted by score
    const displaySymptoms = dataSymptoms
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

    // ── HIGH RISK OVERRIDE — use narcissism traits if detected ──
    if (isHighRisk) {
        const traits = narc?.partner_analysis?.traits_detected || [];
        const redFlags = narc?.relationship_health?.red_flags || [];

        if (traits.length > 0 || redFlags.length > 0) {
            displaySymptoms.length = 0; // clear
            traits.slice(0, 3).forEach((trait: string) => {
                displaySymptoms.push({
                    title: `Pattern: ${trait}`,
                    desc: "You indicated specific behaviors associated with this trait. This is not 'normal conflict' — it is a structural control dynamic.",
                    score: 100,
                    icon: "danger"
                });
            });
            redFlags.slice(0, 2).forEach((flag: string) => {
                displaySymptoms.push({
                    title: "Critical Warning Sign",
                    desc: flag,
                    score: 100,
                    icon: "danger"
                });
            });
        }
    }

    // ── SECTION TITLE — dynamic ──
    const flagCount = narc?.relationship_health?.red_flags?.length || 0;
    const sectionTitle = isHighRisk
        ? `We Detected ${flagCount} Critical Red Flags`
        : `We Found ${displaySymptoms.length} Active Patterns in Your Data`;
    const sectionDesc = isHighRisk
        ? "Your answers align with a specific profile of emotional control and toxicity."
        : "These aren't assumptions. Each one is calculated from your 30 answers and confirmed by your scores.";

    return (
        <section className="py-24 px-6 bg-muted/30 border-y border-border/50">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
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
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${symptom.icon === "danger" ? "bg-red-400 group-hover:bg-red-500" : "bg-primary/30 group-hover:bg-primary"} transition-colors duration-300`}></div>
                            <h3 className="font-bold text-xl text-foreground mb-3 flex items-center gap-2">
                                {symptom.icon === "danger"
                                    ? <AlertTriangle className="text-red-500 shrink-0" size={20} />
                                    : <Activity className="text-primary shrink-0" size={20} />
                                }
                                {symptom.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-[15px]">
                                {symptom.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* TOXICITY CALLOUT — high risk only */}
                {isHighRisk && (
                    <div className="mt-12 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-6 md:p-8 rounded-2xl text-center">
                        <h4 className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400 font-black text-xl mb-3">
                            <ShieldAlert size={24} /> Use Caution
                        </h4>
                        <p className="text-foreground text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                            Your <strong>Toxicity Score is {narc?.relationship_health?.toxicity_score}/100</strong>.
                            This level indicates a cycle that cannot be fixed by "trying harder" alone.
                            The full report includes a safety plan and specific communication scripts.
                        </p>
                    </div>
                )}

                {/* NORMAL — confirmation callout */}
                {!isHighRisk && (
                    <div className="mt-12 bg-primary/5 border border-primary/20 p-8 rounded-2xl text-center max-w-2xl mx-auto">
                        <p className="text-foreground font-medium text-lg leading-relaxed">
                            <strong className="text-primary text-xl block mb-2">You're not imagining it.</strong>
                            Your relationship has {displaySymptoms.length} measurable patterns working against it right now. They have names, they have scores, and they have solutions. The full report maps each one.
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
    // Read session ID from URL params (email links, Stripe cancel redirect) then localStorage
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const urlSessionId = urlParams?.get("session") || urlParams?.get("sessionId") || urlParams?.get("session_id") || null;
    const localSessionId = typeof window !== "undefined" ? localStorage.getItem("uyp-session-id") : null;
    const sessionIdToUse = urlSessionId || localSessionId || undefined;

    // 1. Fetch Session
    const { data: session, isLoading: isSessionLoading, refetch } = useQuery(getTestSession, { sessionId: sessionIdToUse });

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

    // Persist URL session ID to localStorage for subsequent navigations
    useEffect(() => {
        if (urlSessionId) localStorage.setItem("uyp-session-id", urlSessionId);
    }, [urlSessionId]);

    useEffect(() => {
        const offerSection = document.getElementById('offer');
        if (!offerSection) return;
        let hasScrolledPastHero = false;
        const handleScroll = () => { hasScrolledPastHero = window.scrollY > 600; };
        window.addEventListener('scroll', handleScroll, { passive: true });
        const observer = new IntersectionObserver(([entry]) => {
            setShowStickyCTA(!entry.isIntersecting && hasScrolledPastHero);
        }, { threshold: 0.1 });
        observer.observe(offerSection);
        return () => { observer.disconnect(); window.removeEventListener('scroll', handleScroll); };
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
        }
        
        // Trigger the Full Report V2 generation in the background if it doesn't exist
        if (!session.fullReportV2 && !fullReportInitiated.current) {
            fullReportInitiated.current = true;
            console.log("Triggering Full Report V2 generation in background...");
            generateFullReportV2({ sessionId: session.id })
                .then(() => console.log("Full Report V2 generated successfully"))
                .catch(err => {
                    console.error("Failed to generate Full Report V2:", err);
                    fullReportInitiated.current = false;
                });
        } else if (session.fullReportV2) {
            console.log("Full Report V2 already exists in session.");
            fullReportInitiated.current = true;
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

    // Email capture removed — users always have email in new session model

    // No session ID at all (no URL param, no localStorage) → show "not found" with retake link
    if (!session && !sessionIdToUse) return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <div className="text-center space-y-4 p-8">
                <p className="text-xl font-bold">Session not found</p>
                <p className="text-muted-foreground">Your session may have expired or you're on a different device.</p>
                <a href="/test" className="text-primary font-bold hover:underline">Take the assessment &rarr;</a>
            </div>
        </div>
    );

    // Session ID exists but data hasn't loaded yet (hydration gap, network delay)
    if (!session) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Activity className="animate-spin text-primary" size={32} />
        </div>
    );

    const badge = quickOverview?.hero?.result_badge || "CALCULATING...";

    // Stale session detection
    const daysSinceTest = session.createdAt
        ? Math.floor((Date.now() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const isStaleSession = daysSinceTest > 14;
    const testDate = session.createdAt
        ? new Date(session.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : null;

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">

            {isStaleSession && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800 px-6 py-3">
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 text-sm">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                            <Clock size={16} />
                            <span>This analysis was generated on {testDate}. Your relationship may have changed.</span>
                        </div>
                        <button
                            onClick={async () => {
                                if (session) { try { await deactivateSession({ sessionId: session.id }); } catch (e) { console.error(e); } }
                                localStorage.removeItem("uyp-session-id");
                                navigate("/test");
                            }}
                            className="whitespace-nowrap text-amber-900 dark:text-amber-200 font-medium underline hover:text-amber-700"
                        >
                            Retake the test
                        </button>
                    </div>
                </div>
            )}

            <HeroSection
                badge={badge}
                onUnlock={handleScrollToOffer}
                quickOverview={quickOverview}
                narcissismAnalysis={session?.narcissismAnalysis}
                advancedMetrics={session?.advancedMetrics}
                session={session}
            />

            <MirrorSection narcissismAnalysis={session?.narcissismAnalysis} session={session} quickOverview={quickOverview} />

            {/* THE BRIDGE — Personalized free value recap + transition to paid */}
            <section className="py-20 px-6 bg-muted/20 border-y border-border">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-foreground">What You Just Got — For Free</h2>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-10">
                        <ul className="space-y-4 text-foreground font-medium">
                            <li className="flex items-start gap-3">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>Your pattern identified: <strong className="text-primary">"{quickOverview?.pulse?.primary_diagnosis || (session?.scores as any)?.dominantLens?.replace(/_/g, ' ') || "Identified"}"</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>Your attachment style: <strong>{(session?.scores as any)?.attachmentStyle || "Calculated"}</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>12 biomarker scores — including Repair Rate ({(session?.advancedMetrics as any)?.repair_efficiency ?? "—"}%), Burnout ({(session?.advancedMetrics as any)?.nervous_system_load ?? "—"}%), and Sustainability ({(session?.advancedMetrics as any)?.sustainability_forecast ?? "—"}%)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>4 dimension health scores with clinical state labels</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>One actionable de-escalation technique you can use tonight</span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center space-y-6">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            A therapist charges <strong className="text-foreground">$150/session for 4-6 weeks</strong> just to reach this diagnosis. You got it in 10 minutes. For free.
                        </p>

                        <div className="h-px w-16 bg-primary/30 mx-auto"></div>

                        <div className="space-y-4 max-w-xl mx-auto">
                            <p className="text-xl font-bold text-foreground">
                                But here's the truth.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Knowing the pattern is <strong className="text-foreground">step 1</strong>. It's the diagnosis.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The other 80% — the scripts, the action plan, the guides, the forecast — is the <strong className="text-foreground">treatment plan</strong>. And that's what the full report gives you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. THE VISION — Paint the PAID "after" picture */}
            <section className="py-24 px-6 bg-background border-b border-border/50">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold uppercase tracking-widest">
                        What The Full Report Gives You
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                        The Diagnosis Was Free.<br />The <span className="text-primary">Cure</span> Is Inside.
                    </h2>

                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-left">
                        <p>
                            Imagine opening your phone and reading the <strong className="text-foreground">exact sentence</strong> to say when tonight's argument starts — word for word, designed for your partner's specific psychology.
                        </p>
                        <p>
                            Imagine knowing your <strong className="text-foreground">5-year forecast</strong> — the precise month where your window of intervention closes, and the specific actions that change the trajectory.
                        </p>
                        <p>
                            Imagine having a <strong className="text-foreground">30-day action plan</strong> so clear that you don't have to think, you just follow it — and by week 3, the dynamic has already started to shift.
                        </p>
                    </div>

                    <p className="text-foreground font-bold text-lg">
                        That's not a fantasy. That's what's in your report, waiting to be unlocked.
                    </p>
                </div>
            </section>

            {/* CLINICAL WARNING — urgency from data */}
            <section className={`py-16 px-6 relative overflow-hidden border-y border-border/50 ${((session?.narcissismAnalysis as any)?.risk_level === "High" || (session?.narcissismAnalysis as any)?.risk_level === "Severe") ? "bg-red-50 dark:bg-red-950/20" : "bg-orange-50 dark:bg-orange-950/20"}`}>
                <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-10">But here's what makes this urgent</p>
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

            {/* 3. COST OF INACTION (The Forecast) — data-driven trajectories */}
            {(() => {
                const metrics = session?.advancedMetrics as any;
                const narc = session?.narcissismAnalysis as any;
                const isHighRisk = narc?.partner_analysis?.risk_level === "High" || narc?.partner_analysis?.risk_level === "Severe";
                const sustainability = metrics?.sustainability_forecast ?? 50;
                const silentDivorce = metrics?.silent_divorce_risk ?? 0;
                const eroticSpiral = metrics?.erotic_death_spiral ?? 0;
                const malice = metrics?.internalized_malice ?? 0;

                // Choose the 3 most likely trajectories based on their data
                const paths: { title: string; desc: string; icon: React.ReactNode; accentColor: string; bgColor: string; borderColor: string; iconBg: string; yearLabel: string }[] = [];

                if (isHighRisk) {
                    paths.push({
                        title: "The Trauma Bond",
                        desc: "You leave and return, over and over. Each cycle erodes more of your self-worth until you feel unable to function without them. It becomes an addiction, not a relationship.",
                        icon: <Link size={24} />,
                        accentColor: "bg-red-500", bgColor: "bg-red-50 dark:bg-red-950/20", borderColor: "border-red-200 dark:border-red-900/50", iconBg: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
                        yearLabel: "Year 1-2"
                    });
                } else if (silentDivorce > 50) {
                    paths.push({
                        title: "The Roommate Marriage",
                        desc: `Your Silent Divorce Risk is ${silentDivorce}%. You stay together for convenience or the kids, but the passion is gone. You become excellent co-managers of a household — and strangers in bed.`,
                        icon: <Repeat size={24} />,
                        accentColor: "bg-primary", bgColor: "bg-primary/5", borderColor: "border-primary/20", iconBg: "bg-primary/10 text-primary",
                        yearLabel: "Year 1-2"
                    });
                } else {
                    paths.push({
                        title: "The Slow Erosion",
                        desc: `With a sustainability score of ${sustainability}%, the emotional distance between you widens month by month. Not dramatically — just enough that by year 2, you can't remember the last time you felt truly close.`,
                        icon: <TrendingDown size={24} />,
                        accentColor: "bg-primary", bgColor: "bg-primary/5", borderColor: "border-primary/20", iconBg: "bg-primary/10 text-primary",
                        yearLabel: "Year 1-2"
                    });
                }

                if (malice > 40) {
                    paths.push({
                        title: "The Explosion",
                        desc: `Your resentment index is ${malice}%. The quiet contempt builds until a small fight becomes "I want a divorce." It's sudden, messy, and expensive — and everyone wonders why you didn't see it coming. You did. You just didn't act.`,
                        icon: <Zap size={24} />,
                        accentColor: "bg-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950/20", borderColor: "border-orange-200 dark:border-orange-900/50", iconBg: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
                        yearLabel: "Year 3"
                    });
                } else {
                    paths.push({
                        title: "The Explosion",
                        desc: "The quiet resentment finally boils over. A small fight turns into something that can't be taken back. It's sudden, messy, and expensive — and it leaves you wondering why you didn't act sooner.",
                        icon: <Zap size={24} />,
                        accentColor: "bg-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950/20", borderColor: "border-orange-200 dark:border-orange-900/50", iconBg: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
                        yearLabel: "Year 3"
                    });
                }

                paths.push({
                    title: "The Fade",
                    desc: eroticSpiral > 50
                        ? `Your intimacy erosion score is ${eroticSpiral}%. You stop fighting because you've stopped caring. The desire dies completely. You become a ghost of who you used to be — present in the house, absent in the relationship.`
                        : "You stop fighting because you've stopped caring. You become a shadow of who you used to be, slowly sacrificing your identity to just keep the peace. One day you realize you've lost yourself.",
                    icon: <Ghost size={24} />,
                    accentColor: "bg-muted-foreground/50", bgColor: "bg-muted/30", borderColor: "border-border", iconBg: "bg-muted text-muted-foreground",
                    yearLabel: "Year 5"
                });

                // Extract year numbers for large display
                const yearNumbers = paths.map(p => p.yearLabel.replace("Year ", ""));

                return (
                    <section className="py-24 px-6 bg-muted/30 border-y border-border/50">
                        <div className="max-w-5xl mx-auto space-y-16">
                            <div className="text-center space-y-4">
                                <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-bold uppercase tracking-widest">
                                    Clinical Trajectory
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                                    Where This Leads in <span className="text-primary">5 Years</span>
                                </h2>
                                <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                                    Based on your scores, these are the 3 most likely outcomes if nothing changes.
                                </p>
                            </div>

                            {/* ── TIMELINE ── */}
                            <div className="relative">
                                {/* Desktop connecting line */}
                                <div className="hidden md:block absolute top-[52px] left-[16.67%] right-[16.67%] h-px z-0">
                                    <div className="w-full h-full bg-gradient-to-r from-primary/30 via-secondary/20 to-border"></div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                                    {paths.map((path, idx) => (
                                        <div key={idx} className="relative flex flex-col items-center">
                                            {/* Year circle */}
                                            <div className={`relative z-10 mb-6 h-[72px] w-[72px] rounded-full flex items-center justify-center border-2 bg-card shadow-sm ${
                                                idx === 0 ? "border-primary/40 text-primary" :
                                                idx === 1 ? "border-secondary/40 text-secondary" :
                                                "border-border text-muted-foreground"
                                            }`}>
                                                <div className="text-center">
                                                    <span className="block text-2xl font-black leading-none">{yearNumbers[idx]}</span>
                                                    <span className="block text-[9px] font-bold uppercase tracking-wider opacity-70 mt-0.5">year</span>
                                                </div>
                                            </div>

                                            {/* Mobile vertical connector */}
                                            {idx < paths.length - 1 && (
                                                <div className="md:hidden w-px h-6 bg-gradient-to-b from-border to-transparent -mt-3 mb-3"></div>
                                            )}

                                            {/* Card */}
                                            <div className={`flex-1 w-full bg-card rounded-2xl border relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${
                                                idx === 0 ? "border-primary/20 hover:border-primary/40" :
                                                idx === 1 ? "border-secondary/20 hover:border-secondary/40" :
                                                "border-border/60 hover:border-muted-foreground/30"
                                            }`}>
                                                {/* Top accent bar */}
                                                <div className={`h-1 ${
                                                    idx === 0 ? "bg-primary" :
                                                    idx === 1 ? "bg-secondary" :
                                                    "bg-muted-foreground/30"
                                                }`}></div>

                                                <div className="p-6 md:p-8">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                            idx === 0 ? "bg-primary/10 text-primary" :
                                                            idx === 1 ? "bg-secondary/10 text-secondary" :
                                                            "bg-muted text-muted-foreground"
                                                        }`}>
                                                            {path.icon}
                                                        </div>
                                                        <h3 className="font-black text-xl text-foreground">{path.title}</h3>
                                                    </div>

                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {path.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center pt-8 space-y-3">
                                <button
                                    onClick={() => handleCheckout('forecast_cta')}
                                    className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-4 px-10 rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
                                >
                                    See My Full 5-Year Forecast <ArrowRight size={20} />
                                </button>
                                <p className="text-muted-foreground/60 text-xs">Included in your personalized report</p>
                            </div>
                        </div>
                    </section>
                );
            })()}

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
                        {/* Inline video — real report walkthrough */}
                        <div className="relative max-w-sm mx-auto w-full">
                            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-border bg-foreground">
                                <video
                                    src="/demo/screen-capture.webm"
                                    className="w-full"
                                    controls
                                    playsInline
                                    muted
                                    preload="metadata"
                                    poster=""
                                />
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-3">
                                Sample report walkthrough — yours will be personalized to your answers
                            </p>
                        </div>

                        {/* Report Components — BENEFIT-focused copy */}
                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">See the Exact Moment Trust Started Eroding</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Your 5-dimension deep dive reveals not just WHAT's broken — but the specific conversation pattern, the unspoken resentment, and the one dynamic that's quietly poisoning everything else.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">Know If You Still Have Time — Or If It's Already Too Late</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Your personalized 6-month and 5-year forecast. Not "relationships are hard." YOUR specific odds, YOUR intervention window, YOUR point of no return.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
                                    <ShieldAlert size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-orange-600 dark:text-orange-400">End the "Am I Crazy?" Loop Forever</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        A definitive clinical answer to the question you've been afraid to ask. Rough patch or abuse? Your 0-100 Danger Score ends years of self-doubt in one page.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">Know What to Say Tonight — Word for Word</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        When the fight starts, you'll have the exact sentence that stops the spiral. Designed for your partner's specific psychological profile. Not generic advice — phrases that bypass <em>their</em> defenses.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                                    <Eye size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2">See the 12 Hidden Drivers Most Couples Never Discover</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        The invisible forces that kill relationships while you're focused on the surface fights. Including the one that's doing the most damage <em>right now</em> in yours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Proof break — testimonial between solution and premiums */}
            <div className="bg-secondary/5 border-y border-border py-12 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="flex justify-center gap-1 text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => <Star key={`proof-break-${i}`} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-xl italic font-serif text-muted-foreground mb-6 leading-relaxed">
                        "Six months of couples therapy and we weren't getting anywhere. This identified the problem in 10 pages. Brought it to the next session. Therapist said 'okay finally we know what to work on'."
                    </p>
                    <div className="font-bold text-foreground">— Robert, 42, Boston</div>
                </div>
            </div>

            {/* 5. TARGETED STRATEGIC TOOLS (Value Stack) */}
            <section className="py-24 px-6 bg-muted/30 relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-14 space-y-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                            <CheckCircle size={12} /> $194 Value — Included Free
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground">The Emergency Intervention Toolkit</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            5 clinical PDF protocols therapists charge $200+/hr to teach. Yours free with your report.
                        </p>
                    </div>

                    {(() => {
                        const metrics = session?.advancedMetrics as any;
                        const narcissism = session?.narcissismAnalysis as any;
                        const ceoIntern = metrics?.ceo_vs_intern ?? 0;
                        const eroticSpiral = metrics?.erotic_death_spiral ?? 0;
                        const betrayalVuln = metrics?.betrayal_vulnerability ?? 0;
                        const sustainability = metrics?.sustainability_forecast ?? 0;
                        const toxicityScore = narcissism?.relationship_health?.toxicity_score ?? 0;
                        const narcRisk = narcissism?.risk_level;
                        const guides = [
                            {
                                icon: <FileText size={22} />,
                                title: "Mental Load Equalizer",
                                benefit: "Stop managing your partner like a child",
                                items: ["Division of labor audit worksheet", "Rebalancing scripts (no-conflict)", "\"No rescuing\" commitment framework"],
                                value: "$47",
                                metric: ceoIntern,
                                threshold: 50,
                                accentColor: "bg-primary",
                            },
                            {
                                icon: <Heart size={22} />,
                                title: "Dead Bedroom Revival",
                                benefit: "Rebuild desire without pressure or guilt",
                                items: ["3-phase revival protocol (weeks 1-8)", "Sensate focus exercises", "7 desire killers to eliminate"],
                                value: "$39",
                                metric: eroticSpiral,
                                threshold: 45,
                                accentColor: "bg-secondary",
                            },
                            {
                                icon: <ShieldAlert size={22} />,
                                title: "Narcissist Detection Manual",
                                benefit: "Know if it's difficult — or dangerous",
                                items: ["21-point clinical checklist", "Gaslighting counter-scripts", "Exit planning protocol"],
                                value: "$47",
                                metric: toxicityScore || 0,
                                threshold: 40,
                                accentColor: "bg-orange-500",
                                extra: narcRisk && narcRisk !== "Low" ? (
                                    <div className="mt-2 p-2.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-800/30 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider">Your risk level</span>
                                            <span className="text-sm font-black text-orange-600">{narcRisk}</span>
                                        </div>
                                        <div className="w-full h-1 bg-orange-100 rounded-full overflow-hidden mt-1.5">
                                            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: narcRisk === "Severe" ? "95%" : narcRisk === "High" ? "80%" : narcRisk === "Moderate" ? "55%" : "15%" }} />
                                        </div>
                                    </div>
                                ) : null,
                            },
                            {
                                icon: <MessageCircle size={22} />,
                                title: "Emotional Affair Warning",
                                benefit: "Spot the 19 signs before it's too late",
                                items: ["Early/mid/advanced stage indicators", "Affair-proofing boundaries protocol", "Scripts to address without accusations"],
                                value: "$47",
                                metric: betrayalVuln,
                                threshold: 50,
                                accentColor: "bg-primary",
                            },
                            {
                                icon: <Compass size={22} />,
                                title: "Should I Stay or Go?",
                                benefit: "The framework therapists use for the hardest choice",
                                items: ["12-point \"Regret-Proof\" checklist", "Decision matrix with scoring", "Scripts for difficult conversations"],
                                value: "$14",
                                metric: sustainability < 50 ? 100 : 0,
                                threshold: 50,
                                accentColor: "bg-muted-foreground",
                            },
                        ];

                        return (
                            <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {guides.map((guide, idx) => {
                                    const isCritical = guide.metric >= guide.threshold;
                                    return (
                                        <div key={idx} className={`bg-card border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col ${isCritical ? 'border-primary/40 ring-1 ring-primary/10' : 'border-border'}`}>
                                            {/* Accent bar */}
                                            <div className={`h-1 ${guide.accentColor}`} />

                                            {/* Header */}
                                            <div className="p-5 pb-3 flex items-start gap-4">
                                                <div className="bg-primary/10 text-primary p-2.5 rounded-xl shrink-0">
                                                    {guide.icon}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-foreground leading-tight">{guide.title}</h3>
                                                    <p className="text-sm text-muted-foreground mt-0.5">{guide.benefit}</p>
                                                </div>
                                            </div>

                                            {/* Bullet list */}
                                            <div className="px-5 pb-3 flex-1">
                                                <ul className="space-y-1.5">
                                                    {guide.items.map((item, j) => (
                                                        <li key={j} className="flex gap-2 text-sm text-muted-foreground">
                                                            <Check size={14} className="text-primary shrink-0 mt-0.5" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {guide.extra}
                                            </div>

                                            {/* Relevance + Value footer */}
                                            <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-border/50 mt-auto">
                                                {isCritical ? (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                                                        Critical for you
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                        Included
                                                    </span>
                                                )}
                                                <div className="text-right">
                                                    <span className="text-xs text-destructive line-through mr-1.5">{guide.value}</span>
                                                    <span className="text-xs font-bold text-success">Free</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total value anchor */}
                            <div className="mt-10 bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-success/10 text-success p-2 rounded-full">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">All 5 guides included free with your report</p>
                                        <p className="text-sm text-muted-foreground">No extra cost. Instant PDF download after purchase.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-2xl text-destructive line-through font-bold">$194</span>
                                    <span className="text-2xl font-black text-success">$0</span>
                                </div>
                            </div>
                            </>
                        );
                    })()}
                </div>
            </section>

            {/* SOCIAL PROOF — Consolidated testimonials */}
            <section className="py-24 px-6 bg-background border-t border-border">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            People Who Were Exactly Where You Are
                        </h2>
                        <div className="flex justify-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                        </div>
                    </div>

                    {/* Featured testimonial */}
                    <div className="bg-secondary/5 border border-border rounded-2xl p-8 md:p-12 mb-8 max-w-3xl mx-auto text-center">
                        <p className="text-xl md:text-2xl italic font-serif text-muted-foreground mb-6 leading-relaxed">
                            "I read this thing crying because finally someone put into words what I've been feeling for years and couldn't explain. I don't know if we'll stay together but at least now I KNOW I'm not crazy."
                        </p>
                        <div className="font-bold text-foreground">— Laura, 34, Chicago</div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                            <div className="flex gap-1 text-yellow-500 mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                            <p className="text-muted-foreground mb-4 italic text-sm leading-relaxed">
                                "Six months of couples therapy and we weren't getting anywhere. This identified the problem in 10 pages. Brought it to the next session. Therapist said 'okay finally we know what to work on'."
                            </p>
                            <div className="font-bold text-foreground text-sm">— Robert, 42, Boston</div>
                        </div>

                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                            <div className="flex gap-1 text-yellow-500 mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                            <p className="text-muted-foreground mb-4 italic text-sm leading-relaxed">
                                "Bought this at 3am after he locked himself in the bedroom. It wasn't what I wanted to hear. But it was what I NEEDED to hear."
                            </p>
                            <div className="font-bold text-foreground text-sm">— Alexis, 40, Denver</div>
                        </div>

                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                            <div className="flex gap-1 text-yellow-500 mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                            <p className="text-muted-foreground mb-4 italic text-sm leading-relaxed">
                                "My husband and I haven't had sex in 2 years. Turns out I just work differently. We're trying something the guide suggested. Still awkward but at least we're trying."
                            </p>
                            <div className="font-bold text-foreground text-sm">— Claire, 29, London</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GODFATHER OFFER SECTION */}
            <section id="offer" className="py-24 px-6 bg-muted/20">
                <div className="max-w-4xl mx-auto">

                    {/* ─── BLOCK 1: PERSONALIZED BRIDGE — MIND-READ LEVEL ─── */}
                    {(() => {
                        const metrics = session?.advancedMetrics as any;
                        const scores = session?.scores as any;
                        const narcissism = session?.narcissismAnalysis as any;
                        const diagnosis = quickOverview?.pulse?.primary_diagnosis || "Identified";
                        const attachmentStyle = scores?.attachmentStyle || "";
                        const phase = scores?.phase || "";
                        const dominantLens = scores?.dominantLens || "";
                        const dominantDim = scores?.dimensions?.[dominantLens];
                        const repairEff = metrics?.repair_efficiency ?? 0;
                        const sustainability = metrics?.sustainability_forecast ?? 0;
                        const eroticSpiral = metrics?.erotic_death_spiral ?? 0;
                        const betrayalVuln = metrics?.betrayal_vulnerability ?? 0;
                        const silentDivorce = metrics?.silent_divorce_risk ?? 0;
                        const ceoIntern = metrics?.ceo_vs_intern ?? 0;
                        const burnout = metrics?.nervous_system_load ?? 0;
                        const malice = metrics?.internalized_malice ?? 0;
                        const eroticPotential = metrics?.erotic_potential ?? 0;
                        const resilience = metrics?.resilience_battery ?? 0;
                        const toxicityScore = narcissism?.relationship_health?.toxicity_score;
                        const partnerStyle = session?.partnerConflictStyle;
                        const partnerStyleShort = partnerStyle === "Shuts down / Stonewalls" ? "shuts down" : partnerStyle === "Escalates / Yells" ? "escalates" : partnerStyle === "Deflects / Blames you" ? "deflects blame" : "avoids conflict";
                        const biggestFear = session?.biggestFear;
                        const fightFreq = session?.fightFrequency;
                        const repairFreq = session?.repairFrequency;
                        const duration = session?.relationshipDuration;

                        // Find the most alarming metric
                        const alarmMetrics = [
                            { id: "erotic_death_spiral", val: eroticSpiral, label: "Parent-Trap Index", desc: "managing your partner is killing your desire" },
                            { id: "betrayal_vulnerability", val: betrayalVuln, label: "Betrayal Vulnerability", desc: "unmet needs are creating an opening for outside connection" },
                            { id: "silent_divorce_risk", val: silentDivorce, label: "Silent Divorce Risk", desc: "you've stopped fighting — but you've also stopped connecting" },
                            { id: "internalized_malice", val: malice, label: "Resentment Index", desc: "you're starting to see your partner as the enemy, not a teammate" },
                            { id: "nervous_system_load", val: burnout, label: "Burnout Rate", desc: "this relationship is physically and mentally draining you" },
                        ].filter(m => m.val >= 55).sort((a, b) => b.val - a.val);

                        const topAlarm = alarmMetrics[0];

                        // Find one positive signal (if it exists)
                        const positiveSignals = [
                            { val: eroticPotential, label: "Hidden Spark", desc: "the fire isn't gone — it's buried under stress" },
                            { val: resilience, label: "Anchor Score", desc: "you have deep shared history to survive a crisis" },
                            { val: metrics?.compatibility_quotient ?? 0, label: "Soulmate Sync", desc: "your core values still align" },
                        ].filter(s => s.val >= 60).sort((a, b) => b.val - a.val);

                        const topPositive = positiveSignals[0];

                        return (
                    <>
                    <div className="text-center mb-16 space-y-6">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                            Your Analysis Is Ready
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                            Your Pattern Is Called <span className="text-primary">"{diagnosis}"</span>
                        </h2>

                        {/* ── MIND-READ SNAPSHOT: 4 key numbers from THEIR data ── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                            <div className="bg-card border border-border/50 p-3 rounded-xl text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Repair Rate</p>
                                <p className={`text-2xl font-black ${repairEff < 40 ? 'text-red-500' : repairEff < 70 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {repairEff}<span className="text-xs opacity-50">%</span>
                                </p>
                            </div>
                            <div className="bg-card border border-border/50 p-3 rounded-xl text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sustainability</p>
                                <p className={`text-2xl font-black ${sustainability < 40 ? 'text-red-500' : sustainability < 70 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {sustainability}<span className="text-xs opacity-50">%</span>
                                </p>
                            </div>
                            <div className="bg-card border border-border/50 p-3 rounded-xl text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Burnout</p>
                                <p className={`text-2xl font-black ${burnout >= 60 ? 'text-red-500' : burnout >= 40 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {burnout}<span className="text-xs opacity-50">%</span>
                                </p>
                            </div>
                            <div className="bg-card border border-border/50 p-3 rounded-xl text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Toxicity</p>
                                <p className={`text-2xl font-black ${(toxicityScore || 0) >= 60 ? 'text-red-500' : (toxicityScore || 0) >= 35 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                    {toxicityScore || "—"}<span className="text-xs opacity-50">/100</span>
                                </p>
                            </div>
                        </div>

                        {/* ── THE "HOW DO THEY KNOW THIS" PARAGRAPH ── */}
                        <div className="max-w-2xl mx-auto text-left bg-card border border-border/60 rounded-2xl p-6 space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                You're in a <strong className="text-foreground">{duration || ""}</strong> relationship{attachmentStyle ? <> with a <strong className="text-foreground">{attachmentStyle}</strong> attachment pattern</> : null}{phase ? <>, currently stuck in <strong className="text-foreground">{phase}</strong></> : null}.
                                {partnerStyle ? <> Your partner {partnerStyleShort} during conflict.</> : null}
                                {repairFreq ? <> You {repairFreq === "always" ? "repair quickly" : repairFreq === "sometimes" ? "sometimes repair" : repairFreq === "rarely" ? "rarely repair" : "almost never repair"} after arguments.</> : null}
                            </p>

                            {topAlarm && (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Your most critical signal: <strong className="text-red-600 dark:text-red-400">{topAlarm.label} at {topAlarm.val}%</strong> — {topAlarm.desc}.
                                </p>
                            )}

                            {topPositive && (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    But there's something important: your <strong className="text-emerald-600 dark:text-emerald-400">{topPositive.label} is {topPositive.val}%</strong> — {topPositive.desc}. This means there's still something to fight for.
                                </p>
                            )}

                            {biggestFear && (
                                <p className="text-sm text-foreground font-medium leading-relaxed border-t border-border/50 pt-3">
                                    You told us your biggest fear is: <em>"{biggestFear}"</em>. The full report addresses this directly — with data, not reassurance.
                                </p>
                            )}
                        </div>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            <strong className="text-foreground">The question isn't whether you have a problem. You already know you do. The question is: do you understand it well enough to fix it?</strong>
                        </p>
                    </div>

                    {/* ─── BLOCK 2: BENEFITS WITH VALUE ANCHORS (hyper-personal) ─── */}
                    <div className="space-y-8 mb-16">
                        <h3 className="text-2xl font-black text-center text-foreground">What Your Full Report Unlocks</h3>

                        {/* Benefit 1: The full cycle analysis */}
                        <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mt-1">
                                    <Activity size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-foreground">Why "{diagnosis}" keeps repeating — and how to break it</h4>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1 hidden md:block">$99 standalone</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        You've tried talking. You've tried apologizing. You've tried giving space. None of it works because you're treating symptoms, not the structure. Your Repair Rate is {repairEff}% — {repairEff < 40 ? "meaning most fights never actually get resolved, they just get buried" : repairEff < 70 ? "meaning you recover, but the same issues keep resurfacing" : "which is decent, but the cycle still repeats because speed of repair isn't the problem"}. The report maps the complete cycle and shows where it can be interrupted.
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-2 italic">A therapist charges $150/session and takes 4-6 sessions to reach this diagnosis.</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefit 2: Scripts */}
                        <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mt-1">
                                    <MessageCircle size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-foreground">5 word-for-word scripts for a partner who {partnerStyleShort}</h4>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1 hidden md:block">$49 standalone</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {partnerStyleShort === "shuts down"
                                            ? "When they stonewall, your nervous system interprets it as rejection. So you pursue harder — which makes them withdraw more. These scripts bypass the shutdown by removing the perceived threat."
                                            : partnerStyleShort === "escalates"
                                            ? "When they escalate, matching their energy feels instinctive but it pours gasoline on the fire. These scripts de-escalate without conceding — so you stay heard without the explosion."
                                            : partnerStyleShort === "deflects blame"
                                            ? "When they deflect, you end up defending yourself instead of addressing the issue. These scripts sidestep the blame game entirely and redirect to the actual problem."
                                            : "These scripts are designed to make difficult conversations feel safe enough to actually have — so avoidance stops being the default."
                                        }
                                        {" "}Exact phrases, the tone to use, and what to do if they react defensively.
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-2 italic">Communication coaching packages start at $200+.</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefit 3: Forecast — uses sustainability + silent divorce */}
                        <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mt-1">
                                    <TrendingDown size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-foreground">Your 5-year forecast — and whether you still have time</h4>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1 hidden md:block">$49 standalone</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Your Sustainability Score is {sustainability}%{sustainability < 40 ? " — in the critical zone" : sustainability < 60 ? " — declining" : ""}.
                                        {silentDivorce > 60
                                            ? ` Your Silent Divorce Risk is ${silentDivorce}%. You may not be fighting, but you're also not connecting — and that quiet erosion is statistically harder to reverse than open conflict.`
                                            : betrayalVuln > 60
                                            ? ` Your Betrayal Vulnerability is ${betrayalVuln}%. When emotional needs go unmet long enough, the risk of outside connection grows — not because anyone is "bad," but because unmet needs seek an outlet.`
                                            : ` The report shows the specific timeline: what happens at 6 months, 3 years, and 5 years if nothing changes — and the exact intervention window you're in right now.`
                                        }
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-2 italic">Predictive relationship assessments cost $300-500 with a clinical psychologist.</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefit 4: Toxicity screen */}
                        <div className="bg-card border border-red-200 dark:border-red-900/50 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 h-10 w-10 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center mt-1">
                                    <ShieldAlert size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-red-700 dark:text-red-400">The answer to the question you're afraid to ask</h4>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1 hidden md:block">$49 standalone</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Your Toxicity Score is {toxicityScore || "—"}/100{malice > 50 ? ` and your Resentment Index is ${malice}% — you're starting to see your partner as the problem instead of the pattern` : ""}. Is this a rough patch, a structural incompatibility, or something darker? The full report gives you a definitive clinical assessment — not ambiguity, not "it depends." {toxicityScore && toxicityScore >= 60 ? "Including safety scripts and a clear action plan." : "Including exactly where the line is for YOUR situation."}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-2 italic">Specialized abuse screening assessments cost $200-400.</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefit 5: 30-day plan — uses phase + erotic data */}
                        <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 h-10 w-10 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mt-1">
                                    <ListChecks size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-foreground">A 30-day plan you can start tomorrow morning</h4>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1 hidden md:block">$79 standalone</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Week-by-week. Daily actions under 10 minutes. Success metrics so you know it's working.
                                        {ceoIntern > 60
                                            ? ` Your power imbalance score is ${ceoIntern}% — week 1 starts with rebalancing the mental load before anything else can improve.`
                                            : eroticSpiral > 60
                                            ? ` Your intimacy erosion score is ${eroticSpiral}% — the plan addresses desire reconnection before it's too late.`
                                            : ` Designed specifically for the "${diagnosis}" pattern — not generic relationship advice.`
                                        }
                                        {eroticPotential > 60 ? ` Your Hidden Spark score is ${eroticPotential}% — the desire isn't gone, it's buried. The plan is designed to uncover it.` : ""}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 mt-2 italic">Structured therapy homework programs are billed as additional sessions ($150+/each).</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── BLOCK 3: PREMIUMS (INSIDE THE OFFER) ─── */}
                    <div className="mb-16">
                        <div className="text-center mb-8">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Included Free — $194 Value</span>
                            <h3 className="text-2xl font-black text-foreground mt-2">+ 5 Clinical PDF Guides</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { name: "Mental Load Equalizer", icon: <FileText size={18} />, value: "$47", metric: ceoIntern, threshold: 50 },
                                { name: "Dead Bedroom Revival", icon: <Heart size={18} />, value: "$39", metric: eroticSpiral, threshold: 50 },
                                { name: "Narcissist Detection", icon: <ShieldAlert size={18} />, value: "$47", metric: toxicityScore || 0, threshold: 50 },
                                { name: "Emotional Affair Warning", icon: <MessageCircle size={18} />, value: "$47", metric: betrayalVuln, threshold: 50 },
                                { name: "Stay or Go Matrix", icon: <Compass size={18} />, value: "$14", metric: sustainability < 40 ? 100 : 0, threshold: 50 },
                            ].map((guide, idx) => (
                                <div key={`premium-${idx}`} className={`bg-card border rounded-xl p-4 text-center space-y-2 relative hover:-translate-y-1 transition-all duration-200 ${guide.metric >= guide.threshold ? 'border-primary/50 ring-1 ring-primary/20 shadow-md' : 'border-border shadow-sm'}`}>
                                    {guide.metric >= guide.threshold && (
                                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap z-10">
                                            Critical for you
                                        </span>
                                    )}
                                    <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto">
                                        {guide.icon}
                                    </div>
                                    <p className="text-xs font-bold text-foreground leading-tight">{guide.name}</p>
                                    <p className="text-[10px] text-destructive line-through">{guide.value}</p>
                                    <p className="text-[9px] font-bold text-success">Included</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── BLOCK 4: PRICE REVEAL + RATIONALE + GUARANTEE + CTA ─── */}
                    <div className="bg-card rounded-3xl shadow-2xl border-2 border-primary overflow-hidden relative">
                        <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-primary to-purple-500"></div>
                        <div className="p-8 md:p-12">

                            {/* Value total */}
                            <div className="text-center mb-8">
                                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Value of Everything Above</p>
                                <p className="text-4xl font-black text-foreground line-through decoration-red-500 decoration-2 opacity-60">$520+</p>
                            </div>

                            {/* Rationale — NO AI mention */}
                            <div className="max-w-xl mx-auto text-center mb-8 space-y-3">
                                <h3 className="text-xl font-bold text-foreground">Why this costs $29 instead of $520</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    A therapist charges $150/session. It takes 4-6 sessions just to identify your pattern — that's $600-900 and 6 weeks before they even start helping.
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We automated the diagnostic phase using the same clinical frameworks therapists use (Gottman, Attachment Theory, Cluster B screening) — so you get the same depth of analysis at a fraction of the cost. <strong className="text-foreground">This doesn't replace therapy. It replaces the 6 weeks of expensive guesswork that comes before therapy starts working.</strong>
                                </p>
                            </div>

                            {/* Report ready callout */}
                            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-3 text-center rounded-xl text-sm font-medium text-green-800 dark:text-green-300 mb-6 max-w-lg mx-auto">
                                <strong>Your report is already generated.</strong> Personalized to your 30 answers and waiting to be unlocked.
                                {session?.createdAt && (() => {
                                    const expiresAt = new Date(session.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
                                    const msRemaining = expiresAt - Date.now();
                                    const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
                                    const hoursRemaining = Math.floor((msRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

                                    return msRemaining > 0
                                        ? <span className="block mt-2 text-xs font-bold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg py-2 px-3">
                                            <Clock size={12} className="inline mr-1 -mt-0.5" />
                                            Session expires in {daysRemaining}d {hoursRemaining}h — unlock now to preserve your analysis
                                          </span>
                                        : <span className="block mt-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg py-2 px-3">
                                            Session data expiring — unlock now before it's lost
                                          </span>;
                                })()}
                            </div>

                            {/* Price */}
                            <div className="text-center mb-6">
                                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Price Today</p>
                                <p className="text-6xl font-black text-primary">${import.meta.env.REACT_APP_REPORT_PRICE || "29.00"}</p>
                                <p className="text-sm text-muted-foreground mt-2">Less than a single therapy copay. Less than a dinner where you both stare at your phones.</p>
                            </div>

                            {/* Guarantee — INSIDE the card, before CTA */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 md:p-6 mb-8 max-w-lg mx-auto flex items-start gap-4">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                        <Shield className="text-yellow-600 dark:text-yellow-400 w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">The "Lightbulb Moment" Guarantee</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        If you don't have at least one moment where you think <strong className="text-foreground">"that's EXACTLY what happens"</strong> — full refund. No questions. 90 days. We've analyzed thousands of relationships. If your report doesn't nail your situation, that's on us.
                                    </p>
                                </div>
                            </div>

                            {/* ORDER BUMP */}
                            <div className="w-full bg-yellow-50 dark:bg-yellow-900/10 border-2 border-dashed border-yellow-400 p-4 rounded-xl text-left cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors mb-8 max-w-lg mx-auto" onClick={() => setAddOrderBump(!addOrderBump)}>
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-5 w-5 shrink-0 rounded border flex items-center justify-center transition-colors ${addOrderBump ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border'}`}>
                                        {addOrderBump && <Check size={14} strokeWidth={4} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-sm leading-tight mb-2">
                                            YES! Add the <span className="text-primary">30-Day Reconnection Workbook</span> for just $12.
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-relaxed mb-2 font-medium">
                                            The report tells you <em>what's wrong.</em> Without this, you'll understand the problem but won't <em>do anything about it</em>.
                                        </p>
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                            <li className="flex items-start gap-2"><CheckCircle size={12} className="text-primary mt-0.5 shrink-0" /> <span className="leading-tight">5-minute daily exercises that rewire the pattern</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle size={12} className="text-primary mt-0.5 shrink-0" /> <span className="leading-tight">Word-for-word scripts for the 3 conversations that matter most</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle size={12} className="text-primary mt-0.5 shrink-0" /> <span className="leading-tight">Track your progress — see the dynamic shift week by week</span></li>
                                        </ul>
                                        <div className="mt-3 inline-block bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                            Most Chosen Add-On
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => handleCheckout('offer_cta')}
                                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold py-5 px-12 rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                                >
                                    {isCheckoutLoading ? "Processing..." : `Unlock My Full Analysis — $${addOrderBump ? 41 : 29}`} <ArrowRight size={24} />
                                </button>
                                <div className="flex items-center justify-center gap-4 mt-6 text-muted-foreground">
                                    <FaCcVisa className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                    <FaCcMastercard className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                    <FaCcPaypal className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                    <FaApplePay className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                    <FaGooglePay className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-4">Secure One-Time Payment • Instant Access</p>
                                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                                    <div className="flex text-yellow-500">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
                                    <span>Trusted by <strong className="text-foreground">52,847+</strong> couples</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                        );
                    })()}
                </div>

                {/* Sticky Mobile CTA */}
                <div className={`fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-md border-t border-border/50 p-4 md:hidden transform transition-transform duration-300 z-50 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}>
                    <button
                        onClick={handleScrollToOffer}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-full shadow-2xl flex items-center justify-center gap-2 mb-3"
                    >
                        Unlock My Full Analysis <ArrowRight size={20} />
                    </button>
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
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

            {/* FAQ — Collapsible accordion */}
            <div className="max-w-3xl mx-auto space-y-8 mt-16 px-6">
                <h3 className="text-2xl font-bold text-center mb-12 text-foreground">Common Questions & Concerns</h3>

                <div className="space-y-3">
                    {[
                        { q: "Can't I just figure this out on my own?", a: "You've been trying. That's why you took the test. The problem isn't intelligence - it's perspective. You can't read the label from inside the bottle. This analysis gives you the outside view - the clinical lens that cuts through emotions and shows you the STRUCTURE." },
                        { q: "What if my partner refuses to read it?", a: "47% of our users never show it to their partner. They use it to change their OWN behavior - which inevitably forces the dynamic to shift. You don't need their permission to understand the pattern." },
                        { q: "What if it tells me something I don't want to hear?", a: "Then you NEED to hear it. The worst thing isn't a painful truth - it's wasting 5 more years on a comfortable lie. You already KNOW something is wrong. That's why you took the test. The analysis doesn't create problems - it NAMES them." },
                        { q: "Is this therapy?", a: "No, this is triage. Therapy requires finding a doctor, waiting weeks, and spending thousands. This report gives you the immediate diagnostic clarity you need right now to decide your next step." },
                        { q: "What if I'm the problem?", a: "That's actually the most empowering discovery possible. Because you can control YOUR behavior. Most people discover they're BOTH part of the problem - one pattern triggering another. That means you can BOTH fix it." },
                        { q: "Is my data safe?", a: "100%. We don't sell data. We don't share answers. You can delete your account and all data at any time." }
                    ].map((item, i) => (
                        <div key={`faq-${i}`} className="border border-border rounded-xl overflow-hidden">
                            <button
                                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                className="w-full flex justify-between items-center p-5 text-left font-bold text-foreground hover:bg-muted/30 transition-colors"
                            >
                                <span>"{item.q}"</span>
                                {faqOpen === i ? <ChevronUp size={20} className="text-muted-foreground shrink-0 ml-4" /> : <ChevronDown size={20} className="text-muted-foreground shrink-0 ml-4" />}
                            </button>
                            {faqOpen === i && (
                                <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-4">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-foreground text-muted py-12 text-center text-sm border-t border-border">
                <div className="max-w-4xl mx-auto px-6 space-y-4">
                    <p className="text-muted-foreground/60">&copy; 2026 UnderstandYourPartner.com &bull; All Rights Reserved</p>
                    <div className="flex justify-center gap-4 text-muted-foreground/60">
                        <span className="cursor-pointer hover:text-primary-foreground">Privacy Policy</span>
                        <span>&bull;</span>
                        <span className="cursor-pointer hover:text-primary-foreground">Terms of Service</span>
                        <span>&bull;</span>
                        <span className="cursor-pointer hover:text-primary-foreground">Contact Support</span>
                    </div>
                    <p className="max-w-xl mx-auto text-xs text-muted-foreground/40 mt-6">
                        Disclaimer: This analysis is based on psychological frameworks (Gottman, Attachment Theory) but is not a substitute for professional clinical therapy. If you are in immediate danger, please contact local authorities.
                    </p>
                </div>
            </footer>



            {/* EmailCaptureModal removed — users always have email in new session model */}

        </div >
    );
}
