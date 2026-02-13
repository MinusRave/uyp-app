import React from "react";
import { Lock, ShieldAlert, AlertTriangle, CheckCircle, Brain, ArrowRight, AlertCircle } from "lucide-react";

type NarcissismAnalysis = {
    partner_analysis: {
        is_narcissist_risk: boolean;
        risk_level: "Low" | "Moderate" | "High" | "Severe";
        traits_detected: string[];
    };
    user_analysis: {
        likely_profile: string;
        emotional_state: string;
    };
    relationship_health: {
        toxicity_score: number;
        label: string;
        red_flags: string[];
    };
    recommendation: string;
};

type NarcissismSectionProps = {
    analysis: NarcissismAnalysis | null;
    isPaid: boolean;
    onUnlock: () => void;
};

export const NarcissismSection: React.FC<NarcissismSectionProps> = ({ analysis, isPaid, onUnlock }) => {
    // Default/Fallback data for the blurred state
    const riskLevel = analysis?.partner_analysis?.risk_level || "Unknown";
    const toxicityScore = analysis?.relationship_health?.toxicity_score || 0;

    // Determine Color Theme based on Risk
    const getTheme = (level: string) => {
        switch (level) {
            case "Severe": return { bg: "bg-red-50 dark:bg-red-950/20", border: "border-red-200 dark:border-red-800", text: "text-red-800 dark:text-red-200", badge: "bg-red-100 text-red-700" };
            case "High": return { bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-200 dark:border-orange-800", text: "text-orange-800 dark:text-orange-200", badge: "bg-orange-100 text-orange-700" };
            case "Moderate": return { bg: "bg-yellow-50 dark:bg-yellow-950/20", border: "border-yellow-200 dark:border-yellow-800", text: "text-yellow-800 dark:text-yellow-200", badge: "bg-yellow-100 text-yellow-700" };
            default: return { bg: "bg-green-50 dark:bg-green-950/20", border: "border-green-200 dark:border-green-800", text: "text-green-800 dark:text-green-200", badge: "bg-green-100 text-green-700" };
        }
    };

    const theme = getTheme(riskLevel);

    return (
        <section className="space-y-4">
            <div className="px-2">
                <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertCircle className="text-red-600" /> Narcissism & Toxicity Screen
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Are you walking on eggshells? We analyzed your answers for Gaslighting, Emotional Manipulation, and Cluster B traits.
                </p>
            </div>

            {isPaid ? (
                // --- UNLOCKED / PAID VIEW ---
                <div className={`rounded-3xl shadow-sm border overflow-hidden ${theme.border} ${theme.bg}`}>

                    {/* Header: Risk Level */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 bg-white/50 dark:bg-slate-900/50">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest opacity-70">Abuse Risk Level</h3>
                            <div className={`text-3xl md:text-4xl font-black mt-1 uppercase ${theme.text}`}>
                                {riskLevel}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold uppercase tracking-widest opacity-70">Toxicity Index</div>
                            <div className={`text-3xl md:text-4xl font-black mt-1 ${theme.text}`}>
                                {toxicityScore}/100
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6 bg-white dark:bg-slate-900">

                        {/* 1. Partner Analysis */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-lg flex items-center gap-2">
                                <AlertTriangle size={20} className="text-red-600" />
                                Detected Patterns
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis?.partner_analysis?.traits_detected.map((trait, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-semibold">
                                        {trait}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 2. User Analysis */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-lg flex items-center gap-2">
                                <ShieldAlert size={20} className="text-blue-600" />
                                Your Role in This Dynamic
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="font-bold text-slate-900 dark:text-white mb-1">
                                    {analysis?.user_analysis?.likely_profile}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Emotional State: <span className="font-semibold">{analysis?.user_analysis?.emotional_state}</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Red Flags */}
                        {analysis?.relationship_health?.red_flags && analysis.relationship_health.red_flags.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-bold text-lg text-red-600 flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    🚩 Critical Warning Signs
                                </h4>
                                <ul className="space-y-2 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-800">
                                    {analysis.relationship_health.red_flags.map((flag, i) => (
                                        <li key={i} className="flex gap-2 items-start text-sm text-slate-700 dark:text-slate-300">
                                            <span className="text-red-500 font-bold text-base">•</span>
                                            <span className="font-medium">{flag}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 4. Recommendation */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800">
                            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2 text-sm uppercase tracking-wide">⚡ What To Do Next</h4>
                            <p className="text-indigo-900 dark:text-indigo-100 font-medium leading-relaxed">
                                {analysis?.recommendation}
                            </p>
                        </div>

                    </div>
                </div>

            ) : (
                // --- LOCKED / TEASER VIEW (Empathetic & Validating) ---
                <div className="relative bg-white dark:bg-slate-900 p-1 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden group cursor-pointer" onClick={onUnlock}>

                    {/* Background "Teaser" Content - Semi-blurred */}
                    <div className="p-6 pb-24 md:p-8 md:pb-32 space-y-6 opacity-30 blur-[2px] pointer-events-none select-none grayscale transition-all duration-500 group-hover:scale-[1.01] group-hover:blur-[1px]">
                        <div className="flex gap-4 items-center mb-6">
                            <div className="h-16 w-16 bg-red-100 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-6 w-48 bg-slate-200 rounded"></div>
                                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-xl">🚩</span>
                                <p className="font-medium text-lg leading-relaxed text-slate-900">
                                    You often <span className="bg-red-100 px-1">second-guess your own memory</span> of events because they deny...
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">🚩</span>
                                <p className="font-medium text-lg leading-relaxed text-slate-900">
                                    You feel anxious before bringing up simple issues because <span className="bg-red-100 px-1">reactions are unpredictable</span>...
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">🚩</span>
                                <p className="font-medium text-lg leading-relaxed text-slate-900">
                                    Your "No" is frequently ignored or negotiated until it becomes a <span className="bg-red-100 px-1">reluctant Yes</span>...
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-t from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90">

                        <div className="max-w-md w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            {/* Validation Badge */}
                            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mx-auto">
                                <AlertTriangle size={12} /> Signals Detected
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                    Is This Manipulation—<br />Or Are You Overreacting?
                                </h3>
                                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                    "Am I crazy?"<br />
                                    "Why do I feel so drained?"
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                    Your answers contain specific patterns that align with the <strong>Cycle of Emotional Control</strong>. You aren't imagining it.
                                </p>
                            </div>

                            <button className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-base py-4 px-6 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                                GET YOUR CLARITY REPORT - €29
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                Less than one therapy session (€150) • Instant Results
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
