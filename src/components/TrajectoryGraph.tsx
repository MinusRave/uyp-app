import React from 'react';
import { cn } from '../client/utils';

export const TrajectoryGraph: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={cn("w-full h-64 relative bg-card rounded-xl border border-border p-6 overflow-hidden", className)}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 text-center">Projected Trajectory</h4>

            {/* Graph Area */}
            <div className="relative h-full w-full flex items-end pb-8">

                {/* Dashed Line (Current Path) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    {/* Path 1: Downward Spiral (Red) - Dashed */}
                    <path
                        d="M0,50 Q150,50 300,200"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        className="text-red-300 dark:text-red-900/50"
                    />
                    {/* Path 2: Recovery (Green) - Solid */}
                    <path
                        d="M0,50 Q150,50 300,0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-green-500"
                    />
                </svg>

                {/* Labels */}
                <div className="absolute left-0 bottom-1/2 translate-y-4 text-xs font-bold bg-background/80 px-2 py-1 rounded border border-border">Now</div>
                <div className="absolute right-0 bottom-0 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">The Dead Zone</div>
                <div className="absolute right-0 top-0 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">The Partnership</div>
            </div>

            <p className="text-center text-[10px] text-muted-foreground mt-2">
                Without intervention, patterns tend to ossify. With new tools, the trajectory shifts immediately.
            </p>
        </div>
    );
};
