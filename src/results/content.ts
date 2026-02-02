export type ScoreLevel = "LOW" | "MEDIUM" | "HIGH";

export const getLevel = (score: number): ScoreLevel => {
    if (score <= 2.5) return "LOW";
    if (score <= 3.5) return "MEDIUM";
    return "HIGH";
};

export const DIMENSIONS = {
    silence_distance: {
        title: "The Silence Trap",
        description: "How you react when they pull away.",
        levels: {
            LOW: {
                title: "Secure with Space",
                text: "You're okay when they need space. You don't panic.",
                advice: "Keep respecting their space, but say something when you need connection."
            },
            MEDIUM: {
                title: "Occasional Doubt",
                text: "You sometimes wonder 'Are we okay?' when they are quiet, but you can talk yourself down.",
                advice: "When you feel that doubt, just ask: 'We good?' instead of guessing."
            },
            HIGH: {
                title: "Panic Mode",
                text: "When they go silent, your body screams 'Danger'. You feel like they are leaving you.",
                advice: "Practice 'pausing'. When they go silent, tell yourself: 'They are overwhelmed, not leaving'. ask: 'Do you need a minute?'"
            }
        }
    },
    conflict_tension: {
        title: "The Blow-up",
        description: "How you handle it when things get heated.",
        levels: {
            LOW: {
                title: "Peacekeeper",
                text: "You swallow your feelings just to keep things calm.",
                advice: "Swallowing your feelings creates resentment. You need to speak up even if it's scary."
            },
            MEDIUM: {
                title: "Balanced",
                text: "You can handle a fight without thinking the world is ending.",
                advice: "Keep focusing on 'repair'—making jokes or apologizing after a fight."
            },
            HIGH: {
                title: "Urgent Fixer",
                text: "You feel physically sick if a fight isn't resolved RIGHT NOW. You can't sleep until it's fixed.",
                advice: "Learn to self-soothe. Sometimes they need to cool down before they can talk. Pushing them pushes them away."
            }
        }
    },
    intentional_attribution: {
        title: "The Blame Game",
        description: "Do you think they hurt you on purpose?",
        levels: {
            LOW: {
                title: "Benefit of the Doubt",
                text: "You know they aren't trying to be mean.",
                advice: "This is a superpower. Keep assuming they mean well."
            },
            MEDIUM: {
                title: "Skeptic",
                text: "When you're mad, you start to think: 'They are doing this just to annoy me.'",
                advice: "Check the story in your head. Are they evil, or just careless?"
            },
            HIGH: {
                title: "The Prosecutor",
                text: "You feel like everything they do is a personal attack.",
                advice: "This kills love. Ask yourself: 'Could this be a mistake rather than an attack?'"
            }
        }
    },
    reassurance_need: {
        title: "Feeling Unloved",
        description: "How often you need to hear 'I love you'.",
        levels: {
            LOW: {
                title: "Secure",
                text: "You know they love you, even if they don't say it constantly.",
                advice: "Make sure you still appreciate when they DO say it."
            },
            MEDIUM: {
                title: "Normal Needs",
                text: "You like hearing it, but you don't panic without it.",
                advice: "Tell them clearly: 'I need a little boost today'."
            },
            HIGH: {
                title: "Starving for Signal",
                text: "If they are quiet, you feel unloved. You need constant proof.",
                advice: "Work on believing you are worthy, with or without their constant praise."
            }
        }
    },
    repair_closure: {
        title: "Making Up",
        description: "Can you let it go?",
        levels: {
            LOW: {
                title: "Grudge Holder",
                text: "You hold onto the pain long after the fight is over.",
                advice: "Holding a grudge hurts YOU, not them. Let it go for your own sake."
            },
            MEDIUM: {
                title: "Steady",
                text: "You can move on, but it takes you a minute.",
                advice: "Focus on small jokes to break the tension."
            },
            HIGH: {
                title: "Rug Sweeper",
                text: "You pretend nothing happened just to stop the bad feelings.",
                advice: "Don't just pretend. Actually say 'Are we good?' then really let it go."
            }
        }
    }
};
