import { type TestSession } from "wasp/entities";

// Personalization variable types
export interface PersonalizationVars {
    // Legacy / Basic
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
    ai_cold_truth?: string;
    user_email: string;

    // NEW: Quick Overview Data
    quick_overview_headline: string;
    quick_overview_result_badge: string;
    pulse_summary: string;

    // NEW: Metrics (Scores 0-100)
    metric_repair_efficiency: number;
    metric_sustainability_score: number;
    metric_parent_trap_score: number; // Aka CEO vs Intern usually, or derived
    metric_erotic_potential: number;
    metric_betrayal_vulnerability: number;
    metric_compatibility_quotient: number;
    metric_ceo_vs_intern: number;

    // NEW: Forecasts & Insights
    forecast_short_term_teaser: string;
    // NEW: App URL for links
    app_url: string;
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
    communication: "You get stuck in a 'Panic vs. Shutdown' loop during conflict.",
    emotional_safety: "You feel like you are constantly walking on eggshells.",
    physical_intimacy: "You feel a deep disconnect or rejection in your physical connection.",
    power_fairness: "You feel overwhelmed by an unequal mental load or parenting dynamic.",
    future_values: "You feel like you are drifting apart or growing in different directions.",
};

// Get top triggers based on scores
export function getTopTriggers(scores: any): string[] {
    const triggers: { dimension: string; score: number }[] = [];

    const dimensions = ["communication", "emotional_safety", "physical_intimacy", "power_fairness", "future_values"];

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
        communication: "Feeling shut out or ignored",
        emotional_safety: "Feeling unsafe or criticized",
        physical_intimacy: "Feeling unwanted or rejected",
        power_fairness: "Feeling like a parent/servant",
        future_values: "Feeling disconnected from a shared future",
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
    appUrl: string,
    apiUrl: string
): PersonalizationVars {
    const answers = session.answers as Record<string, number>;
    const scores = session.scores as any;

    // Extract email prefix as first name (or use a default)
    const email = session.email || "";

    // Get dominant lens from scores
    const dominant_lens = scores?.dominantLens || "communication";
    const dominant_dimension = dominant_lens;

    // Get specific question answers
    const q4_answer = getLikertLabel(answers["4"] || 3);
    const q11_answer = getLikertLabel(answers["11"] || 3);
    const q14_answer = getLikertLabel(answers["14"] || 3);

    // Calculate flags - ADAPTED FOR NEW MODEL
    // silence sensitivity -> likely Communication or Safety
    const has_high_silence_sensitivity = (scores?.communication?.SL || 0) > 60;
    const has_conflict_avoidance = (scores?.emotional_safety?.SL || 0) > 65;

    // Get PM and SL for conflict dimension (using 'communication' as proxy for conflict style)
    const PM_conflict = scores?.communication?.PM || 0;
    const SL_conflict = scores?.communication?.SL || 0;

    // Get top triggers
    const top_3_triggers = getTopTriggers(scores);

    // Get lens description
    const lens_short_description = getLensDescription(dominant_lens);

    // Calculate if high mismatch (any dimension > 75)
    // Safe access
    const has_high_mismatch = Object.values(scores || {}).some(
        (dimScore: any) => (dimScore?.mismatch || 0) > 75
    );

    // Generate unsubscribe URL
    // MUST point to the API endpoint which handles the DB update and redirects
    const unsubscribe_url = `${apiUrl}/api/unsubscribe?token=${session.id}`;

    // --- NEW DATA EXTRACTION ---
    const quickOverview = (session.quickOverview as any) || {};
    const metrics = (session.advancedMetrics as any) || {};
    const fullReport = (session.fullReport as any) || {};

    const quick_overview_headline = quickOverview?.hero?.headline || "Analysis Complete";
    const quick_overview_result_badge = quickOverview?.hero?.result_badge || "CALCULATING...";
    const pulse_summary = quickOverview?.pulse?.summary || "Your relationship pattern is showing signs of critical strain.";

    const metric_repair_efficiency = Math.round(metrics.repair_efficiency || 35);
    const metric_sustainability_score = Math.round(metrics.sustainability_forecast || 65);
    const metric_parent_trap_score = Math.round(metrics.erotic_death_spiral || 68); // Using Erotic Death Spiral as Parent Trap proxy based on mapping in doc
    const metric_erotic_potential = Math.round(metrics.erotic_potential || 52);
    const metric_betrayal_vulnerability = Math.round(metrics.betrayal_vulnerability || 72);
    const metric_compatibility_quotient = Math.round(metrics.compatibility_quotient || 85);
    const metric_ceo_vs_intern = Math.round(metrics.ceo_vs_intern || 58);

    // Use nullish coalescing to avoid errors if object path doesn't exist
    const forecast_short_term_teaser = fullReport?.chapter1_pulse?.short_term_forecast || "Without intervention, the current conflict loops will likely intensify...";

    // Extract AI Cold Truth
    let ai_cold_truth = "";
    if ((session as any).executiveAnalysis) {
        const analysis = (session as any).executiveAnalysis;
        const [publicPart] = analysis.split("<<<PREMIUM_SPLIT>>>");
        // Remove the Header line ("# Diagnosis: ...")
        const body = publicPart.replace(/^#\s*Diagnosis:.*$/m, "").trim();
        // Take the first paragraph (or up to 200 chars to be safe)
        const firstPara = body.split('\n').find((l: string) => l.trim().length > 20);
        if (firstPara) {
            ai_cold_truth = firstPara.trim();
        }
    }

    return {
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
        ai_cold_truth,
        user_email: email,

        // New Data
        quick_overview_headline,
        quick_overview_result_badge,
        pulse_summary,
        metric_repair_efficiency,
        metric_sustainability_score,
        metric_parent_trap_score,
        metric_erotic_potential,
        metric_betrayal_vulnerability,
        metric_compatibility_quotient,
        metric_ceo_vs_intern,
        forecast_short_term_teaser,
        app_url: appUrl
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
    const apiUrl = process.env.WASP_API_SERVER_URL || "http://localhost:3001";
    const personalizationData = buildPersonalizationData(session, appUrl, apiUrl);

    // Cache in database
    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            personalizationData: personalizationData as any,
        },
    });

    return personalizationData;
}
