import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, Loader2, ArrowRight, Sparkles, MessageCircle, MessageSquare, FileText, Zap, Heart, Activity, AlertTriangle, Shield, Clock, X, Eye, Quote, Star } from "lucide-react";
import { createCheckoutSession, getTestSession, captureLead, claimSession } from "wasp/client/operations";
import { LensRadar } from "../components/LensRadar";
import { useQuery } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";

export default function TeaserPage() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;
    const { data: session, isLoading, error } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [email, setEmail] = useState("");
    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);

    // CRO State
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const [showExitIntent, setShowExitIntent] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const hasTriggeredExit = useRef(false);

    const claimedSessionRef = useRef<string | null>(null);

    useEffect(() => {
        if (!isLoading && !session) navigate("/test");
        if (session?.isPaid) navigate("/report");
        if (session?.email) setEmail(session.email);

        if (user && session && !session.userId && session.id !== claimedSessionRef.current) {
            claimedSessionRef.current = session.id;
            claimSession({ sessionId: session.id }).catch(console.error);
        }
    }, [isLoading, session, navigate, user]);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format Time (MM:SS)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

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

    const handleUpdateEmail = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!session || !email) return;
        setIsSavingEmail(true);

        // Generate Event ID for deduplication
        const eventID = generateEventId();

        try {
            // Pass eventID to Server (CAPI)
            await captureLead({ sessionId: session.id, email, eventID });

            // Pass eventID to Client Pixel
            trackPixelEvent('Lead', { eventID });
            // Small delay to ensure Pixel event has time to fire
            await new Promise(resolve => setTimeout(resolve, 300));

            setEditingEmail(false);
            setShowExitIntent(false); // Close modal on success
        } catch (e) {
            console.error(e);
            alert("Error updating email.");
        } finally {
            setIsSavingEmail(false);
        }
    };

    const handleUnlock = async () => {
        if (!session) return;
        const currentEmail = user?.email || session.email || email;
        if (!currentEmail) {
            setEditingEmail(true);
            alert("Please enter your email to proceed.");
            return;
        }
        if (!session.email && email && email !== session.email) {
            await handleUpdateEmail();
        }

        setIsRedirecting(true);

        // Generate Event ID for deduplication
        const eventID = generateEventId();

        try {
            // Pass eventID to Client Pixel
            trackPixelEvent('InitiateCheckout', { eventID });

            // Pass eventID to Server (CAPI)
            const checkout = await createCheckoutSession({ sessionId: session.id, eventID });

            if (checkout.sessionUrl) window.location.href = checkout.sessionUrl;
        } catch (e) {
            console.error(e);
            alert("Error initiating checkout.");
        } finally {
            setIsRedirecting(false);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;
    if (!session) return null;

    // --- DATA PARSING ---
    const scores = (session.scores as any) || {};
    const report = scores.report;
    const dominantLens = scores.dominantLens || "silence";
    const dimensionScore = scores.dimensions?.[dominantLens] || { mismatch: 0 };
    const conflictDescription = (session as any).conflictDescription;

    // Parse Loop Text for "Half-Revealed" effect
    const loopLines = report?.recurringLoop?.text?.split('\n') || [];
    const loopEvent = loopLines[0] || "When tension arises,";
    const loopEmotion = loopLines[1]?.replace("you tend to feel ", "").replace(".", "") || "uncomfortable";
    const loopMeaning = loopLines[2] || "You interpret it negatively.";

    return (
        <div className="min-h-screen bg-background text-foreground font-sans animate-fade-in pb-24">

            {/* 1. Header (Ref for Sticky CTA) */}
            <header ref={headerRef} className="py-8 px-6 text-center max-w-3xl mx-auto relative">

                {/* Timer Banner */}
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm py-2 px-4 rounded-full inline-flex items-center gap-2 mb-6 animate-pulse">
                    <Clock size={14} />
                    Results reserved for {formatTime(timeLeft)}
                </div>

                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6 block mx-auto w-fit">
                    <CheckCircle2 size={16} /> Analysis Complete
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                    We found the <span className="text-primary">root cause</span> of your disconnect.
                </h1>

                {/* TRANSLATION LAYER */}
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-8 text-left max-w-2xl mx-auto">
                    <p className="font-medium text-foreground text-lg">
                        <span className="font-bold text-primary mr-2">In simple terms:</span>
                        We found exactly what sets your body off during fights, and why your partner reacts differently.
                    </p>
                </div>

                {/* TRUST BANNER */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground animate-fade-in-up">
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

            <main className="max-w-3xl mx-auto px-6 space-y-12">

                {/* 2. Dominant Pattern */}
                <section className="bg-card p-8 rounded-3xl shadow-sm border border-border">
                    <h2 className="text-primary font-bold uppercase tracking-wider text-xs mb-2">Dominant Pattern</h2>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 capitalize">
                        Your strongest sensitivity is around {dominantLens.replace('_', ' ')}
                    </h3>
                    <p className="text-lg leading-relaxed text-foreground/90">
                        <span className="font-bold text-primary block mb-2">In simple terms: when you don't feel {dominantLens.replace('_', ' ')}, your body goes into alert mode fast.</span>
                        You experience this as chest tightness, urgency, or a sudden need to fix things <em>right now</em>.
                        This is where most of your interpretations are formed.
                    </p>
                </section>

                {/* 3. The Shape of Your Sensitivity */}
                <section>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Radar Chart */}
                        <div className="order-2 md:order-1 relative">
                            <h3 className="font-bold text-sm uppercase text-muted-foreground mb-4 text-center md:text-left">Your Sensitivity Profile</h3>
                            <div className="bg-secondary/5 rounded-full p-4 border border-secondary/10">
                                <LensRadar data={[
                                    { dimension: "silence", score: scores.dimensions?.silence?.SL || 30 },
                                    { dimension: "conflict", score: scores.dimensions?.conflict?.SL || 30 },
                                    { dimension: "pressure", score: scores.dimensions?.pressure?.SL || 30 },
                                    { dimension: "disconnection", score: scores.dimensions?.disconnection?.SL || 30 },
                                    { dimension: "misunderstanding", score: scores.dimensions?.not_heard?.SL || 30 },
                                ]} />
                            </div>
                        </div>

                        {/* Emotional Consequence */}
                        <div className="order-1 md:order-2">
                            <p className="text-lg mb-6">
                                Your body hits its limit quickly here. <span className="text-muted-foreground text-sm">(We call this a low "Protection Limit").</span>
                                When that happens, your instincts default to:
                            </p>
                            <div className="bg-secondary/10 p-6 rounded-2xl text-center border border-secondary/20">
                                <span className="text-2xl md:text-3xl font-bold text-secondary-foreground block mb-2 capitalize">
                                    {loopEmotion}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    This isn’t random. It’s your body's attempt to keep you safe.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NEW: Compatibility Pulse Teaser */}
                <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-800/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Activity size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 shadow-sm">
                            <Heart size={12} /> Relationship Health Analysis
                        </div>
                        <h3 className="font-bold text-2xl mb-4">How Compatible Are You Really?</h3>

                        <div className="flex items-center gap-6 mb-6">
                            <div className="bg-white dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800 text-center min-w-[120px]">
                                <div className="text-4xl font-black text-red-600 dark:text-red-400 blur-sm select-none">??%</div>
                                <div className="text-xs text-muted-foreground mt-2 font-medium">Your Score</div>
                            </div>
                            <div className="flex-1">
                                <p className="text-lg font-medium leading-relaxed">
                                    We analyzed how your instincts interact under stress. Your <span className="font-bold text-red-600 dark:text-red-400">Compatibility Pulse</span> (how well you regulate each other) reveals 3 critical risk factors and your #1 repair opportunity.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-sm text-red-600 font-bold bg-white/50 w-fit px-3 py-2 rounded-lg">
                            <Lock size={14} /> Full Breakdown Locked
                        </div>
                    </div>
                </section>

                {/* 4. NEW: Conflict Teaser */}
                {conflictDescription && (
                    <section className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-8 rounded-3xl border border-purple-100 dark:border-purple-800/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <MessageSquare size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 shadow-sm">
                                <Sparkles size={12} /> Specific Analysis Ready
                            </div>
                            <h3 className="font-bold text-2xl mb-4">We decoded your last argument.</h3>
                            <p className="text-muted-foreground mb-4 font-serif italic text-lg opacity-80">
                                "{conflictDescription.length > 60 ? conflictDescription.substring(0, 60) + "..." : conflictDescription}"
                            </p>
                            <p className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4">
                                This is why the fight feels bigger than it should.
                            </p>
                            <p className="text-lg font-medium leading-relaxed">
                                We've analyzed exactly why this moment triggered you and created a custom <span className="font-bold underline decoration-purple-400 decoration-2">Script Rewrite</span> to show you what you *could* have said to stop the spiral instantly.
                            </p>
                            <div className="mt-4 p-4 bg-white/60 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                                <p className="text-base font-medium">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">Plus:</span> We identified 2-3 specific behaviors your partner did that hurt you—and we're not sugarcoating it. You'll see <span className="underline decoration-purple-400">validation FIRST</span>, then the nervous system explanation.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center gap-2 text-sm text-purple-600 font-bold bg-white/50 w-fit px-3 py-2 rounded-lg">
                                <Lock size={14} /> Analysis Locked inside Full Report
                            </div>
                        </div>
                    </section>
                )}

                {/* 5. The Blur (Teaser) */}
                {/* 5. NEW: Socialization & Partner Translation Teaser (Cross-Promotion) */}
                <section className="grid md:grid-cols-2 gap-6">
                    {/* Socialization Teaser */}
                    <div className="bg-card rounded-3xl p-8 border border-border relative overflow-hidden group hover:border-teal-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Eye size={100} />
                        </div>
                        <h4 className="font-bold text-teal-600 uppercase tracking-widest text-xs mb-3">The "Why"</h4>
                        <h3 className="font-bold text-2xl mb-4">It's Not Your Fault.</h3>
                        <div className="relative">
                            <p className="text-muted-foreground mb-4 filter blur-[3px]">
                                We found that your reaction isn't a choice—it's a programmed response from your upbringing. Specifically, you learned early on that...
                            </p>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-background/90 px-4 py-2 rounded-lg border border-border shadow-sm flex items-center gap-2">
                                    <Lock size={14} className="text-teal-600" />
                                    <span className="text-sm font-bold">Childhood Context Locked</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Unlock the <span className="font-bold text-foreground">Gender & Socialization</span> section to see exactly how your past shaped this pattern.
                        </p>
                    </div>

                    {/* Partner Translation Teaser */}
                    <div className="bg-card rounded-3xl p-8 border border-border relative overflow-hidden group hover:border-pink-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Heart size={100} />
                        </div>
                        <h4 className="font-bold text-pink-600 uppercase tracking-widest text-xs mb-3">For Your Partner</h4>
                        <h3 className="font-bold text-2xl mb-4">The "Impossible" Letter</h3>
                        <p className="text-muted-foreground mb-6">
                            TIred of explaining yourself? We wrote a psychological explanation of your internal world specifically for your partner to read.
                        </p>

                        <div className="bg-pink-50 dark:bg-pink-900/10 p-4 rounded-xl border border-pink-100 dark:border-pink-800/20 relative">
                            <Quote className="text-pink-300 absolute top-2 left-2" size={20} />
                            <p className="text-center font-serif italic text-pink-900/50 dark:text-pink-100/50 text-lg blur-[4px] select-none">
                                "Please understand that when I pull away, it's not because I don't love you..."
                            </p>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-background/90 px-4 py-2 rounded-lg border border-border shadow-sm flex items-center gap-2">
                                    <Lock size={14} className="text-pink-600" />
                                    <span className="text-sm font-bold">Letter Locked</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. SOCIAL PROOF / REVIEWS */}
                <section className="py-12">
                    <div className="text-center mb-10">
                        <h3 className="font-bold text-2xl md:text-3xl mb-4">You are not alone in this.</h3>
                        <p className="text-muted-foreground">See what others realized about their relationships.</p>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        <ReviewCard
                            text="I usually scroll past these, but the 'Silence' question hit too close to home. Paid the $19."
                            author="Sarah M."
                        />
                        <ReviewCard
                            text="Legitimately cheaper than the Uber Eats I ordered to comfort eat after our last fight lol. Just do it."
                            author="Mike T."
                        />
                        <ReviewCard
                            text="I’ve never felt so dragged yet so validated at the same time 💀."
                            author="Jasmine K."
                        />
                        <ReviewCard
                            text="I cried reading my report. Not because it was sad, but because for the first time someone explained that I'm not 'crazy' or 'needy'"
                            author="Emma R."
                            highlight
                        />
                        <ReviewCard
                            text="Finally something that doesn't just tell me to 'communicate better.' Like okay, HOW?? The scripts in this actually gave me the words."
                            author="David L."
                        />
                        <ReviewCard
                            text="It’s basically a user manual for your partner's brain. Wish I had this 2 years ago."
                            author="Alex & Jamie"
                        />
                        <ReviewCard
                            text="I printed out the 'Partner Translation' page and stuck it on the fridge."
                            author="Chris P."
                        />
                    </div>
                </section>

                {/* 6. WHAT YOU GET (Honest Value Presentation) */}
                <section className="">
                    <h3 className="font-bold text-3xl mb-8 text-center">What You Get for $19</h3>
                    <div className="bg-card rounded-3xl border border-border shadow-lg overflow-hidden">

                        {/* Stack Items */}
                        <div className="divide-y divide-border">
                            {/* Item 1: Complete Analysis */}
                            <div className="p-8">
                                <div className="flex gap-4 items-start mb-4">
                                    <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                                        <Sparkles size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-2xl mb-2">Your Complete Relationship Analysis</h5>
                                        <p className="text-muted-foreground mb-4">Everything you need to understand your patterns and fix the disconnect.</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3 pl-16">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
                                        <span className="text-sm">AI-powered "Mirror" psychological profile</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
                                        <span className="text-sm">Compatibility score with risk assessment</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
                                        <span className="text-sm">Partner's red flags (validation-first)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
                                        <span className="text-sm">Pattern decoder & blind spot analysis</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
                                        <span className="text-sm">Visual distortion graphs</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-primary mt-1 shrink-0" />
                                        <span className="text-sm">Custom intervention scripts</span>
                                    </div>
                                </div>
                            </div>

                            {/* Item 2: Interactive Tools */}
                            <div className="p-8 bg-green-50/30 dark:bg-green-900/10">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 shrink-0">
                                        <MessageCircle size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-2xl mb-2">Interactive Communication Tools</h5>
                                        <p className="text-muted-foreground mb-4">Real-time help when you need it most.</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-green-600 mt-1 shrink-0" />
                                                <span className="text-sm">The Translator: AI-powered message rewriter</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-green-600 mt-1 shrink-0" />
                                                <span className="text-sm">De-escalation toolkit with visual cards</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item 3: Partner Communication Guide */}
                            <div className="p-8 bg-pink-50/30 dark:bg-pink-900/10">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-xl text-pink-600 shrink-0">
                                        <Heart size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-2xl mb-2">Partner Communication Guide</h5>
                                        <p className="text-muted-foreground mb-4">Share-ready explanation of your patterns for your partner.</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-pink-600 mt-1 shrink-0" />
                                                <span className="text-sm">What helps you feel safe</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-pink-600 mt-1 shrink-0" />
                                                <span className="text-sm">What triggers your defenses</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-pink-600 mt-1 shrink-0" />
                                                <span className="text-sm">Personalized do's and don'ts</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Item 4: Intervention Cards */}
                            <div className="p-8">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 shrink-0">
                                        <Shield size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-2xl mb-2">Conflict Intervention Cards</h5>
                                        <p className="text-muted-foreground mb-4">Scenario-specific scripts for your toughest moments.</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-blue-600 mt-1 shrink-0" />
                                                <span className="text-sm">Tailored to your dominant pattern</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-blue-600 mt-1 shrink-0" />
                                                <span className="text-sm">In-the-moment and repair scripts</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="bg-primary/5 p-6 text-center border-t border-border">
                            <p className="text-sm text-muted-foreground mb-2">Cost of 1hr Couples Therapy: <span className="line-through decoration-red-500 decoration-2">$150+</span></p>
                            <p className="font-bold text-lg">Your Price Today: <span className="text-primary text-2xl">${import.meta.env.REACT_APP_REPORT_PRICE || "19"}</span></p>
                        </div>
                    </div>
                </section>

                {/* EMOTIONAL ROI SECTION (New) */}
                <section className="bg-gradient-to-br from-primary/5 to-transparent p-8 rounded-3xl border border-primary/10 mb-12">
                    <h3 className="font-bold text-2xl mb-6 text-center">After you unlock this, you’ll finally know:</h3>
                    <div className="space-y-4 max-w-xl mx-auto">
                        <div className="flex items-center gap-3 bg-background p-4 rounded-xl border border-border shadow-sm">
                            <CheckCircle2 className="text-green-500 shrink-0" />
                            <span className="font-medium">Why this specific fight keeps repeating (and how to stop it).</span>
                        </div>
                        <div className="flex items-center gap-3 bg-background p-4 rounded-xl border border-border shadow-sm">
                            <CheckCircle2 className="text-green-500 shrink-0" />
                            <span className="font-medium">Why "trying to stay calm" just makes you explode later.</span>
                        </div>
                        <div className="flex items-center gap-3 bg-background p-4 rounded-xl border border-border shadow-sm">
                            <CheckCircle2 className="text-green-500 shrink-0" />
                            <span className="font-medium">Exactly what to say when your body wants to explode or shut down.</span>
                        </div>
                    </div>
                </section>

                {/* 7. Final Pricing & CTA */}
                <section className="text-center pb-12">
                    <div className="bg-secondary/5 rounded-3xl p-8 border-2 border-primary/20 relative overflow-hidden max-w-lg mx-auto shadow-2xl">

                        <p className="text-lg font-medium mb-1">Get your full explanation for just</p>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <span className="text-xl text-muted-foreground line-through decoration-2 decoration-muted-foreground/50">$97</span>
                            <div className="text-5xl font-extrabold text-primary">${import.meta.env.REACT_APP_REPORT_PRICE || "19"}</div>
                        </div>

                        {/* TRUST TESTIMONIAL ABOVE CTA */}
                        <div className="bg-white/80 dark:bg-black/20 p-3 rounded-lg mb-6 backdrop-blur-sm">
                            <div className="flex justify-center text-yellow-500 mb-1">★★★★★</div>
                            <p className="text-sm font-medium italic">"This explained my reactions better than months of advice."</p>
                        </div>

                        {/* Email Input */}
                        {(!user?.email && !session.email && !email) && (
                            <div className="max-w-xs mx-auto mb-4">
                                <input
                                    type="email"
                                    placeholder="Enter email to unlock"
                                    className="w-full p-3 rounded-xl border border-input text-center"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            onClick={handleUnlock}
                            disabled={isRedirecting}
                            className="w-full bg-primary text-primary-foreground text-xl font-bold py-4 px-12 rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
                        >
                            {isRedirecting && <Loader2 className="animate-spin" />}
                            Show Me Why This Happens
                            <ArrowRight size={20} />
                        </button>
                        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Lock size={12} /> Secure 256-bit SSL</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Zap size={12} /> Instant Access</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* STICKY CTA (Mobile & Desktop) */}
            <div className={`fixed bottom-0 left-0 w-full bg-background border-t border-border p-4 shadow-2xl transform transition-transform duration-300 z-50 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden md:block">
                        <p className="font-bold text-sm">Your Full Analysis</p>
                        <p className="text-xs text-muted-foreground">Reserved for {formatTime(timeLeft)}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-auto md:ml-0 w-full md:w-auto">
                        <div className="text-right shrink-0">
                            <span className="block text-xs line-through text-muted-foreground">$97</span>
                            <span className="block font-bold text-xl text-primary leading-none">${import.meta.env.REACT_APP_REPORT_PRICE || "19"}</span>
                        </div>
                        <button
                            onClick={handleUnlock}
                            disabled={isRedirecting}
                            className="flex-1 md:flex-none bg-primary text-primary-foreground font-bold py-3 px-6 rounded-full shadow-lg text-sm whitespace-nowrap"
                        >
                            Show Me Why
                        </button>
                        <p className="hidden md:block text-[10px] text-muted-foreground text-center mt-1">100% Money-back Guarantee</p>
                    </div>
                </div>
            </div>

            {/* EXIT INTENT MODAL */}
            {showExitIntent && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-background rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-2xl border-2 border-primary/20">
                        <button
                            onClick={() => setShowExitIntent(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center">
                            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Wait! Don't lose your results.</h3>
                            <p className="text-muted-foreground mb-6">
                                Your detailed analysis has already been generated. If you leave now, it may be deleted for security.
                                <br /><br />
                                <span className="font-bold text-foreground">Enter your email to save it for later.</span>
                            </p>

                            <form onSubmit={handleUpdateEmail} className="space-y-4">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="w-full p-3 rounded-xl border border-input text-center text-lg"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={isSavingEmail}
                                    className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-full hover:opacity-90 transition-opacity"
                                >
                                    {isSavingEmail ? "Saving..." : "Save My Results"}
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            )}

        </div>
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
