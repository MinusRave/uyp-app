// Shared types for the results page

export type QuickOverviewData = {
    hero: { headline: string; subheadline: string; result_badge: string };
    pulse: { summary: string; primary_diagnosis: string };
    forecast: { short_term: string };
    dimensions: {
        communication: { status: string; teaser: string; metric_insight: string };
        security: { status: string; teaser: string; metric_insight: string };
        erotic: { status: string; teaser: string; metric_insight: string };
        balance: { status: string; teaser: string; metric_insight: string };
        compass: { status: string; teaser: string; metric_insight: string };
    };
};

export type NarcissismData = {
    partner_analysis?: {
        is_narcissist_risk: boolean;
        risk_level: string; // "Low" | "Moderate" | "High" | "Severe"
        traits_detected: string[];
    };
    user_analysis?: {
        likely_profile: string;
        emotional_state: string;
    };
    relationship_health?: {
        toxicity_score: number;
        label: string;
        red_flags: string[];
    };
    recommendation?: string;
};

export type DimensionKey = "communication" | "emotional_safety" | "physical_intimacy" | "power_fairness" | "future_values";

export type DimensionData = {
    PM: number;
    SL: number;
    mismatch: number;
    state: string;
    health: number;
    prescription: {
        stateName: string;
        analysis: string;
        scripts: { inTheMoment: string; repair: string };
        partnerTranslation: string;
    };
};

export type ScriptEntry = {
    dimension: string;
    inTheMoment: string;
    repair: string;
};

export type AdvancedMetrics = {
    sustainability_forecast: number;
    repair_efficiency: number;
    nervous_system_load: number;
    erotic_death_spiral: number;
    betrayal_vulnerability: number;
    silent_divorce_risk: number;
    ceo_vs_intern: number;
    compatibility_quotient: number;
    internalized_malice: number;
    erotic_potential: number;
    resilience_battery: number;
    duty_sex_index: number;
};

// Plain-English labels for dimensions
export const DIMENSION_LABELS: Record<DimensionKey, string> = {
    communication: "How You Handle Fights",
    emotional_safety: "Trust & Safety",
    physical_intimacy: "Intimacy & Connection",
    power_fairness: "Fairness & Balance",
    future_values: "Your Shared Future",
};

// Map dimension keys to quickOverview keys
export const DIMENSION_TO_OVERVIEW: Record<DimensionKey, string> = {
    communication: "communication",
    emotional_safety: "security",
    physical_intimacy: "erotic",
    power_fairness: "balance",
    future_values: "compass",
};
