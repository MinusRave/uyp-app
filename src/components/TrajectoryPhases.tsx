
import React from 'react';
import { ArrowDown } from 'lucide-react';

interface TrajectoryPhasesProps {
    currentPhase?: string;
}

const phases = [
    "The Honeymoon",
    "The Power Struggle",
    "The Dead Zone",
    "The Partnership"
];

const TrajectoryPhases: React.FC<TrajectoryPhasesProps> = ({ currentPhase = "The Power Struggle" }) => {

    // Determine active index
    const activeIndex = phases.findIndex(p => p.toLowerCase().includes(currentPhase.toLowerCase().replace("the ", "")));
    const safeIndex = activeIndex === -1 ? 1 : activeIndex;

    return (
        <div className="w-full py-8">
            <div className="flex justify-between items-start relative max-w-2xl mx-auto px-4">

                {/* Connecting Line */}
                <div className="absolute top-5 left-4 right-4 h-0.5 bg-border -z-10" />

                {phases.map((phase, index) => {
                    const isActive = index === safeIndex;
                    const isPast = index < safeIndex;
                    const isFuture = index > safeIndex;

                    return (
                        <div key={index} className="flex flex-col items-center flex-1 relative group">
                            <div
                                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center bg-background transition-all duration-300 relative
                                ${isActive ? 'border-primary scale-125 shadow-lg z-10' : ''}
                                ${isPast ? 'border-primary/50 text-muted-foreground' : ''}
                                ${isFuture ? 'border-muted text-muted-foreground/30' : ''}
                                `}
                            >
                                {isActive && <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />}
                                {isPast && <div className="w-full h-full rounded-full bg-primary/10" />}
                            </div>

                            <div className={`mt-4 text-center text-xs md:text-sm font-bold max-w-[80px] leading-tight
                                ${isActive ? 'text-primary' : 'text-muted-foreground'}
                                ${isFuture ? 'opacity-50' : ''}
                            `}>
                                {phase}
                            </div>

                            {isActive && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-primary flex flex-col items-center animate-bounce">
                                    YOU ARE HERE
                                    <ArrowDown size={12} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-8 text-sm">
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                    <h4 className="font-bold text-red-600 mb-2 uppercase text-xs tracking-wider">Without Intervention</h4>
                    <ul className="space-y-2">
                        <li className="flex gap-2">
                            <span className="font-bold">6 mo:</span>
                            <span className="text-muted-foreground">Slide into "Dead Zone" (68% prob)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">12 mo:</span>
                            <span className="text-muted-foreground">Emotional detachment sets in</span>
                        </li>
                        {/* Blurred future */}
                        <li className="filter blur-[3px] select-none opacity-50">
                            18 mo: Complete relationship breakdown and potential separation
                        </li>
                    </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20">
                    <h4 className="font-bold text-green-600 mb-2 uppercase text-xs tracking-wider">With Intervention</h4>
                    <ul className="space-y-2">
                        <li className="flex gap-2">
                            <span className="font-bold">6 mo:</span>
                            <span className="filter blur-[3px] select-none text-muted-foreground">Conflict frequency reduced by 80%</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">12 mo:</span>
                            <span className="filter blur-[3px] select-none text-muted-foreground">Restored intimacy and trust</span>
                        </li>
                    </ul>
                    <div className="mt-2 text-center">
                        <span className="text-xs font-bold text-green-600 bg-white/50 px-2 py-1 rounded">🔒 Forecast Locked</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrajectoryPhases;
