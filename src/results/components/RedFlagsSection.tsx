import React from 'react';
import { Flag, ArrowRight, AlertCircle, Quote } from 'lucide-react';

interface RedFlagsSectionProps {
    scores: any; // Using any for flexibility with session object structure
}

export function RedFlagsSection({ scores }: RedFlagsSectionProps) {
    interface FlagItem {
        title: string;
        youSaid: string;
        meaning: string;
        fix: string;
    }
    // Logic to determine flags
    const flags: FlagItem[] = [];

    const safetyScore = scores.dimensions?.emotional_safety?.PM || 50;
    const fairnessScore = scores.dimensions?.power_fairness?.SL || 50;
    const anxietyScore = scores.dimensions?.physical_intimacy?.SL || 50;

    // Flag 1: Shut down (Avoidance) - Triggered if Safety (Real) is low
    if (safetyScore < 45) {
        flags.push({
            title: "They shut down during conflict",
            youSaid: `Emotional Safety Real Score: ${Math.round(safetyScore)}/100 (Low)`,
            meaning: "When you escalate, their nervous system screams 'TOO MUCH'. They retreat to protect themselves, which feels like abandonment to you.",
            fix: "Notice when you're escalating. Pause BEFORE they shut down. Say: 'I'm activated. Can we take 15 mins?'"
        });
    }

    // Flag 2: Mental Load (Fairness) - Triggered if Fairness (Feel) is high (meaning high imbalance pain)
    if (fairnessScore > 70) {
        flags.push({
            title: "Decisions happen without your input",
            youSaid: `Power Fairness Load: ${Math.round(fairnessScore)}/100 (High Burden)`,
            meaning: "You carry the mental load because if you don't, nothing happens. This creates a Pursuer-Distancer dynamic around responsibility.",
            fix: "Stop managing everything. Pick ONE task and ask them to OWN it completely. 'I need you to own the weekend plans.'"
        });
    }

    // Flag 3: Reassurance (Anxiety) - Triggered if Anxiety is high
    if (anxietyScore > 65) {
        flags.push({
            title: "They don't reassure you enough",
            youSaid: `Intimacy/Reassurance Need: ${Math.round(anxietyScore)}/100 (High)`,
            meaning: "Your nervous system needs constant confirmation of connection. They likely interpret this as 'needy' or 'critical'.",
            fix: "Be explicit: 'When you go quiet, I assume the worst. I just need to hear we are okay.'"
        });
    }

    // Fallback if not enough flags
    if (flags.length < 3) {
        flags.push({
            title: "The Silent Treatment",
            youSaid: "Common Pattern Detected",
            meaning: "Silence is often a freeze response, not a punishment. They are overwhelmed.",
            fix: "Soft start-up. Don't attack their silence. Invite them back in gently."
        });
    }

    return (
        <section className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-8 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-2 mb-8">
                <Flag className="text-red-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Partner's Red Flags</h2>
            </div>

            <h3 className="text-3xl font-bold mb-8">What Triggers You Most</h3>

            <div className="space-y-8">
                {flags.slice(0, 3).map((flag, idx) => (
                    <div key={idx} className="bg-white dark:bg-black/20 rounded-2xl p-6 md:p-8 border border-red-100 dark:border-red-900/20 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <AlertCircle size={100} />
                        </div>

                        <h4 className="font-bold text-xl text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
                            <span className="bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded text-sm uppercase tracking-wide">Red Flag #{idx + 1}</span>
                            {flag.title}
                        </h4>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* YOU SAID */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                                    <Quote size={10} /> Data Point
                                </div>
                                <p className="font-medium text-sm">{flag.youSaid}</p>
                            </div>

                            {/* MEANING */}
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <div className="text-xs font-bold uppercase text-red-600 mb-1">Diagnosis</div>
                                    <p className="leading-relaxed text-foreground/90">{flag.meaning}</p>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border-l-4 border-green-500">
                                    <div className="text-xs font-bold uppercase text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                                        <ArrowRight size={12} /> The Fix
                                    </div>
                                    <p className="italic text-foreground/80 font-medium">"{flag.fix}"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
