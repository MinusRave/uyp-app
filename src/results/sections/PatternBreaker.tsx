import { Lightbulb, ShieldAlert, MessageCircle } from "lucide-react";
import { DIMENSION_LABELS, type DimensionKey, type NarcissismData } from "../types";

type Props = {
    session: any;
    narcissismAnalysis: NarcissismData | null;
};

export function PatternBreaker({ session, narcissismAnalysis }: Props) {
    const scores = session?.scores as any;
    if (!scores) return null;

    const dominantLens = scores.dominantLens as DimensionKey;
    const dim = scores.dimensions?.[dominantLens];
    const prescription = dim?.prescription;
    const script = prescription?.scripts;

    const isHighNarcRisk = narcissismAnalysis?.partner_analysis?.risk_level === "High" || narcissismAnalysis?.partner_analysis?.risk_level === "Severe";

    // Safety override for high narcissism risk
    if (isHighNarcRisk) {
        return (
            <section className="py-16 px-5 md:py-24 md:px-6 bg-background">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-widest border border-red-200 dark:border-red-800">
                            <ShieldAlert size={12} />
                            Safety First
                        </span>
                        <h2 className="text-2xl md:text-4xl font-black text-foreground">
                            Your Situation Needs a Different Approach
                        </h2>
                    </div>

                    <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-800 rounded-2xl p-6 md:p-8 space-y-4">
                        <p className="text-base text-foreground leading-relaxed">
                            Based on your answers, the usual "fix your communication" advice won't work here. Your situation has patterns that need to be handled carefully.
                        </p>
                        <div className="bg-white dark:bg-card rounded-xl p-5 border border-red-100 dark:border-red-900/50">
                            <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">What to do right now</p>
                            <p className="text-base font-bold text-foreground leading-relaxed">
                                Do not try to "fix" things in the heat of the moment. If a conflict starts, say: "I need to step away for 20 minutes." Then actually leave the room.
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your full report includes a complete safety protocol designed for your specific pattern. It goes far beyond basic communication tips.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (!script?.inTheMoment) return null;

    const partnerStyle = session.partnerConflictStyle;
    const partnerContext = partnerStyle === "withdraws"
        ? "a partner who goes quiet and pulls away"
        : partnerStyle === "escalates"
            ? "a partner who gets loud when things get hard"
            : "how your partner handles tough moments";

    return (
        <section className="py-16 px-5 md:py-24 md:px-6 bg-background">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                        <Lightbulb size={12} />
                        Free Technique
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black text-foreground">
                        One Thing You Can Do Tonight
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
                        This is a real tool. Not a preview. Use it the next time things get tense.
                    </p>
                </div>

                {/* The script card */}
                <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 md:p-8 space-y-6">
                    {/* Context */}
                    <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-primary" />
                        <p className="text-xs font-bold uppercase tracking-wider text-primary">
                            When things get tense, say this:
                        </p>
                    </div>

                    {/* The actual script — big and clear */}
                    <blockquote className="text-lg md:text-xl font-bold text-foreground leading-relaxed border-l-4 border-primary pl-4">
                        "{script.inTheMoment}"
                    </blockquote>

                    {/* Why it works */}
                    {prescription?.analysis && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Why this works</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {prescription.analysis.length > 200
                                    ? prescription.analysis.slice(0, 200).replace(/\s+\S*$/, "") + "..."
                                    : prescription.analysis}
                            </p>
                        </div>
                    )}

                    {/* Partner context */}
                    <p className="text-xs text-muted-foreground leading-relaxed border-t border-primary/10 pt-3">
                        This was chosen for you because you have {partnerContext}. It's built for your exact situation.
                    </p>
                </div>

                {/* The repair script too */}
                {script.repair && (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">After the dust settles, try this:</p>
                        <blockquote className="text-base font-bold text-foreground leading-relaxed border-l-4 border-emerald-400 pl-4">
                            "{script.repair}"
                        </blockquote>
                        <p className="text-xs text-muted-foreground">
                            Use this after things calm down. It opens the door again. Without starting a new fight.
                        </p>
                    </div>
                )}

                {/* Bridge to offer */}
                <p className="text-center text-sm text-muted-foreground leading-relaxed">
                    That was <strong>1 out of 5</strong> tools in your full report. The other 4 are just as specific to you.
                </p>
            </div>
        </section>
    );
}
