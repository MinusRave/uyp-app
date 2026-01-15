
export type DimensionType = "silence" | "conflict" | "intentions" | "reassurance" | "repair";

export type QuadrantType = "Amplified Distress" | "Self-Regulation" | "Detached Cynicism" | "Secure Flow";

export interface Prescription {
    stateName: string; // The user-facing label (e.g. "The Panic Loop" vs "Amplified Distress")
    analysis: string; // "You feel unsafe AND you think..."
    scripts: {
        inTheMoment: string;
        repair: string;
    };
    partnerTranslation: string; // "Read this to your partner..."
}

export const EVENT_TRIGGERS: Record<DimensionType, string> = {
    silence: "your partner becomes quiet or emotionally unavailable",
    conflict: "a disagreement or tension appears",
    intentions: "your partner disappoints you or doesn’t meet an expectation",
    reassurance: "you don’t receive clear signs of care or affection",
    repair: "a conflict ends without clear emotional closure"
};

export const CORE_NEEDS: Record<DimensionType, { need: string; fear: string }> = {
    silence: { need: "connection even in silence", fear: "emotional abandonment" },
    conflict: { need: "emotional safety during disagreement", fear: "loss of relationship security" },
    intentions: { need: "trust in partner's good will", fear: "being deliberately hurt" },
    reassurance: { need: "clear signs of affection", fear: "being unloved or invisible" },
    repair: { need: "resolved emotional closure", fear: "lingering disconnection" }
};

