import React from 'react';
import { Heart, Flame, AlertCircle, CheckCircle2, Lock, ArrowRight, Brain, Scale, Flag, Sparkles, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DimensionDeepDiveProps {
    dimensionKey: 'communication' | 'emotional_safety' | 'physical_intimacy' | 'power_fairness' | 'future_values';
    answers: Record<string, number>;
    aiAnalysis?: string; // Dynamic AI content for this dimension
}

/**
 * A unified component to display "Deep Dive" insights for any dimension.
 * Combines Rating-Driven (Specific hard truths based on Qs) + AI-Driven (General wisdom).
 */
// --- SCORING HELPER ---
function getDimensionScore(key: string, answers: Record<string, number>): { score: number, label: string, color: string } {
    let ids: number[] = [];
    switch (key) {
        case 'communication': ids = [1, 2, 3, 4, 5, 6]; break;
        case 'emotional_safety': ids = [7, 8, 9, 10, 11, 12]; break;
        case 'physical_intimacy': ids = [13, 14, 15, 16, 17, 18]; break;
        case 'power_fairness': ids = [19, 20, 21, 22, 23, 24]; break;
        case 'future_values': ids = [25, 26, 27, 28]; break;
    }

    if (ids.length === 0) return { score: 0, label: 'Unknown', color: 'text-gray-500' };

    // Calculate Average (1-5 scale)
    // Note: Assuming 1=Good, 5=Bad in this app based on "trigger if >= 4" logic seen in patterns.
    // WAIT. Let's verify scoring direction.
    // "trigger: (s) => s >= 4" implies 4/5 is BAD (High Issue).
    // So 1 = Healthy, 5 = Critical.

    // Let's invert it for display so 100% is GOOD.
    // Raw Average (1-5, where 5 is bad)
    const total = ids.reduce((sum, id) => {
        const val = answers[id.toString()];
        const numVal = typeof val !== 'undefined' ? Number(val) : 3;
        return sum + (isNaN(numVal) ? 3 : numVal);
    }, 0);
    const rawAvg = total / ids.length;

    // Convert to percentage health (1 = 100%, 5 = 0%)
    // Formula: (5 - rawAvg) / 4 * 100
    const healthPercent = Math.round(((5 - rawAvg) / 4) * 100);

    let label = "Healthy";
    let color = "text-green-600 dark:text-green-400";

    if (healthPercent < 40) {
        label = "Critical";
        color = "text-red-600 dark:text-red-400";
    } else if (healthPercent < 70) {
        label = "At Risk";
        color = "text-orange-600 dark:text-orange-400";
    }

    return { score: healthPercent, label, color };
}

export function DimensionDeepDive({ dimensionKey, answers, aiAnalysis }: DimensionDeepDiveProps) {

    // Helper to safety get score
    const getScore = (id: number) => answers[id.toString()] || 3;

    // --- CONFIGURATION PER DIMENSION ---
    const config = getDimensionConfig(dimensionKey);
    const insights = getDimensionInsights(dimensionKey);

    // Filter triggered insights
    const activeInsights = insights.filter(insight => insight.trigger(getScore(insight.id)));

    // Select Main Icon
    const MainIcon = config.icon;

    // --- CALCULATE SCORE ---
    const scoreData = getDimensionScore(dimensionKey, answers);

    return (
        <section id={`section-${dimensionKey}`} className="scroll-mt-24 mb-24">
            {/* Header */}
            <div className={`rounded-3xl p-8 md:p-12 border shadow-sm ${config.bg} ${config.border}`}>

                {/* BRAND NEW SCORE DASHBOARD */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-black/5 pb-8 gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${config.bg} border ${config.border}`}>
                            <MainIcon className={config.color} size={32} />
                        </div>
                        <div>
                            <h2 className={`text-sm font-bold uppercase tracking-wider ${config.textColor}`}>Deep Dive</h2>
                            <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground">{config.title}</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-white/50 dark:bg-black/20 px-6 py-4 rounded-2xl border border-black/5">
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase text-muted-foreground">Your Score</div>
                            <div className={`text-2xl font-bold ${scoreData.color}`}>{scoreData.score}%</div>
                        </div>
                        <div className="h-10 w-px bg-black/10"></div>
                        <div className="text-left">
                            <div className="text-xs font-bold uppercase text-muted-foreground">Status</div>
                            <div className={`text-lg font-bold ${scoreData.color}`}>{scoreData.label}</div>
                        </div>
                    </div>
                </div>

                <div className="text-center max-w-2xl mx-auto mb-12 hidden">
                    {/* Hidden old header content since we moved it up */}
                    <div className="flex items-center gap-2 mb-8 justify-center">
                        <MainIcon className={config.color} size={24} />
                        <h2 className={`text-sm font-bold uppercase tracking-wider ${config.textColor}`}>Deep Dive: {config.title}</h2>
                    </div>

                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display text-foreground">
                            {config.heading}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            {config.subheading}
                        </p>
                    </div>
                </div>

                {/* 1. RATING DRIVEN: Specific Hard Truths */}
                {activeInsights.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {activeInsights.map((insight, idx) => {
                            const Icon = insight.icon;
                            // Determine color overrides if the insight specifies them, else use dimension theme
                            const color = insight.color || config.textColor;
                            const bg = insight.bg || "bg-white dark:bg-black/20";

                            return (
                                <div key={idx} className={`rounded-2xl p-6 md:p-8 border shadow-sm bg-white/60 dark:bg-black/20 ${config.border}`}>
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`p-3 rounded-xl bg-background shadow-sm text-foreground`}>
                                            <Icon size={24} className={color} />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-xl ${color}`}>{insight.title}</h4>
                                            <div className="text-xs font-bold uppercase opacity-70 mt-1">Pattern #{idx + 1}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white/50 dark:bg-black/10 p-4 rounded-xl border border-black/5">
                                            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">You Said</p>
                                            <p className="italic text-foreground/80">"{insight.youSaid}"</p>
                                        </div>

                                        <div>
                                            <p className="font-medium leading-relaxed text-foreground/90">
                                                {insight.analysis}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-black/5 flex gap-3 items-start">
                                            <div className={`mt-1 bg-white rounded-full p-1`}>
                                                <ArrowRight size={14} className={color} />
                                            </div>
                                            <p className="text-sm font-bold text-foreground/80">
                                                <span className={color}>The Fix:</span> {insight.action}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : scoreData.score >= 70 ? (
                    // Thriving State for this dimension (Only if score is reasonably high)
                    <div className="bg-white/60 dark:bg-black/20 rounded-3xl p-10 text-center border border-black/5 mb-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Healthy Status: Active</h4>

                        <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-2xl mb-8 max-w-xl mx-auto">
                            <p className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-2">The Gold Standard</p>
                            <p className="text-lg font-serif italic text-foreground/80">
                                "{getGoldStandard(dimensionKey)}"
                            </p>
                        </div>

                        {/* Level Up Tip */}
                        <div className="inline-block bg-white dark:bg-black/40 rounded-xl p-4 border border-green-200 dark:border-green-900/30 max-w-md mx-auto">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Sparkles size={16} className="text-green-600 dark:text-green-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">{getLevelUpTip(dimensionKey).title}</span>
                            </div>
                            <p className="font-medium text-foreground/90 text-sm">
                                "{getLevelUpTip(dimensionKey).action}"
                            </p>
                        </div>
                    </div>
                ) : (
                    // Low Score but NO Specific Triggers (Silent Drift)
                    <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-3xl p-10 text-center border border-orange-100 dark:border-orange-800 mb-12">
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-2">Status: Silent Tension</h4>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                            You didn't report major "red flag" behaviors, but your overall score ({scoreData.score}%) indicates significant friction.
                            This often means you are <b>drifting apart quietly</b> rather than fighting loudly.
                        </p>
                        <div className="inline-block bg-white dark:bg-black/40 rounded-xl p-4 border border-orange-200 dark:border-orange-900/30 max-w-md mx-auto">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Target size={16} className="text-orange-600 dark:text-orange-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Recommended Focus</span>
                            </div>
                            <p className="font-medium text-foreground/90 text-sm">
                                Review the AI Analysis below. It has detected patterns that your conscious answers might have minimized.
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. AI DRIVEN: The Wisdom Layer */}
                {aiAnalysis && (
                    <div className="bg-white/80 dark:bg-slate-900/50 rounded-3xl p-8 md:p-10 border border-black/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] transform rotate-12">
                            <Sparkles size={150} />
                        </div>

                        <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
                            <Brain className={config.textColor} />
                            <div>
                                <h4 className="font-bold text-lg uppercase tracking-wide">AI Analysis</h4>
                                <p className="text-xs text-muted-foreground">Generated specifically for you</p>
                            </div>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 font-serif leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {aiAnalysis}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

// --- CONFIGURATION HELPERS ---

function getDimensionConfig(key: string) {
    switch (key) {
        case 'communication':
            return {
                title: "Communication",
                heading: "Your Fight Style",
                subheading: "How you handle conflict when your nervous system is triggered.",
                icon: Flag,
                bg: "bg-orange-50 dark:bg-orange-950/20",
                border: "border-orange-100 dark:border-orange-900/30",
                color: "text-orange-500",
                textColor: "text-orange-600 dark:text-orange-400"
            };
        case 'emotional_safety':
            return {
                title: "Emotional Safety",
                heading: "The Bond",
                subheading: "Do you trust them with your feelings? Do they have your back?",
                icon: Lock,
                bg: "bg-blue-50 dark:bg-blue-950/20",
                border: "border-blue-100 dark:border-blue-900/30",
                color: "text-blue-500",
                textColor: "text-blue-600 dark:text-blue-400"
            };
        case 'physical_intimacy':
            return {
                title: "Physical Intimacy",
                heading: "The Spark",
                subheading: "From holding hands to bedroom dynamics. Are you lovers or roommates?",
                icon: Flame,
                bg: "bg-rose-50 dark:bg-rose-950/20",
                border: "border-rose-100 dark:border-rose-900/30",
                color: "text-rose-500",
                textColor: "text-rose-600 dark:text-rose-400"
            };
        case 'power_fairness':
            return {
                title: "Fairness & Power",
                heading: "The Balance",
                subheading: "Who carries the mental load? Who makes the decisions?",
                icon: Scale,
                bg: "bg-purple-50 dark:bg-purple-950/20",
                border: "border-purple-100 dark:border-purple-900/30",
                color: "text-purple-500",
                textColor: "text-purple-600 dark:text-purple-400"
            };
        case 'future_values':
            return {
                title: "Future & Values",
                heading: "The Vision",
                subheading: "Are you rowing the boat in the same direction?",
                icon: Brain, // Or Map/Compass if available
                bg: "bg-emerald-50 dark:bg-emerald-950/20",
                border: "border-emerald-100 dark:border-emerald-900/30",
                color: "text-emerald-500",
                textColor: "text-emerald-600 dark:text-emerald-400"
            };
        default:
            return {
                title: "Analysis", heading: "Deep Dive", subheading: "", icon: CheckCircle2,
                bg: "bg-slate-50", border: "border-slate-100", color: "text-slate-500", textColor: "text-slate-600"
            };
    }
}

// --- INSIGHTS DATABASE (The "Question Bank") ---
function getDimensionInsights(key: string): any[] {
    switch (key) {
        case 'communication':
            return [
                {
                    id: 1, // Silent/Panic
                    trigger: (s: number) => s >= 4,
                    title: "Panic Pursuit",
                    icon: AlertCircle,
                    youSaid: "When they are silent, I panic and think they are leaving.",
                    analysis: "Silence registers as a threat to your brain. You pursue to get reassurance, but this likely pushes them further away.",
                    action: "Self-Soothe first. When they go quiet, put a hand on your chest and say 'I am safe'. Don't chase."
                },
                {
                    id: 2, // Shut down
                    trigger: (s: number) => s >= 4,
                    title: "Stonewalling",
                    icon: Lock,
                    youSaid: "They shut down or walk away during fights.",
                    analysis: "This isn't manipulation; it's overwhelm. Their brain has hit 'maximum capacity' and pulled the plug to prevent saying something regrettable.",
                    action: "Give them space, but demand a time to return. 'Take 20 minutes, then let's finish this.'"
                },
                {
                    id: 4, // Loop
                    trigger: (s: number) => s >= 4,
                    title: "The Infinite Loop",
                    icon: CheckCircle2, // Cycle icon
                    youSaid: "We have the same argument over and over.",
                    analysis: "You aren't fighting about the dirty dishes. You are fighting about the underlying question: 'Do you respect me?'",
                    action: "Stop arguing the facts. Start arguing the feelings. 'I feel unimportant when...'"
                }
            ];

        case 'emotional_safety':
            return [
                {
                    id: 7, // Not heard
                    trigger: (s: number) => s >= 4,
                    title: "Emotional Orphan",
                    icon: Heart,
                    youSaid: "I barely feel heard or understood.",
                    analysis: "You are lonely in this relationship. You might be 'managing' the relationship alone while they coast.",
                    action: "Stop 'hinting'. Be blunt. 'I need you to look at me and listen for 5 minutes.'"
                },
                {
                    id: 9, // Reassurance
                    trigger: (s: number) => s >= 4,
                    title: "Validation Hunger",
                    icon: Heart,
                    youSaid: "I need frequent reassurance to feel safe.",
                    analysis: "You have an 'Anxious' attachment style in this dynamic. You treat their neutral mood as a negative mood.",
                    action: "Ask for what you need. 'I'm making up a story that you're mad. Can you tell me we're good?'"
                },
                {
                    id: 12, // Slow repair
                    trigger: (s: number) => s >= 4,
                    title: "The Cold War",
                    icon: Lock,
                    youSaid: "It takes us a long time to reconnect after a fight.",
                    analysis: "You punish each other with distance. This erodes trust faster than the actual yelling does.",
                    action: "Prioritize repair. Even a clumsy apology is better than perfect silence."
                }
            ];

        case 'physical_intimacy':
            // Ported from previous IntimacySection
            return [
                { id: 13, trigger: (s: number) => s >= 4, title: "The Roommate Drift", icon: Heart, youSaid: "We are more like roommates than lovers.", analysis: "You operate as business partners. Efficiency kills intimacy.", action: "Ban logistics talk after 8pm." },
                { id: 14, trigger: (s: number) => s >= 4, title: "Rejection Sensitivity", icon: AlertCircle, youSaid: "I feel rejected as a person when they say no to sex.", analysis: "You equate sex with love. A 'no' to the act feels like a 'no' to your soul.", action: "Separate self-worth from their libido." },
                { id: 15, trigger: (s: number) => s >= 4, title: "Responsive Desire", icon: Lock, youSaid: "I need emotional connection before physical.", analysis: "You don't get horny spontaneously. You need safety first.", action: "Foreplay starts with conversation in the morning." },
                { id: 16, trigger: (s: number) => s >= 4, title: "The Desire Gap", icon: Flame, youSaid: "Mismatched desire levels.", analysis: "One chases, one retreats. The pressure to have sex actually kills the desire for sex.", action: "The higher drive partner must back off to let oxygen back into the room." }
            ];

        case 'power_fairness':
            return [
                {
                    id: 19, // Mental Load
                    trigger: (s: number) => s >= 4,
                    title: "The Project Manager",
                    icon: Scale,
                    youSaid: "I carry the mental load for the household.",
                    analysis: "You are the CEO of the house; they are the intern waiting for instructions. This is exhausting and unsexy.",
                    action: "Stop delegating tasks. Delegate *responsibilities*. 'You own dinner' includes planning, buying, and cooking."
                },
                {
                    id: 20, // Parent/Child
                    trigger: (s: number) => s >= 4,
                    title: "Parent-Child Dynamic",
                    icon: AlertCircle,
                    youSaid: "I feel like their parent.",
                    analysis: "If you mother them, they will act like a child (rebellious or helpless). You cannot be intimate with someone you parent.",
                    action: "Stop saving them. Let them fail. If they forget to do their laundry, let them wear dirty clothes."
                }
            ];

        case 'future_values':
            return [
                {
                    id: 25, // Different directions
                    trigger: (s: number) => s >= 4,
                    title: "The Drift",
                    icon: Brain,
                    youSaid: "We are growing in different directions.",
                    analysis: "You are evolving, they are staying put (or vice versa). A relationship must be a shared project.",
                    action: "Schedule a 'State of the Union' meeting. 'Where do we want to be in 5 years?'"
                },
                {
                    id: 27, // No fun
                    trigger: (s: number) => s >= 4,
                    title: "Joy Deficit",
                    icon: Sparkles,
                    youSaid: "We rarely just have fun anymore.",
                    analysis: "A relationship cannot survive on problem-solving alone. You need to play.",
                    action: "Go on a date this week where talking about work/kids/money is banned."
                }
            ];

        default:
            return [];
    }
}
// --- GOLD STANDARD (What Healthy Looks Like) ---
function getGoldStandard(key: string) {
    switch (key) {
        case 'communication':
            return "Conflict is safe. You can bring up a complaint without it turning into a war. You repair faster than you break.";
        case 'emotional_safety':
            return "You are each other's safe harbor. Vulnerability is met with curiosity, not judgment. You never feel alone in the same room.";
        case 'physical_intimacy':
            return "A fluid loop of emotional and physical connection. Sex is a language you speak together, not a currency you trade.";
        case 'power_fairness':
            return "A true partnership where labor and power are fluid. You don't keep score because you both trust the other is doing their best.";
        case 'future_values':
            return "Two independent lives growing toward a shared horizon. You preserve your individual dreams while building a joint legacy.";
        default:
            return "A balanced and secure dynamic.";
    }
}

// --- LEVEL UP TIPS (For Strong Foundation) ---
function getLevelUpTip(key: string) {
    switch (key) {
        case 'communication':
            return {
                title: "Level Up: The Daily Check-In",
                action: "Spend 20 minutes a week not talking about logistics. Ask: 'What made you feel most alive today?'"
            };
        case 'emotional_safety':
            return {
                title: "Level Up: Micro-Attunement",
                action: "Notice one small thing they do right every day and praise it. Safety creates space for vulnerability."
            };
        case 'physical_intimacy':
            return {
                title: "Level Up: The 6-Second Kiss",
                action: "Kiss for 6 full seconds when you say goodbye or hello. It releases oxytocin and signals 'we are lovers'."
            };
        case 'power_fairness':
            return {
                title: "Level Up: The Gratitude Flip",
                action: "Instead of tracking who does what, track who thanked whom. Fairness feels different when it's appreciated."
            };
        case 'future_values':
            return {
                title: "Level Up: Dream Stacking",
                action: "Once a month, spend $50 on a 'Vision Date'. Plan a hypothetical trip or project you can't afford yet."
            };
        default:
            return { title: "Level Up", action: "Quality time is the best investment." };
    }
}
