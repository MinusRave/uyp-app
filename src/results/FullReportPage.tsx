import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { useQuery, getTestSession, generateExecutiveAnalysis, translateMessage } from "wasp/client/operations";
import { Loader2, Lock, CheckCircle, CheckCircle2, AlertTriangle, ArrowRight, Heart, MessageCircle, MessageSquare, Eye, Shield, Zap, Quote, BarChart3, BookOpen, Sparkles, FileText, ChevronDown, TrendingDown, Repeat, Target, Lightbulb } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DistortionGraph } from "../components/DistortionGraph";
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

    useEffect(() => {
        if (success === "true" && sessionIdParam) {
            const trackedKey = `uyp-tracked-purchase-${sessionIdParam}`;
            if (!localStorage.getItem(trackedKey)) {
                trackPixelEvent('Purchase', {
                    value: 15.00,
                    currency: 'USD',
                    eventID: sessionIdParam
                });
                localStorage.setItem(trackedKey, 'true');
            }
        }
    }, [success, sessionIdParam]);

    useEffect(() => {
        if (!isLoading && (!session || !session.isPaid)) {
            if (session && !session.isPaid) {
                navigate("/results");
            } else if (!session) {
                // handle no session
            }
        }
    }, [isLoading, session, navigate]);

    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

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

            {/* 1. Cover Section */}
            <header className="py-20 px-6 md:px-12 text-center max-w-4xl mx-auto border-b border-border/50">
                <div className="uppercase tracking-widest text-xs font-bold text-primary mb-4">CONFIDENTIAL USER MANUAL</div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-primary">
                    {report.cover.title}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
                    {report.cover.subtitle}
                </p>
                <div className="bg-card p-6 rounded-xl border-l-4 border-primary shadow-sm text-left italic text-foreground/80">
                    "{report.cover.opening}"
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12 space-y-24">

                {/* 1. The Mirror (Executive Synthesis) - ACCORDION */}
                <section className="mb-16">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="text-purple-500" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">01. The Executive Summary</h2>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-8 md:p-12 rounded-3xl border border-purple-100 dark:border-purple-800 shadow-xl">
                        {/* Animated decorative background elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>



                        {isAiLoading ? (

                            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                <Loader2 className="animate-spin text-purple-500" size={40} />
                                <p className="text-muted-foreground animate-pulse text-lg">Analyzing your complete nervous system profile...</p>
                            </div>
                        ) : aiAnalysis ? (
                            <div className="relative z-10">
                                <div className="relative z-10">
                                    <MirrorInsightCards content={aiAnalysis} />
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic text-center py-8">Analysis could not be generated at this time.</p>
                        )}
                    </div>
                </section>

                {/* 2. NEW: Relationship Health (Compatibility) */}
                {report.compatibility && (
                    <section className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <Heart className="text-red-500" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">02. Relationship Health</h2>
                        </div>
                        <CompatibilityCard data={report.compatibility} />
                    </section>
                )}

                {/* 3. Primary Lens & State */}
                <section className="bg-primary/5 rounded-3xl p-8 md:p-10 border border-primary/10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">03. Your Dominant Lens</h2>

                    <div className="mb-8">
                        <h3 className="text-4xl font-extrabold mb-2 capitalize text-primary">{report.primaryLens.lensName.replace('_', ' ')}</h3>
                        <div className="inline-block bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide mb-4">
                            Current State: {report.primaryLens.stateName}
                        </div>
                        <p className="text-xl text-foreground/80 leading-relaxed italic">
                            "{report.primaryLens.analysis}"
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 pt-6 border-t border-primary/10">
                        <div className="space-y-2">
                            <h4 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-2">
                                <AlertTriangle size={16} /> Activates
                            </h4>
                            <p className="text-sm font-medium">{report.primaryLens.activates}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-2">
                                <Heart size={16} /> Deep Need
                            </h4>
                            <p className="text-sm font-medium">{report.primaryLens.need}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-2">
                                <Lock size={16} /> Fear
                            </h4>
                            <p className="text-sm font-medium">{report.primaryLens.fear}</p>
                        </div>
                    </div>
                </section>

                {/* 4. NEW: Visual Analytics */}
                {report.visualData && (
                    <section id="analytics" className="scroll-mt-24">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="text-primary" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">04. The Distortion Graph</h2>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-8">What You Feel vs. What Is Real</h3>
                        <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
                            <p className="text-muted-foreground mb-8">
                                This chart compares the <strong>intensity of your internal feeling</strong> (Fear/Anxiety) with the <strong>actual level of negative intent</strong> you are perceiving. Large gaps indicate where your lens is distorting reality.
                            </p>
                            <DistortionGraph data={report.visualData} />
                        </div>
                    </section>
                )}



                {/* 5. Partner Communication Guide - NEW */}
                {dominantTranslation && (
                    <section className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <Heart className="text-pink-500" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">05. Partner Communication Guide</h2>
                        </div>

                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-8 md:p-10 rounded-3xl border border-pink-100 dark:border-pink-800 shadow-sm">
                            <h3 className="text-3xl font-bold mb-6">Share This With Your Partner</h3>
                            <p className="text-lg text-muted-foreground mb-8">
                                This section explains your patterns in language your partner can understand. Share it to help them support you better.
                            </p>

                            {/* Partner-friendly explanation */}
                            <div className="bg-white dark:bg-black/20 rounded-2xl p-6 md:p-8 border border-pink-200 dark:border-pink-800 mb-8">
                                <h4 className="font-bold text-xl mb-4 text-pink-600 dark:text-pink-400">What Your Partner Needs to Know</h4>
                                <SimpleMarkdown content={dominantTranslation.text} />
                            </div>

                            {/* Do's and Don'ts */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* What Helps */}
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-700 dark:text-green-400">
                                        <CheckCircle size={20} />
                                        What Helps
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-2 items-start">
                                            <span className="text-green-600 mt-1">•</span>
                                            <span>Acknowledge my {report.primaryLens.need.toLowerCase()}</span>
                                        </li>
                                        {dominantScript?.repair && (
                                            <li className="flex gap-2 items-start">
                                                <span className="text-green-600 mt-1">•</span>
                                                <span>Give me time to process and circle back</span>
                                            </li>
                                        )}
                                        <li className="flex gap-2 items-start">
                                            <span className="text-green-600 mt-1">•</span>
                                            <span>Be patient when I'm in {report.primaryLens.stateName.toLowerCase()} mode</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* What Hurts */}
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-700 dark:text-red-400">
                                        <AlertTriangle size={20} />
                                        What Hurts
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-2 items-start">
                                            <span className="text-red-600 mt-1">•</span>
                                            <span>Triggering my fear of {report.primaryLens.fear.toLowerCase()}</span>
                                        </li>
                                        <li className="flex gap-2 items-start">
                                            <span className="text-red-600 mt-1">•</span>
                                            <span>Dismissing my feelings when {report.primaryLens.activates.toLowerCase()}</span>
                                        </li>
                                        <li className="flex gap-2 items-start">
                                            <span className="text-red-600 mt-1">•</span>
                                            <span>Pushing me to respond before I'm ready</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 6. Gender Dynamics Analysis - NEW */}
                {report.primaryLens && (
                    <section className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <Eye className="text-teal-500" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">06. Gender & Socialization Context</h2>
                        </div>

                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-8 md:p-10 rounded-3xl border border-teal-100 dark:border-teal-800 shadow-sm">
                            <h3 className="text-3xl font-bold mb-6">How Socialization Shapes Your Pattern</h3>

                            <div className="bg-white dark:bg-black/20 rounded-2xl p-6 md:p-8 border border-teal-200 dark:border-teal-800 space-y-6">
                                <div>
                                    <h4 className="font-bold text-lg mb-3 text-teal-600 dark:text-teal-400">Your Core Pattern</h4>
                                    <p className="text-lg leading-relaxed italic">
                                        "{report.primaryLens.analysis}"
                                    </p>
                                </div>

                                <div className="border-t border-teal-200 dark:border-teal-800 pt-6">
                                    <h4 className="font-bold text-lg mb-3 text-teal-600 dark:text-teal-400">The Socialization Layer</h4>
                                    <p className="leading-relaxed">
                                        Your <strong className="text-primary">{report.primaryLens.lensName.replace('_', ' ')}</strong> sensitivity
                                        may have been reinforced by how you were taught to handle {report.primaryLens.lensName.replace('_', ' ')} situations.
                                        Many people learn early on that {report.primaryLens.activates.toLowerCase()} is dangerous,
                                        which creates a protective response that persists into adult relationships.
                                    </p>
                                </div>

                                <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4 border border-teal-200 dark:border-teal-700">
                                    <p className="text-sm">
                                        <strong>Important:</strong> This isn't about gender stereotypes. It's about recognizing how your unique
                                        upbringing and social conditioning may have shaped your nervous system's response patterns.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 7. Intervention Cards - NEW */}
                {report.scripts && report.scripts.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="text-blue-500" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">07. Intervention Cards</h2>
                        </div>

                        <h3 className="text-3xl font-bold mb-8">Your Conflict Scenarios & Responses</h3>
                        <p className="text-lg text-muted-foreground mb-8">
                            These cards show specific situations that trigger your patterns and exactly what to say in those moments.
                        </p>

                        <div className="grid gap-6">
                            {report.scripts.map((script, index) => (
                                <div
                                    key={script.dimension}
                                    className={`rounded-2xl border overflow-hidden ${script.dimension === report.snapshot.dominantLens
                                        ? 'bg-primary/5 border-primary/20 ring-2 ring-primary/10'
                                        : 'bg-card border-border'
                                        }`}
                                >
                                    <div className={`p-4 border-b ${script.dimension === report.snapshot.dominantLens
                                        ? 'bg-primary/10 border-primary/10'
                                        : 'bg-muted border-border'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-lg capitalize flex items-center gap-2">
                                                {script.dimension.replace('_', ' ')}
                                                {script.dimension === report.snapshot.dominantLens && (
                                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase">
                                                        Your Dominant Pattern
                                                    </span>
                                                )}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Scenario */}
                                        <div>
                                            <h5 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">
                                                When This Happens:
                                            </h5>
                                            <p className="text-base">
                                                When {script.dimension.replace('_', ' ')} is triggered in your relationship...
                                            </p>
                                        </div>

                                        {/* In The Moment Response */}
                                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                                            <h5 className="text-sm font-bold uppercase tracking-wide text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                                                <Zap size={16} />
                                                Say This In The Moment:
                                            </h5>
                                            <p className="text-lg font-medium italic">
                                                "{script.inTheMoment}"
                                            </p>
                                        </div>

                                        {/* Repair Response */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                            <h5 className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                                                <CheckCircle size={16} />
                                                For Repair Later:
                                            </h5>
                                            <p className="text-base">
                                                "{script.repair}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}


                {/* 8. Full Spectrum Profile (Deep Dive) */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">08. Full Spectrum Profile</h2>
                    <h3 className="text-3xl font-bold mb-8">Your Complete Map</h3>
                    <p className="text-lg text-muted-foreground mb-8">
                        You are not just one pattern. Here is how your nervous system reacts across all 5 dimensions of your relationship.
                    </p>

                    <div className="space-y-6">
                        {report.dimensionsDetailed?.map((dim) => {
                            const isDominant = dim.id === report.snapshot.dominantLens;
                            return (
                                <div key={dim.id} className={`p-6 rounded-2xl border ${isDominant ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' : 'bg-card border-border'}`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                        <div>
                                            <h4 className="font-bold text-xl capitalize flex items-center gap-2">
                                                {dim.id.replace('_', ' ')}
                                                {isDominant && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">Dominant</span>}
                                            </h4>
                                            <div className="text-sm font-medium text-muted-foreground mt-1">
                                                State: <span className={`${isDominant ? 'text-primary' : 'text-foreground'} font-bold`}>{dim.score.state}</span>
                                            </div>
                                        </div>

                                        {/* Mini Bar Chart for this dimension */}
                                        <div className="flex items-center gap-3 text-xs w-full md:w-48">
                                            <div className="grid grid-cols-2 gap-2 w-full">
                                                <div>
                                                    <div className="flex justify-between mb-1 opacity-70"><span>Feel</span><span>{Math.round(dim.score.SL)}%</span></div>
                                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${dim.score.SL}%` }}></div></div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1 opacity-70"><span>Real</span><span>{Math.round(dim.score.PM)}%</span></div>
                                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-slate-400" style={{ width: `${dim.score.PM}%` }}></div></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-foreground/80 leading-relaxed text-sm md:text-base border-t border-border/50 pt-4">
                                        "{dim.score.prescription.analysis}"
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 9. Toolkit (Scripts) */}
                <section id="toolkit">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">09. Your Toolkit</h2>
                    <h3 className="text-3xl font-bold mb-8">De-Escalation Scripts</h3>

                    <div className="grid gap-8">
                        {/* Current Crisis Script */}
                        <div className="bg-card rounded-2xl border-2 border-primary/20 shadow-lg overflow-hidden">
                            <div className="bg-primary/10 p-4 border-b border-primary/10">
                                <h4 className="font-bold text-lg flex items-center gap-2 text-primary">
                                    <Zap size={20} /> In The Moment
                                </h4>
                            </div>
                            <div className="p-6 md:p-8">
                                <p className="text-muted-foreground mb-4 text-sm uppercase tracking-wide font-bold">Say this when you feel the panic rising:</p>
                                <blockquote className="text-xl md:text-2xl font-serif italic text-foreground leading-relaxed border-l-4 border-primary pl-6 py-2">
                                    "{dominantScript?.inTheMoment || "I need a moment to regulate."}"
                                </blockquote>
                            </div>
                        </div>

                        {/* Repair Script */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="bg-muted p-4 border-b border-border">
                                <h4 className="font-bold text-lg flex items-center gap-2 text-muted-foreground">
                                    <CheckCircle size={20} /> For Repair
                                </h4>
                            </div>
                            <div className="p-6 md:p-8">
                                <p className="text-muted-foreground mb-4 text-sm uppercase tracking-wide font-bold">Say this when things have calmed down:</p>
                                <div className="bg-muted/30 p-4 rounded-lg">
                                    <p className="text-lg text-foreground/90">
                                        "{dominantScript?.repair || "I want to circle back to what happened."}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Partner Translation Card */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Quote size={100} />
                            </div>
                            <h4 className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">Partner Translation Layer</h4>
                            <h3 className="text-2xl font-bold mb-6">Show this to your Partner</h3>
                            <div className="bg-white dark:bg-black/20 p-6 rounded-xl shadow-sm text-left relative z-10 max-w-lg mx-auto">
                                <p className="text-lg leading-relaxed font-medium">
                                    "{dominantTranslation?.text || "Please be patient with me."}"
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. NEW: The Translator Tool */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="text-green-500" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">10. The Translator</h2>
                    </div>
                    <TranslatorTool
                        myLens={report.snapshot.dominantLens}
                        partnerLens={report.snapshot.dominantLens.includes('silence') ? 'conflict_engulfment' : 'silence_distance'}
                        sessionId={session?.id}
                    />
                </section>

                {/* 6. Integration Questions */}
                <section className="border-t border-border pt-12">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">11. Deepening</h2>
                    <h3 className="text-2xl font-bold mb-6">Questions for Clarity</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {report.questions.map((qGroup, i) => (
                            <div key={i} className="bg-muted/30 p-5 rounded-lg border border-border/50">
                                <h4 className="font-bold capitalize mb-2 text-primary text-sm">{qGroup.dimension.replace('_', ' ')}</h4>
                                <ul className="space-y-2">
                                    {qGroup.questions.slice(0, 2).map((q, j) => (
                                        <li key={j} className="flex gap-2 items-start text-xs md:text-sm text-muted-foreground">
                                            <span className="opacity-50">•</span> {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. Closing */}
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

function TranslatorTool({ myLens, partnerLens, sessionId }: { myLens: string; partnerLens: string; sessionId?: string }) {
    const [message, setMessage] = useState("");
    const [result, setResult] = useState<{ translatedMessage: string; analysis: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTranslate = async () => {
        if (!message) return;
        setLoading(true);
        try {
            const res = await translateMessage({
                message,
                userLens: myLens,
                partnerLens: partnerLens,
                sessionId: sessionId
            });

            // Parse the response - handle both direct JSON and markdown-wrapped JSON
            let parsed = res;

            // If translatedMessage is a string that looks like JSON, try to parse it
            if (typeof res.translatedMessage === 'string' && res.translatedMessage.includes('```json')) {
                try {
                    // Remove markdown code blocks
                    const cleanJson = res.translatedMessage
                        .replace(/```json\s*/g, '')
                        .replace(/```\s*/g, '')
                        .trim();

                    const jsonData = JSON.parse(cleanJson);
                    parsed = {
                        translatedMessage: jsonData.translatedMessage || jsonData.message || res.translatedMessage,
                        analysis: jsonData.analysis || jsonData.explanation || res.analysis
                    };
                } catch (parseError) {
                    console.error('Failed to parse JSON from response:', parseError);
                    // Keep original response if parsing fails
                }
            }

            setResult(parsed);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-8 md:p-10">
                <h3 className="text-2xl font-bold mb-2">The Translator</h3>
                <p className="text-muted-foreground mb-6">
                    Type what you <em>want</em> to say. AI will rewrite it so your partner can actually hear it (bypassing their "{partnerLens}" defense).
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-wide text-muted-foreground">My Draft</label>
                        <textarea
                            className="w-full p-4 rounded-xl border border-input bg-background min-h-[200px] resize-none focus:ring-2 ring-primary/20 outline-none"
                            placeholder="e.g., 'You never listen to me and I'm sick of it!'"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            onClick={handleTranslate}
                            disabled={loading || !message}
                            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                            Translate
                        </button>
                    </div>

                    {/* Output */}
                    <div className="bg-muted/30 rounded-xl p-6 border border-border relative">
                        <label className="text-sm font-bold uppercase tracking-wide text-green-600 mb-4 block flex items-center gap-2">
                            <CheckCircle2 size={16} /> Safe Version
                        </label>

                        {result ? (
                            <div className="animate-fade-in space-y-4">
                                <div className="p-4 bg-background rounded-lg border border-border shadow-sm text-lg font-medium leading-relaxed">
                                    "{result.translatedMessage}"
                                </div>
                                <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-800 dark:text-blue-200">
                                    <strong>Why this works:</strong> {result.analysis}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <MessageCircle size={48} className="mb-4" />
                                <p>Translation will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
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

    return sections;
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
                // Handle "✅ **Title**" specific style
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

                // Standard Paragraph
                return <p key={i} className="text-gray-700 dark:text-gray-300">{formatText(trimmed)}</p>;
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
            return <strong key={i} className="font-bold text-primary/90">{formatItalics(content)}</strong>;
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
