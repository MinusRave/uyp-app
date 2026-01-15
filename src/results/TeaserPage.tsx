import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, Loader2, ArrowRight, Sparkles, MessageCircle, MessageSquare, FileText, Zap, Heart, Activity, AlertTriangle, Download } from "lucide-react";
import { createCheckoutSession, getTestSession, captureLead, claimSession } from "wasp/client/operations";
import { LensRadar } from "../components/LensRadar";
import { useQuery } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import { trackPixelEvent } from "../analytics/pixel";

export default function TeaserPage() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;
    const { data: session, isLoading, error } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [email, setEmail] = useState("");
    const [isSavingEmail, setIsSavingEmail] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);

    useEffect(() => {
        if (!isLoading && !session) navigate("/test");
        if (session?.isPaid) navigate("/report");
        if (session?.email) setEmail(session.email);

        if (user && session && !session.userId) {
            claimSession({ sessionId: session.id }).catch(console.error);
        }
    }, [isLoading, session, navigate, user]);

    const handleUpdateEmail = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!session || !email) return;
        setIsSavingEmail(true);
        try {
            await captureLead({ sessionId: session.id, email });
            trackPixelEvent('Lead');
            setEditingEmail(false);
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
        try {
            trackPixelEvent('InitiateCheckout');
            const checkout = await createCheckoutSession({ sessionId: session.id });
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

            {/* 1. Header */}
            <header className="py-12 px-6 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6">
                    <CheckCircle2 size={16} /> Analysis Complete
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                    We have decoded your <span className="text-primary">relationship patterns</span>.
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                    Your answers reveal a specific "Protection Limit" that is silently driving your conflicts.
                </p>
            </header>

            <main className="max-w-3xl mx-auto px-6 space-y-12">

                {/* 2. Dominant Pattern */}
                <section className="bg-card p-8 rounded-3xl shadow-sm border border-border">
                    <h2 className="text-primary font-bold uppercase tracking-wider text-xs mb-2">Dominant Pattern</h2>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 capitalize">
                        Your strongest sensitivity is around {dominantLens.replace('_', ' ')}
                    </h3>
                    <p className="text-lg leading-relaxed text-foreground/90">
                        When situations touch this area, your emotional system reacts quickly.
                        You tend to notice signals related to <strong>{dominantLens.replace('_', ' ')}</strong> more than anything else.
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
                                Because your "Protection Limit" is low in this specific area, your nervous system defaults to:
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
                                    We analyzed how your nervous systems interact under stress. Your <span className="font-bold text-red-600 dark:text-red-400">Compatibility Pulse</span> reveals 3 critical risk factors and your #1 repair opportunity.
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
                <section className="relative overflow-hidden text-center py-12">
                    <h3 className="font-bold text-2xl mb-2">Wait, there's more...</h3>
                    <p className="text-muted-foreground mb-8">We found a critical misalignment in how you perceive "Support".</p>

                    <div className="blur-sm select-none opacity-50 pointer-events-none mb-4">
                        <p className="text-lg">You expressed a need for emotional validation, but your partner's default response is often practical problem-solving.</p>
                        <p>This gap makes you feel unheard despite their best intentions to help.</p>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>

                    <div className="relative z-20 bg-background border border-border rounded-xl p-4 inline-flex items-center gap-2 shadow-lg">
                        <Lock className="text-primary" size={20} />
                        <span className="font-bold">Unlock to see your Blind Spot</span>
                    </div>
                </section>

                {/* 6. WHAT YOU GET (Honest Value Presentation) */}
                <section className="">
                    <h3 className="font-bold text-3xl mb-8 text-center">What You Get for $15</h3>
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

                            {/* Item 3: Downloadable Resources */}
                            <div className="p-8">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl text-yellow-600 shrink-0">
                                        <Download size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-2xl mb-2">Downloadable Resources</h5>
                                        <p className="text-muted-foreground mb-4">Take it with you, share with your partner.</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-yellow-600 mt-1 shrink-0" />
                                                <span className="text-sm">Cheat Sheet PDF (for your fridge)</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-yellow-600 mt-1 shrink-0" />
                                                <span className="text-sm">Alignment Workbook PDF</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="bg-primary/5 p-6 text-center border-t border-border">
                            <p className="text-sm text-muted-foreground mb-2">One-time payment • Instant access • No subscription</p>
                            <p className="font-bold text-lg">Everything above for just <span className="text-primary text-2xl">$15</span></p>
                        </div>
                    </div>
                </section>

                {/* 7. Final Pricing & CTA */}
                <section className="text-center pb-12">
                    <div className="bg-secondary/5 rounded-3xl p-8 border-2 border-primary/20 relative overflow-hidden max-w-lg mx-auto shadow-2xl">

                        <p className="text-lg font-medium mb-1">Get instant access for just</p>
                        <div className="text-5xl font-extrabold text-primary mb-2">$15</div>
                        <p className="text-xs text-muted-foreground mb-8">One-time payment. No subscription.</p>

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
                            Unlock My Results
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
        </div>
    );
}
