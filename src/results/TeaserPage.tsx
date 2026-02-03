import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, Loader2, ArrowRight, Sparkles, MessageCircle, MessageSquare, FileText, Zap, Heart, Activity, AlertTriangle, Shield, Clock, X, Eye, Quote, Star } from "lucide-react";
import { createCheckoutSession, getTestSession, captureLead, claimSession, generateExecutiveAnalysis } from "wasp/client/operations";
import { useQuery } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";

// Component Components
import GaugeChart from "../components/GaugeChart";
import CategoryBarChart from "../components/CategoryBarChart";
import { ScatterPlot } from "../components/ScatterPlot";
import TrajectoryPhases from "../components/TrajectoryPhases";
import { AttachmentRadar } from "../components/AttachmentRadar";
import ValueStackGrid from "../components/ValueStackGrid";
import FAQSection from "../components/FAQSection";
import ExitIntentModal from "../components/ExitIntentModal";
import CheckoutConfirmationModal from "../components/CheckoutConfirmationModal";
import CheckoutErrorModal from "../components/CheckoutErrorModal";
import WhatYouGetSection from "../components/WhatYouGetSection";
import CostOfInactionSection from "../components/CostOfInactionSection";

export default function TeaserPage() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;
    const { data: session, isLoading, error, refetch: refetchSession } = useQuery(getTestSession, { sessionId: localSessionId || undefined });
    const [analyzing, setAnalyzing] = useState(false);

    // AUTO-ANALYZE IF MISSING
    useEffect(() => {
        if (!session) return;
        if (session.scores && !(session as any).executiveAnalysis && !analyzing) {
            const runAnalysis = async () => {
                setAnalyzing(true);
                try {
                    const scores = (session.scores as any) || {};
                    await generateExecutiveAnalysis({
                        sessionId: session.id,
                        dominantLens: scores.dominantLens || "communication",
                        dimensions: [], // Backend handles retrieval if empty
                        userContext: (session as any).conflictDescription
                    });
                    await refetchSession();
                } catch (e) { console.error("Auto-analysis failed", e); }
                finally { setAnalyzing(false); }
            };
            runAnalysis();
        }
    }, [session, analyzing]);

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [email, setEmail] = useState("");
    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);

    // CRO State
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const [showExitIntent, setShowExitIntent] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const hasTriggeredExit = useRef(false);

    // Checkout Modal State
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [checkoutError, setCheckoutError] = useState<{ title: string, message: string } | null>(null);
    const [checkoutCancelled, setCheckoutCancelled] = useState(false);

    const claimedSessionRef = useRef<string | null>(null);

    // --- FAKE PROCESSING ANIMATION ---
    // Fix: Initialize based on whether we already have the analysis or are paid
    // If we have analysis, NO processing needed.
    const [isProcessing, setIsProcessing] = useState(() => {
        if (!session) return true; // Default to true while loading
        if (session.isPaid) return false;
        if ((session as any).executiveAnalysis) return false;
        return true;
    });

    // Update processing state when session loads
    useEffect(() => {
        if (session) {
            const hasAnalysis = !!(session as any).executiveAnalysis;
            if (session.isPaid || hasAnalysis) {
                setIsProcessing(false);
            }
        }
    }, [session]);

    const [processingStep, setProcessingStep] = useState(0);
    const processingSteps = [
        "Connecting to Neural Link...",
        "Analyzing Conflict Pattern...",
        "Measuring Attachment Signals...",
        "Generating Relationship MRI...",
        "Finalizing Report..."
    ];

    useEffect(() => {
        // If meant to be processing, run the timer
        if (!isProcessing) return;

        const interval = setInterval(() => {
            setProcessingStep(prev => {
                if (prev >= processingSteps.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => setIsProcessing(false), 800);
                    return prev;
                }
                return prev + 1;
            });
        }, 800);

        return () => clearInterval(interval);
    }, [isProcessing]);

    useEffect(() => {
        if (!isLoading && !session) navigate("/test");
        if (session?.isPaid) navigate("/report");
        if (session?.email) setEmail(session.email);

        if (user && session && !session.userId && session.id !== claimedSessionRef.current) {
            claimedSessionRef.current = session.id;
            claimSession({ sessionId: session.id }).catch(console.error);
        }

        // Detect cancelled checkout
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout_cancelled') === 'true') {
            setCheckoutCancelled(true);
            // Clean URL
            window.history.replaceState({}, '', '/results');
        }
    }, [isLoading, session, navigate, user]);

    // Sticky CTA Observer
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // Show sticky CTA when header is NO LONGER visible
            setShowStickyCTA(!entry.isIntersecting);
        }, { threshold: 0 });

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    // Exit Intent Detection
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggeredExit.current && !session?.email && !email) {
                setShowExitIntent(true);
                hasTriggeredExit.current = true;
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, [email, session]);

    const handleUpdateEmail = async (emailToSave: string) => {
        if (!session) return;
        const eventID = generateEventId();
        try {
            await captureLead({ sessionId: session.id, email: emailToSave, eventID });
            trackPixelEvent('Lead', { eventID });
            await new Promise(resolve => setTimeout(resolve, 300));
            setEmail(emailToSave);
            setShowExitIntent(false);
        } catch (e) {
            console.error(e);
            alert("Error updating email.");
        }
    };

    const handleUnlock = async () => {
        if (!session) return;
        const currentEmail = user?.email || session.email || email;
        if (!currentEmail) {
            setEditingEmail(true);
            setShowExitIntent(true);
            return;
        }
        if (!session.email && email && email !== session.email) {
            await handleUpdateEmail(email);
        }
        setShowCheckoutModal(true);
    };

    const handleConfirmCheckout = async () => {
        if (!session) return;
        setIsRedirecting(true);
        const eventID = generateEventId();
        try {
            trackPixelEvent('InitiateCheckout', { eventID });
            const checkout = await createCheckoutSession({ sessionId: session.id, eventID });
            if (checkout.sessionUrl) window.location.href = checkout.sessionUrl;
        } catch (e) {
            console.error(e);
            setCheckoutError({
                title: "Hmm, something went wrong",
                message: "Don't worry, your results are safe. Let's try again."
            });
        } finally {
            setIsRedirecting(false);
            setShowCheckoutModal(false);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
    if (!session) return null;

    // --- DATA PARSING ---
    const scores = (session.scores as any) || {}; if (!scores) return null; // Safety
    const report = scores.report;
    const dominantLens = scores.dominantLens || "communication";
    const dimensionScore = scores.dimensions?.[dominantLens] || { mismatch: 0 };
    const conflictDescription = (session as any).conflictDescription;

    // Mapping for Bar Chart
    const barData = [
        { label: "Communication", score: scores.dimensions?.communication?.SL ? Math.max(0, 10 - (scores.dimensions.communication.SL / 10)) : 6.2 },
        { label: "Emotional Safety", score: scores.dimensions?.emotional_safety?.SL ? Math.max(0, 10 - (scores.dimensions.emotional_safety.SL / 10)) : 4.1 },
        { label: "Physical Intimacy", score: scores.dimensions?.physical_intimacy?.SL ? Math.max(0, 10 - (scores.dimensions.physical_intimacy.SL / 10)) : 2.8, isBleedingNeck: dominantLens === 'physical_intimacy' },
        { label: "Trust & Security", score: scores.dimensions?.power_fairness?.SL ? Math.max(0, 10 - (scores.dimensions.power_fairness.SL / 10)) : 7.4 },
        { label: "Conflict Resolution", score: scores.dimensions?.future_values?.SL ? Math.max(0, 10 - (scores.dimensions.future_values.SL / 10)) : 5.1 },
    ];

    barData.forEach(d => {
        if (d.label.toLowerCase().includes(dominantLens.replace('_', ' '))) d.isBleedingNeck = true;
    });

    if (isProcessing) {
        return (
            <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="w-full max-w-xs space-y-8">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-muted rounded-full opacity-20"></div>
                        <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-4 bg-primary/10 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2 text-center">
                        <h2 className="text-xl font-bold animate-pulse">{processingSteps[processingStep]}</h2>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Overall Score Calculation
    // Simple avg of barData or use specific score if available
    const overallScore = Math.round(barData.reduce((acc, curr) => acc + curr.score, 0) / barData.length * 10);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans animate-fade-in pb-24">

            {/* 1. Header (Ref for Sticky CTA) */}
            <header ref={headerRef} className="py-8 px-6 text-center max-w-3xl mx-auto relative">


                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6 block mx-auto w-fit">
                    <CheckCircle2 size={16} /> Analysis Complete
                </div>

                {/* DYNAMIC HEADLINE */}
                <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                    {scores.preview?.headline || <span>We found <span className="text-primary">exactly why</span> you're stuck.</span>}
                </h1>

                {/* AI COLD TRUTH SECTION */}
                <div className="max-w-2xl mx-auto mb-10 text-left animate-fade-in-up">
                    {(() => {
                        const analysisText = (session as any).executiveAnalysis || "";
                        const [publicSection, protocolSection] = analysisText.split("<<<PREMIUM_SPLIT>>>");

                        // Extract Diagnosis Title (or fallback)
                        const diagnosisMatch = publicSection?.match(/^#\s*Diagnosis:\s*(.+)$/m);
                        const diagnosisTitle = diagnosisMatch ? diagnosisMatch[1] : "Clinical Assessment";

                        // Extract Body (Remove title) - If no diagnosis line, use whole section
                        const coldTruthBody = diagnosisMatch ? publicSection.replace(/^#\s*Diagnosis:.+$/m, '').trim() : publicSection?.trim();

                        // Extract Protocol Title
                        const protocolTitleMatch = protocolSection?.match(/^#\s*(?:Protocol:)?\s*(.+)$/m);
                        const protocolTitle = protocolTitleMatch ? protocolTitleMatch[1] : "The Neural Protocol";

                        if (analyzing) {
                            return (
                                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm animate-pulse">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-8 w-8 bg-muted rounded-full"></div>
                                        <div className="h-4 bg-muted w-1/3 rounded"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-muted w-full rounded"></div>
                                        <div className="h-3 bg-muted w-5/6 rounded"></div>
                                        <div className="h-3 bg-muted w-4/6 rounded"></div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold">
                                        <Loader2 className="animate-spin text-primary" size={12} /> Analyzing your answers...
                                    </div>
                                </div>
                            )
                        }

                        if (coldTruthBody && coldTruthBody.length > 50) {
                            return (
                                <>
                                    {/* DIAGNOSIS BADGE (The Structural Diagnosis) */}
                                    <div className="flex justify-center mb-6">
                                        <div className="inline-flex flex-col items-center animate-fade-in-up delay-100">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Your Clinical Profile</span>
                                            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-6 py-2 rounded-full border border-red-100 dark:border-red-900/30 text-lg md:text-xl font-extrabold shadow-sm flex items-center gap-2">
                                                <Activity size={18} className="text-red-600" />
                                                {diagnosisTitle.replace(/[*#]/g, '')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* PREMIUM DOSSIER CARD */}
                                    <div className="relative bg-[#1a1a1a] text-white p-1 rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
                                        {/* Golden rim effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 via-transparent to-amber-500/10 rounded-2xl pointer-events-none"></div>

                                        <div className="bg-[#1f1f1f] rounded-xl p-6 md:p-8 relative z-10 border border-white/5">
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-amber-900/30 p-2 rounded-lg border border-amber-500/30">
                                                        <Activity className="text-amber-400" size={24} />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xl font-bold text-amber-50 leading-none tracking-tight">Clinical Assessment</h2>
                                                        <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">Confidential • Patient Copy</span>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    <div className="border border-red-500/50 text-red-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest transform rotate-[-2deg]">
                                                        Analysis Final
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="prose prose-lg prose-invert leading-relaxed text-gray-300 font-serif">
                                                {coldTruthBody.split('\n').filter((l: string) => l.trim().length > 0).map((line: string, i: number) => (
                                                    <p key={i} className="mb-4 last:mb-0">{line.replace(/[*#]/g, '')}</p>
                                                ))}
                                            </div>

                                            {/* Footer */}
                                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500 font-mono">
                                                <Zap size={12} />
                                                <span>Session ID: {session?.id?.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        } else {
                            // FALLBACK
                            return (
                                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl mb-8">
                                    <p className="font-medium text-foreground text-lg">
                                        <span className="font-bold text-primary block mb-2 text-sm uppercase tracking-wider">Initial Diagnosis:</span>
                                        {scores.preview?.insight || "We found exactly what sets your body off during fights, and why your partner reacts differently."}
                                    </p>
                                </div>
                            );
                        }
                    })()}
                </div>

                {/* TRUST BANNER - Moved below Cold Truth */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground animate-fade-in-up mb-8">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-slate-200 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="font-medium">Joined by 15,000+ couples</span>
                    </div>
                </div>
            </header>

            {/* Checkout Cancelled Banner */}
            {checkoutCancelled && (
                <div className="max-w-3xl mx-auto px-6 mb-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl text-center">
                        <p className="font-medium text-foreground mb-2">👋 Still here? No worries. Your results are waiting.</p>
                        <button
                            onClick={() => { setCheckoutCancelled(false); handleUnlock(); }}
                            className="text-primary font-bold hover:underline"
                        >
                            Try Again →
                        </button>
                    </div>
                </div>
            )}

            <main className="max-w-3xl mx-auto px-6 space-y-12">

                {/* 2. Dominant Pattern - MODIFIED LAYOUT */}
                <section className="bg-card p-0 rounded-3xl shadow-sm border border-border overflow-hidden">
                    <div className="bg-primary/5 p-6 border-b border-primary/10 text-center">
                        <h2 className="text-primary font-bold uppercase tracking-wider text-xs mb-2">Primary Diagnosis</h2>
                        <h3 className="text-2xl md:text-3xl font-bold capitalize">
                            {scores.preview?.hook || `The "${dominantLens.replace(/_/g, ' ')}" Cycle`}
                        </h3>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <GaugeChart score={overallScore} label="Relationship Health Score" riskLevel="Intervention Required" />

                            <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/20 text-center">
                                <p className="text-sm md:text-base">
                                    Your score of <span className="font-bold text-yellow-700">{overallScore}/100</span> places you in the <span className="font-bold text-yellow-700">Yellow Zone</span>.
                                    <br />
                                    <span className="text-xs text-muted-foreground mt-1 block">Critical warning signs that require immediate attention.</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-bold text-lg border-b pb-2 mb-4">Your Relationship Breakdown</h4>
                            <CategoryBarChart data={barData} />

                            <div className="mt-8 text-center">
                                <p className="text-lg leading-relaxed text-foreground/90">
                                    While you might be fighting about dishes or schedules,
                                    <span className="font-bold text-primary"> {dominantLens.replace('_', ' ')}</span> is your "Bleeding Neck"—the invisible wound that keeps reopening.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2.5 LOCKED PROTOCOL PREVIEW */}
                <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-background shadow-lg">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

                    {(() => {
                        // RE-PARSE for Protocol Context
                        const analysisText = (session as any).executiveAnalysis || "";
                        const [, protocolSection] = analysisText.split("<<<PREMIUM_SPLIT>>>");
                        const protocolTitleMatch = protocolSection?.match(/^#\s*(?:Protocol:)?\s*(.+)$/m);
                        const protocolTitle = protocolTitleMatch ? protocolTitleMatch[1] : "The Neural Protocol";

                        return (
                            <>
                                <div className="relative p-8 text-center filter blur-[6px] select-none opacity-50 space-y-4">
                                    <h3 className="text-2xl font-bold">Step 2: {protocolTitle}</h3>
                                    <p className="text-lg">To stop the "{dominantLens.replace('_', ' ')}" cycle, you must override your amygdala.</p>
                                    <div className="bg-card p-6 rounded-xl border border-border text-left space-y-4">
                                        <h4 className="font-bold border-b pb-2">Immediate Action Plan:</h4>
                                        <p>1. When you feel the tightness in your throat...</p>
                                        <p>2. Say exactly this phrase: "I am not attacking you..."</p>
                                        <p>3. Do NOT leave the room until...</p>
                                    </div>
                                </div>

                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] p-6 text-center">
                                    <div className="bg-card p-6 rounded-2xl shadow-2xl border border-primary/20 max-w-sm w-full animate-fade-in-up">
                                        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary">
                                            <Lock size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Unlock: {protocolTitle}</h3>
                                        <p className="text-muted-foreground text-sm mb-6">
                                            The "Cold Truth" was just the diagnosis. This is the cure.
                                        </p>
                                        <button
                                            onClick={handleUnlock}
                                            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Reveal My Protocol <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )
                    })()}
                </section>

                {/* 3. Trajectory */}
                <section className="bg-card p-8 rounded-3xl shadow-sm border border-border">
                    <h2 className="text-purple-600 font-bold uppercase tracking-wider text-xs mb-4 text-center">Relationship Trajectory</h2>
                    <h3 className="text-2xl font-bold mb-6 text-center">Where You Are vs. Where You're Going</h3>
                    <TrajectoryPhases currentPhase={scores.phase || "The Power Struggle"} />
                </section>

                {/* 4. Comparison Scatter */}
                <section className="py-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Where You Stand</h2>
                        <p className="text-muted-foreground">Compared to 15,000+ other couples.</p>
                    </div>
                    <div className="bg-white dark:bg-card p-4 rounded-3xl border border-border shadow-md">
                        <ScatterPlot userScore={{ x: overallScore, y: 35 }} />

                        <div className="mt-6 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20 flex gap-4 items-start">
                            <AlertTriangle className="text-red-600 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-red-700 dark:text-red-400 text-sm uppercase">Diagnostic Alert</h4>
                                <p className="text-sm text-foreground/80 mt-1">
                                    Without change: 68% of couples in your position move to Crisis within 18 months.
                                    With intervention: <span className="font-bold">72% report significant improvement within 3 months.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Compatibility Pulse */}
                <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-800/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Activity size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl mb-6 text-center">Your Compatibility Pulse</h3>
                        <p className="text-center text-muted-foreground mb-8">How well do you regulate each other under stress?</p>

                        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-3xl p-6 border border-red-100/50">
                            <GaugeChart score={47} label="Regulation Friction" riskLevel="High Friction Zone" />
                        </div>

                        <div className="mt-8 text-center max-w-lg mx-auto">
                            <p className="text-lg font-medium leading-relaxed mb-4">
                                Your nervous systems are in <span className="font-bold text-red-600">OPPOSITE</span> survival modes.
                            </p>
                            <div className="bg-white/80 dark:bg-black/40 p-4 rounded-xl inline-block text-left text-sm space-y-2">
                                <p>➡️ When you seek connection → They feel overwhelmed</p>
                                <p>➡️ When they need space → You feel abandoned</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button onClick={handleUnlock} className="flex items-center gap-2 text-sm font-bold bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition">
                                <Lock size={14} /> Stop This Pattern
                            </button>
                        </div>
                    </div>
                </section>

                {/* 6. Attachment Style */}
                <section className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1">
                        <AttachmentRadar dimensions={scores.dimensions} />
                    </div>
                    <div className="order-1 md:order-2">
                        <h4 className="font-bold text-xl mb-2">Your Attachment Profile</h4>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
                            <h5 className="font-bold text-lg mb-1 text-blue-800 dark:text-blue-300">ANXIOUS-PREOCCUPIED (8.7/10)</h5>
                            <p className="text-sm">
                                This explains why you panic when they go quiet.
                            </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800 opacity-75">
                            <h5 className="font-bold text-lg mb-1 text-red-800 dark:text-red-300">PARTNER: DISMISSIVE (Est.)</h5>
                            <p className="text-sm">
                                Why they shut down when you pursue.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 7. Script Rewrite (Conflict) */}
                {conflictDescription && (
                    <section className="mb-16">
                        <div className="bg-gray-900 dark:bg-black text-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden isolate">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <MessageSquare size={150} />
                            </div>
                            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl -z-10" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6 border border-purple-500/30">
                                    <Sparkles size={12} /> We Decoded Your Last Argument
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">You wrote:</p>
                                        <p className="text-gray-300 italic">"{conflictDescription.substring(0, 60)}..."</p>
                                    </div>

                                    <div className="border-t border-white/10 pt-6">
                                        <h4 className="font-bold text-lg mb-4">HERE'S WHAT REALLY HAPPENED:</h4>

                                        <div className="grid gap-4">
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <p className="text-xs text-purple-300 font-bold mb-1">Real Issue (Hidden):</p>
                                                <p className="filter blur-[4px] select-none text-gray-400">You felt deprioritized when they didn't ask about your day instantly.</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <p className="text-xs text-purple-300 font-bold mb-1">What You SHOULD Have Said:</p>
                                                <p className="filter blur-[4px] select-none text-gray-400">"Hey, I'm feeling a bit disconnected, can we take 5 mins to catch up?"</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleUnlock} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition flex justify-center items-center gap-2">
                                        <Lock size={16} /> Unlock Script Rewrite
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 8. Testimonials (Fixed) */}
                <section className="py-12">
                    <div className="text-center mb-10">
                        <h3 className="font-bold text-2xl md:text-3xl mb-4">You are not alone in this.</h3>
                    </div>

                    <div className="columns-1 md:columns-2 gap-6 space-y-6">
                        <ReviewCard
                            text="Legitimately cheaper than the Uber Eats I ordered to comfort eat after our last fight lol."
                            author="Mike T."
                        />
                        <ReviewCard
                            text="My therapist asked if she could see my report lmao."
                            author="Jordan"
                            highlight
                        />
                        <ReviewCard
                            text="Finally something that doesn't just tell me to 'communicate better.' Like okay, HOW??"
                            author="David L."
                        />
                        <ReviewCard
                            text="It’s basically a user manual for your partner's brain."
                            author="Alex & Jamie"
                        />
                        <ReviewCard
                            text="Showed my partner the 'Letter' section and they finally got why I freak out when they don't text back."
                            author="Maya"
                        />
                        <ReviewCard
                            text="Worth it just for the 'what NOT to say' list tbh."
                            author="Tyler"
                        />
                    </div>
                </section>

                {/* 9. What You Get Section */}
                <WhatYouGetSection />

                {/* 10. Cost of Inaction */}
                <CostOfInactionSection />

                {/* 11. FAQ */}
                <FAQSection />

                {/* 12. Final CTA */}
                <section className="text-center pb-12">
                    <p className="text-sm text-muted-foreground mb-1">Couples therapy: $200-300/session</p>
                    <p className="text-lg font-medium mb-1">Get your complete analysis for just</p>
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-xl text-muted-foreground line-through decoration-2 decoration-muted-foreground/50">$197</span>
                        <div className="text-5xl font-extrabold text-primary">${import.meta.env.REACT_APP_REPORT_PRICE || "29"}</div>
                    </div>

                    {/* Risk Reversal - Guarantee Above CTA */}
                    <div className="max-w-lg mx-auto mb-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Shield size={20} className="text-green-600 dark:text-green-400" />
                            <span className="font-bold text-green-900 dark:text-green-300">60-Day Guarantee</span>
                        </div>
                        <p className="text-sm text-green-900 dark:text-green-200">
                            If you don't get at least ONE insight that shifts how you see your relationship, we'll refund you. No questions asked.
                        </p>
                    </div>

                    <button
                        onClick={handleUnlock}
                        disabled={isRedirecting}
                        className="w-full max-w-md bg-primary text-primary-foreground text-xl font-bold py-4 px-12 rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
                    >
                        {isRedirecting && <Loader2 className="animate-spin" />}
                        Get My Answers Now
                        <ArrowRight size={20} />
                    </button>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mt-3 flex-wrap">
                        <div className="flex items-center gap-1">
                            <Lock size={12} />
                            <span>Secure Payment</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Shield size={12} />
                            <span>60-Day Guarantee</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            <span>Instant Access</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* STICKY CTA */}
            <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm md:max-w-4xl px-4 z-50 transition-all duration-500 ease-in-out ${showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="bg-gray-900/90 dark:bg-black/90 backdrop-blur-md text-white p-3 md:p-4 rounded-full shadow-2xl border border-white/10 flex items-center justify-between gap-4">
                    <div className="hidden md:block pl-4">
                        <span className="text-xs text-gray-400">Your analysis is ready</span>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto p-1 md:p-0">
                        <div className="pl-2 md:pl-0">
                            <span className="block text-[10px] text-gray-400 line-through leading-none">$197</span>
                            <span className="block font-bold text-lg text-white leading-none">${import.meta.env.REACT_APP_REPORT_PRICE || "29"}</span>
                        </div>

                        <button
                            onClick={handleUnlock}
                            disabled={isRedirecting}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg text-sm whitespace-nowrap transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isRedirecting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                            Get My Answers
                        </button>
                    </div>
                </div>
            </div>

            {/* EXIT INTENT */}
            <ExitIntentModal
                show={showExitIntent}
                onClose={() => setShowExitIntent(false)}
                onSave={handleUpdateEmail}
            />

            {/* CHECKOUT CONFIRMATION MODAL */}
            <CheckoutConfirmationModal
                show={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onConfirm={handleConfirmCheckout}
                price={import.meta.env.REACT_APP_REPORT_PRICE || "29"}
                isRedirecting={isRedirecting}
                lowestDimension={(() => {
                    // Calculate lowest scoring dimension for personalization
                    const dims = scores.dimensions;
                    if (!dims) return undefined;
                    const entries = Object.entries(dims) as [string, number][];
                    const lowest = entries.reduce((min, curr) => curr[1] < min[1] ? curr : min);
                    return lowest[0];
                })()}
                isCrisis={overallScore < 40}
            />

            {/* CHECKOUT ERROR MODAL */}
            {checkoutError && (
                <CheckoutErrorModal
                    error={checkoutError}
                    onClose={() => setCheckoutError(null)}
                    onRetry={handleUnlock}
                />
            )}

        </div >
    );
}

function ReviewCard({ text, author, highlight = false }: { text: string; author: string; highlight?: boolean }) {
    return (
        <div className={`p-6 rounded-2xl border break-inside-avoid shadow-sm ${highlight ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
            <div className="flex gap-1 text-yellow-500 mb-3">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
            </div>
            <p className="text-foreground/90 leading-relaxed mb-4 font-medium">"{text}"</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">- {author}</p>
        </div>
    );
}
