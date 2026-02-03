export type ScoreLevel = "LOW" | "MEDIUM" | "HIGH";

export const getLevel = (score: number): ScoreLevel => {
    if (score <= 2.5) return "LOW";
    if (score <= 3.5) return "MEDIUM";
    return "HIGH";
};


export const DIMENSIONS = {
    communication: {
        title: "Communication Style",
        description: "How you handle conflict and silence.",
        levels: {
            LOW: { title: "Secure Flow", text: "You communicate well.", advice: "Keep it up." },
            MEDIUM: { title: "Friction", text: "You have some bad habits.", advice: "Watch out for the Four Horsemen." },
            HIGH: { title: "Toxic Loop", text: "You are in a cycle of attack/defend.", advice: "You need to stop the bleeding immediately." }
        }
    },
    emotional_safety: {
        title: "Emotional Safety",
        description: "Do you trust they have your back?",
        levels: {
            LOW: { title: "Deep Trust", text: "You feel safe.", advice: "This is rare. Protect it." },
            MEDIUM: { title: "Wary", text: "You are waiting for the other shoe to drop.", advice: "Check your assumptions." },
            HIGH: { title: "Hyper-Vigilant", text: "You feel unsafe constantly.", advice: "You need to rebuild trust from zero." }
        }
    },
    physical_intimacy: {
        title: "Sex & Intimacy",
        description: "The spark and connection.",
        levels: {
            LOW: { title: "Alive & Well", text: "The spark is there.", advice: "Keep prioritizing this." },
            MEDIUM: { title: "Drifting", text: "It's becoming routine.", advice: "Don't let it fade." },
            HIGH: { title: "Roommate Syndrome", text: "The spark is gone.", advice: "You must prioritize touch today." }
        }
    },
    power_fairness: {
        title: "Power & Fairness",
        description: "Who carries the load?",
        levels: {
            LOW: { title: "True Partners", text: "You share the load.", advice: "Great teamwork." },
            MEDIUM: { title: "Imbalanced", text: "One of you does more.", advice: "Talk about the 'Mental Load'." },
            HIGH: { title: "Parent/Child", text: "One manages, one follows.", advice: "This kills desire. Fix the balance." }
        }
    },
    future_values: {
        title: "Values & Future",
        description: "Are you going to the same place?",
        levels: {
            LOW: { title: "Aligned", text: "Shared vision.", advice: "Dream big together." },
            MEDIUM: { title: "Drifting", text: "Some different goals.", advice: "Re-align your compass." },
            HIGH: { title: "Divergent", text: "Growing apart.", advice: "Find common ground fast." }
        }
    }
};

