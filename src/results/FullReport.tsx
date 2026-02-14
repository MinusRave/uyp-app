import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, CheckCircle, AlertTriangle, TrendingUp, Shield, Heart, BadgeCheck, Compass, Zap, X, Activity, ChevronDown, Check, Eye, Microscope, ListChecks, ShieldAlert, Clock, MessageCircle, Brain, Quote, Star, Play, TrendingDown, Battery, Thermometer, FileWarning, Download, FileText, Loader2 } from "lucide-react";
import { useQuery, generateQuickOverview, generateFullReport, getTestSession } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import { api } from "wasp/client/api";
import { config } from "wasp/client";
import GaugeChart from "../components/GaugeChart";
import Confetti from "react-confetti";
import { NarcissismSection } from "./sections/NarcissismSection";
import { FutureForecastSection } from "./sections/FutureForecastSection";
import { PulseSection } from "./sections/PulseSection";
// DimensionCard is defined locally below.
// Routes import removed (unused)

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

// --- COMPONENTS ---

const BiomarkerStrip = ({ label, score, description, icon, color = "red" }: any) => {
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

                    {/* TEXT */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const DimensionCard = ({
    title, description, icon, status, teaser, metricInsight, blurredText, onUnlock, visible, metricName, metricScore, isGoodMetric = true, deepDive, specificItems, specificItemsLabel, impactText, unlockCopy, isSymptom
}: any) => {

    const isCritical = status?.toUpperCase().includes("RISK") || status?.toUpperCase().includes("CRITICAL") || isSymptom;
    const scoreColor = isGoodMetric ? (metricScore > 60 ? "text-green-500" : "text-yellow-500") : (metricScore > 50 ? "text-red-500" : "text-yellow-500");

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${isCritical ? 'border-red-200 dark:border-red-900/50' : 'border-slate-200 dark:border-slate-800'} shadow-sm overflow-hidden transition-all hover:shadow-md`}>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4">
                <div className="flex gap-4">
                    <div className={`p-3 rounded-xl h-fit ${isCritical ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                            {isCritical && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Attention</span>}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
                    </div>
                </div>
                {/* Metric Badge */}
                <div className="hidden sm:block text-right">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">{metricName}</span>
                    <span className={`text-xl font-black ${scoreColor}`}>{metricScore}%</span>
                </div>
            </div>

            {/* Content (Fully Unlocked) */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/10 space-y-6">
                {/* 1. Deep Dive */}
                {deepDive && (
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Microscope size={12} /> Analysis
                        </h4>
                        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                            {Array.isArray(deepDive) ? deepDive.map((p: any, i: number) => <p key={i}>{p}</p>) : <p>{deepDive}</p>}
                        </div>
                    </div>
                )}

                {/* 2. Specific Items */}
                {specificItems && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <ListChecks size={12} /> {specificItemsLabel || "Key Observations"}
                        </h4>
                        <ul className="space-y-2">
                            {Array.isArray(specificItems) ? specificItems.map((item: any, i: number) => (
                                <li key={i} className="flex gap-2 items-start text-sm text-slate-600 dark:text-slate-400">
                                    <span className="text-indigo-500 mt-0.5">•</span>
                                    <span>{item}</span>
                                </li>
                            )) : (
                                <li className="text-sm text-slate-600">{specificItems}</li>
                            )}
                        </ul>
                    </div>
                )}

                {/* 3. Impact */}
                {impactText && (
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Activity size={12} /> Clinical Impact
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic border-l-2 border-indigo-200 dark:border-indigo-900 pl-3">
                            "{impactText}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- DOWNLOAD GUIDES COMPONENT ---
const GuideCard = ({ title, format, desc, icon, color, filename, sessionId }: any) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!filename) return;
        try {
            setDownloading(true);
            // DIRECT PUBLIC DOWNLOAD (Simpler, faster, reliable)
            // Files are in public/secure_downloads_v1/
            const downloadUrl = `/secure_downloads_v1/${filename}`;

            // Trigger download via new tab/window
            window.open(downloadUrl, '_blank');
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to initiate download. Please try again.");
        } finally {
            // Short delay to reset button state
            setTimeout(() => setDownloading(false), 1000);
        }
    };

    return (
        <div className="group relative">
            {/* 3D Document Effect */}
            <div className="relative bg-card border border-border aspect-[3/4] rounded-r-xl shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl overflow-hidden flex flex-col h-full bg-white dark:bg-slate-900">
                {/* Spine/Binding */}
                <div className={`absolute left-0 top-0 bottom-0 w-3 border-r border-slate-200 dark:border-slate-700 ${color.bgLight}`}></div>

                {/* Header / Cover Top */}
                <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${color.bgLight} ${color.text}`}>
                            {icon}
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{format}</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white min-h-[3rem]">{title}</h3>
                </div>

                {/* Body */}
                <div className="p-6 flex-grow bg-slate-50 dark:bg-slate-800/20">
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                        {desc}
                    </p>
                </div>

                {/* Footer / Action */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${color.btnBg} ${color.btnText} hover:opacity-90 disabled:opacity-50`}
                    >
                        {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {downloading ? "Opening..." : "Download PDF"}
                    </button>
                </div>
            </div>
            {/* Stacked Paper Effect underneath */}
            <div className="absolute top-2 left-2 w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-xl shadow-sm -z-10"></div>
            <div className="absolute top-4 left-4 w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-xl shadow-sm -z-20"></div>
        </div>
    );
};


export default function FullReport() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    // For FullReport, we assume user is logged in or verified via authRequired: true
    // But we still need the sessionId.
    // If entered via magic link, sessionId might be in URL or localStorage.
    // If entered via Post-Payment redirect, sessionId is in URL query param.

    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const urlSessionId = searchParams.get("session_id");
    const localSessionId = typeof window !== "undefined" ? localStorage.getItem("uyp-session-id") : null;

    const sessionIdToUse = urlSessionId || localSessionId || undefined;

    // 1. Fetch Session
    const { data: session, isLoading: isSessionLoading } = useQuery(getTestSession, { sessionId: sessionIdToUse });

    // 2. Local State for AI Results
    const [quickOverview, setQuickOverview] = useState<QuickOverviewData | null>(null);
    const [fullReport, setFullReport] = useState<FullReportData | null>(null);
    const [loadingQuick, setLoadingQuick] = useState(false);
    const [loadingFull, setLoadingFull] = useState(false);

    // Guards
    const quickOverviewInitiated = useRef(false);
    const fullReportInitiated = useRef(false);

    // Validate Payment
    useEffect(() => {
        if (!isSessionLoading && session) {
            if (!session.isPaid) {
                // Redirect to Teaser if not paid
                navigate("/results");
            }
        }
    }, [session, isSessionLoading, navigate]);


    // 3. Trigger AI Calls on Load (if not present)
    useEffect(() => {
        if (!session || !session.id) return;

        // Quick Overview
        if (session.quickOverview && Object.keys(session.quickOverview as object).length > 0) {
            setQuickOverview(session.quickOverview as any);
            quickOverviewInitiated.current = true;
        } else if (!quickOverviewInitiated.current && !loadingQuick) {
            quickOverviewInitiated.current = true;
            setLoadingQuick(true);
            generateQuickOverview({ sessionId: session.id })
                .then((res: any) => setQuickOverview(res.json))
                .catch((err: any) => { console.error(err); quickOverviewInitiated.current = false; })
                .finally(() => setLoadingQuick(false));
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
    }, [session?.id]);

    if (isSessionLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Activity className="animate-spin text-primary" /></div>;
    if (!session) return <div className="min-h-screen flex items-center justify-center">Session not found.</div>;
    if (!session.isPaid) return null; // Redirection handled in useEffect

    // Render Logic
    const metrics = (session.advancedMetrics as any) || {};

    // Use Overview data or Fallbacks
    const headline = quickOverview?.hero?.headline || "Analysis Complete";
    const badge = quickOverview?.hero?.result_badge || "Analysis Complete";
    const summary = quickOverview?.pulse?.summary || "We are synthesizing your data against 45 emotional markers...";


    // --- METRICS CONFIG (Copied from src/test/metricsConfig.ts to avoid build issues) ---
    const FULL_METRICS_CONFIG = [
        { id: "sustainability_forecast", title: "The Crystal Ball", description: "Predicts if your current path leads to long-term growth or a dead end.", icon: <Compass size={20} /> },
        { id: "erotic_death_spiral", title: "The Parent-Trap", description: "Measures how much 'managing' your partner is killing your sex life.", icon: <Heart size={20} /> },
        { id: "betrayal_vulnerability", title: "The Open Door", description: "How likely an outside emotional or physical connection could disrupt the bond.", icon: <ShieldAlert size={20} /> },
        { id: "repair_efficiency", title: "The Bounce Back", description: "Your relationship's 'immune system'—how quickly you recover after a fight.", icon: <TrendingUp size={20} /> },
        { id: "duty_sex_index", title: "The Tactical Truce", description: "Are you having sex because you want to, or just to keep the peace?", icon: <Battery size={20} /> },
        { id: "ceo_vs_intern", title: "The Office Manager", description: "Measures the imbalance of 'worrying and planning' vs. just 'showing up'.", icon: <BadgeCheck size={20} /> },
        { id: "silent_divorce_risk", title: "The Quiet Quit", description: "High risk for couples who 'never fight' but have emotionally checked out.", icon: <FileWarning size={20} /> },
        { id: "compatibility_quotient", title: "The Soulmate Sync", description: "Measures if your core life values and 'future dreams' actually match.", icon: <Compass size={20} /> },
        { id: "internalized_malice", title: "The Enemy Within", description: "Are you starting to see your partner as a 'bad person' rather than a teammate?", icon: <Shield size={20} /> },
        { id: "nervous_system_load", title: "The Burnout Rate", description: "The physical and mental toll this relationship is taking on your body.", icon: <Activity size={20} /> },
        { id: "erotic_potential", title: "The Hidden Spark", description: "Tells you if the 'fire' is still there but just covered by domestic stress.", icon: <Zap size={20} /> },
        { id: "resilience_battery", title: "The Anchor Score", description: "How much 'shared history' and core trust you have to survive a crisis.", icon: <Battery size={20} /> }
    ];

    return (
        <div className="min-h-screen bg-background font-sans pb-24 text-foreground selection:bg-primary selection:text-primary-foreground">
            <Confetti recycle={false} numberOfPieces={500} />

            {/* 1. HERO SECTION (Updated to match TeaserPageNew) */}
            <header className="bg-background pt-12 pb-20 px-6 relative overflow-hidden text-center border-b border-border/40">
                {/* Dynamic Background based on Risk */}
                <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${(session.narcissismAnalysis as any)?.score > 40 ? 'from-orange-500/20 via-background to-background' : 'from-primary/10 via-background to-background'} -z-20`} />

                <div className="max-w-4xl mx-auto space-y-6 relative z-10 animate-fade-in">
                    <div className="flex justify-center mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold uppercase tracking-widest">
                            <CheckCircle size={14} /> Analysis Unlocked
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4">
                        Your Relationship<br className="hidden md:block" /> Decoding Report
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        The complete clinical breakdown of your relationship dynamics, future trajectory, and the specific steps to fix it.
                    </p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 -mt-8 space-y-12 relative z-10 transition-all">

                {/* 2. CRITICAL INSIGHTS: NARCISSISM & TOXICITY */}
                <div className="transform hover:scale-[1.01] transition-transform duration-300">
                    <NarcissismSection
                        analysis={session.narcissismAnalysis as any}
                        isPaid={true}
                        onUnlock={() => { }}
                    />
                </div>

                {/* 3. RELATIONSHIP PULSE */}
                <PulseSection
                    analysis={fullReport?.chapter1_pulse}
                    quickOverview={quickOverview}
                    metrics={metrics}
                    isPaid={true}
                    onUnlock={() => { }}
                />

                {/* 4. FUTURE FORECAST */}
                <FutureForecastSection
                    analysis={fullReport?.chapter1_pulse}
                    quickOverview={quickOverview}
                    isPaid={true}
                    onUnlock={() => { }}
                />

                {/* 5. DIMENSION BREAKDOWN (DEEP DIVE) */}
                <div className="space-y-8">
                    <div className="text-center py-6 space-y-2">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Detailed Diagnostic</h3>
                        <div className="h-1 w-20 bg-primary/20 mx-auto rounded-full"></div>
                        <p className="text-muted-foreground max-w-lg mx-auto text-lg font-medium">
                            Deep dive into the 5 Core Dimensions.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {/* A. Communication */}
                        <DimensionCard
                            title="Communication Efficiency"
                            description="How effectively you resolve conflict and repair connection."
                            icon={<TrendingUp />}
                            status={quickOverview?.dimensions?.communication?.status || "Analyzing..."}
                            teaser={quickOverview?.dimensions?.communication?.teaser}
                            metricInsight={quickOverview?.dimensions?.communication?.metric_insight}
                            visible={true}
                            metricName="Repair Efficiency"
                            metricScore={metrics.repair_efficiency || 40}
                            deepDive={fullReport?.chapter2_communication?.deep_dive}
                            specificItems={fullReport?.chapter2_communication?.specific_triggers}
                            specificItemsLabel="Specific Triggers Identified"
                            impactText={fullReport?.chapter2_communication?.impact_on_other_dimensions}
                            isSymptom={(metrics.repair_efficiency || 40) < 60}
                        />

                        {/* B. Emotional Safety */}
                        <DimensionCard
                            title="Emotional Safety"
                            description="The foundation of trust and vulnerability in your relationship."
                            icon={<Shield />}
                            status={quickOverview?.dimensions?.security?.status || "Analyzing..."}
                            teaser={quickOverview?.dimensions?.security?.teaser}
                            metricInsight={quickOverview?.dimensions?.security?.metric_insight}
                            visible={true}
                            metricName="Betrayal Vulnerability"
                            metricScore={metrics.betrayal_vulnerability || 65}
                            isGoodMetric={false}
                            deepDive={fullReport?.chapter3_security?.deep_dive}
                            specificItems={fullReport?.chapter3_security?.hypervigilance_triggers}
                            specificItemsLabel="Hypervigilance Triggers"
                            impactText={fullReport?.chapter3_security?.impact_on_daily_life}
                            isSymptom={(metrics.betrayal_vulnerability || 65) > 40}
                        />

                        {/* C. Sex & Intimacy */}
                        <DimensionCard
                            title="Intimacy & Connection"
                            description="Physical connection, desire, and the 'spark'."
                            icon={<Heart />}
                            status={quickOverview?.dimensions?.erotic?.status || "Analyzing..."}
                            teaser={quickOverview?.dimensions?.erotic?.teaser}
                            metricInsight={quickOverview?.dimensions?.erotic?.metric_insight}
                            visible={true}
                            metricName="Erotic Connection"
                            metricScore={metrics.erotic_death_spiral ? 100 - metrics.erotic_death_spiral : 30}
                            isGoodMetric={false}
                            deepDive={fullReport?.chapter4_erotic?.deep_dive}
                            specificItems={fullReport?.chapter4_erotic?.specific_blockers}
                            specificItemsLabel="Desire Blockers"
                            impactText={fullReport?.chapter4_erotic?.polarity_analysis}
                            isSymptom={(metrics.erotic_death_spiral || 68) > 40}
                        />

                        {/* D. Power & Fairness */}
                        <DimensionCard
                            title="Power Balance & Fairness"
                            description="Mental load, decision making, and partnership equity."
                            icon={<BadgeCheck />}
                            status={quickOverview?.dimensions?.balance?.status || "Analyzing..."}
                            teaser={quickOverview?.dimensions?.balance?.teaser}
                            metricInsight={quickOverview?.dimensions?.balance?.metric_insight}
                            visible={true}
                            metricName="Power Imbalance"
                            metricScore={metrics.ceo_vs_intern || 45}
                            isGoodMetric={false}
                            deepDive={fullReport?.chapter5_balance?.deep_dive}
                            specificItems={[fullReport?.chapter5_balance?.mental_load_breakdown, fullReport?.chapter5_balance?.resentment_pattern].filter(Boolean)}
                            specificItemsLabel="Mental Load Dynamics"
                            impactText={fullReport?.chapter5_balance?.impact_on_attraction}
                            isSymptom={(metrics.ceo_vs_intern || 58) > 40}
                        />

                        {/* E. Shared Future */}
                        <DimensionCard
                            title="Shared Vision"
                            description="Alignment on long-term goals, dreams, and life trajectory."
                            icon={<Compass />}
                            status={quickOverview?.dimensions?.compass?.status || "Analyzing..."}
                            teaser={quickOverview?.dimensions?.compass?.teaser}
                            metricInsight={quickOverview?.dimensions?.compass?.metric_insight}
                            visible={true}
                            metricName="Compatibility"
                            metricScore={metrics.compatibility_quotient || 90}
                            deepDive={fullReport?.chapter6_compass?.deep_dive}
                            specificItems={[fullReport?.chapter6_compass?.vision_compatibility, fullReport?.chapter6_compass?.dream_erosion, fullReport?.chapter6_compass?.trajectory_warning].filter(Boolean)}
                            specificItemsLabel="Future Alignment Factors"
                            impactText={fullReport?.chapter6_compass?.impact_on_longevity}
                            isSymptom={(metrics.compatibility_quotient || 90) < 60}
                        />
                    </div>
                </div>

                {/* 5A. COMPREHENSIVE BIOMARKER REPORT (All 12 Metrics) */}
                <section className="mt-16 mb-12">
                    <div className="text-center space-y-4 mb-8">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                            <Activity size={16} /> Clinical Pathology
                        </h3>
                        <h2 className="text-3xl font-black text-foreground">
                            12-Point Biomarker Analysis
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            A granular look at the hidden drivers of your relationship health.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FULL_METRICS_CONFIG.map((metric) => (
                            <BiomarkerStrip
                                key={metric.id}
                                label={metric.title}
                                score={metrics[metric.id] || 0} // Default to 0 if missing
                                color={(metrics[metric.id] || 0) > 70 ? "red" : (metrics[metric.id] || 0) > 40 ? "orange" : "amber"}
                                icon={metric.icon}
                                description={metric.description}
                            />
                        ))}
                    </div>
                </section>

                {/* 6. SYSTEMIC ANALYSIS (Chapter 7) */}
                <section className="bg-card dark:bg-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden mt-12 relative border border-border/50">
                    <div className="bg-card/50 backdrop-blur-sm p-8 text-center space-y-8 relative">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-foreground">
                                Connecting The Dots
                            </h2>
                            <p className="text-muted-foreground">
                                How your dimensions interact to create your specific relationship loop.
                            </p>
                        </div>

                        <div className="space-y-4 text-left max-w-3xl mx-auto">
                            <div className="flex gap-4 p-6 bg-secondary/20 rounded-xl border border-border/50">
                                <div className="bg-primary/20 p-3 rounded h-fit shrink-0"><Zap size={20} className="text-primary" /></div>
                                <p className="text-foreground text-sm md:text-base leading-relaxed font-medium">{fullReport?.chapter7_synthesis?.connection_1 || "Analyzing systemic connection..."}</p>
                            </div>
                            <div className="flex gap-4 p-6 bg-secondary/20 rounded-xl border border-border/50">
                                <div className="bg-primary/20 p-3 rounded h-fit shrink-0"><Zap size={20} className="text-primary" /></div>
                                <p className="text-foreground text-sm md:text-base leading-relaxed font-medium">{fullReport?.chapter7_synthesis?.connection_2 || "Analyzing systemic connection..."}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. ACTION PLAN (Chapter 8) */}
                <section className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 rounded-3xl p-1 shadow-2xl overflow-hidden mt-12 text-emerald-50">
                    <div className="bg-black/20 backdrop-blur-sm p-8 md:p-12 text-center space-y-10 relative">
                        <div className="space-y-4">
                            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200 text-3xl md:text-4xl font-black">
                                Your Recovery Roadmap
                            </h2>
                            <p className="text-emerald-100/80 text-lg">
                                Immediate steps to reverse the negative trends.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
                            {/* Stop Doing */}
                            <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-emerald-200 font-bold mb-6 flex items-center gap-2 text-xl">
                                    <X size={24} className="text-red-400" /> Stop Doing This
                                </h3>
                                <ul className="space-y-4 text-emerald-100/90">
                                    {fullReport?.chapter8_roadmap?.stop_doing?.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="text-red-400 font-bold mt-1">•</span>
                                            <span className="text-sm md:text-base leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Scripts */}
                            <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-emerald-200 font-bold mb-6 flex items-center gap-2 text-xl">
                                    <MessageCircle size={24} className="text-green-400" /> Say This Instead
                                </h3>
                                <div className="space-y-4 text-emerald-100/90">
                                    {fullReport?.chapter8_roadmap?.scripts?.map((script: string, idx: number) => (
                                        <div key={idx} className="bg-black/20 p-4 rounded-xl border-l-4 border-emerald-400 italic text-sm md:text-base leading-relaxed">
                                            "{script}"
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* 8. GUIDES DOWNLOAD SECTION */}
                <section className="py-12 mt-12 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-center mb-12 space-y-4">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs animate-pulse">Available For Download</span>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Your Premium Clinical Guides</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            These specialized protocols are included with your plan. Download them to your device.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Guide 1 */}
                        <GuideCard
                            title="The Mental Load Equalizer"
                            format="PDF Protocol"
                            desc="Spreadsheet tools and scripts to rebalance household management responsibilities without conflict."
                            icon={<FileText size={24} />}
                            color={{ bgLight: "bg-indigo-500/20", text: "text-indigo-500", btnBg: "bg-indigo-600", btnText: "text-white" }}
                            filename="mental-load-equalizer.pdf"
                            sessionId={session?.id}
                        />
                        {/* Guide 2 */}
                        <GuideCard
                            title="Dead Bedroom Revival"
                            format="Clinical Guide"
                            desc="Techniques to bypass psychological 'brakes' and accelerate desire in long-term relationships."
                            icon={<Heart size={24} />}
                            color={{ bgLight: "bg-pink-500/20", text: "text-pink-500", btnBg: "bg-pink-600", btnText: "text-white" }}
                            filename="dead-bedroom-revival.pdf"
                            sessionId={session?.id}
                        />
                        {/* Guide 3 */}
                        <GuideCard
                            title="Narcissist Detection"
                            format="Safety Screen"
                            desc="Clinical checklist to distinguish between 'difficult' traits and dangerous pathology."
                            icon={<ShieldAlert size={24} />}
                            color={{ bgLight: "bg-orange-500/20", text: "text-orange-500", btnBg: "bg-orange-600", btnText: "text-white" }}
                            filename="narcissist-detection-manual.pdf"
                            sessionId={session?.id}
                        />
                        {/* Guide 4 */}
                        <GuideCard
                            title="Emotional Affair Screen"
                            format="Assessment"
                            desc="Identify the 19 subtle signs of micro-cheating before it escalates to physical infidelity."
                            icon={<MessageCircle size={24} />}
                            color={{ bgLight: "bg-blue-500/20", text: "text-blue-500", btnBg: "bg-blue-600", btnText: "text-white" }}
                            filename="emotional-affair-warning.pdf"
                            sessionId={session?.id}
                        />
                        {/* Guide 5 */}
                        <GuideCard
                            title="Should I Stay or Should I Go?"
                            format="Decision Matrix"
                            desc="The framework used by therapists to help patients make the hardest choice of their lives with zero regret."
                            icon={<Compass size={24} />}
                            color={{ bgLight: "bg-gray-500/20", text: "text-gray-500", btnBg: "bg-gray-700", btnText: "text-white" }}
                            filename="stay-or-go-matrix.pdf"
                            sessionId={session?.id}
                        />
                    </div>
                </section>

            </main>
        </div>
    );
}
