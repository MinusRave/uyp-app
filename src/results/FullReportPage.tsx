import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { useQuery, getTestSession, generateExecutiveAnalysis, translateMessage, claimSession } from "wasp/client/operations";
import { Loader2, Lock, Clock, CheckCircle, CheckCircle2, AlertTriangle, ArrowRight, Heart, MessageCircle, MessageSquare, Eye, Shield, Zap, Quote, BarChart3, BookOpen, Sparkles, FileText, ChevronDown, TrendingDown, Repeat, Target, Lightbulb, Share2, Brain } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { DistortionGraph } from "../components/DistortionGraph"; // Keep for legacy or replace? User wants grid.
import { LensRadar } from "../components/LensRadar";
// import { AttachmentRadar } from "../components/AttachmentRadar"; // Replaced by Dual
import { RelationshipPhaseChart } from "../components/RelationshipPhaseChart";
// import { TrajectoryGraph } from '../components/TrajectoryGraph'; // Replaced
import { RoadmapGantt } from '../components/RoadmapGantt';
import { RelationshipCycle } from '../components/RelationshipCycle';
import { TherapyFlowchart } from '../components/TherapyFlowchart';
import { Activity } from 'lucide-react';

// NEW COMPONENTS
import { TableOfContents } from "./components/TableOfContents";
import { CompatibilityPulse } from "./components/CompatibilityPulse";
import { TrajectoryChart } from "./components/TrajectoryChart";
import { DistortionGrid } from "./components/DistortionGrid";
import { DualAttachmentRadar } from "./components/DualAttachmentRadar";
import { ConflictDecoder } from "./components/ConflictDecoder";
import { RedFlagsSection } from "./components/RedFlagsSection";
import { TranslatorTool } from "./components/TranslatorTool";
import { IntimacyAnalysisSection } from "./components/IntimacyAnalysisSection";
import { DimensionDeepDive } from "./components/DimensionDeepDive";
import { trackPixelEvent } from "../analytics/pixel";

import { OnboardingWizard } from "./components/OnboardingWizard";
import { CompatibilityCard } from "./components/CompatibilityCard";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../client/components/ui/accordion";

// Helper Interface for Report Data (mirrors backend structure)
interface FullReportData {
    cover: { title: string; subtitle: string; opening: string; };
    snapshot: { summary: string; dominantLens: string; };
    primaryLens: {
        lensName: string;
        activates: string;
        need: string;
        fear: string;
        stateName: string;
        analysis: string;
    };
    /* Legacy lists preserved for backward compat if needed, but we focus on new sections */
    dimensionsDetailed?: {
        id: string;
        score: {
            state: string;
            SL: number;
            PM: number;
            prescription: {
                analysis: string;
            };
        };
    }[];
    alignedAreas: { dimension: string; text: string; }[];
    misreadAreas: { dimension: string; feel: string; assume: string; distortion_origin: string; }[];
    // NEW VISUALS
    visualData?: {
        dimension: string;
        label: string;
        sensitivity: number;
        interpretation: number;
    }[];
    recurringLoop: { text: string; explanation: string; }; // Kept for now
    whatThisCreates: { text: string; origin: string; };
    practicalActions: { observe: string; communicate: string; regulate: string; }; // Legacy, can keep or hide

    // NEW SECTIONS
    scripts: { dimension: string; inTheMoment: string; repair: string; }[];
    partnerTranslations: { dimension: string; text: string; }[];

    // NEW: Compatibility
    compatibility?: {
        overallScore: number;
        breakdown: {
            dimension: string;
            score: number;
            status: string;
            insight: string;
        }[];
        riskLevel: string;
        topRecommendation: string;
    };

    questions: { dimension: string; questions: string[]; }[];
    closing: string;
}

