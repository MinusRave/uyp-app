import {
    DimensionType,
    QuadrantType,
    EVENT_TRIGGERS,
    CORE_NEEDS,
    QUADRANT_CONTENT,
    Prescription
} from "./reportContent";
import { calculateCompatibility } from "./compatibilityScore";

// --- Interfaces ---

export interface DimensionScore {
    PM: number; // 0-100 (Negative Interpretation)
    SL: number; // 0-100 (Sensitivity/Need)
    mismatch: number; // 0-100
    state: QuadrantType; // New: The 4 Quadrants
    prescription: Prescription; // The content for this state
}

export interface ReportSection {
    title: string;
    content: any;
}

export interface FullReport {
    cover: {
        title: string;
        subtitle: string;
        opening: string;
    };
    snapshot: {
        summary: string;
        dominantLens: string;
        dimensions: Record<string, DimensionScore>;
    };
    primaryLens: {
        lensName: string;
        activates: string;
        need: string;
        fear: string;
        stateName: string; // New
        analysis: string; // New
    };
    /* Deprecated old lists in favor of detailed Dimension sections */
    dimensionsDetailed: {
        id: string;
        score: DimensionScore;
    }[];

    /* Legacy fields kept for backward compatibility if UI needs them, or we can drop them if we refactor UI completely. 
       Let's keep the structure compatible but populated with new logic where possible. */
    alignedAreas: {
        dimension: string;
        text: string;
    }[];
    misreadAreas: {
        dimension: string;
        feel: string;
        assume: string;
        distortion_origin: string;
    }[];

    // New: Data for graphs
    visualData: {
        dimension: string;
        label: string;
        sensitivity: number; // SL
        interpretation: number; // PM
    }[];

    // New Prescriptive Sections
    scripts: {
        dimension: string;
        inTheMoment: string;
        repair: string;
    }[];

    partnerTranslations: {
        dimension: string;
        text: string;
    }[];

    questions: {
        dimension: string;
        questions: string[];
    }[];

    // New: Compatibility Score
    compatibility?: {
        overallScore: number;
        breakdown: {
            dimension: string;
            score: number;
            status: string;
            insight: string;
        }[];
        riskLevel: string;
        topRecommendation: string;
    };

    closing: string;
}

export interface ScoreResult {
    dimensions: Record<string, DimensionScore>;
    dominantLens: string;
    triggers: string[];
    misreadRisks: string[];
    report: FullReport;
    preview: {
        headline: string;
        insight: string;
        hook: string;
        cta: string;
    };
}

// --- Configuration & Helpers ---

const DIMENSIONS: DimensionType[] = [
    "silence",
    "conflict",
    "intentions",
    "reassurance",
    "repair",
];

// Mapping Table (Question IDs)
const DIMENSION_MAPPING: Record<DimensionType, { PM: number[]; SL: number[] }> = {
    silence: { PM: [1, 2, 3], SL: [4, 5, 6] },
    conflict: { PM: [7, 8, 9], SL: [10, 11, 12] },
    intentions: { PM: [13, 14, 15], SL: [16, 17, 18] },
    reassurance: { PM: [19, 20, 21], SL: [22, 23, 24] },
    repair: { PM: [25], SL: [26, 27, 28] },
};

// Reverse Coded Questions (IDs)
const REVERSE_CODED_IDS = [2, 6, 9, 12, 14, 18, 24, 28];

// --- Lookup Tables (Legacy helpers moved or deprecated, using new Quadrant logic) ---

const QUESTION_BANK: Record<DimensionType, string[]> = {
    silence: ["When you go quiet, what’s happening inside you?", "What does silence mean to you emotionally?", "What helps you feel safe when you need space?"],
    conflict: ["What feels hardest for you during disagreements?", "What do you need from me when things get tense?", "How do you protect yourself in conflict?"],
    intentions: ["When I disappoint you, what do you think I mean?", "What helps you trust someone’s intentions?", "What makes you doubt motives?"],
    reassurance: ["What makes you feel most loved?", "How do you usually show affection?", "What kind of reassurance matters most?"],
    repair: ["What helps you feel close again after conflict?", "How do you know when something is resolved?", "What do you need before you can reconnect?"]
};

