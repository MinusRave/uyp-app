import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DimensionData {
    id: string;
    score: {
        SL: number; // Feel
        PM: number; // Real
        state: string;
    };
}

interface DistortionGridProps {
    dimensions: DimensionData[];
}

export function DistortionGrid({ dimensions }: DistortionGridProps) {
    // Sort or fixed order? Fixed order is better for consistency.
    const order = ['communication', 'emotional_safety', 'physical_intimacy', 'power_fairness', 'future_values'];

    const sorted = order.map(id => dimensions.find(d => d.id === id)).filter(Boolean) as DimensionData[];

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((dim) => {
                const gap = Math.abs(dim.score.SL - dim.score.PM);
                const isDistorted = gap > 20; // Threshold for "Distortion"
                const label = dim.id.replace('_', ' ');

                return (
                    <div key={dim.id} className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col justify-between">
                        <div className="mb-4">
                            <h4 className="font-bold text-sm uppercase tracking-wider mb-3 capitalize text-foreground/80">{label}</h4>

                            <div className="space-y-3">
                                {/* FEEL */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-primary">Feel</span>
                                        <span>{Math.round(dim.score.SL)}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${dim.score.SL}%` }} />
                                    </div>
                                </div>

                                {/* REAL */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1 text-muted-foreground">
                                        <span>Real</span>
                                        <span>{Math.round(dim.score.PM)}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-400 dark:bg-slate-600" style={{ width: `${dim.score.PM}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-2 pt-3 border-t border-border flex items-center gap-2 text-xs font-bold uppercase tracking-wide
              ${isDistorted ? 'text-red-500' : 'text-green-600'}
            `}>
                            {isDistorted ? (
                                <>
                                    <AlertTriangle size={14} />
                                    High Distortion
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={14} />
                                    Aligned
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