export default function FullReportPage() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;
    const { data: session, isLoading, error } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

    const [urlSearchParams] = useSearchParams();
    const success = urlSearchParams.get("success");
    const sessionIdParam = urlSearchParams.get("session_id");

    const claimedSessionRef = React.useRef<string | null>(null);

    useEffect(() => {
        if (success === "true" && sessionIdParam) {
            const trackedKey = `uyp-tracked-purchase-${sessionIdParam}`;
            if (!localStorage.getItem(trackedKey)) {
                trackPixelEvent('Purchase', {
                    value: parseFloat(import.meta.env.REACT_APP_REPORT_PRICE || "29.00"),
                    currency: 'USD',
                    eventID: sessionIdParam
                });
                localStorage.setItem(trackedKey, 'true');
            }
        }
    }, [success, sessionIdParam]);

    useEffect(() => {
        if (!isLoading) {
            if (session && !session.isPaid) {
                navigate("/results");
            } else if (!session) {
                // handle no session
            }

            // CLAIM SESSION LOGIC
            if (user && session && !session.userId && session.id !== claimedSessionRef.current) {
                claimedSessionRef.current = session.id;
                claimSession({ sessionId: session.id }).catch(console.error);
            }
        }
    }, [isLoading, session, navigate, user]);

    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Parse AI Analysis (Split Executive vs Deep Dives)
    const [executiveSummary, setExecutiveSummary] = useState<string>("");
    const [deepDiveContent, setDeepDiveContent] = useState<Record<string, string>>({});

    const [protocolTitle, setProtocolTitle] = useState<string>("The Neural Protocol");

    useEffect(() => {
        if (aiAnalysis) {
            // 1. Split Executive (Cold Truth) vs Premium (Protocol)
            const [executivePart, deepDivePart] = aiAnalysis.split('DEEP DIVE APPENDIX');

            // Simply remove the delimiter to let headers drive the sectioning
            setExecutiveSummary(executivePart.replace('<<<PREMIUM_SPLIT>>>', '\n\n'));

            if (deepDivePart) {
                setDeepDiveContent(extractDeepDiveAnalysis(deepDivePart));
            }
        }
    }, [aiAnalysis, protocolTitle]);

    useEffect(() => {
        const fetchAI = async () => {
            if (session && session.scores && !aiAnalysis) {
                const scores = session.scores as any;

                setIsAiLoading(true);
                try {
                    const dimensions = Object.entries(scores.dimensions || {}).map(([key, val]: [string, any]) => ({
                        id: key,
                        sl: val.SL,
                        pm: val.PM,
                        state: val.state
                    }));

                    const result = await generateExecutiveAnalysis({
                        dominantLens: scores.dominantLens,
                        dimensions: dimensions,
                        userContext: (session as any).conflictDescription || undefined,
                        sessionId: session.id // NEW: Pass explicit ID
                    });
                    setAiAnalysis(result.markdown);
                } catch (e) {
                    console.error("AI Generation failed", e);
                } finally {
                    setIsAiLoading(false);
                }
            }
        };
        fetchAI();
    }, [session]);

    const tocSections = [
        { id: 'section-executive', label: '01. Executive Summary', time: '2 min' },
        { id: 'section-health', label: '02. Relationship Health', time: '3 min' },
        { id: 'section-pattern', label: '03. Your Pattern', time: '3 min' },
        { id: 'section-communication', label: '04. Bad Fights', time: 'Deep Dive' },
        { id: 'section-emotional_safety', label: '05. Emotional Safety', time: 'Deep Dive' },
        { id: 'section-physical_intimacy', label: '06. Intimacy', time: 'Deep Dive' },
        { id: 'section-power_fairness', label: '07. Fairness', time: 'Deep Dive' },
        { id: 'section-future_values', label: '08. Future', time: 'Deep Dive' },
        { id: 'section-bottom_line', label: '09. The Bottom Line', time: 'Final Verdict' },
    ];

    const [activeSection, setActiveSection] = useState('section-executive');

    useEffect(() => {
        const handleScroll = () => {
            const sections = tocSections.map(s => document.getElementById(s.id));
            const scrollPos = window.scrollY + 300; // Trigger earlier

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPos) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
    }

    if (!session || !session.isPaid) {
        return <div className="text-center p-10">Redirecting...</div>;
    }

    // Safe cast details
    const scores = session.scores as any;
    const report = scores?.report as FullReportData | undefined;

    if (!report) {
        return <div className="p-10 text-center">Report data not found. Please contact support.</div>;
    }

    // Isolate Dominant Scripts
    const dominantScript = report.scripts?.find(s => s.dimension === report.snapshot.dominantLens);
    const dominantTranslation = report.partnerTranslations?.find(s => s.dimension === report.snapshot.dominantLens);

    // Check if onboarding should be shown
    if (!session.onboardingCompleted && dominantScript) {
        return (
            <OnboardingWizard
                sessionId={session.id}
                dominantPattern={report.snapshot.dominantLens}
                scripts={{
                    inTheMoment: dominantScript.inTheMoment,
                    repair: dominantScript.repair,
                }}
                onComplete={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 pb-24 relative">

            {/* Table of Contents - Sticky Sidebar */}
            <TableOfContents sections={tocSections} activeSection={activeSection} />

            {/* Emergency Button (Floating) */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => navigate('/emergency')}
                    className="bg-destructive text-destructive-foreground font-bold py-3 px-6 rounded-full shadow-lg hover:bg-destructive/90 transition-all flex items-center gap-2 animate-pulse"
                >
                    <Zap size={20} fill="currentColor" />
                    I'm Triggered
                </button>
            </div>

            {/* Cover Section */}
            <header className="py-20 px-6 md:px-12 text-center max-w-4xl mx-auto border-b border-border/50 lg:pl-80">
                <div className="uppercase tracking-widest text-xs font-bold text-primary mb-4">CONFIDENTIAL USER MANUAL</div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-primary">
                    {report.cover.title}
                </h1>

                {/* BLUNT MIRROR SENTENCE */}
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-8 max-w-2xl mx-auto">
                    <p className="text-lg font-medium text-foreground">
                        "Your body reacts before your brain. That’s why this feels out of control — even when you love each other."
                    </p>
                </div>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
                    {report.cover.subtitle}
                </p>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 space-y-24 lg:pl-80 relative z-0">

                {/* 01. Executive Summary */}
                <section id="section-executive" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="text-primary animate-pulse" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">01. Executive Analysis</h2>
                    </div>

                    <div className="min-h-[200px]">
                        {isAiLoading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                                <div className="h-32 bg-muted rounded-xl mt-4"></div>
                                <div className="flex justify-center mt-4">
                                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={12} />
                                        Generating your personalized deep dive...
                                    </span>
                                </div>
                            </div>
                        ) : executiveSummary ? (
                            <MirrorInsightCards content={executiveSummary} />
                        ) : (
                            <div className="bg-card p-8 rounded-3xl border border-destructive/20 text-center">
                                <p className="text-muted-foreground italic">Analysis could not be generated at this time.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 02. Relationship Health (Compatibility) */}
                <section id="section-health" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-6">
                        <Heart className="text-red-500" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">02. Relationship Health</h2>
                    </div>

                    <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
                        <h3 className="text-2xl font-bold mb-8 text-center">Compatibility Pulse</h3>
                        <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto">
                            How your nervous systems interact under stress. This score reflects your ability to repair, not just your fight frequency.
                        </p>
                        <CompatibilityPulse score={report.compatibility?.overallScore || 50} />

                        {/* REALITY CHECK / THE VERDICT */}
                        <div className="mt-8 text-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">The Reality Check</h4>
                            {(!report.compatibility?.overallScore || report.compatibility.overallScore < 40) ? (
                                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                    "This relationship is currently unsafe for your emotional health. Without radical change, it will not survive."
                                </p>
                            ) : report.compatibility.overallScore < 60 ? (
                                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                    "You are running on fumes. The resentment is building faster than the love can replenish it."
                                </p>
                            ) : report.compatibility.overallScore < 80 ? (
                                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                                    "Workable, but fragile. You have the raw materials for a great relationship, but your patterns are getting in the way."
                                </p>
                            ) : (
                                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                    "Thriving. You have a rare and resilient bond that can withstand conflict."
                                </p>
                            )}
                        </div>

                        {/* Breakdown if available */}
                        {report.compatibility?.breakdown && (
                            <div className="grid md:grid-cols-2 gap-4 mt-8">
                                {report.compatibility.breakdown.map((item, idx) => (
                                    <div key={idx} className="bg-secondary/10 p-4 rounded-xl flex justify-between items-center">
                                        <span className="font-bold text-sm">{item.dimension}</span>
                                        <div className={`text-xs font-bold uppercase px-2 py-1 rounded bg-white dark:bg-black/20 ${item.status === 'Strength' ? 'text-green-600' : 'text-orange-600'
                                            }`}>
                                            {item.status} ({item.score}%)
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* What This Score Means - NEW */}
                        {(() => {
                            const overallScore = report.compatibility?.overallScore || 50;
                            return (
                                <div className="mt-10 bg-secondary/5 rounded-2xl p-6 border border-border">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <Target size={20} className="text-primary" />
                                        What Does {overallScore}% Mean?
                                    </h4>

                                    {overallScore >= 70 ? (
                                        <div className="space-y-4">
                                            <p className="text-foreground/90 leading-relaxed">
                                                <strong className="text-green-600 dark:text-green-400">You're in the Green Zone.</strong> Your relationship has a strong foundation.
                                                Most couples at this level report feeling "generally happy" but know there's room to grow.
                                            </p>
                                            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-900/30">
                                                <p className="text-sm font-bold text-green-900 dark:text-green-300 mb-2">Your Focus:</p>
                                                <p className="text-sm text-green-900 dark:text-green-200">
                                                    Maintain your repair rituals and address the 1-2 friction points before they become patterns.
                                                    The scripts below will help you fine-tune your communication.
                                                </p>
                                            </div>
                                        </div>
                                    ) : overallScore >= 40 ? (
                                        <div className="space-y-4">
                                            <p className="text-foreground/90 leading-relaxed">
                                                <strong className="text-yellow-600 dark:text-yellow-400">You're in the Yellow Zone.</strong> Your relationship is functional but strained.
                                                You're likely feeling "stuck" or "disconnected" more often than not.
                                            </p>
                                            <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-900/30">
                                                <p className="text-sm font-bold text-yellow-900 dark:text-yellow-300 mb-2">Your Focus:</p>
                                                <p className="text-sm text-yellow-900 dark:text-yellow-200">
                                                    Break the 1-2 dominant patterns causing the most pain. The Deep Dive sections and Circuit Breaker script
                                                    are your starting point. Consistency over the next 30 days is key.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-foreground/90 leading-relaxed">
                                                <strong className="text-red-600 dark:text-red-400">You're in the Red Zone.</strong> Your relationship is in crisis mode.
                                                You're likely asking yourself "Is this worth it?" more than you'd like to admit.
                                            </p>
                                            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200 dark:border-red-900/30">
                                                <p className="text-sm font-bold text-red-900 dark:text-red-300 mb-2">Your Focus:</p>
                                                <p className="text-sm text-red-900 dark:text-red-200">
                                                    Stop the bleeding. Use the Circuit Breaker Script when things escalate.
                                                    If you can't de-escalate within 48 hours, consider professional support. This report gives you the roadmap,
                                                    but you may need a guide.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 pt-6 border-t border-border">
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            <strong>Benchmark:</strong> The average couple scores 55-65%. Couples in therapy average 35-50%.
                                            Thriving couples (the top 15%) score 75%+. Your score isn't a judgment—it's a starting line.
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </section>

                {/* 03. Your Pattern (Cycle) */}
                <section id="section-pattern" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-6">
                        <Repeat className="text-orange-500" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">03. Your Pattern: "The Loop"</h2>
                    </div>

                    {/* Pattern Context - NEW */}
                    <div className="mb-8 bg-rose-50 dark:bg-rose-900/10 rounded-2xl p-6 border border-rose-100 dark:border-rose-800">
                        <h4 className="font-bold text-lg mb-3 text-rose-700 dark:text-rose-300">
                            Why This Pattern Exists
                        </h4>
                        <p className="text-foreground/80 mb-4 leading-relaxed">
                            This isn't about blame. This pattern formed because <strong>both of you are trying to feel safe</strong>,
                            but your strategies are opposite. When you {
                                report.snapshot.dominantLens === 'communication' ? 'pursue clarity' :
                                    report.snapshot.dominantLens === 'emotional_safety' ? 'seek reassurance' :
                                        report.snapshot.dominantLens === 'physical_intimacy' ? 'initiate connection' :
                                            report.snapshot.dominantLens === 'power_fairness' ? 'demand fairness' : 'push for alignment'
                            }, they feel pressured. When they withdraw, you panic. Repeat.
                        </p>

                        <div className="bg-white dark:bg-black/20 rounded-xl p-4 border border-rose-200 dark:border-rose-900">
                            <p className="text-sm font-bold text-rose-800 dark:text-rose-200 mb-2">The Hidden Cost:</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                Every time this loop runs, you lose a little trust. A little intimacy. A little hope.
                                If this continues for 6-12 months, one of you will emotionally check out.
                                <strong> That's when "I love you but I'm not in love with you" starts.</strong>
                            </p>
                        </div>
                    </div>

                    <div className="bg-background rounded-3xl p-6 md:p-12 shadow-xl border border-border mb-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
                        <h3 className="text-2xl font-bold mb-8 text-center capitalize">The {report.snapshot.dominantLens.replace('_', ' ')} Cycle</h3>
                        <RelationshipCycle
                            myLens={report.snapshot.dominantLens}
                            partnerLens={report.snapshot.dominantLens.includes('anxiety') ? 'avoidant' : 'anxious'}
                        />
                    </div>

                    {/* Conflict Decoder Logic */}
                    <ConflictDecoder conflictText={(session as any).conflictDescription || "We fight about small things"} />
                </section>

                {/* 04. Emergency Scripts (Moved UP) */}
                {report.scripts && report.scripts.length > 0 && (
                    <section id="section-scripts" className="scroll-mt-24">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 animate-pulse">
                                <Zap size={12} fill="currentColor" /> Priority Action
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Emergency Scripts</h2>
                            <p className="text-lg text-muted-foreground">Stop the spiral before it takes over. Use these immediately.</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-1">
                            {/* Only show the dominant script prominently here */}
                            {dominantScript && (
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-[2rem] blur opacity-30"></div>
                                    <div className="relative bg-background rounded-[1.75rem] p-8 md:p-12 border border-red-100 dark:border-red-900/30 shadow-2xl">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Zap size={24} /></div>
                                            <div>
                                                <h4 className="font-bold text-xl">Protocol: {dominantScript.dimension.replace('_', ' ')}</h4>
                                                <div className="text-xs text-red-500 font-bold uppercase tracking-wide">Primary Trigger Response</div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* When to Use */}
                                            <div>
                                                <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                                                    <AlertTriangle size={18} className="text-red-600" />
                                                    When to Use This:
                                                </h5>
                                                <ul className="space-y-2 text-foreground/80">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-red-600 font-bold mt-1 shrink-0">•</span>
                                                        <span>You feel your heart racing or your voice getting louder</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-red-600 font-bold mt-1 shrink-0">•</span>
                                                        <span>You're about to say something you'll regret</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-red-600 font-bold mt-1 shrink-0">•</span>
                                                        <span>You notice the same fight starting AGAIN</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* The Script */}
                                            <div className="bg-red-50 dark:bg-red-900/10 p-6 md:p-8 rounded-2xl border-2 border-red-500">
                                                <div className="text-xs font-bold uppercase text-red-600 mb-3 tracking-wide">SAY THIS OUT LOUD:</div>
                                                <p className="font-serif italic text-2xl md:text-3xl leading-relaxed text-foreground">
                                                    "{dominantScript.inTheMoment}"
                                                </p>
                                            </div>

                                            {/* What Happens Next */}
                                            <div>
                                                <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                                                    <ArrowRight size={18} className="text-blue-600" />
                                                    What Happens Next:
                                                </h5>
                                                <ol className="space-y-3 text-foreground/80">
                                                    <li className="flex items-start gap-3">
                                                        <span className="font-bold text-blue-600 shrink-0">1.</span>
                                                        <span><strong>They might resist.</strong> "No, we need to talk NOW." Stay firm. Repeat the script.</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="font-bold text-blue-600 shrink-0">2.</span>
                                                        <span><strong>Take 20 minutes.</strong> Walk, breathe, splash water on your face. Do NOT rehearse your argument.</span>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <span className="font-bold text-blue-600 shrink-0">3.</span>
                                                        <span><strong>Come back.</strong> Start with "I want to understand you" instead of "You need to understand me."</span>
                                                    </li>
                                                </ol>
                                            </div>

                                            {/* Why It Works */}
                                            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                                                <h5 className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                                                    <Brain size={16} />
                                                    Why This Works:
                                                </h5>
                                                <p className="text-sm text-foreground/80 leading-relaxed">
                                                    When you're flooded (heart rate above 100bpm), your prefrontal cortex shuts down.
                                                    You literally cannot think clearly. This script buys you time to get your brain back online
                                                    so you can actually solve the problem instead of making it worse.
                                                </p>
                                            </div>

                                            {/* Repair Script */}
                                            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border-l-4 border-blue-500">
                                                <div className="text-xs font-bold uppercase text-blue-600 mb-2">THE REPAIR (Use This Later):</div>
                                                <p className="text-lg leading-relaxed text-foreground/90">
                                                    "{dominantScript.repair}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Detailed Breakdown & Recommendation (NEW VALUE ADD) */}
                            {report.compatibility && report.compatibility.breakdown ? (
                                <div className="mt-8 grid md:grid-cols-2 gap-6">
                                    <div className="bg-background/50 rounded-2xl p-6 border border-border/50">
                                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Share2 size={18} className="text-primary" />
                                            Data Breakdown
                                        </h4>
                                        <div className="space-y-4">
                                            {report.compatibility.breakdown.map((item: any, idx: number) => (
                                                <div key={idx} className="bg-white dark:bg-black/20 p-3 rounded-xl border border-black/5">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold uppercase text-muted-foreground">{item.dimension}</span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === 'aligned' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                            item.status === 'opposite' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                            }`}>
                                                            {item.status === 'aligned' ? 'Strong Match' : item.status === 'opposite' ? 'Friction Point' : 'Tension'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium leading-tight opacity-90">{item.insight}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-background/50 rounded-2xl p-6 border border-border/50 flex flex-col justify-center">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Target size={24} />
                                            </div>
                                            <h4 className="font-bold text-lg mb-2">Top Recommendation</h4>
                                            <p className="text-xl font-serif italic text-foreground/80 leading-relaxed">
                                                "{report.compatibility.topRecommendation}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 text-center">
                                    <p className="text-sm font-bold text-yellow-800 dark:text-yellow-400 mb-1">Compatibility Insight Unavailable</p>
                                    <p className="text-xs text-muted-foreground">We need your conflict details (Wizard Step 3) to generate this breakdown.</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* --- 5 DIMENSION DEEP DIVES --- */}

                {/* --- 5 DIMENSION DEEP DIVES --- */}

                {/* Helper to extract AI content safely */}

                <DimensionDeepDive
                    dimensionKey="communication"
                    answers={(session as any)?.answers || {}}
                    aiAnalysis={deepDiveContent['communication'] || report.dimensionsDetailed?.find(d => d.id === 'communication')?.score.prescription.analysis}
                />

                <DimensionDeepDive
                    dimensionKey="emotional_safety"
                    answers={(session as any)?.answers || {}}
                    aiAnalysis={deepDiveContent['emotional_safety'] || report.dimensionsDetailed?.find(d => d.id === 'emotional_safety')?.score.prescription.analysis}
                />

                <DimensionDeepDive
                    dimensionKey="physical_intimacy"
                    answers={(session as any)?.answers || {}}
                    aiAnalysis={deepDiveContent['physical_intimacy'] || report.dimensionsDetailed?.find(d => d.id === 'physical_intimacy')?.score.prescription.analysis}
                />

                <DimensionDeepDive
                    dimensionKey="power_fairness"
                    answers={(session as any)?.answers || {}}
                    aiAnalysis={deepDiveContent['power_fairness'] || report.dimensionsDetailed?.find(d => d.id === 'power_fairness')?.score.prescription.analysis}
                />

                <DimensionDeepDive
                    dimensionKey="future_values"
                    answers={(session as any)?.answers || {}}
                    aiAnalysis={deepDiveContent['future_values'] || report.dimensionsDetailed?.find(d => d.id === 'future_values')?.score.prescription.analysis}
                />

                {/* THE BOTTOM LINE */}
                {deepDiveContent['bottom_line'] && (
                    <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 mt-12 mb-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <Quote size={120} />
                        </div>
                        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-primary">The Bottom Line</h3>
                            <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full"></div>
                            <div className="prose prose-lg prose-invert dark:prose-invert mx-auto text-foreground/90 font-medium leading-relaxed">
                                {deepDiveContent['bottom_line'].split('\n').map((line, i) => (
                                    <p key={i} className="mb-4">{line}</p>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Closing */}
                <footer className="text-center py-20 bg-gradient-to-b from-transparent to-primary/5 rounded-t-3xl mt-12">
                    <p className="text-2xl font-serif italic max-w-2xl mx-auto mb-8">
                        "{report.closing}"
                    </p>
                    <div className="text-sm text-muted-foreground">
                        UnderstandYourPartner &copy; {new Date().getFullYear()}
                    </div>
                </footer>

            </main>
        </div >
    );
}



// MirrorInsightCards - Displays analysis as a series of beautiful therapeutic insight cards
function MirrorInsightCards({ content }: { content: string }) {
    // 1. Normalize content
    const normalizedContent = content
        .replace(/---/g, '\n<HR_MARKER>\n')
        .replace(/\\n/g, '\n')
        .replace(/(\#{1,3})\s/g, '\n$1 ')
        .replace(/\n{3,}/g, '\n\n');

    const sections = parseInsights(normalizedContent);

    return (
        <div className="space-y-6 md:space-y-8">
            {sections.map((section, index) => {
                const style = getSectionStyle(section.title);
                const Icon = style.icon;

                // Special layout for the very first "Title" card if it exists and is short
                if (index === 0 && section.title.toLowerCase().includes('deep mirror')) {
                    return (
                        <div key={index} className="text-center mb-10">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                                {section.title}
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto"></div>
                            {section.content && <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">{section.content}</p>}
                        </div>
                    );
                }

                return (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-500 hover:shadow-xl ${style.containerClass}`}
                    >
                        {/* Decorative background icon */}
                        <div className={`absolute -right-6 -top-6 opacity-[0.03] transform rotate-12 ${style.highlightClass}`}>
                            <Icon size={200} />
                        </div>

                        <div className="p-8 md:p-10 relative z-10">
                            <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                {/* Icon Column */}
                                <div className={`shrink-0`}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${style.iconClass}`}>
                                        <Icon size={28} strokeWidth={2.5} />
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="flex-1">
                                    <h4 className={`text-2xl md:text-3xl font-bold mb-6 ${style.highlightClass}`}>
                                        {section.title}
                                    </h4>

                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <SimpleMarkdown content={section.content} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Smart styling based on section title keywords
function getSectionStyle(title: string) {
    const lower = title.toLowerCase();

    if (lower.includes('truth') || lower.includes('core')) {
        return {
            icon: Sparkles,
            containerClass: "bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800",
            triggerClass: "hover:bg-purple-50/80 dark:hover:bg-purple-900/20",
            iconClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
            labelClass: "text-purple-600 dark:text-purple-400",
            highlightClass: "text-purple-700 dark:text-purple-300"
        };
    }
    if (lower.includes('cost') || lower.includes('toll') || lower.includes('pain') || lower.includes('distortion')) {
        return {
            icon: TrendingDown,
            containerClass: "bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800",
            triggerClass: "hover:bg-rose-50/80 dark:hover:bg-rose-900/20",
            iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300",
            labelClass: "text-rose-600 dark:text-rose-400",
            highlightClass: "text-rose-700 dark:text-rose-300"
        };
    }
    if (lower.includes('decoder') || lower.includes('loop') || lower.includes('cycle') || lower.includes('conflict')) {
        return {
            icon: Repeat,
            containerClass: "bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800",
            triggerClass: "hover:bg-orange-50/80 dark:hover:bg-orange-900/20",
            iconClass: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300",
            labelClass: "text-orange-600 dark:text-orange-400",
            highlightClass: "text-orange-700 dark:text-orange-300"
        };
    }
    if (lower.includes('partner') || lower.includes('their') || lower.includes('view') || lower.includes('perspective')) {
        return {
            icon: Eye,
            containerClass: "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800",
            triggerClass: "hover:bg-blue-50/80 dark:hover:bg-blue-900/20",
            iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
            labelClass: "text-blue-600 dark:text-blue-400",
            highlightClass: "text-blue-700 dark:text-blue-300"
        };
    }
    if (lower.includes('forward') || lower.includes('path') || lower.includes('action') || lower.includes('solution') || lower.includes('growth')) {
        return {
            icon: Target,
            containerClass: "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800",
            triggerClass: "hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20",
            iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
            labelClass: "text-emerald-600 dark:text-emerald-400",
            highlightClass: "text-emerald-700 dark:text-emerald-300"
        };
    }
    if (lower.includes('insight') || lower.includes('key') || lower.includes('realization')) {
        return {
            icon: Lightbulb,
            containerClass: "bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-800",
            triggerClass: "hover:bg-yellow-50/80 dark:hover:bg-yellow-900/20",
            iconClass: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300",
            labelClass: "text-yellow-600 dark:text-yellow-400",
            highlightClass: "text-yellow-700 dark:text-yellow-300"
        };
    }

    // NEW: Personal Script Rewrite (Golden Style)
    if (lower.includes('script') || lower.includes('rewrite') || lower.includes('instead')) {
        return {
            icon: Sparkles, // Or maybe a Pen/Edit icon if imported
            containerClass: "bg-amber-50/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 shadow-md transform hover:-translate-y-1",
            triggerClass: "hover:bg-amber-100 dark:hover:bg-amber-900/40",
            iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
            labelClass: "text-amber-600 dark:text-amber-400",
            highlightClass: "text-amber-700 dark:text-amber-400 font-serif italic"
        };
    }

    // Default
    return {
        icon: FileText,
        containerClass: "bg-gray-50/50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-700",
        triggerClass: "hover:bg-gray-50/80 dark:hover:bg-gray-800/30",
        iconClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
        labelClass: "text-gray-500",
        highlightClass: "text-primary"
    };
}

// Improved Parser: Cleans titles and structure
function parseInsights(content: string): { title: string; content: string }[] {
    const lines = content.split('\n');
    const sections: { title: string; content: string }[] = [];
    let currentTitle = '';
    let currentContent = '';

    // Regex to match headers but STRIP the # marks and any trailing ** or ::
    const headerRegex = /^(#{1,3})\s+(.*)/;

    // Helper to push section
    const pushSection = (title: string, body: string) => {
        const cleanTitle = title.replace(/\*\*/g, '').replace(/:/g, '').trim();
        const cleanBody = body.trim();
        if (cleanTitle || cleanBody) {
            sections.push({ title: cleanTitle || "Insight", content: cleanBody });
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();
        const headerMatch = trimmed.match(headerRegex);

        if (headerMatch || trimmed === '<HR_MARKER>') {
            // If we have accumulated content, push it
            if (currentTitle || currentContent) {
                pushSection(currentTitle, currentContent);
            }

            // Start new section
            if (trimmed === '<HR_MARKER>') {
                // If marker, just reset, next line might be header or content
                currentTitle = '';
                currentContent = '';
            } else if (headerMatch) {
                currentTitle = headerMatch[2]; // Capture group 2 is the text
                currentContent = '';
            }
        } else {
            currentContent += line + '\n';
        }
    }

    // Final push
    if (currentTitle || currentContent) {
        pushSection(currentTitle, currentContent);
    }

    // Filter out completely empty or garbage sections
    const validSections = sections.filter(s => {
        const cleanContent = s.content.trim();
        // Drop if empty
        if (cleanContent.length === 0 && !s.title) return false;
        // Drop if just a stray character like # or -
        if (cleanContent.length < 3 && /^[\W_]+$/.test(cleanContent)) return false;
        // Drop if title is "Insight" (default) but content is empty
        if (s.title === "Insight" && cleanContent.length === 0) return false;

        return true;
    });

    // FALLBACK: If parsing led to zero valid sections (but we had content), 
    // it probably means the format wasn't markdown headers. Treat whole thing as one block.
    if (validSections.length === 0 && content.trim().length > 0) {
        return [{ title: "Executive Analysis", content: content }];
    }

    return validSections;
}

function SimpleMarkdown({ content }: { content: string }) {
    if (!content) return null;

    // 1. Pre-process: Handle "---" as explicit section breaks if they lack newlines, 
    // and split by newlines to process line-by-line.
    const normalizedContent = content
        .replace(/---/g, '\n<HR_MARKER>\n')
        .replace(/\\n/g, '\n'); // Handle escaped newlines if coming from JSON

    const lines = normalizedContent.split('\n');

    return (
        <div className="space-y-4 font-serif text-lg leading-relaxed text-foreground/90">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-2" />;

                // Horizontal Rule / Section Break
                if (trimmed === '<HR_MARKER>') {
                    return <div key={i} className="my-8 border-t-2 border-primary/10 w-1/3 mx-auto" />;
                }

                // Headers
                if (trimmed.startsWith('# ')) {
                    return <h1 key={i} className="text-3xl md:text-4xl font-bold mt-10 mb-6 text-primary tracking-tight">{formatText(trimmed.replace('# ', ''))}</h1>;
                }
                if (trimmed.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-foreground/80 flex items-center gap-2">
                        {/* Optional: Add icon based on header content if desired, for now just text */}
                        {formatText(trimmed.replace('## ', ''))}
                    </h2>;
                }
                if (trimmed.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-bold mt-6 mb-2 text-primary/80 uppercase tracking-wide text-sm">{formatText(trimmed.replace('### ', ''))}</h3>;
                }

                // Lists
                // Handle "âœ… **Title**" specific style
                if (trimmed.startsWith('✅')) {
                    return (
                        <div key={i} className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30 my-4">
                            <div className="flex gap-3 items-start">
                                <span className="text-xl mt-1">✅</span>
                                <div>{formatText(trimmed.replace('✅', ''))}</div>
                            </div>
                        </div>
                    );
                }

                // Bullet points
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return (
                        <div key={i} className="flex gap-3 pl-2 md:pl-4">
                            <span className="text-primary font-bold mt-1.5 leading-none">•</span>
                            <span>{formatText(trimmed.replace(/^[-*] /, ''))}</span>
                        </div>
                    );
                }

                // Numbered lists
                if (/^\d+\.\s/.test(trimmed)) {
                    const [num, ...rest] = trimmed.split('.');
                    return (
                        <div key={i} className="flex gap-2 pl-2 md:pl-4">
                            <span className="text-primary font-bold">{num}.</span>
                            <span>{formatText(rest.join('.').trim())}</span>
                        </div>
                    );
                }

                // Blockquotes / Truth Bombs
                if (trimmed.startsWith('> ')) {
                    return (
                        <div key={i} className="my-8 relative pl-6 border-l-4 border-primary/30">
                            <Quote className="absolute -top-2 -left-3 bg-background text-primary" size={20} fill="currentColor" />
                            <p className="text-2xl md:text-3xl font-serif italic text-primary/90 leading-tight">
                                "{formatText(trimmed.replace('> ', ''))}"
                            </p>
                        </div>
                    );
                }

                // Standard Paragraph
                // Check if it's a short "Punch" line (under 60 chars) to make it stand out more?
                const isPunchLine = trimmed.length < 80 && !trimmed.includes('.') && i > 0;

                return (
                    <p key={i} className={`
                        ${isPunchLine ? 'text-xl md:text-2xl font-bold text-foreground/80 my-6' : 'text-lg md:text-xl text-foreground/80 leading-relaxed mb-6'}
                    `}>
                        {formatText(trimmed)}
                    </p>
                );
            })}
        </div>
    );
}

// Helper to handle Bold (**text**) and Italic (*text*) formatting
function formatText(text: string): React.ReactNode[] {
    // Split by bold patterns first
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, i) => {
        // Handle Bold
        if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2);
            return <strong key={i} className="font-bold text-primary bg-primary/10 px-1 rounded mx-0.5">{formatItalics(content)}</strong>;
        }
        // Handle Iterables within non-bold text
        return <span key={i}>{formatItalics(part)}</span>;
    });
}

function formatItalics(text: string): React.ReactNode[] {
    const parts = text.split(/(\*.*?\*)/g); // Simple italic regex, careful with * lists handled above
    return parts.map((part, j) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return <em key={j} className="italic text-foreground/80">{part.slice(1, -1)}</em>;
        }
        return part;
    });
}

// Helper to extract the Deep Dive map from the appendix
// Helper to extract the Deep Dive map from the appendix
// Helper to extract the Deep Dive map and Bottom Line
function extractDeepDiveAnalysis(appendix: string): Record<string, string> {
    const map: Record<string, string> = {};

    // Standardize newlines
    const text = appendix.replace(/\r\n/g, '\n');

    // Regex to match "[[TAG:KEY]]" blocks
    // Matches: [[DIMENSION:COMMUNICATION]] or [[SECTION:BOTTOM_LINE]]
    const blockRegex = /\[\[(DIMENSION|SECTION):([A-Z_]+)\]\]/g;

    // Find all matches
    let match;
    const matches: { key: string, start: number, end: number }[] = [];

    while ((match = blockRegex.exec(text)) !== null) {
        matches.push({
            key: match[2].toLowerCase(), // e.g., "communication" or "bottom_line"
            start: match.index,
            end: match.index + match[0].length
        });
    }

    // Extract content between matches
    for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        const next = matches[i + 1];

        // Content starts after the current tag ends
        const contentStart = current.end;
        // Content ends at the start of the next tag, or end of string
        const contentEnd = next ? next.start : text.length;

        const content = text.slice(contentStart, contentEnd).trim();
        if (content) {
            map[current.key] = content;
        }
    }

    // BACKWARD COMPATIBILITY: If no strict tags found, fall back to "## DIMENSION:" split
    if (Object.keys(map).length === 0) {
        const sections = appendix.split('## DIMENSION:');
        const keyMap: Record<string, string> = {
            "communication": "communication",
            "emotional safety": "emotional_safety",
            "physical intimacy": "physical_intimacy",
            "power dynamics": "power_fairness",
            "future values": "future_values"
        };
        sections.forEach(section => {
            const trimmed = section.trim();
            if (!trimmed) return;
            const lines = trimmed.split('\n');
            const rawKey = lines[0].trim().toLowerCase();
            const mappedKey = keyMap[rawKey] || rawKey.replace(/ /g, '_');
            const content = lines.slice(1).join('\n').trim();
            if (mappedKey && content) map[mappedKey] = content;
        });
    }

    return map;
}
