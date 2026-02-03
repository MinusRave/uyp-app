import React from 'react';
import { cn } from '../client/utils';
import { CheckCircle2, Lock } from 'lucide-react';

interface RelationshipPhaseChartProps {
    currentPhase: string;
    className?: string;
}

export const RelationshipPhaseChart: React.FC<RelationshipPhaseChartProps> = ({ currentPhase, className }) => {
    const phases = [
        "The Honeymoon",
        "The Power Struggle",
        "The Dead Zone",
        "The Partnership"
    ];

    const currentIndex = phases.findIndex(p => p.toLowerCase() === currentPhase?.toLowerCase()) || 1; // Default to Power Struggle

    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative flex justify-between items-center w-full max-w-lg mx-auto">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -z-10 rounded-full"></div>

                {/* Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-1000"
                    style={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
                ></div>

                {phases.map((phase, index) => {
                    const isActive = index === currentIndex;
                    const isPast = index < currentIndex;

                    return (
                        <div key={phase} className="flex flex-col items-center group relative">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all z-10 bg-background",
                                isActive ? "border-primary scale-125 shadow-lg" :
                                    isPast ? "border-primary bg-primary text-primary-foreground" : "border-muted"
                            )}>
                                {isPast ? <CheckCircle2 size={16} /> :
                                    isActive ? <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" /> :
                                        <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />}
                            </div>

                            {/* Label */}
                            <div className={cn(
                                "absolute top-10 text-[10px] md:text-xs font-bold text-center w-24 transition-opacity",
                                isActive ? "opacity-100 text-primary" : "opacity-0 md:opacity-50 text-muted-foreground"
                            )}>
                                {phase}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Current Phase Description */}
            <div className="text-center mt-12 bg-secondary/10 p-4 rounded-xl border border-secondary/20 animate-fade-in-up">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Current Status</p>
                <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    {phases[currentIndex]}
                </h4>
            </div>
        </div>
    );
};
