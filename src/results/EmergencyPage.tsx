import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { useQuery } from "wasp/client/operations";
import { getTestSession } from "wasp/client/operations";
import { Loader2, ArrowLeft, Wind, Heart, MessageCircle, Quote } from "lucide-react";
import { QUADRANT_CONTENT, DimensionType, QuadrantType, Prescription } from "../test/reportContent";

// Helper Interface (Subset of what we need)
interface SessionData {
    scores: {
        dominantLens: DimensionType;
        dimensions: Record<DimensionType, { SL: number; PM: number; state: QuadrantType }>;
    };
}

export default function EmergencyPage() {
    const navigate = useNavigate();
    const { data: user } = useAuth();
    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;
    const { data: session, isLoading } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

    const [step, setStep] = useState<"breathe" | "reality" | "script">("breathe");
    const [breathCount, setBreathCount] = useState(3);

    // Breathing Timer
    useEffect(() => {
        if (step === "breathe") {
            const interval = setInterval(() => {
                setBreathCount((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setTimeout(() => setStep("reality"), 1000); // Auto advance after last breath
                        return 0;
                    }
                    return prev - 1;
                });
            }, 4000); // 4 seconds per breath cycle
            return () => clearInterval(interval);
        }
    }, [step]);

    if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!session) return <div className="min-h-screen bg-black text-white p-10 text-center">No session found.</div>;

    const scores = session.scores as any; // Cast to bypass strict type for now
    const dominantLens = scores?.dominantLens as DimensionType;
    const dimensionData = scores?.dimensions?.[dominantLens];

    // Safety check - if data is missing, fallback to generic
    const state = (dimensionData?.state || "Amplified Distress") as QuadrantType;
    const content = (QUADRANT_CONTENT as any)[dominantLens]?.[state] || QUADRANT_CONTENT["communication"]["Amplified Distress"];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-blue-500/30">

            {/* Top Bar */}
            <div className="p-6 flex justify-between items-center z-10">
                <button onClick={() => navigate('/report')} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft size={20} /> Exit
                </button>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Emergency Protocol</div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full relative">

                {/* STEP 1: BREATHE */}
                {step === "breathe" && (
                    <div className="animate-in fade-in zoom-in duration-700 space-y-12">
                        <h1 className="text-2xl md:text-4xl font-light text-slate-200">Let's regulate your nervous system.</h1>

                        <div className="relative flex items-center justify-center py-10">
                            {/* Breathing Ball Animation */}
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-blue-500/20 animate-pulse text-center flex items-center justify-center border-2 border-blue-500/40 relative">
                                <span className="text-4xl font-bold font-serif text-blue-200">{breathCount}</span>
                                <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping"></div>
                            </div>
                        </div>

                        <p className="text-lg text-slate-400">Take a deep breath in... and slow out.</p>
                    </div>
                )}

                {/* STEP 2: REALITY CHECK */}
                {step === "reality" && (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-8">
                        <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-6">
                            <Heart size={32} />
                        </div>

                        <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Reality Check</h2>

                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                            You are in <span className="text-emerald-300">{state}</span>.
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-lg mx-auto">
                            "{content.analysis}"
                        </p>

                        <button
                            onClick={() => setStep("script")}
                            className="mt-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-105"
                        >
                            I'm Ready to Speak
                        </button>
                    </div>
                )}

                {/* STEP 3: SCRIPT */}
                {step === "script" && (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-8 w-full">
                        <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-400 mb-6">
                            <MessageCircle size={32} />
                        </div>

                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Read this Exact Sentence</h2>

                        <div className="bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                            <Quote className="absolute top-4 left-4 text-slate-800" size={48} />
                            <blockquote className="relative z-10 text-2xl md:text-4xl font-serif italic text-white leading-relaxed">
                                "{content.scripts.inTheMoment}"
                            </blockquote>
                            <Quote className="absolute bottom-4 right-4 text-slate-800 rotate-180" size={48} />
                        </div>

                        <p className="text-slate-400 max-w-md mx-auto">
                            Stop explaining. Stop defending. Just say this sentence and stop.
                        </p>

                        <button
                            onClick={() => navigate('/report')}
                            className="mt-8 text-slate-500 hover:text-white underline decoration-slate-700 hover:decoration-white underline-offset-4 transition-all"
                        >
                            Return to Report
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