// --- Helper Functions ---

const determineQuadrant = (sl: number, pm: number): QuadrantType => {
    // Thresholds: High >= 50, Low < 50. 
    // Note: User strategy doc suggested 60/40 split. Let's use 50 as the hard line for now, 
    // or maybe a "Buffer Zone" (40-60).
    // Let's stick to a clear 50 split for simplicity first.

    // Wait, let's look at the strategy doc:
    // High (>60), Low (<40). What about 40-60?
    // Let's assume > 50 is High.
    const isHighSL = sl >= 50;
    const isHighPM = pm >= 50;

    if (isHighSL && isHighPM) return "Amplified Distress";
    if (isHighSL && !isHighPM) return "Self-Regulation";
    if (!isHighSL && isHighPM) return "Detached Cynicism";
    return "Secure Flow";
};

// --- Algorithm ---

export function calculateScore(answers: Record<string, any>, userProfile?: any): ScoreResult {
    // 1. Normalize and aggregate
    const normalizedScores: Record<number, number> = {};
    Object.entries(answers).forEach(([qIdStr, rawVal]) => {
        const qId = parseInt(qIdStr);
        const raw = typeof rawVal === "number" ? rawVal : parseInt(rawVal);
        let norm = (raw - 1) / 4;
        if (REVERSE_CODED_IDS.includes(qId)) norm = 1 - norm;
        normalizedScores[qId] = norm;
    });

    const dimensions: any = {};
    const dimensionStats: { id: DimensionType; sl: number; pm: number; mismatch: number; state: QuadrantType; prescription: Prescription }[] = [];

    DIMENSIONS.forEach((dim) => {
        const mapping = DIMENSION_MAPPING[dim];
        const pmScores = mapping.PM.map((id) => normalizedScores[id]).filter((s) => s !== undefined);
        const pmFinal = Math.round((pmScores.length > 0 ? pmScores.reduce((a, b) => a + b, 0) / pmScores.length : 0) * 100);
        const slScores = mapping.SL.map((id) => normalizedScores[id]).filter((s) => s !== undefined);
        const slFinal = Math.round((slScores.length > 0 ? slScores.reduce((a, b) => a + b, 0) / slScores.length : 0) * 100);
        const mismatch = Math.abs(slFinal - pmFinal);

        // NEW: Determine State
        const state = determineQuadrant(slFinal, pmFinal);
        const prescription = QUADRANT_CONTENT[dim][state];

        dimensions[dim] = { PM: pmFinal, SL: slFinal, mismatch, state, prescription };
        dimensionStats.push({ id: dim, sl: slFinal, pm: pmFinal, mismatch, state, prescription });
    });

    // 2. Dominant Lens Calculation
    // Logic: Highest "Pain". 
    // Pain = Amplified Distress > Detached Cynicism > Self Regulation > Secure Flow.
    // Within same category, highest SL + PM sum?

    const scoreState = (s: QuadrantType) => {
        if (s === "Amplified Distress") return 4;
        if (s === "Detached Cynicism") return 3;
        if (s === "Self-Regulation") return 2;
        return 1;
    };

    const candidates = [...dimensionStats];
    candidates.sort((a, b) => {
        const scoreA = scoreState(a.state);
        const scoreB = scoreState(b.state);
        if (scoreA !== scoreB) return scoreB - scoreA; // Bio-threat priority

        // Tie-breaker: Intensity (Sum of scores)
        return (b.sl + b.pm) - (a.sl + a.pm);
    });

    const dominantLensObj = candidates[0];
    const dominantLens = dominantLensObj.id;

    // 3. Lists & Triggers
    // Triggers are areas with Distress or Self-Regulation (High SL)
    const triggers = dimensionStats
        .filter(d => d.state === "Amplified Distress" || d.state === "Self-Regulation")
        .sort((a, b) => b.sl - a.sl)
        .map(d => d.id)
        .slice(0, 3);

    const misreadRisks = dimensionStats
        .filter(d => d.state === "Detached Cynicism")
        .map(d => d.id);

    // --- Report Generation ---

    const dimContent = dominantLensObj.prescription;
    const coreNeed = CORE_NEEDS[dominantLens as DimensionType];

    // Snapshot Summary
    const snapshotSummary = `Your relationship dynamic is defined by a primary pattern in ${dominantLens}, which is currently in a state of "${dimContent.stateName}".`;

    // Legacy Support (Aligned vs Misread)
    // We Map "Secure Flow" & "Self-Ref" to Aligned? Or just Secure?
    // Let's map Secure Flow -> Aligned.
    // Others -> Misread/Attention Needed.

    const alignedAreas = dimensionStats
        .filter(d => d.state === "Secure Flow")
        .map(d => ({
            dimension: d.id,
            text: d.prescription.analysis
        }));

    const misreadAreas = dimensionStats
        .filter(d => d.state !== "Secure Flow")
        .map(d => ({
            dimension: d.id,
            feel: `State: ${d.prescription.stateName}`,
            assume: d.prescription.analysis,
            distortion_origin: "Based on Quadrant Analysis."
        }));

    // scripts
    const scriptsContent = dimensionStats.map(d => ({
        dimension: d.id,
        inTheMoment: d.prescription.scripts.inTheMoment,
        repair: d.prescription.scripts.repair
    }));

    const partnerTranslations = dimensionStats.map(d => ({
        dimension: d.id,
        text: d.prescription.partnerTranslation
    }));

    // Question Selection
    const questionSelection = dimensionStats.map(d => {
        const allQs = QUESTION_BANK[d.id as DimensionType];
        // If secure, maybe easier questions? For now return all.
        return { dimension: d.id, questions: allQs };
    });

    // Calculate Compatibility Score (if partner data available)
    let compatibilityScore = undefined;
    if (userProfile?.partnerConflictStyle || userProfile?.fightFrequency || userProfile?.repairFrequency) {
        compatibilityScore = calculateCompatibility({
            userDominantLens: dominantLens,
            userState: dimContent.stateName,
            partnerConflictStyle: userProfile.partnerConflictStyle,
            fightFrequency: userProfile.fightFrequency,
            repairFrequency: userProfile.repairFrequency
        });
    }

    const report: FullReport = {
        cover: {
            title: "Your Relationship Operating Manual",
            subtitle: "A physiological map of how you connect",
            opening: "This is not just a report. It is a user manual for your specific nervous system."
        },
        snapshot: {
            summary: snapshotSummary,
            dominantLens: dominantLens,
            dimensions: dimensions
        },
        primaryLens: {
            lensName: dominantLens,
            activates: EVENT_TRIGGERS[dominantLens as DimensionType],
            need: coreNeed.need,
            fear: coreNeed.fear,
            stateName: dimContent.stateName,
            analysis: dimContent.analysis
        },
        dimensionsDetailed: dimensionStats.map(d => ({
            id: d.id,
            score: dimensions[d.id]
        })),
        alignedAreas,
        misreadAreas,
        visualData: dimensionStats.map(d => ({
            dimension: d.id,
            label: d.id.charAt(0).toUpperCase() + d.id.slice(1).replace('_', ' '),
            sensitivity: dimensions[d.id].SL,
            interpretation: dimensions[d.id].PM
        })),
        scripts: scriptsContent,
        partnerTranslations: partnerTranslations,
        questions: questionSelection,
        compatibility: compatibilityScore,
        closing: "Use these scripts. They are designed to bypass the defense mechanisms of your partner."
    };

    const preview = {
        headline: `You are currently in a "${dimContent.stateName}" loop regarding ${dominantLens}.`,
        insight: `Your nervous system perceives ${dominantLens} as a threat to ${coreNeed.need}.`,
        hook: `We have generated a specific script to say when you feel this panic.`,
        cta: "Unlock your User Manual to get the scripts."
    };

    return {
        dimensions,
        dominantLens,
        triggers,
        misreadRisks,
        report,
        preview
    };
}
