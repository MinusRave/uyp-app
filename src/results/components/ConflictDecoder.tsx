import React from 'react';
import { Search, ArrowDown, RefreshCw, Mail } from 'lucide-react';

interface ConflictDecoderProps {
    conflictText?: string;
}

export function ConflictDecoder({ conflictText = "we fight about small things" }: ConflictDecoderProps) {
    // Heuristic Analysis
    const surface = conflictText.length > 50 ? conflictText.substring(0, 50) + "..." : conflictText;

    let realIssue = "Do I matter to you? / Am I being heard?";
    let trigger = "Feeling dismissed or unimportant";

    const lowerText = conflictText.toLowerCase();

    if (lowerText.includes('money') || lowerText.includes('spend') || lowerText.includes('budget')) {
        realIssue = "Safety, Security, and Shared Values";
        trigger = "Fear of scarcity or lack of control";
    } else if (lowerText.includes('sex') || lowerText.includes('intimacy') || lowerText.includes('touch')) {
        realIssue = "Desirability, Connection, and Vulnerability";
        trigger = "Fear of rejection or inadequacy";
    } else if (lowerText.includes('chore') || lowerText.includes('clean') || lowerText.includes('dishes') || lowerText.includes('help')) {
        realIssue = "Partnership, Fairness, and Respect";
        trigger = "Feeling taken for granted or alone in the work";
    }

    return (
        <section className="bg-orange-50 dark:bg-orange-900/10 rounded-3xl p-8 border border-orange-100 dark:border-orange-900/30 mb-16">
            <div className="flex items-center gap-2 mb-6">
                <Search className="text-orange-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">The Conflict Decoder</h2>
            </div>

            <div className="text-center mb-8">
                <div className="inline-block bg-white dark:bg-black/20 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800 text-lg italic text-foreground/80 mb-4">
                    You wrote: "{surface}"
                </div>
            </div>

            <div className="relative">
                {/* Decor line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-orange-200 dark:bg-orange-800 -translate-x-1/2 hidden md:block" />

                <div className="grid md:grid-cols-2 gap-12 relative z-10">
                    {/* Left: Surface */}
                    <div className="bg-white dark:bg-black/20 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Surface Level</h4>
                        <p className="text-xl font-bold text-foreground">"{surface}"</p>
                    </div>

                    {/* Center Arrow (Desktop) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full border border-orange-300 dark:border-orange-700 hidden md:block">
                        <ArrowDown className="text-orange-600" />
                    </div>

                    {/* Right: Real Issue */}
                    <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-sm text-center ring-4 ring-orange-50 dark:ring-orange-900/10">
                        <h4 className="text-xs font-bold uppercase text-orange-600 mb-2">Real Issue (Hidden)</h4>
                        <p className="text-xl font-bold text-orange-800 dark:text-orange-200">{realIssue}</p>
                        <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800/50 text-sm text-orange-700 dark:text-orange-300">
                            <strong>Trigger:</strong> {trigger}
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
}
