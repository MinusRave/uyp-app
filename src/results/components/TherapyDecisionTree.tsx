import React from 'react';
import { ArrowDown, XCircle, CheckCircle } from 'lucide-react';

export function TherapyDecisionTree() {
    return (
        <section className="mb-16">
            <h2 className="text-center text-2xl font-bold mb-8">Why Traditional Advice Often Fails</h2>

            <div className="grid md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
                {/* Traditional Route */}
                <div className="bg-gray-50 dark:bg-gray-800/20 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gray-300 dark:bg-gray-700" />
                    <h3 className="text-xl font-bold text-gray-500 mb-8 text-center uppercase tracking-wide">Traditional Route</h3>

                    <div className="space-y-6 relative">
                        <div className="bg-white dark:bg-black/40 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                            <div className="font-bold mb-1">1. Focus on Communication</div>
                            <p className="text-sm text-muted-foreground">"Use 'I' statements and active listening"</p>
                        </div>

                        <div className="flex justify-center text-gray-300"><ArrowDown /></div>

                        <div className="bg-white dark:bg-black/40 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-center relative">
                            <div className="font-bold mb-1">2. Amygdala Hi-Jacks</div>
                            <p className="text-sm text-muted-foreground">Logic goes offline. Techniques become weapons.</p>
                        </div>

                        <div className="flex justify-center text-gray-300"><ArrowDown /></div>

                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-center">
                            <div className="flex justify-center mb-2 text-red-500"><XCircle /></div>
                            <div className="font-bold text-red-700 dark:text-red-400 mb-1">OUTCOME: Failure</div>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80">"We must be broken."</p>
                        </div>
                    </div>
                </div>

                {/* MRI Method */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-6 md:p-8 border border-emerald-100 dark:border-emerald-800 relative overflow-hidden shadow-lg transform md:-translate-y-2">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                    <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-8 text-center uppercase tracking-wide">The MRI Method</h3>

                    <div className="space-y-6 relative">
                        <div className="bg-white dark:bg-black/40 p-4 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800 text-center">
                            <div className="font-bold mb-1">1. Focus on Nervous System</div>
                            <p className="text-sm text-muted-foreground">Identify biological triggers first.</p>
                        </div>

                        <div className="flex justify-center text-emerald-300"><ArrowDown /></div>

                        <div className="bg-white dark:bg-black/40 p-4 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800 text-center relative">
                            <div className="font-bold mb-1">2. Regulate First</div>
                            <p className="text-sm text-muted-foreground">Soothe the body. Restore safety.</p>
                        </div>

                        <div className="flex justify-center text-emerald-300"><ArrowDown /></div>

                        <div className="bg-emerald-100 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700 text-center">
                            <div className="flex justify-center mb-2 text-emerald-600"><CheckCircle /></div>
                            <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1">OUTCOME: Connection</div>
                            <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">Triggers lose power.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center max-w-2xl mx-auto">
                <p className="text-lg font-serif italic text-muted-foreground">
                    "Traditional therapy asks you to swim upstream against your biology.
                    We teach you to stop the current."
                </p>
            </div>
        </section>
    );
}
