import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type Props = {
    label: string;
    health: number;
    state: string;
    teaser?: string;
};

export function DimensionCard({ label, health, state, teaser }: Props) {
    const isGood = health >= 65;
    const isBad = health < 40;

    const colorClass = isBad ? "border-red-300 bg-red-50/50 dark:bg-red-950/20" : isGood ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-orange-300 bg-orange-50/50 dark:bg-orange-950/20";
    const scoreColor = isBad ? "text-red-600" : isGood ? "text-emerald-600" : "text-orange-600";
    const statusLabel = isBad ? "Needs Work" : isGood ? "Doing Well" : "Watch This";
    const Icon = isBad ? XCircle : isGood ? CheckCircle : AlertTriangle;

    // Turn clinical state names into plain English
    const STATE_FRIENDLY: Record<string, string> = {
        "Amplified Distress": "High stress, high tension",
        "Self-Regulation": "You're coping, but it's hard",
        "Detached Cynicism": "You've stopped caring about this",
        "Secure Flow": "This part feels safe",
    };
    const rawLabel = state.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const stateLabel = STATE_FRIENDLY[rawLabel] || rawLabel;

    return (
        <div className={`rounded-2xl border-2 ${colorClass} p-5 space-y-3 transition-all`}>
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stateLabel}</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <Icon size={16} className={scoreColor} />
                    <span className={`text-2xl font-black ${scoreColor}`}>{health}</span>
                </div>
            </div>

            {/* Health bar */}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${isBad ? "bg-red-500" : isGood ? "bg-emerald-500" : "bg-orange-500"}`}
                    style={{ width: `${health}%` }}
                />
            </div>

            <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase ${scoreColor}`}>{statusLabel}</span>
                <span className="text-xs text-muted-foreground">{health}/100</span>
            </div>

            {teaser && (
                <p className="text-sm text-muted-foreground leading-relaxed pt-1 border-t border-border/50 animate-in fade-in duration-500">
                    {teaser}
                </p>
            )}
        </div>
    );
}
