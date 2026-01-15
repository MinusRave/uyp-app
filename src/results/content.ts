export type ScoreLevel = "LOW" | "MEDIUM" | "HIGH";

export const getLevel = (score: number): ScoreLevel => {
    if (score <= 2.5) return "LOW";
    if (score <= 3.5) return "MEDIUM";
    return "HIGH";
};

export const DIMENSIONS = {
    silence_distance: {
        title: "Silence & Distance",
        description: "How you interpret and react to your partner's need for space or silence.",
        levels: {
            LOW: {
                title: "Secure with Space",
                text: "You generally feel comfortable when your partner needs space or is silent. You don't immediately interpret it as a threat to the relationship.",
                advice: "Continue to respect their space, but ensure you also voice your needs when you want connection."
            },
            MEDIUM: {
                title: "Occasional Doubt",
                text: "You sometimes wonder if silence means something is wrong, but you can usually rationalize it.",
                advice: "When doubt creeps in, ask for clarification calmly instead of assuming the worst."
            },
            HIGH: {
                title: "Silence Alert System",
                text: "You strongly interpret silence or distance as a sign of anger or rejection. It triggers immediate anxiety.",
                advice: "Practice 'pausing'. When they go silent, remind yourself: 'Silence is not necessarily rejection'. ask: 'Do you need some time?'"
            }
        }
    },
    conflict_tension: {
        title: "Conflict & Tension",
        description: "Your comfort level with unresolved arguments and emotional tension.",
        levels: {
            LOW: {
                title: "Conflict Avoider",
                text: "You may try to avoid conflict at all costs to keep the peace.",
                advice: "Remember that healthy conflict is necessary for growth. Don't suppress your needs just to avoid tension."
            },
            MEDIUM: {
                title: "Balanced Resolver",
                text: "You can handle some tension but prefer to resolve things relatively quickly.",
                advice: "You have a healthy balance. Keep focusing on 'repair' after arguments."
            },
            HIGH: {
                title: "Urgent Resolver",
                text: "You feel extreme distress if a conflict isn't resolved immediately. 'Going to bed angry' is impossible for you.",
                advice: "Learn to self-soothe during unresolved tension. Sometimes partners need time to cool down before resolving."
            }
        }
    },
    intentional_attribution: {
        title: "Intentional Attribution",
        description: "To what extent you believe your partner hurts you on purpose.",
        levels: {
            LOW: {
                title: "Benefit of the Doubt",
                text: "You rarely believe your partner is trying to hurt you intentionally.",
                advice: "This is a great strength. Keep assuming positive intent."
            },
            MEDIUM: {
                title: "Situational Skeptic",
                text: "In heated moments, you might suspect they are doing things just to annoy you.",
                advice: "Check your narrative. Are they actually 'trying to hurt you' or just being careless?"
            },
            HIGH: {
                title: "Malice Detective",
                text: "You often feel your partner's actions are calculated attacks against you.",
                advice: "This pattern erodes trust. Challenge this thought: 'Could this be a mistake rather than an attack?'"
            }
        }
    },
    reassurance_need: {
        title: "Reassurance Need",
        description: "How much verbal confirmation you need to feel loved.",
        levels: {
            LOW: {
                title: "Self-Assured",
                text: "You feel loved without needing constant verbal reminders.",
                advice: "Make sure you still appreciate when they DO give compliments."
            },
            MEDIUM: {
                title: "Moderate Validation",
                text: "You enjoy reassurance but don't crumble without it.",
                advice: "Communicate your 'love language' clearly so they know when you need a boost."
            },
            HIGH: {
                title: "Validation Hungry",
                text: "You feel empty or anxious if you don't hear 'I love you' or receive validation frequently.",
                advice: "Work on self-validation. Your worth exists independently of their praise."
            }
        }
    },
    repair_closure: {
        title: "Repair & Closure",
        description: "How you handle the aftermath of a disagreement.",
        levels: {
            LOW: {
                title: "Lingering Resentment",
                text: "You struggle to let go and may hold grudges after arguments.",
                advice: "Holding onto resentment hurts you more than them. Practice 'letting go' rituals."
            },
            MEDIUM: {
                title: "Steady Repairer",
                text: "You can move on, though sometimes IT takes a while.",
                advice: "Focus on 'repair attempts'—small jokes or apologies that break the tension."
            },
            HIGH: {
                title: "Quick Eraser",
                text: "You might want to pretend nothing happened just to move on quickly.",
                advice: "Ensure you aren't rug-sweeping. Genuine repair means acknowledging what happened, not just ignoring it."
            }
        }
    }
};
