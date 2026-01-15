import React from 'react';

interface DistortionGraphProps {
    data: {
        dimension: string;
        label: string;
        sensitivity: number; // SL
        interpretation: number; // PM
    }[];
}

export const DistortionGraph: React.FC<DistortionGraphProps> = ({ data }) => {
    return (
        <div className="space-y-8">
            {data.map((item) => {
                const sl = Math.round(item.sensitivity);
                const pm = Math.round(item.interpretation);
                const isDistorted = (sl - pm) > 20;

                return (
                    <div key={item.dimension} className="space-y-2">
                        <div className="flex justify-between items-end mb-1">
                            <h4 className="font-bold text-sm uppercase">{item.label}</h4>
                            {isDistorted && (
                                <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full animate-pulse">
                                    Distortion Detected
                                </span>
                            )}
                        </div>

                        {/* Comparison Bars */}
                        <div className="space-y-3 bg-secondary/5 p-4 rounded-xl border border-secondary/10">

                            {/* Sensitivity Bar (Internal Reality) */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>How intense it feels to you</span>
                                    <span>{sl}%</span>
                                </div>
                                <div className="h-3 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 ease-out"
                                        style={{ width: `${sl}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Interpretation Bar (Assumed Intent) */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>How much negative intent you assume</span>
                                    <span>{pm}%</span>
                                </div>
                                <div className="h-3 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${pm > 60 ? 'bg-destructive' : 'bg-green-500'}`}
                                        style={{ width: `${pm}%` }}
                                    ></div>
                                </div>
                            </div>

                        </div>

                        {/* Insight Blurb */}
                        <p className="text-xs text-muted-foreground italic mt-1 pl-2 border-l-2 border-border">
                            {sl > pm + 20
                                ? "You feel unsafe, but your partner likely doesn't mean harm."
                                : pm > sl + 20
                                    ? "You assume negative intent even when you don't feel intense pain."
                                    : "Your reaction matches your interpretation."}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};
