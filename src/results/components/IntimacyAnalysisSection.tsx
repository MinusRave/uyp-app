import React from 'react';
import { Heart, Flame, AlertCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface IntimacyAnalysisSectionProps {
    answers: Record<string, number>; // Map of QuestionID -> Score (1-5)
}

export function IntimacyAnalysisSection({ answers }: IntimacyAnalysisSectionProps) {

    // Helper to get raw score (handle missing)
    const getScore = (id: number) => answers[id.toString()] || 3;

    // Define the insights logic
    const insights = [
        {
            id: 13,
            trigger: (score: number) => score >= 4, // Agree/Strongly Agree
            title: "The Roommate Drift",
            icon: Heart,
            color: "text-rose-500",
            bg: "bg-rose-50 dark:bg-rose-900/10",
            youSaid: "I feel we have become more like roommates than lovers.",
            analysis: "You satisfy the 'Business Partnership' of marriage (logistics, bills, kids) but starve the 'Romantic Partnership'. This isn't a lack of love; it's a lack of polarity.",
            action: "Stop talking about logistics after 8 PM. Creating separation between 'Work You' and 'Lover You' is critical."
        },
        {
            id: 14,
            trigger: (score: number) => score >= 4,
            title: "Rejection Sensitivity",
            icon: AlertCircle,
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-900/10",
            youSaid: "I feel rejected as a person when my partner turns down sex.",
            analysis: "You equate sex with love. When they say 'no' to the act, you hear 'no' to *you*. This inadvertently pressures them, making sex feel like a duty rather than a gift.",
            action: "Separate the 'No'. Remind yourself: 'They are rejecting the activity right now, not my worth as a human.'"
        },
        {
            id: 15,
            trigger: (score: number) => score >= 4,
            title: "Responsive Desire",
            icon: Lock,
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/10",
            youSaid: "I need to feel emotional connection before physical connection.",
            analysis: "You likely have 'Responsive Desire'. You don't get horny randomly; you get horny *in response* to safety and connection. Your partner may have 'Spontaneous Desire' and confusingly wait for you to initiate.",
            action: "Educate your partner: 'Foreplay starts in the morning with emotional safety, not 5 minutes before bed.'"
        },
        {
            id: 16,
            trigger: (score: number) => score >= 4,
            title: "The Desire Gap",
            icon: Flame,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-900/10",
            youSaid: "One of us wants sex significantly more than the other.",
            analysis: "This is the classic Pursuer-Distancer dynamic in the bedroom. The High Desire partner chases (creating pressure), and the Low Desire partner retreats (seeking autonomy).",
            action: "The High Desire partner must 'take their foot off the gas' to create space for the Low Desire partner to lean in."
        },
        {
            id: 17,
            trigger: (score: number) => score >= 4,
            title: "Duty Sex (The Libido Killer)",
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/10",
            youSaid: "I sometimes agree to sex just to keep the peace.",
            analysis: "Consensual but unwanted sex is toxic to long-term desire. It trains your body to associate sex with resentment or dissociation, eventually leading to total aversion.",
            action: "Stop having duty sex immediately. It is better to have no sex than resentful sex. Build intimacy through non-sexual touch first."
        },
        {
            id: 18,
            trigger: (score: number) => score <= 2, // Disagree/Strongly Disagree (Reverse Coded in meaning, but here checked raw)
            // Original Q: "We touch affectionately often, even without sex."
            // If they DISAGREE (score 1 or 2), it means they LACK touch.
            title: "Touch Starvation",
            icon: HandMetal, // Using generic icon or Heart
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/10",
            youSaid: "We rarely touch affectionately unless it's leading to sex.",
            analysis: "When touch only happens as a precursor to sex, the Low Desire partner starts 'flinching' at a hug because they fear it's a contract they didn't sign.",
            action: "Institute 'The 60-Second Hug' with zero expectation of sex. Retrain your nervous systems to feel safe in touch."
        }
    ];

    // Filter active insights
    const activeInsights = insights.filter(insight => insight.trigger(getScore(insight.id)));

    // Lucide Icon Component Helper
    function HandMetal(props: any) {
        return <Heart {...props} />; // Fallback since HandMetal might not be imported or exist in all versions
    }


    return (
        <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 rounded-3xl p-8 md:p-12 border border-rose-100 dark:border-rose-900/30">
            <div className="flex items-center gap-2 mb-8 justify-center">
                <Flame className="text-rose-500 fill-rose-500" size={24} />
                <h2 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Deep Dive: Intimacy Analysis</h2>
            </div>

            <div className="text-center max-w-2xl mx-auto mb-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display text-foreground">
                    Your Sexual Dynamics
                </h3>
                <p className="text-lg text-muted-foreground">
                    Based on your specific answers, here is why your intimacy feels the way it does.
                </p>
            </div>

            {activeInsights.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {activeInsights.map((insight, idx) => {
                        const Icon = insight.icon;
                        return (
                            <div key={idx} className={`rounded-2xl p-6 md:p-8 border shadow-sm ${insight.bg} border-border/50`}>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`p-3 rounded-xl bg-background shadow-sm ${insight.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-xl ${insight.color}`}>{insight.title}</h4>
                                        <div className="text-xs font-bold uppercase opacity-70 mt-1">Insight #{idx + 1}</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/50 dark:bg-black/10 p-4 rounded-xl border border-black/5">
                                        <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Your Answer</p>
                                        <p className="italic text-foreground/80">"{insight.youSaid}"</p>
                                    </div>

                                    <div>
                                        <p className="font-medium leading-relaxed text-foreground/90">
                                            {insight.analysis}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-black/5 flex gap-3 items-start">
                                        <div className={`mt-1 bg-white rounded-full p-1 ${insight.color}`}>
                                            <ArrowRight size={14} />
                                        </div>
                                        <p className="text-sm font-bold text-foreground/80">
                                            <span className={`${insight.color}`}>Fix:</span> {insight.action}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Thriving State
                <div className="bg-white dark:bg-black/20 rounded-3xl p-10 text-center border border-green-200 dark:border-green-900/30">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h4 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">A Strong Foundation</h4>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Your answers indicate a high level of physical connection and safety. You don't show the common signs of 'Roommate Drift' or resentment. Keep prioritizing non-sexual touch and emotional safety to maintain this.
                    </p>
                </div>
            )}
        </section>
    );
}
