import React from 'react';
import { Clock, AlertTriangle, Lock, TrendingDown, ArrowRight, Activity, Calendar } from 'lucide-react';

interface FutureForecastSectionProps {
    analysis: any; // Full Report Data (chapter1_pulse)
    quickOverview?: any; // Quick Overview Data (hero, forecast)
    isPaid: boolean;
    onUnlock: () => void;
}

export const FutureForecastSection: React.FC<FutureForecastSectionProps> = ({ analysis, quickOverview, isPaid, onUnlock }) => {
    // 1. DATA EXTRACTION & FALLBACKS
    // New Fields (might be missing in old reports)
    const breakupProb = analysis?.breakup_probability; // "Low", "Medium", "High", "Critical"
    const silentKiller = analysis?.silent_killer;
    const timeline = analysis?.timeline;

    // Old Fields (Fallbacks)
    const shortTermOld = analysis?.short_term_forecast || quickOverview?.forecast?.short_term;
    const longTermOld = analysis?.long_term_forecast;

    // Determine Risk Level Color
    const getRiskColor = (prob: string) => {
        switch (prob?.toLowerCase()) {
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const riskColor = getRiskColor(breakupProb || 'Medium');

    // 2. RENDER
    return (
        <section className="space-y-6">
            <div className="px-2">
                <h2 className="font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="text-indigo-600 dark:text-indigo-400" /> Future Forecast
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    A clinical prediction of where the relationship is headed in the next 1–5 years if nothing changes.
                </p>
            </div>

            {/* A. RISK ASSESSMENT (New Data) */}
            {breakupProb && (
                <div className={`p-6 rounded-2xl border-2 ${riskColor.replace('text-', 'border-').split(' ')[2]} ${riskColor.split(' ')[1]} relative overflow-hidden`}>
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between relative z-10">
                        <div className="text-center md:text-left">
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Breakup Probability</h3>
                            <div className={`text-3xl md:text-4xl font-black ${riskColor.split(' ')[0]}`}>
                                {breakupProb.toUpperCase()}
                            </div>
                        </div>

                        {silentKiller && (
                            <div className="flex-1 bg-white/60 dark:bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-black/5">
                                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
                                    <Activity size={12} /> The Silent Killer
                                </h4>
                                <p className="text-slate-900 dark:text-slate-100 font-medium leading-tight">
                                    {silentKiller}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* B. TIMELINE (Visual Roadmap) */}
            <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                {/* Background Grid/Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 space-y-8">

                    {/* Year 1: THE DRIFT (Always Visible) */}
                    <div className="relative pl-8 border-l-2 border-indigo-500/50">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <h4 className="text-sm font-bold text-indigo-300 uppercase mb-2 flex items-center gap-2">
                            <Calendar size={14} /> Year 1: The Drift
                        </h4>
                        <p className="text-slate-300 leading-relaxed">
                            {timeline?.year_1 || shortTermOld || "We're analyzing the immediate trajectory..."}
                        </p>
                    </div>

                    {/* Year 3: THE DETACHMENT (Blurred if not paid) */}
                    <div className="relative pl-8 border-l-2 border-purple-500/30">
                        <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${isPaid ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-slate-700'}`} />
                        <h4 className={`text-sm font-bold uppercase mb-2 flex items-center gap-2 ${isPaid ? 'text-purple-300' : 'text-slate-600'}`}>
                            <Calendar size={14} /> Year 3: The Detachment
                        </h4>

                        {isPaid ? (
                            <p className="text-slate-300 leading-relaxed">
                                {timeline?.year_3 || "Without intervention, the emotional gap widens significantly..."}
                            </p>
                        ) : (
                            <div className="relative cursor-pointer group" onClick={onUnlock}>
                                <p className="text-slate-500 blur-[4px] select-none">
                                    This is where parallel lives begin. You stop fighting because you stop caring. The resentment solidifies into indifference.
                                </p>
                                <div className="absolute inset-0 flex items-center justify-start">
                                    {/* No overlay here, just slight blur to tease */}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Year 5: THE OUTCOME (Blurred + Locked) */}
                    <div className="relative pl-8 border-l-2 border-slate-700/30">
                        <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${isPaid ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-700'}`} />
                        <h4 className={`text-sm font-bold uppercase mb-2 flex items-center gap-2 ${isPaid ? 'text-red-300' : 'text-slate-600'}`}>
                            <AlertTriangle size={14} /> Year 5: The Outcome
                        </h4>

                        {isPaid ? (
                            <p className="text-slate-300 leading-relaxed">
                                {timeline?.year_5 || longTermOld || "The final stage of separation or emotional divorce..."}
                            </p>
                        ) : (
                            <div className="relative mt-2">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                                    <p className="text-slate-500 blur-[5px] select-none mb-4">
                                        The relationship effectively ends here. Either through physical separation or complete emotional detachment where you live as strangers.
                                    </p>
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <button
                                            onClick={onUnlock}
                                            className="bg-white text-slate-900 hover:bg-indigo-50 font-bold text-sm py-2 px-6 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                                        >
                                            <Lock size={14} /> Unlock The 5-Year Forecast
                                        </button>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                                            Included in Full Report
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};
