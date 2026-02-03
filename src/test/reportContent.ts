
export type DimensionType = "communication" | "emotional_safety" | "physical_intimacy" | "power_fairness" | "future_values";

export type QuadrantType = "Amplified Distress" | "Self-Regulation" | "Detached Cynicism" | "Secure Flow";

export interface Prescription {
    stateName: string;
    analysis: string;
    scripts: {
        inTheMoment: string;
        repair: string;
    };
    partnerTranslation: string;
}

export const EVENT_TRIGGERS: Record<DimensionType, string> = {
    communication: "you try to resolve a conflict or get a response",
    emotional_safety: "you feel hurt, misunderstood, or disconnected",
    physical_intimacy: "you approach (or avoid) sexual connection",
    power_fairness: "chores, money, or logistics need to be handled",
    future_values: "you talk about the future, family, or life goals"
};

export const CORE_NEEDS: Record<DimensionType, { need: string; fear: string }> = {
    communication: { need: "to be heard and resolved", fear: "being shut out or ignored" },
    emotional_safety: { need: "to feel liked and safe", fear: "being rejected or attacked" },
    physical_intimacy: { need: "to be desired and cherished", fear: "being unwanted or used" },
    power_fairness: { need: "partnership and support", fear: "being a servant or parent" },
    future_values: { need: "shared meaning and growth", fear: "drifting apart" }
};

