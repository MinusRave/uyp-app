type Props = {
    label: string;
    score: number;
    description: string;
    invert?: boolean; // If true, higher = worse
};

export function DangerMetric({ label, score, description, invert = false }: Props) {
    const isGood = invert ? score < 40 : score >= 60;
    const isBad = invert ? score >= 60 : score < 40;

    const barColor = isBad ? "bg-red-500" : isGood ? "bg-emerald-500" : "bg-orange-500";
    const textColor = isBad ? "text-red-600" : isGood ? "text-emerald-600" : "text-orange-600";
    const statusLabel = isBad ? "Critical" : isGood ? "Healthy" : "At Risk";

    return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">{label}</p>
                <div className="flex items-center gap-2">
                    <span className={`text-xl font-black ${textColor}`}>{score}%</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${isBad ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : isGood ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}`}>
                        {statusLabel}
                    </span>
                </div>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${score}%` }} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
