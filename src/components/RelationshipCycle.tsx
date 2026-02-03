import React from 'react';
import { ArrowDown, Zap, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface RelationshipCycleProps {
    myLens: string;
    partnerLens: string;
}

export const RelationshipCycle: React.FC<RelationshipCycleProps> = ({ myLens, partnerLens }) => {
    // Dynamic Content based on Lens
    const getLensData = (lens: string) => {
        const lower = lens.toLowerCase();
        if (lower.includes('anxiety') || lower.includes('pursuer')) {
            return {
                role: 'The Pursuer / Worrier',
                feeling: 'Alone, Unimportant, Panic',
                reaction: 'Pursues, Texts multiple times, Demands attention',
                need: 'Reassurance & Connection',
                circuitBreaker: 'Pause. Self-soothe. "I am feeling anxious, I need 5 minutes."'
            };
        }
        if (lower.includes('avoidance') || lower.includes('withdraw') || lower.includes('distancer')) {
            return {
                role: 'The Distancer / Withdrawer',
                feeling: 'Overwhelmed, Controlled, Defective',
                reaction: 'Shuts down, Leaves room, Goes silent',
                need: 'Space & Autonomy',
                circuitBreaker: 'Don\'t just leave. Say: "I am flooded. I need 20 mins, then I will come back."'
            };
        }
        // Fallback / Mixed
        return {
            role: 'The Protector / Reactor',
            feeling: 'Misunderstood, Unsafe',
            reaction: 'Defends, Explains, Fixes',
            need: 'Safety & Understanding',
            circuitBreaker: 'Stop explaining. Ask: "What do you need right now?"'
        };
    };

    const me = getLensData(myLens);
    const partner = getLensData(partnerLens);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 py-8 px-4">

            {/* STEP 1: THE TRIGGER */}
            <div className="relative text-center">
                <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border border-red-200 shadow-sm animate-pulse z-10 relative">
                    <Zap size={16} fill="currentColor" /> The Trigger
                </div>
                <div className="mt-4 bg-background border border-border p-4 rounded-xl shadow-sm max-w-sm mx-auto">
                    <p className="text-muted-foreground italic">"Something happens (Tone of voice, a ignored text, a chore left undone)..."</p>
                </div>
                {/* Arrow */}
                <div className="absolute left-1/2 -bottom-8 h-8 w-0.5 bg-border -translate-x-1/2" />
                <div className="absolute left-1/2 -bottom-8 translate-y-full -translate-x-1/2 text-muted-foreground/30">
                    <ArrowDown size={24} />
                </div>
            </div>

            {/* STEP 2: MY REACTION */}
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-3xl p-6 md:p-8 relative mt-12">
                <div className="absolute -top-3 left-6 bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
                    Step 1: You
                </div>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h4 className="font-bold text-lg text-orange-800 dark:text-orange-300 mb-2">You Feel:</h4>
                        <p className="text-xl font-serif italic text-foreground/90 leading-relaxed">"{me.feeling}"</p>
                    </div>
                    <div className="md:border-l md:border-orange-200/50 md:pl-6">
                        <h4 className="font-bold text-lg text-orange-800 dark:text-orange-300 mb-2">So You React:</h4>
                        <p className="text-lg text-foreground/80">{me.reaction}</p>
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center -my-2 opacity-30">
                <ArrowDown size={32} />
            </div>

            {/* STEP 3: PARTNER REACTION */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 md:p-8 relative">
                <div className="absolute -top-3 right-6 bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
                    Step 2: Partner
                </div>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="md:text-right order-2 md:order-1">
                        <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-2">Partner Reacts:</h4>
                        <p className="text-lg text-foreground/80">{partner.reaction}</p>
                    </div>
                    <div className="md:border-l md:border-blue-200/50 md:pl-6 order-1 md:order-2">
                        <h4 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-2">Because They Feel:</h4>
                        <p className="text-xl font-serif italic text-foreground/90 leading-relaxed">"{partner.feeling}"</p>
                    </div>
                </div>
            </div>

            {/* STEP 4: THE LOOP (RESULT) */}
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center p-4 bg-background rounded-full shadow-lg border-4 border-slate-100 dark:border-slate-800 mb-4 z-10 relative">
                    <RefreshCw size={32} className="text-slate-400 animate-spin-slow" style={{ animationDuration: '10s' }} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">The Loop Takes Over</h3>
                <p className="text-muted-foreground max-w-md mx-auto mt-2">
                    You chase, they run (or vice versa). The more you do, the worse it gets.
                    <br /><span className="font-bold text-foreground">Neither of you gets what you need.</span>
                </p>
            </div>

            {/* STEP 5: THE WAY OUT (SOLUTION) */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-background rounded-xl border border-green-200 dark:border-green-900/30 p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-green-100 text-green-600 p-4 rounded-full shrink-0">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-lg font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">The Circuit Breaker</h4>
                            <p className="text-lg font-medium text-foreground/90 mb-2">
                                For you ({me.role}), the exit is:
                            </p>
                            <p className="text-xl md:text-2xl font-serif italic text-foreground leading-relaxed bg-green-50/50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100 dark:border-green-800/20">
                                "{me.circuitBreaker}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
