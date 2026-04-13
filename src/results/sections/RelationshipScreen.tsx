import { CheckCircle, ShieldAlert, Lock } from "lucide-react";
import { DimensionCard } from "../components/DimensionCard";
import { DIMENSION_LABELS, DIMENSION_TO_OVERVIEW, type DimensionKey, type QuickOverviewData } from "../types";

type Props = {
    session: any;
    quickOverview: QuickOverviewData | null;
};

const DIMENSION_ORDER: DimensionKey[] = [
    "communication",
    "emotional_safety",
    "physical_intimacy",
    "power_fairness",
    "future_values",
];

export function RelationshipScreen({ session, quickOverview }: Props) {
    const scores = session?.scores as any;
    const metrics = session?.advancedMetrics as any;
    if (!scores?.dimensions) return null;

    const dims = scores.dimensions;
    const dominantLens = scores.dominantLens as string;
    const attachmentStyle = scores.attachmentStyle as string;
    const phase = scores.phase as string;

    // Count areas
    const problemCount = DIMENSION_ORDER.filter((k) => dims[k]?.health < 40).length;
    const strongCount = DIMENSION_ORDER.filter((k) => dims[k]?.health >= 65).length;
    const isHighRisk = problemCount >= 3 || (metrics?.sustainability_forecast ?? 50) < 35;

    // Build a plain-English summary line
    const summaryLine = problemCount === 0
        ? "Your relationship looks strong across the board. But there are things under the surface worth understanding."
        : problemCount === 1 && strongCount >= 2
        ? `Your relationship has ${strongCount} strong areas and 1 area that needs attention. Here's the full picture.`
        : problemCount <= 2
        ? `${problemCount} areas need work. ${strongCount > 0 ? `${strongCount} ${strongCount === 1 ? "area is" : "areas are"} holding strong.` : "But nothing is beyond repair."} Here's what your answers show.`
        : `${problemCount} out of 5 areas are struggling. This is serious — but now you can see exactly where the problem is.`;

    return (
        <section className="py-16 px-5 md:py-24 md:px-6 bg-background">
            <div className="max-w-3xl mx-auto space-y-10">
                {/* Badge */}
                <div className="text-center space-y-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${isHighRisk ? "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" : "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"}`}>
                        {isHighRisk ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                        {isHighRisk ? "Patterns Detected" : "Analysis Complete"}
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black text-foreground">
                        Here's What We Found
                    </h2>
                    <p className="text-base md:text-lg text-foreground leading-relaxed max-w-xl mx-auto font-medium">
                        {summaryLine}
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-2">
                        <Lock size={10} /> 100% private. Only you can see this.
                    </p>
                </div>

                {/* Dimension Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DIMENSION_ORDER.map((key) => {
                        const dim = dims[key];
                        if (!dim) return null;

                        // Get AI teaser if available
                        const overviewKey = DIMENSION_TO_OVERVIEW[key];
                        const aiTeaser = (quickOverview?.dimensions as any)?.[overviewKey]?.teaser || undefined;

                        return (
                            <DimensionCard
                                key={key}
                                label={DIMENSION_LABELS[key]}
                                health={Math.round(dim.health)}
                                state={dim.state}
                                teaser={aiTeaser}
                            />
                        );
                    })}
                </div>

                {/* Profile Summary */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Profile</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {attachmentStyle && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">How You Love</p>
                                <p className="text-sm font-bold text-foreground">{attachmentStyle}</p>
                            </div>
                        )}
                        {phase && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Where You Are</p>
                                <p className="text-sm font-bold text-foreground">{phase}</p>
                            </div>
                        )}
                        {dominantLens && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Biggest Issue</p>
                                <p className="text-sm font-bold text-primary">
                                    {DIMENSION_LABELS[dominantLens as DimensionKey] || dominantLens.replace(/_/g, " ")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
