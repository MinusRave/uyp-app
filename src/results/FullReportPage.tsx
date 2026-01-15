import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { useQuery, getTestSession, generateExecutiveAnalysis, translateMessage } from "wasp/client/operations";
import { Loader2, Lock, CheckCircle, CheckCircle2, AlertTriangle, ArrowRight, Heart, MessageCircle, MessageSquare, Eye, Shield, Zap, Quote, BarChart3, Download, BookOpen, Sparkles, FileText } from "lucide-react";
import { DistortionGraph } from "../components/DistortionGraph";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CheatSheetPDF } from "./downloads/CheatSheetPDF";
import { WorkbookPDF } from "./downloads/WorkbookPDF";
import { OnboardingWizard } from "./components/OnboardingWizard";

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

    questions: { dimension: string; questions: string[]; }[];
    closing: string;
}

export default function FullReportPage() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;
    const { data: session, isLoading, error } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

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

                {/* 1. NEW: The Mirror (Executive Synthesis) */}
                <section className="mb-16">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="text-purple-500" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">01. The Executive Summary</h2>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-8 md:p-10 rounded-3xl border border-purple-100 dark:border-purple-800 shadow-sm relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                        <h3 className="text-3xl font-bold mb-6 text-foreground/90 font-serif">The Mirror</h3>

                        {isAiLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="animate-spin text-purple-500" size={32} />
                                <p className="text-muted-foreground animate-pulse">Analyzing your complete nervous system profile...</p>
                            </div>
                        ) : aiAnalysis ? (
                            <div className="bg-white/50 dark:bg-black/20 rounded-xl p-6 md:p-8 border border-white/40 dark:border-white/5 shadow-sm">
                                <SimpleMarkdown content={aiAnalysis} />
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">Analysis could not be generated at this time.</p>
                        )}
                    </div>
                </section>

                {/* 3. Primary Lens & State */}
                <section className="bg-primary/5 rounded-3xl p-8 md:p-10 border border-primary/10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">02. Your Dominant Lens</h2>

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
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">03. The Distortion Graph</h2>
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




                {/* 5. NEW: The Care Package (Downloads) */}
                <section id="downloads">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">04. Your Care Package</h2>
                    <h3 className="text-3xl font-bold mb-8">Digital Downloads</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Fridge Sheet Download */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                                <Download size={24} />
                            </div>
                            <h4 className="font-bold text-xl mb-2">The Fridge Sheet</h4>
                            <p className="text-sm text-muted-foreground mb-6">
                                A one-page summary of your scripts and partner translations. Print it and stick it on the fridge.
                            </p>

                            {/* PDF Link - Rendered conditionally to ensure client-side execution */}
                            <PDFDownloadLink
                                document={
                                    <CheatSheetPDF data={{
                                        lensName: report.snapshot.dominantLens,
                                        stateName: report.primaryLens.stateName,
                                        scripts: {
                                            inTheMoment: dominantScript?.inTheMoment || "",
                                            repair: dominantScript?.repair || ""
                                        },
                                        partnerTranslation: dominantTranslation?.text || ""
                                    }} />
                                }
                                fileName="UYP-Fridge-Sheet.pdf"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all text-sm flex items-center gap-2"
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Generating PDF...' : 'Download PDF'
                                }
                            </PDFDownloadLink>
                        </div>

                        {/* Workbook Download */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                                <BookOpen size={24} />
                            </div>
                            <h4 className="font-bold text-xl mb-2">Alignment Workbook</h4>
                            <p className="text-sm text-muted-foreground mb-6">
                                A 4-week guided journal to help you observe and regulate your pattern in real-time.
                            </p>

                            <PDFDownloadLink
                                document={
                                    <WorkbookPDF data={{
                                        lensName: report.primaryLens.lensName,
                                        coreNeed: report.primaryLens.need,
                                        fear: report.primaryLens.fear,
                                        analysis: report.primaryLens.analysis
                                    }} />
                                }
                                fileName="UYP-Alignment-Workbook.pdf"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-all text-sm flex items-center gap-2"
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? 'Generating PDF...' : 'Download Workbook'
                                }
                            </PDFDownloadLink>
                        </div>
                    </div>
                </section>

                {/* 6. NEW: Full Spectrum Profile (Deep Dive) */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">05. Full Spectrum Profile</h2>
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

                {/* 7. Toolkit (Scripts) */}
                <section id="toolkit">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">06. Your Toolkit</h2>
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

                {/* NEW: The Translator Tool */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="text-green-500" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">04. The Translator</h2>
                    </div>
                    <TranslatorTool
                        myLens={report.snapshot.dominantLens}
                        partnerLens={report.snapshot.dominantLens.includes('silence') ? 'conflict_engulfment' : 'silence_distance'}
                        sessionId={session?.id}
                    />
                </section>

                {/* 6. Integration Questions */}
                <section className="border-t border-border pt-12">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">05. Deepening</h2>
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
        </div>
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
                sessionId: sessionId // NEW: Pass ID
            });
            setResult(res);
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

function SimpleMarkdown({ content }: { content: string }) {
    // Simple parser for standard AI markdown
    const lines = content.split('\n');

    return (
        <div className="space-y-4 font-serif text-lg leading-relaxed text-foreground/90">
            {lines.map((line, i) => {
                // Headers
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-bold mt-6 mb-2 text-primary">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 border-b border-border/50 pb-2">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-3xl font-bold mt-8 mb-6">{line.replace('# ', '')}</h1>;
                }

                // Lists
                if (line.trim().startsWith('- ')) {
                    return (
                        <div key={i} className="flex gap-2 pl-4">
                            <span className="text-primary font-bold">•</span>
                            <span>{parseBold(line.replace('- ', ''))}</span>
                        </div>
                    );
                }

                // Numbered lists (simple detection)
                if (/^\d+\.\s/.test(line)) {
                    return (
                        <div key={i} className="flex gap-2 pl-4">
                            <span className="text-primary font-bold">{line.split('.')[0]}.</span>
                            <span>{parseBold(line.replace(/^\d+\.\s/, ''))}</span>
                        </div>
                    );
                }

                // Empty lines
                if (!line.trim()) return <div key={i} className="h-2" />;

                // Paragraphs
                return <p key={i}>{parseBold(line)}</p>;
            })}
        </div>
    );
}

// Helper to bold text wrapped in **
function parseBold(text: string) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-primary/90">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}
