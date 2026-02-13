import React from 'react';
import { Activity, AlertTriangle, CheckCircle, HeartPulse, Stethoscope, ArrowRight } from 'lucide-react';

interface PulseSectionProps {
    analysis: any; // Full Report Data (chapter1_pulse)
    quickOverview?: any; // Quick Overview Data (pulse)
    metrics: any; // Raw metrics from session
    isPaid: boolean;
    onUnlock: () => void;
}

export const PulseSection: React.FC<PulseSectionProps> = ({ analysis, quickOverview, metrics, isPaid, onUnlock }) => {
    // 1. DATA EXTRACTION & FALLBACKS
    const healthScore = analysis?.health_score || quickOverview?.pulse?.health_score ||
        // Fallback calculation if missing from AI
        Math.round(((metrics.repair_efficiency || 50) + (metrics.betrayal_vulnerability || 50) + (metrics.compatibility_quotient || 50)) / 3);

    const diagnosis = analysis?.primary_diagnosis || quickOverview?.pulse?.primary_diagnosis || "Under Analysis...";
    const priority = analysis?.action_priority || quickOverview?.pulse?.action_priority || "Communication Patterns";
    const summary = analysis?.summary || quickOverview?.pulse?.summary || "We've detected a recurring pattern that is draining your emotional resources.";

    // Helper for vital signs
    const getVitalStatus = (score: number) => {
        if (score >= 80) return { label: "OPTIMAL", color: "text-green-500", icon: CheckCircle, bg: "bg-green-500/10" };
        if (score >= 50) return { label: "STABLE", color: "text-yellow-500", icon: Activity, bg: "bg-yellow-500/10" };
        return { label: "CRITICAL", color: "text-red-500", icon: AlertTriangle, bg: "bg-red-500/10" };
    };

    const vitals = [
        { label: "Communication Repair", score: metrics.repair_efficiency || 40 },
        { label: "Emotional Safety", score: metrics.betrayal_vulnerability || 65 },
        { label: "Erotic Connection", score: metrics.erotic_death_spiral || 20 },
        { label: "Power Balance", score: metrics.ceo_vs_intern || 45 },
        { label: "Future Alignment", score: metrics.compatibility_quotient || 90 },
    ].sort((a, b) => a.score - b.score); // Sort by lowest score first to highlight failure points

    const criticalPoint = vitals[0]; // The lowest score

    return (
        <section className="space-y-6">
            <div className="px-2">
                <h2 className="font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                    <HeartPulse className="text-rose-500" /> Relationship Vital Signs
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Clinical audit of the 5 core systems that keep a relationship alive.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* A. HEADER: HEALTH SCORE & DIAGNOSIS */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row gap-8 items-center">

                        {/* Health Score Gauge */}
                        <div className="relative shrink-0">
                            <div className="w-32 h-32 rounded-full border-8 border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                                <div className={`absolute inset-0 rounded-full border-8 border-t-transparent border-r-transparent transform -rotate-45 ${healthScore > 70 ? 'border-green-500' : healthScore > 40 ? 'border-yellow-500' : 'border-red-500'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                                <div className="text-center">
                                    <span className="block text-4xl font-black text-slate-900 dark:text-white">{healthScore}</span>
                                    <span className="text-[10px] font-bold uppercase text-slate-400">Health Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Medical File / Diagnosis */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center justify-center md:justify-start gap-1">
                                    <Stethoscope size={14} /> Primary Diagnosis
                                </h3>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                                    {diagnosis}
                                </h4>
                            </div>

                            <div className="bg-white dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                                    "{summary}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* B. VITALS GRID */}
                <div className="p-6 md:p-8 space-y-6">
                    {/* Critical Alert */}
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-red-700 dark:text-red-400 text-sm uppercase">System Failure: {criticalPoint.label}</h4>
                            <p className="text-red-600/80 dark:text-red-300/80 text-xs mt-1 leading-relaxed">
                                This is your relationship's "bleeding neck." Your score of <strong>{criticalPoint.score}%</strong> in this area is dragging down the entire system. Fix this priority first.
                            </p>
                        </div>
                    </div>

                    {/* Vitals List */}
                    <div className="space-y-3">
                        {vitals.map((v, idx) => {
                            const status = getVitalStatus(v.score);
                            const StatusIcon = status.icon;
                            return (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${status.bg}`}>
                                            <StatusIcon size={16} className={status.color} />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{v.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                                            <div className={`h-full rounded-full ${status.color.replace('text-', 'bg-')}`} style={{ width: `${v.score}%` }}></div>
                                        </div>
                                        <span className={`font-bold text-sm ${status.color}`}>{v.score}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* C. CTA FOOTER */}
                {!isPaid && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button onClick={onUnlock} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1 mx-auto group">
                            See how to fix your {criticalPoint.label} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};
