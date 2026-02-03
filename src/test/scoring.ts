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
    state: QuadrantType;
    prescription: Prescription;
    health: number; // 0-100 (Higher is Better) - NEW for Crisis Triage
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
        stateName: string;
        analysis: string;
    };
    dimensionsDetailed: {
        id: string;
        score: DimensionScore;
    }[];
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
    visualData: {
        dimension: string;
        label: string;
        sensitivity: number;
        interpretation: number;
    }[];
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
    attachmentStyle: string;
    phase: string;
}

// --- Configuration & Helpers ---

const DIMENSIONS: DimensionType[] = [
    "communication",
    "emotional_safety",
    "physical_intimacy",
    "power_fairness",
    "future_values",
];

// Mapping Table (Based on New Question Set)
const DIMENSION_MAPPING: Record<DimensionType, { PM: number[]; SL: number[] }> = {
    communication: { PM: [2, 4, 5], SL: [1, 3, 6] },
    emotional_safety: { PM: [8, 11, 12], SL: [7, 9, 10] },
    physical_intimacy: { PM: [15, 16, 18], SL: [13, 14, 17] },
    power_fairness: { PM: [20, 24], SL: [19, 21, 22, 23] },
    future_values: { PM: [26, 28], SL: [25, 27] }
};

// Reverse Coded Questions (IDs) - Updated for new set
const REVERSE_CODED_IDS = [6, 11, 18, 24, 28];

const QUESTION_BANK: Record<DimensionType, string[]> = {
    communication: ["When you argue, what happens physically?", "Does silence feel like safety or danger?"],
    emotional_safety: ["When do you feel most 'held' by your partner?", "What triggers your distrust?"],
    physical_intimacy: ["Is sex a way to connect, or the result of connection?", "How do you handle rejection?"],
    power_fairness: ["Do you feel like a parent or a partner?", "Does the mental load feel shared?"],
    future_values: ["Are you building the same cathedral?", "Do you have fun together?"]
};

// --- Helper Functions ---

const determineQuadrant = (sl: number, pm: number): QuadrantType => {
    const isHighSL = sl >= 50;
    const isHighPM = pm >= 50;

    if (isHighSL && isHighPM) return "Amplified Distress";
    if (isHighSL && !isHighPM) return "Self-Regulation";
    if (!isHighSL && isHighPM) return "Detached Cynicism";
    return "Secure Flow";
};

// --- Algorithm ---

