import { type TestSession } from "wasp/entities";

// Personalization variable types
export interface PersonalizationVars {
    first_name: string;
    current_question: number;
    dominant_lens: string;
    dominant_dimension: string;
    q4_answer: string;
    q11_answer: string;
    q14_answer: string;
    has_high_silence_sensitivity: boolean;
    has_conflict_avoidance: boolean;
    PM_conflict: number;
    SL_conflict: number;
    top_3_triggers: string[];
    lens_short_description: string;
    has_high_mismatch: boolean;
    unsubscribe_url: string;
}

// Likert scale mapping (1-5 to human-readable labels)
export function getLikertLabel(answerId: number): string {
    const labels: Record<number, string> = {
        1: "Strongly Disagree",
        2: "Disagree",
        3: "Neutral",
        4: "Agree",
        5: "Strongly Agree",
    };
    return labels[answerId] || "Unknown";
}

// Lens descriptions for each dominant lens
const LENS_DESCRIPTIONS: Record<string, string> = {
    silence: "You react strongly to silence and emotional distance.",
    conflict: "You have heightened sensitivity to tension and unresolved conflict.",
    intentions: "You tend to interpret your partner's actions through a lens of assumed intent.",
    reassurance: "You have a strong need for explicit emotional validation and reassurance.",
    repair: "You require clear closure and repair after conflicts to feel secure.",
};

// Get top triggers based on scores
export function getTopTriggers(scores: any): string[] {
    const triggers: { dimension: string; score: number }[] = [];

    const dimensions = ["silence", "conflict", "intentions", "reassurance", "repair"];

    dimensions.forEach((dim) => {
        if (scores[dim] && scores[dim].SL > 60) {
            triggers.push({
                dimension: dim,
                score: scores[dim].SL,
            });
        }
    });

    // Sort by score descending
    triggers.sort((a, b) => b.score - a.score);

    // Map to human-readable strings
    const triggerMap: Record<string, string> = {
        silence: "Silence or emotional distance",
        conflict: "Unresolved tension or disagreements",
        intentions: "Perceived negative intent from your partner",
        reassurance: "Lack of explicit affection or validation",
        repair: "Incomplete closure after conflicts",
    };

    return triggers.slice(0, 3).map((t) => triggerMap[t.dimension]);
}

// Get lens description
export function getLensDescription(dominantLens: string): string {
    return LENS_DESCRIPTIONS[dominantLens] || "You have a unique interpretive pattern.";
}

// Main personalization data builder
export function buildPersonalizationData(
    session: TestSession,
    appUrl: string
): PersonalizationVars {
    const answers = session.answers as Record<string, number>;
    const scores = session.scores as any;

    // Extract email prefix as first name (or use a default)
    const email = session.email || "";
    const first_name = email.split("@")[0] || "there";

    // Get dominant lens from scores
    const dominant_lens = scores?.dominantLens || "silence";
    const dominant_dimension = dominant_lens;

    // Get specific question answers
    const q4_answer = getLikertLabel(answers["4"] || 3);
    const q11_answer = getLikertLabel(answers["11"] || 3);
    const q14_answer = getLikertLabel(answers["14"] || 3);

    // Calculate flags
    const has_high_silence_sensitivity = (scores?.silence?.SL || 0) > 60;
    const has_conflict_avoidance = (scores?.conflict?.SL || 0) > 65;

    // Get PM and SL for conflict dimension
    const PM_conflict = scores?.conflict?.PM || 0;
    const SL_conflict = scores?.conflict?.SL || 0;

    // Get top triggers
    const top_3_triggers = getTopTriggers(scores);

    // Get lens description
    const lens_short_description = getLensDescription(dominant_lens);

    // Calculate if high mismatch (any dimension > 75)
    const has_high_mismatch = Object.values(scores || {}).some(
        (dimScore: any) => dimScore?.mismatch > 75
    );

    // Generate unsubscribe URL
    const unsubscribe_url = `${appUrl}/unsubscribe?token=${session.id}`;

    return {
        first_name,
        current_question: session.currentQuestionIndex,
        dominant_lens,
        dominant_dimension,
        q4_answer,
        q11_answer,
        q14_answer,
        has_high_silence_sensitivity,
        has_conflict_avoidance,
        PM_conflict,
        SL_conflict,
        top_3_triggers,
        lens_short_description,
        has_high_mismatch,
        unsubscribe_url,
    };
}

// Cache personalization data in session
export async function cachePersonalizationData(
    sessionId: string,
    context: any
): Promise<PersonalizationVars> {
    const session = await context.entities.TestSession.findUnique({
        where: { id: sessionId },
    });

    if (!session) {
        throw new Error("Session not found");
    }

    const appUrl = process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000";
    const personalizationData = buildPersonalizationData(session, appUrl);

    // Cache in database
    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            personalizationData: personalizationData as any,
        },
    });

    return personalizationData;
}
