import { AlertTriangle, TrendingDown, Clock } from "lucide-react";
import { DangerMetric } from "../components/DangerMetric";
import { DIMENSION_LABELS, type DimensionKey, type QuickOverviewData, type NarcissismData } from "../types";

type Props = {
    session: any;
    quickOverview: QuickOverviewData | null;
    narcissismAnalysis: NarcissismData | null;
};

const CONFLICT_STYLE_TEXT: Record<string, string> = {
    withdraws: "your partner shuts down and pulls away",
    engages: "your partner pushes harder to resolve it",
    escalates: "your partner gets louder and more intense",
};

const FIGHT_FREQ_TEXT: Record<string, string> = {
    daily: "almost every day",
    weekly: "about once a week",
    monthly: "a few times a month",
    rarely: "not that often",
};

export function PainMap({ session, quickOverview, narcissismAnalysis }: Props) {
    const scores = session?.scores as any;
    const metrics = session?.advancedMetrics as any;
    if (!scores || !metrics) return null;

    const dominantLens = scores.dominantLens as DimensionKey;
    const dim = scores.dimensions?.[dominantLens];
    const prescription = dim?.prescription;

    const biggestFear = session.biggestFear;
    const fightFrequency = session.fightFrequency;
    const partnerStyle = session.partnerConflictStyle;

    const isHighNarcRisk = narcissismAnalysis?.partner_analysis?.risk_level === "High" || narcissismAnalysis?.partner_analysis?.risk_level === "Severe";

    // Pick the top danger metrics (worst scores)
    const dangerMetrics = [
        { key: "sustainability_forecast", label: "Long-Term Outlook", score: metrics.sustainability_forecast ?? 50, invert: false, desc: "Can this relationship last? This score shows the big picture." },
        { key: "repair_efficiency", label: "Bounce-Back Speed", score: metrics.repair_efficiency ?? 50, invert: false, desc: "After a fight, how fast do you two get back to normal? Low means fights drag on for days." },
        { key: "nervous_system_load", label: "Stress on Your Body", score: metrics.nervous_system_load ?? 50, invert: true, desc: "Your relationship is putting weight on you. This is how much." },
        { key: "silent_divorce_risk", label: "Drifting Apart", score: metrics.silent_divorce_risk ?? 50, invert: true, desc: "You might not be fighting. But are you slowly losing each other without saying a word?" },
    ].sort((a, b) => {
        // Sort by severity: bad scores first
        const aSeverity = a.invert ? a.score : 100 - a.score;
        const bSeverity = b.invert ? b.score : 100 - b.score;
        return bSeverity - aSeverity;
    });

    return (
        <section className="py-16 px-5 md:py-24 md:px-6 bg-muted/30 border-y border-border/50">
            <div className="max-w-3xl mx-auto space-y-10">
                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400 rounded-full text-xs font-bold uppercase tracking-widest border border-orange-200 dark:border-orange-800">
                        <AlertTriangle size={12} />
                        Your Specific Situation
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black text-foreground">
                        Here's What's Really Going On
                    </h2>
                </div>

                {/* Their words mirrored back */}
                <div className="space-y-6">
                    {/* Biggest fear */}
                    {biggestFear && (
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">You told us your biggest fear is</p>
                            <p className="text-lg md:text-xl font-bold text-foreground italic leading-relaxed">
                                "{biggestFear}"
                            </p>
                        </div>
                    )}

                    {/* Fight pattern */}
                    {(fightFrequency || partnerStyle) && (
                        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">How your fights go</p>
                            <p className="text-base text-foreground leading-relaxed">
                                {fightFrequency && <>You said you fight <strong>{FIGHT_FREQ_TEXT[fightFrequency] || fightFrequency}</strong>. </>}
                                {partnerStyle && <>When it happens, <strong>{CONFLICT_STYLE_TEXT[partnerStyle] || partnerStyle}</strong>. </>}
                            </p>
                            {prescription?.analysis && (
                                <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                                    {prescription.analysis}
                                </p>
                            )}
                        </div>
                    )}

                    {/* The named pattern */}
                    {dominantLens && (
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-primary">The pattern you're stuck in</p>
                            <p className="text-xl md:text-2xl font-black text-foreground">
                                {DIMENSION_LABELS[dominantLens] || dominantLens.replace(/_/g, " ")}
                            </p>
                            {prescription?.stateName && (
                                <p className="text-sm text-muted-foreground">
                                    Your state: <strong>"{prescription.stateName}"</strong>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Danger metrics */}
                <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">The numbers that matter most</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dangerMetrics.map((m) => (
                            <DangerMetric key={m.key} label={m.label} score={m.score} description={m.desc} invert={m.invert} />
                        ))}
                    </div>
                </div>

                {/* AI forecast (appears when loaded) */}
                {quickOverview?.forecast?.short_term && (
                    <div className="bg-card border border-orange-200 dark:border-orange-800 rounded-2xl p-6 space-y-2 animate-in fade-in duration-500">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-orange-500" />
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">6-Month Outlook</p>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed italic">
                            "{quickOverview.forecast.short_term}"
                        </p>
                    </div>
                )}

                {/* High narcissism risk warning */}
                {isHighNarcRisk && narcissismAnalysis?.relationship_health && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <TrendingDown size={16} className="text-red-500" />
                            <p className="text-xs font-bold uppercase tracking-wider text-red-600">Safety Notice</p>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                            Your answers show signs that this relationship may be hurting you.
                            {narcissismAnalysis.relationship_health.red_flags?.length > 0 && (
                                <> There are {narcissismAnalysis.relationship_health.red_flags.length} warning signs in what you told us.</>
                            )}
                        </p>
                    </div>
                )}

                {/* Hope signal */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-2xl p-6 text-center space-y-2">
                    <p className="text-base font-bold text-foreground">
                        But here's what matters: this pattern has a name.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                        And patterns with names can be broken. You're not stuck because you're broken. You're stuck because you couldn't see the loop. Now you can.
                    </p>
                </div>

                {/* Closing */}
                <p className="text-center text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    This is <strong>your</strong> story. Not a template. Not a guess. Every number above came from what <strong>you</strong> told us.
                </p>
            </div>
        </section>
    );
}