export function calculateScore(answers: Record<string, any>, userProfile?: any): ScoreResult {
    const normalizedScores: Record<number, number> = {};
    Object.entries(answers).forEach(([qIdStr, rawVal]) => {
        const qId = parseInt(qIdStr);
        const raw = typeof rawVal === "number" ? rawVal : parseInt(rawVal);
        let norm = (raw - 1) / 4;
        if (REVERSE_CODED_IDS.includes(qId)) norm = 1 - norm;
        normalizedScores[qId] = norm;
    });

    const dimensions: any = {};
    const dimensionStats: { id: DimensionType; sl: number; pm: number; mismatch: number; state: QuadrantType; prescription: Prescription; health: number }[] = [];

    DIMENSIONS.forEach((dim) => {
        const mapping = DIMENSION_MAPPING[dim];
        const pmScores = mapping.PM.map((id) => normalizedScores[id]).filter((s) => s !== undefined);
        const pmFinal = Math.round((pmScores.length > 0 ? pmScores.reduce((a, b) => a + b, 0) / pmScores.length : 0) * 100);
        const slScores = mapping.SL.map((id) => normalizedScores[id]).filter((s) => s !== undefined);
        const slFinal = Math.round((slScores.length > 0 ? slScores.reduce((a, b) => a + b, 0) / slScores.length : 0) * 100);
        const mismatch = Math.abs(slFinal - pmFinal);

        const state = determineQuadrant(slFinal, pmFinal);
        const prescription = QUADRANT_CONTENT[dim][state];
        const health = 100 - Math.round((slFinal + pmFinal) / 2);

        dimensions[dim] = { PM: pmFinal, SL: slFinal, mismatch, state, prescription, health };
        dimensionStats.push({ id: dim, sl: slFinal, pm: pmFinal, mismatch, state, prescription, health });
    });

    // PRIMARY CRISIS CALCULATION
    const priorityOrder: DimensionType[] = ["physical_intimacy", "power_fairness", "emotional_safety", "future_values", "communication"];

    const candidates = [...dimensionStats];
    candidates.sort((a, b) => {
        if (a.health !== b.health) return a.health - b.health;
        const pA = priorityOrder.indexOf(a.id);
        const pB = priorityOrder.indexOf(b.id);
        return pA - pB;
    });

    const dominantLensObj = candidates[0];
    const dominantLens = dominantLensObj.id;

    const triggers = dimensionStats
        .filter(d => d.state === "Amplified Distress" || d.state === "Self-Regulation")
        .sort((a, b) => b.sl - a.sl)
        .map(d => d.id)
        .slice(0, 3);

    const misreadRisks = dimensionStats
        .filter(d => d.state === "Detached Cynicism")
        .map(d => d.id);

    const dimContent = dominantLensObj.prescription;
    const coreNeed = CORE_NEEDS[dominantLens as DimensionType];

    const snapshotSummary = `Your relationship is suffering from a critical breakdown in ${dominantLens.replace('_', ' ').toUpperCase()}. You are currently in the "${dimContent.stateName}" trap.`;

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
            distortion_origin: "Based on MRI Scan."
        }));

    const scriptsContent = dimensionStats.map(d => ({
        dimension: d.id,
        inTheMoment: d.prescription.scripts.inTheMoment,
        repair: d.prescription.scripts.repair
    }));

    const partnerTranslations = dimensionStats.map(d => ({
        dimension: d.id,
        text: d.prescription.partnerTranslation
    }));

    const questionSelection = dimensionStats.map(d => {
        const allQs = QUESTION_BANK[d.id as DimensionType];
        return { dimension: d.id, questions: allQs };
    });

    let compatibilityScore: any = undefined;
    if (userProfile?.partnerConflictStyle) {
        compatibilityScore = calculateCompatibility({
            userDominantLens: dominantLens,
            userState: dimContent.stateName,
            partnerConflictStyle: userProfile.partnerConflictStyle,
            fightFrequency: userProfile.fightFrequency || "Monthly",
            repairFrequency: userProfile.repairFrequency || "Sometimes"
        });
    }

    const report: FullReport = {
        cover: {
            title: "Relationship MRI Report",
            subtitle: "Diagnostic Scan & Treatment Plan",
            opening: "We have analyzed the 5 Vital Signs of your relationship. Here is the diagnosis."
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
            label: d.id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            sensitivity: dimensions[d.id].SL,
            interpretation: dimensions[d.id].PM
        })),
        scripts: scriptsContent,
        partnerTranslations: partnerTranslations,
        questions: questionSelection,
        compatibility: compatibilityScore,
        closing: "This is your starting point. Use the scripts."
    };

    const preview = {
        headline: `CRITICAL ALERT: You are in the "${dimContent.stateName}" regarding ${dominantLens.replace('_', ' ')}.`,
        insight: `Your scan shows this is the #1 threat to your relationship right now.`,
        hook: `We have a specific protocol to fix this today.`,
        cta: "Unlock Your Diagnosis"
    };

    return {
        dimensions,
        dominantLens,
        triggers,
        misreadRisks,
        report,
        preview,
        attachmentStyle: calculateAttachmentStyle(dimensions), // NEW
        phase: calculateRelationshipPhase(dimensions, userProfile?.relationshipDuration) // NEW
    };
}

// --- NEW LOGIC: Attachment & Phase ---

export type AttachmentStyle = "Secure" | "Anxious-Preoccupied" | "Dismissive-Avoidant" | "Fearful-Avoidant";

export function calculateAttachmentStyle(dimensions: Record<string, DimensionScore>): AttachmentStyle {
    // We derive this primarily from Emotional Safety and Physical Intimacy
    // Safe = High Trust (Low PM), Moderate/High Intimacy
    // Anxious = High Safety SL (Need Reassurance) + High Intimacy SL (Need Connection)
    // Avoidant = High Safety PM (Distrust) + Low Intimacy SL (Distance)

    const safety = dimensions["emotional_safety"];
    const intimacy = dimensions["physical_intimacy"];

    if (!safety || !intimacy) return "Secure"; // Fallback

    const highNeed = safety.SL > 60 || intimacy.SL > 60;
    const highDistrust = safety.PM > 60;
    const lowNeed = intimacy.SL < 40;

    if (!highNeed && !highDistrust) return "Secure";

    if (highNeed && !highDistrust) return "Anxious-Preoccupied";

    if (highDistrust && lowNeed) return "Dismissive-Avoidant";

    if (highDistrust && highNeed) return "Fearful-Avoidant";

    // Default if mixed
    return highNeed ? "Anxious-Preoccupied" : "Dismissive-Avoidant";
}

export type RelationshipPhase = "The Honeymoon" | "The Power Struggle" | "The Dead Zone" | "The Partnership";

export function calculateRelationshipPhase(dimensions: Record<string, DimensionScore>, duration?: string): RelationshipPhase {
    // Simplified logic based on duration and overall "health" (inverse of distress)
    const avgStates = Object.values(dimensions).map(d => d.state);
    const distressCount = avgStates.filter(s => s === "Amplified Distress" || s === "Detached Cynicism").length;

    // Use duration as a heuristic base
    if (!duration || duration.toLowerCase().includes("less than 1")) {
        return "The Honeymoon";
    }

    if (distressCount >= 3) {
        // High distress across board
        return "The Power Struggle";
    }

    if (distressCount < 3 && avgStates.includes("Detached Cynicism")) {
        // Disconnection
        return "The Dead Zone";
    }

    if (distressCount === 0) {
        return "The Partnership";
    }

    // Default fallback
    return "The Power Struggle";
}
