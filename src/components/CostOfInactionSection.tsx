import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, Activity, TrendingDown } from 'lucide-react';

export default function CostOfInactionSection() {
    return (
        <section className="bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl p-6 md:p-10 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                <TrendingDown size={200} />
            </div>

            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                    <AlertTriangle size={14} /> Critical Warning
                </div>
                <h3 className="font-bold text-3xl md:text-4xl mb-3">The "Fork in the Road" Moment</h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Psychologists call this the <span className="font-bold text-foreground">"Drift Point."</span> Here is where your two futures diverge.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {/* PATH A: INACTION */}
                <div className="bg-white/80 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50 rounded-2xl p-6 md:p-8 flex flex-col shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-red-100 dark:border-red-900/30 pb-4">
                        <div className="bg-red-100 dark:bg-red-900/50 rounded-full p-2.5">
                            <TrendingDown size={24} className="text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-red-900 dark:text-red-200">Path A: Do Nothing</h4>
                            <p className="text-xs font-bold text-red-600 uppercase tracking-widest">High Risk</p>
                        </div>
                    </div>

                    <div className="space-y-5 mb-8 flex-grow">
                        <div className="flex gap-4">
                            <span className="font-bold text-red-300 text-lg">01</span>
                            <div>
                                <h5 className="font-bold text-sm text-foreground mb-1">The "Groove" Gets Deeper</h5>
                                <p className="text-sm text-muted-foreground">Every time you have this same fight, the neural pathway reinforces itself. It becomes physically harder to stop next time.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-bold text-red-300 text-lg">02</span>
                            <div>
                                <h5 className="font-bold text-sm text-foreground mb-1">Resentment calcifies</h5>
                                <p className="text-sm text-muted-foreground">What is currently "annoyance" slowly turns into "indifference" (the #1 predictor of divorce).</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-bold text-red-300 text-lg">03</span>
                            <div>
                                <h5 className="font-bold text-sm text-foreground mb-1">The 18-Month Cliff</h5>
                                <p className="text-sm text-muted-foreground">Couples who score in your range often hit a breaking point within 1.5 years without intervention.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-xl p-4 mt-auto">
                        <div className="flex items-start gap-3">
                            <Activity size={18} className="text-red-600 mt-1 shrink-0 animate-pulse" />
                            <p className="text-sm font-medium text-red-900 dark:text-red-200">
                                <span className="font-bold">Statistic:</span> 68% of couples who ignore these signs end up in "Crisis Mode" where repair takes 3x longer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* PATH B: ACTION */}
                <div className="bg-white dark:bg-green-950/20 border-2 border-green-500 dark:border-green-700 rounded-2xl p-6 md:p-8 flex flex-col shadow-xl transform md:-translate-y-4 ring-4 ring-green-100 dark:ring-green-900/20">
                    <div className="flex items-center gap-3 mb-6 border-b border-green-100 dark:border-green-900/30 pb-4">
                        <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-2.5">
                            <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-green-900 dark:text-green-200">Path B: Get The Map</h4>
                            <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Proven Solution</p>
                        </div>
                    </div>

                    <div className="space-y-5 mb-8 flex-grow">
                        <div className="flex gap-4">
                            <span className="font-bold text-green-300 text-lg">01</span>
                            <div>
                                <h5 className="font-bold text-sm text-foreground mb-1">Pattern Interrupt</h5>
                                <p className="text-sm text-muted-foreground">You learn the 6-second trick to stop the spiral before it starts.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-bold text-green-300 text-lg">02</span>
                            <div>
                                <h5 className="font-bold text-sm text-foreground mb-1">You feel "See" again</h5>
                                <p className="text-sm text-muted-foreground">Instead of "why are you doing this to me?", you see "oh, this is their fear response."</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="font-bold text-green-300 text-lg">03</span>
                            <div>
                                <h5 className="font-bold text-sm text-foreground mb-1">Connection returns</h5>
                                <p className="text-sm text-muted-foreground">The silence breaks. The intimacy comes back. You remember why you fell in love.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-xl p-4 mt-auto">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 size={18} className="text-green-600 mt-1 shrink-0" />
                            <p className="text-sm font-medium text-green-900 dark:text-green-200">
                                <span className="font-bold">Fact:</span> It costs less than a single takeout meal to fix this tonight.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA Nudge */}
            <div className="mt-12 text-center">
                <p className="text-lg text-muted-foreground mb-4">
                    The groove is getting deeper every day you wait.
                </p>
                <div className="inline-block relative">
                    <ArrowRight className="absolute -left-8 top-1/2 -translate-y-1/2 text-primary animate-pulse" />
                    <p className="text-xl md:text-2xl font-bold">
                        Stop the drift. <span className="text-primary underline decoration-wavy underline-offset-4">Get your map now.</span>
                    </p>
                    <ArrowRight className="absolute -right-8 top-1/2 -translate-y-1/2 text-primary animate-pulse" />
                </div>
            </div>
        </section>
    );
}