export const QUADRANT_CONTENT: Record<DimensionType, Record<QuadrantType, Prescription>> = {
    communication: {
        "Amplified Distress": {
            stateName: "The Panic Loop",
            analysis: "STOP. Your anxiety is lying to you. It says 'if we don't fix this NOW, we are over.' The truth is the opposite: Chasing them forces them to run. YOUR PROTOCOL: When you feel the urge to text/call/fix, put your phone in another room. Set a timer for 20 minutes. Do not speak until your heart rate is normal.",
            scripts: {
                inTheMoment: "I'm panicking and need to pause. I'm not leaving you, I'm just calming down.",
                repair: "When I chase you, it's not control—it's anxiety. I'm working on self-soothing."
            },
            partnerTranslation: "They aren't trying to control you; they are trying to stop their internal panic. Give them a tiny bit of reassurance before you take space."
        },
        "Self-Regulation": {
            stateName: "White-Knuckling",
            analysis: "You are holding it together, but you are exhausted. You are swallowing your needs to 'keep the peace.' STOP DOING THAT. Peace built on suppression isn't peace; it's a slow breakup. YOUR PROTOCOL: Say 'I am anxious about X' within 5 minutes of feeling it. Don't let it rot.",
            scripts: {
                inTheMoment: "I'm trying to stay calm, but I'm struggling. Can we slow down?",
                repair: "I tend to hide my feelings until I explode. I'm trying to speak up sooner."
            },
            partnerTranslation: "They are working incredibly hard to stay calm. Acknowledge it."
        },
        "Detached Cynicism": {
            stateName: "The Wall",
            analysis: "You have decided they won't listen, so you stopped talking. This is the death knell of a relationship. YOUR PROTOCOL: Break the silence. Say the thing you think is 'useless' to say. Even if they get mad, anger is better than this silence. Anger is alive; this wall is dead.",
            scripts: {
                inTheMoment: "I'm shutting down because I don't think you're listening. I want to try again.",
                repair: "I've built a wall to protect myself. I want to take a brick down."
            },
            partnerTranslation: "They seem cold, but they are actually protecting themselves from disappointment. Show them you care to melt the wall."
        },
        "Secure Flow": {
            stateName: "Fluid Connection",
            analysis: "You can handle conflict without panicking.",
            scripts: { inTheMoment: "Let's take a break.", repair: "Good talk." },
            partnerTranslation: "Keep it up."
        }
    },
    emotional_safety: {
        "Amplified Distress": {
            stateName: "Hyper-Vigilance",
            analysis: "You are scanning for danger 24/7. A sigh, a look, a tone—you treat them all as threats. THIS IS EXHAUSTING YOUR PARTNER. YOUR PROTOCOL: Assume positive intent. Next time they are quiet, do not ask 'Are you mad?'. Instead, say 'I'm telling myself a story that you're mad. Is that true?' Check the facts before you react.",
            scripts: {
                inTheMoment: "My brain is telling me you hate me. Is that true, or are you just tired?",
                repair: "I struggle to feel safe when things are off. I need extra reassurance."
            },
            partnerTranslation: "They are like a burn victim—even a light touch hurts. Be extra gentle and explicit with your love."
        },
        "Self-Regulation": {
            stateName: "Rationalizing",
            analysis: "You feel hurt, but you dismiss your own feelings: 'Oh, he's just tired.' STOP GASLIGHTING YOURSELF. If it hurt, it hurt. YOUR PROTOCOL: Validate your own reality. Say 'Ouch' when something stings. Don't explain it away.",
            scripts: {
                inTheMoment: "That comment landed wrong for me. Ouch.",
                repair: "I try to talk myself out of my feelings. I'm going to stop doing that."
            },
            partnerTranslation: "They are trying to trust you. Don't make it hard for them."
        },
        "Detached Cynicism": {
            stateName: "Protective Distrust",
            analysis: "You've decided safety is impossible, so you've numbed out. You are in the room, but your heart is in a bunker. YOUR PROTOCOL: Take one risk this week. Share one vulnerable fear. If they drop it, you know where you stand. But give them one chance to catch it.",
            scripts: {
                inTheMoment: "I'm finding it hard to trust you right now.",
                repair: "I've stopped sharing my real self with you. I want to change that."
            },
            partnerTranslation: "They are waiting for the other shoe to drop. Prove them wrong with consistency."
        },
        "Secure Flow": {
            stateName: "Deep Safety",
            analysis: "You are a 'Safe Harbor' for each other. This is the superpower of relationships. Don't get complacent.",
            scripts: { inTheMoment: "I know you love me.", repair: "All good." },
            partnerTranslation: "Safety is established."
        }
    },
    physical_intimacy: {
        "Amplified Distress": {
            stateName: "The Starvation Cycle",
            analysis: "You are chasing sex to feel loved. When they say 'no' to sex, you hear 'I don't love you.' STOP CHASING. The pressure is killing their libido. YOUR PROTOCOL: No sex initiation for 1 week. Focus entirely on non-sexual touch (hugging, holding hands) with zero expectation. Re-wire your brain to feel safe without the orgasm.",
            scripts: {
                inTheMoment: "I feel rejected right now, but I know you love me.",
                repair: "I equate sex with love. I'm working on separating them."
            },
            partnerTranslation: "For them, sex isn't just pleasure; it's an oxygen mask for connection. When you say no to sex, they hear 'I don't love you'."
        },
        "Self-Regulation": {
            stateName: "The Patient Wait",
            analysis: "You are waiting for them to want you. It hurts, but you are quiet about it. SILENCE KILLS PASSION. YOUR PROTOCOL: Initiate a conversation about sex *outside the bedroom*. Don't ask for it. Ask about it. 'What was your favorite memory of us?' Spark the mind first.",
            scripts: {
                inTheMoment: "I miss our connection. Just wanted you to know.",
                repair: "I've been waiting for you to come to me. I miss being pursued."
            },
            partnerTranslation: "They are being incredibly patient. Don't take it for granted. Initate non-sexual touch."
        },
        "Detached Cynicism": {
            stateName: "The Roommate Trap",
            analysis: "You are business partners. Efficient, polite, and completely sexless. You've suppressed your needs to survive. YOUR PROTOCOL: Ban logistics talk after 8pm. No kids, no bills, no schedules. If you have nothing else to talk about, stare at each other. Boredom is better than 'business'.",
            scripts: {
                inTheMoment: "No more logistics tonight. Let's just hang out.",
                repair: "We've become roommates. I want to be your lover again."
            },
            partnerTranslation: "They have given up. If you want the spark back, you have to show them it's safe to try again."
        },
        "Secure Flow": {
            stateName: "Erotic Play",
            analysis: "You have kept the spark alive. Prioritize this. It is the first thing to go when life gets busy.",
            scripts: { inTheMoment: "That was fun.", repair: "Let's connect soon." },
            partnerTranslation: "Keep the fire burning."
        }
    },
    power_fairness: {
        "Amplified Distress": {
            stateName: "The Parent-Child Trap",
            analysis: "You are the Manager; they are the Employee. It is unsexy and exhausting. STOP MANAGING. Every time you remind them to do something, you are their mother. YOUR PROTOCOL: Full Handover. Give them one entire domain (e.g., 'Dinner'). They plan it, buy it, cook it. If they fail, they fail. DO NOT RESCUE THEM.",
            scripts: {
                inTheMoment: "I'm not your parent. I need a partner.",
                repair: "I hate nagging. It makes me feel unsexy and angry."
            },
            partnerTranslation: "They aren't 'controlling'; they are overwhelmed. Take a task off their plate entirely (conception to execution) to help them breathe."
        },
        "Self-Regulation": {
            stateName: "The Silent Martyr",
            analysis: "You are doing it all and 'fine' with it... until you resent them. MARTYRDOM IS TOXIC. YOUR PROTOCOL: The 50/50 Audit. Sit down this Sunday. List every regular task. Assign names. If your list is longer, hand 3 items over. Stop being a hero.",
            scripts: {
                inTheMoment: "I'm overwhelmed. I need you to take this off my plate.",
                repair: "I've been doing too much silently. That's on me."
            },
            partnerTranslation: "They are drowning quietly. Throw them a lifeline before they sink."
        },
        "Detached Cynicism": {
            stateName: "Resentful Check-Out",
            analysis: "You've stopped asking for help because 'it's easier to just do it myself'. This is how resentment rots a marriage. YOUR PROTOCOL: Stop doing their laundry. Stop buying their snacks. If you act single, be single. Force the crisis. They need to see the labor you are doing.",
            scripts: {
                inTheMoment: "I'm not doing that for you anymore. It's your responsibility.",
                repair: "I stopped relying on you because I felt let down."
            },
            partnerTranslation: "They have stopped relying on you. Re-build trust by doing what you say you will do."
        },
        "Secure Flow": {
            stateName: "True Partnership",
            analysis: "You are a team. You cover for each other without keeping score. Protect this dynamic.",
            scripts: { inTheMoment: "Your turn.", repair: "Good teamwork." },
            partnerTranslation: "Balanced and fair."
        }
    },
    future_values: {
        "Amplified Distress": {
            stateName: "The Divergent Path",
            analysis: "You are pulling in opposite directions. Every conversation about the future triggers a fight. STOP PULLING. You cannot force them to change their path. YOUR PROTOCOL: The 'No-Change' Date. Go out. Talk about anything EXCEPT the future. Remember why you liked them in the present before you destroy the future.",
            scripts: {
                inTheMoment: "I'm scared we want different things.",
                repair: "I need to know we are building the same life."
            },
            partnerTranslation: "They need to know you are on the same team. Dream with them."
        },
        "Self-Regulation": {
            stateName: "Compromise Fatigue",
            analysis: "You are bending over backwards to fit their life. Eventually, you will snap. YOUR PROTOCOL: Draw a Line. What is one non-negotiable for you? (Living city? Kids? Career?). Tell them. 'I can compromise on the drapes, but not on having a dog.' Clarity is kindness.",
            scripts: {
                inTheMoment: "I feel like I'm the only one compromising.",
                repair: "I've been bending too much. I need to stand firm on this."
            },
            partnerTranslation: "They are bending for you. Don't let them break."
        },
        "Detached Cynicism": {
            stateName: "Parallel Lives",
            analysis: "You have given up on a shared future. You are just sharing a zip code. YOUR PROTOCOL: Dream Stacking. Spend $50 this weekend on something purely for 'us' (not the kids, not the house). A game, a drink, a drive. You need to remember you are a couple, not just co-tenants.",
            scripts: {
                inTheMoment: "You do your thing, I'll do mine.",
                repair: "We need a shared goal to reconnect."
            },
            partnerTranslation: "Find one thing you both love and do it together. Re-ignite the shared purpose."
        },
        "Secure Flow": {
            stateName: "Shared Vision",
            analysis: "You are building a cathedral together. Keep laying the bricks.",
            scripts: { inTheMoment: "Let's plan.", repair: "Great vision." },
            partnerTranslation: "Aligned."
        }
    }
};