// The content database
export const QUADRANT_CONTENT: Record<DimensionType, Record<QuadrantType, Prescription>> = {
    silence: {
        "Amplified Distress": {
            stateName: "The Abandonment Panic",
            analysis: "You are currently in a high-alert state. You care deeply (High Sensitivity), but you also strongly interpret silence as danger (High Negative Interpretation). This creates a self-reinforcing loop where your partner's need for quiet feels like a direct threat to your safety.",
            scripts: {
                inTheMoment: "I'm feeling a spike of panic right now because you're quiet. I know my brain does this. Can you just tell me 'We are okay' so I can settle down?",
                repair: "Earlier, when you went quiet, my brain went to a 'worst-case scenario'. I know that's my lens, not necessarily your intent."
            },
            partnerTranslation: "Your partner isn't trying to control you or demand attention. Their nervous system registers 'Silence' as 'Danger'. A small, verbal reassurance ('I'm just thinking, we're good') works like an off-switch for their anxiety."
        },
        "Self-Regulation": {
            stateName: "Internal Friction",
            analysis: "You feel the sting of silence (High Sensitivity), but you know logically your partner isn't trying to hurt you (Low Negative Interpretation). You are doing the hard work of self-soothing, but it generates internal fatigue.",
            scripts: {
                inTheMoment: "I'm feeling a bit anxious about the silence, but I know you just need space. I'm going to take a walk to regulate myself.",
                repair: "I managed my anxiety when you were quiet today, but it takes energy. It helps if you can give me a heads-up before checking out."
            },
            partnerTranslation: "Your partner feels the silence deeply but is working hard not to project that onto you. Acknowledge their effort: 'I appreciate you giving me space even when it's hard for you.'"
        },
        "Detached Cynicism": {
            stateName: "Protective Numbness",
            analysis: "You don't feel acute anxiety (Low Sensitivity), but you still view your partner's silence negatively (High Negative Interpretation). You likely see them as 'cold' or 'avoidant' and have emotionally checked out to protect yourself.",
            scripts: {
                inTheMoment: "I'm noticing I'm writing you off as 'avoidant' right now. I want to stay engaged. Can we talk about this later?",
                repair: "I tend to judge your silence as you being cold. I want to be curious instead of critical."
            },
            partnerTranslation: "Your partner may seem unbothered, but they are internally categorizing your silence as a character flaw. They need to see you engage warmly to break this cynical assumption."
        },
        "Secure Flow": {
            stateName: "Comfortable Silence",
            analysis: "You are in a secure state. You notice silence but don't fear it (Low Sensitivity), and you trust your partner's need for space (Low Negative Interpretation).",
            scripts: {
                inTheMoment: "Looks like you need some thinking time. I'll be in the other room.",
                repair: "I felt good about our downtime today. It felt comfortable."
            },
            partnerTranslation: "Your partner feels safe with you, even in silence. Continue to protect this safety by being transparent when you need to withdraw."
        }
    },
    conflict: {
        "Amplified Distress": {
            stateName: "The Escalation Loop",
            analysis: "Conflict feels cataclysmic to you. You feel highly threatened (High Sensitivity) and assume your partner is attacking or dumping you (High Negative Interpretation). You likely fight to survive.",
            scripts: {
                inTheMoment: "I am feeling flooded and unsafe. I need a 20-minute timeout. I promise to come back.",
                repair: "When we fight, I lose access to the part of me that knows you love me. I'm working on staying grounded."
            },
            partnerTranslation: "During conflict, your partner enters 'Fight or Flight'. Logic will not reach them here. Soften your tone and remind them 'We are on the same team' before making your point."
        },
        "Self-Regulation": {
            stateName: "Holding the Line",
            analysis: "Conflict hurts (High Sensitivity), but you hold onto the truth that your partner isn't the enemy (Low Negative Interpretation). This is noble but exhausting.",
            scripts: {
                inTheMoment: "This is really hard for me to hear, but I'm listening. Give me a second to process.",
                repair: "I worked hard to stay present today. I need to know you see that effort."
            },
            partnerTranslation: "Your partner is doing heavy emotional lifting to stay present. Validate them: 'I know this is hard to hear, thank you for staying with me.'"
        },
        "Detached Cynicism": {
            stateName: "Dismissive Defense",
            analysis: "You don't feel overwhelmed (Low Sensitivity), but you view the conflict as your partner's fault/drama (High Negative Interpretation). You likely condescend or withdraw.",
            scripts: {
                inTheMoment: "I'm feeling dismissive right now. That's not helpful. Let me try to actually hear your grievance.",
                repair: "I tend to treat your concerns as 'drama'. I want to respect your experience more."
            },
            partnerTranslation: "Your partner may act superior or unbothered. This is a defense. Ask them: 'I need to know his matters to you, even if you don't agree with the facts.'"
        },
        "Secure Flow": {
            stateName: "Constructive Friction",
            analysis: "You see conflict as a problem to solve, not a threat to the relationship.",
            scripts: {
                inTheMoment: "I disagree with that, but I understand why you feel that way.",
                repair: "That was a tough talk, but I'm glad we cleared the air."
            },
            partnerTranslation: "You have a solid foundation here. Keep it up."
        }
    },
    intentions: {
        "Amplified Distress": {
            stateName: "The Paranoid Spike",
            analysis: "When hurt, you feel it deeply (High Sensitivity) and immediately assume it was on purpose (High Negative Interpretation).",
            scripts: {
                inTheMoment: "My brain is telling me you did this to hurt me. Is that true?",
                repair: "I struggle to give the benefit of the doubt when I'm in pain."
            },
            partnerTranslation: "Your partner's 'Ouch' turns into 'You attacked me' instantly. Over-communicate your good intent: 'I messed up, but I never wanted to hurt you.'"
        },
        "Self-Regulation": {
            stateName: "The Benefit of the Doubt",
            analysis: "You feel the disappointment (High Sensitivity), but you catch yourself before blaming them (Low Negative Interpretation).",
            scripts: {
                inTheMoment: "I'm disappointed, but I know you didn't mean to let me down.",
                repair: "I'm working on separating the impact of your actions from your intent."
            },
            partnerTranslation: "Your partner feels things deeply but tries to be fair. Acknowledge the impact: 'I know my mistake hurt you, I'm sorry.'"
        },
        "Detached Cynicism": {
            stateName: "Resentful Scorekeeping",
            analysis: "You don't show the hurt (Low Sensitivity), but you secretly chalk it up to their incompetence/character (High Negative Interpretation).",
            scripts: {
                inTheMoment: "I'm tallying this as a failure. I need to stop and tell you I'm annoyed.",
                repair: "I resent you silently instead of speaking up. I'm trying to change that."
            },
            partnerTranslation: "Your partner may seem fine, but they are building a case against you. Encourage them to speak up: 'If you're annoyed, please tell me. I can take it.'"
        },
        "Secure Flow": {
            stateName: "Trusting Resilience",
            analysis: "You can feel disappointed without doubting the relationship.",
            scripts: {
                inTheMoment: "That sucked, but I know you've got my back.",
                repair: "Thanks for owning that mistake."
            },
            partnerTranslation: "You are in a good place."
        }
    },
    reassurance: {
        "Amplified Distress": {
            stateName: "The Void",
            analysis: "You have a high hunger for love (High Sensitivity) but don't see it even when it's there (High Negative Interpretation/Blindness).",
            scripts: {
                inTheMoment: "I'm feeling unloved right now. I need a specific reminder that I matter.",
                repair: "I have a 'bucket with a hole in it' regarding affection. I'm working on patching it."
            },
            partnerTranslation: "Your partner needs love to be LOUD to hear it. Subtle cues don't work. Be explicit: 'I love you, you matter to me.'"
        },
        "Self-Regulation": {
            stateName: "Self-Soothing",
            analysis: "You crave reassurance (High Sensitivity) but recognize your partner's unique way of showing it (Low Negative Interpretation).",
            scripts: {
                inTheMoment: "I'm craving affection. I'm going to ask for a hug instead of waiting and brooding.",
                repair: "I know you show love by [Action], even if I crave words."
            },
            partnerTranslation: "Your partner needs vocal reassurance but appreciates your efforts. Meet them halfway."
        },
        "Detached Cynicism": {
            stateName: "Dismissive Independence",
            analysis: "You deny needing love (Low Sensitivity) and view their attempts as weak or annoying (High Negative Interpretation).",
            scripts: {
                inTheMoment: "I'm pushing you away. I actually do want to connect.",
                repair: "I act like I don't need anyone. That's a defense mechanism."
            },
            partnerTranslation: "Your partner acts tough to avoid being let down. Don't stop trying to reach them."
        },
        "Secure Flow": {
            stateName: "Secure Base",
            analysis: "You feel loved and can ask when you need a boost.",
            scripts: {
                inTheMoment: "I need a hug.",
                repair: "Thanks for being there."
            },
            partnerTranslation: "Keep doing what you're doing."
        }
    },
    repair: {
        "Amplified Distress": {
            stateName: "The Grudge Loop",
            analysis: "Unresolved issues burn you (High Sensitivity) and you assume your partner doesn't care to fix them (High Negative Interpretation).",
            scripts: {
                inTheMoment: "I can't move on yet. I need us to agree on what happened.",
                repair: "I get stuck in the past because I'm afraid it will happen again."
            },
            partnerTranslation: "Your partner isn't being difficult; they are afraid. They need 'Closure' to feel safe again."
        },
        "Self-Regulation": {
            stateName: "Patient Processing",
            analysis: "You need closure (High Sensitivity) but trust it will come eventually (Low Negative Interpretation).",
            scripts: {
                inTheMoment: "I'm not over this yet, but I can wait until tomorrow to talk.",
                repair: "I need us to circle back to this."
            },
            partnerTranslation: "Your partner is patient but don't forget the follow-up. They are counting on it."
        },
        "Detached Cynicism": {
            stateName: "Pseudo-Forgiveness",
            analysis: "You claim you don't care (Low Sensitivity) but you actually think 'why bother, nothing changes' (High Negative Interpretation).",
            scripts: {
                inTheMoment: "I'm saying 'it's fine' but it's not. Ideally, we fix this.",
                repair: "I check out of repair because I don't think it works."
            },
            partnerTranslation: "Your partner says 'whatever' but means 'this is hopeless'. Prove them wrong by driving the repair yourself."
        },
        "Secure Flow": {
            stateName: "Elastic Repair",
            analysis: "You bounce back well.",
            scripts: {
                inTheMoment: "I'm good if you're good.",
                repair: "Glad we worked that out."
            },
            partnerTranslation: "Great resilience."
        }
    }
};
