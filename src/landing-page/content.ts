
export const PILLAR_CONTENT: Record<string, {
    title: string;
    subtitle: string;
    symptom: {
        title: string;
        desc: string;
    };
    science: {
        title: string;
        desc: string;
        mirror: string;
    };
    solution: {
        dimension: string;
        desc: string;
    };
}> = {
    "silence": {
        title: "Why does he pull away?",
        subtitle: "The cycle of Distance vs. Pursuit",
        symptom: {
            title: "Does this sound like you?",
            desc: "You ask 'What's wrong?', and they say 'Nothing'—but the room feels freezing. The more you try to bridge the gap, the further they retreat. You feel abandoned; they feel overwhelmed."
        },
        science: {
            title: "It's not rejection. It's regulation.",
            desc: "Your partner isn't pulling away to hurt you. They are pulling away to lower their internal blood pressure.",
            mirror: "Your Brain: 'They are leaving me.' vs Their Brain: 'If I don't leave, I will explode.'"
        },
        solution: {
            dimension: "Silence & Distance",
            desc: "Measure your 'Pursuit/Withdrawal' ratio and get the specific script to stop them from retreating without you feeling abandoned."
        }
    },
    "conflict": {
        title: "Why do we keep fighting?",
        subtitle: "Breaking the Infinite Loop",
        symptom: {
            title: "The Script never changes.",
            desc: "It starts with a dirty dish and ends with 'You never listen to me.' You feel like you're speaking different languages. You're exhausted from explaining your feelings over and over."
        },
        science: {
            title: "The Instinct Mismatch",
            desc: "One of you fights to be 'heard' (Active), the other fights to 'stabilize' (Passive). This creates a loop where your solution invites their problem.",
            mirror: "You: 'If I explain it louder, they'll get it.' Them: 'If they get louder, I must shut down.'"
        },
        solution: {
            dimension: "Conflict & Tension",
            desc: "Map your conflict styles and get the 'Circuit Breaker' phrase that stops this loop in 30 seconds."
        }
    },
    "reassurance": {
        title: "Do I matter to him?",
        subtitle: "The unseen Need for Reassurance",
        symptom: {
            title: "You feel like you're 'too much'.",
            desc: "You catch yourself checking their tone, their texts, their mood. You need to know you're okay, but asking for it feels needy.",
        },
        science: {
            title: "The Validation Gap",
            desc: "You have a high 'Reassurance Baseline'. Your partner likely has a low one. This isn't a love deficit; it's a sensory difference.",
            mirror: "You feel unsafe without signal. They feel suffocated by the demand for signal."
        },
        solution: {
            dimension: "Reassurance & Intentions",
            desc: "Find out your exact Reassurance Score and teach your partner how to fill your cup without draining theirs."
        }
    }
};
