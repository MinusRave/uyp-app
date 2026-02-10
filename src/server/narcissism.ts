import Anthropic from '@anthropic-ai/sdk';
import { AssessNarcissism } from 'wasp/server/operations';
import { TEST_CONFIG } from '../test/testConfig.js';

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_for_build',
});

// --- HELPERS (Duplicated to avoid refactoring existing ai.ts) ---

const calculateAiCost = (model: string, inputTokens: number, outputTokens: number): number => {
    // Determine pricing based on model
    let inputPrice: number;
    let outputPrice: number;

    const isFastModel = model.includes('haiku');

    if (isFastModel) {
        inputPrice = parseFloat(process.env.ANTHROPIC_MODEL_FAST_INPUT_PRICE || '1.00');
        outputPrice = parseFloat(process.env.ANTHROPIC_MODEL_FAST_OUTPUT_PRICE || '5.00');
    } else {
        // Default to Sonnet pricing
        inputPrice = parseFloat(process.env.ANTHROPIC_MODEL_INPUT_PRICE || '3.00');
        outputPrice = parseFloat(process.env.ANTHROPIC_MODEL_OUTPUT_PRICE || '15.00');
    }

    // Calculate cost (prices are per million tokens)
    const inputCost = (inputTokens / 1_000_000) * inputPrice;
    const outputCost = (outputTokens / 1_000_000) * outputPrice;

    return inputCost + outputCost;
};

const startAiLog = async (context: any, data: { action: string, model: string, prompt?: string, sessionId?: string }) => {
    try {
        return await context.entities.AiLog.create({
            data: {
                action: data.action,
                model: data.model,
                status: 'pending',
                requestPrompt: data.prompt ? data.prompt.substring(0, 5000) : null,
                sessionId: data.sessionId,
                duration: 0
            }
        });
    } catch (e) {
        console.error("Failed to start AI Log:", e);
        return null;
    }
};

const completeAiLog = async (context: any, logId: string | undefined, data: { duration: number, status: string, response?: string, error?: string, usage?: { input_tokens: number, output_tokens: number }, model?: string }) => {
    if (!logId) return;
    try {
        // Calculate cost if usage data is available
        let cost: number | null = null;
        if (data.usage && data.model) {
            cost = calculateAiCost(data.model, data.usage.input_tokens, data.usage.output_tokens);
            console.log(`[AI Cost] ${data.model}: $${cost.toFixed(4)} (${data.usage.input_tokens} in + ${data.usage.output_tokens} out)`);
        }

        await context.entities.AiLog.update({
            where: { id: logId },
            data: {
                duration: data.duration / 1000, // Convert ms to seconds
                tokensUsed: data.usage ? (data.usage.input_tokens + data.usage.output_tokens) : null,
                inputTokens: data.usage?.input_tokens || null,
                outputTokens: data.usage?.output_tokens || null,
                cost: cost,
                status: data.status,
                errorMessage: data.error,
                response: data.response ? data.response.substring(0, 10000) : null
            }
        });
    } catch (e) {
        console.error("Failed to complete AI Log:", e);
    }
};

// --- NARCISSISM ASSESSMENT ACTION ---

type AssessNarcissismArgs = {
    sessionId: string;
};

type AssessNarcissismResult = {
    json: any;
};

export const assessNarcissism: AssessNarcissism<AssessNarcissismArgs, AssessNarcissismResult> = async (args, context) => {
    const startTime = Date.now();
    if (!args.sessionId) throw new Error('Session ID required');

    // 1. Fetch Session Data
    const session = await context.entities.TestSession.findUnique({
        where: { id: args.sessionId }
    });
    if (!session) throw new Error('Session not found');

    // CACHE HIT
    if (session.narcissismAnalysis && Object.keys(session.narcissismAnalysis as object).length > 0) {
        return { json: session.narcissismAnalysis };
    }

    // 2. Prepare Data for AI
    const answers = (session.answers as Record<string, any>) || {};

    // Extract key markers
    // Q29: Gaslighting
    const q29 = answers["29"];
    const gaslightingScore = q29 ? q29.score : 0; // 1-5

    // Q30: Cycle
    const q30 = answers["30"];
    const cycleScore = q30 ? q30.score : 0; // 1-5

    // Partner Conflict Style
    const conflictStyle = session.partnerConflictStyle || "Unknown";

    // Partner Hurtful Behavior (if available)
    const hurtfulBehavior = session.partnerHurtfulBehavior || "N/A";
    const biggestFear = session.biggestFear || "N/A";

    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';

    const systemPrompt = `You are an expert Psychometric AI specialized in Relationship Dynamics, Cluster B Personality Disorders (NPD), and Emotional Abuse patterns.

    Your task is to analyze a structured questionnaire response set and output a detailed psychological profile in strict JSON format.

    ### ANALYSIS LOGIC

    1.  **PARTNER EVALUATION (Narcissism/NPD):**
        * **High Risk Indicators:** High scores on 'Gaslighting' (Q7/Q29), 'The Cycle' (Q14/Q30), 'Malice/Intent' (Q8), and 'Deflection/Blame' (Wizard Q3).
        * **Key Traits to Detect:** Lack of Empathy, Grandiosity (implied by entitlement), Manipulation, Refusal to accept responsibility.

    2.  **USER EVALUATION (Self-Assessment):**
        * **Victim/Anxious Profile:** High scores on 'Panic' (Q1), 'Need for Reassurance' (Q9), 'Fear' (Wizard Q5). Indicates the user is reacting to abuse (walking on eggshells).
        * **Narcissistic/Controlling Profile:** If the User reports 'Feeling like a Manager/Parent' (Q20) AND displays low distress/high contempt, or answers 'Deflects' regarding *their own* conflict style (if inferred). *Note: True narcissists rarely take these tests, so prioritize detecting "Anxious Attachment" or "Codependency" unless the user shows clear lack of empathy.*

    3.  **TOXICITY INDEX (0-100 Scoring Algorithm):**
        * **0-30 (Healthy/Normal):** Occasional conflict, repair exists (Wizard Q3 = 'Always/Sometimes').
        * **31-60 (Stagnant/Unsatisfying):** Lack of spark, roommate syndrome, emotional distance, but low danger.
        * **61-85 (Toxic):** Frequent stonewalling, criticism, unresolved conflict, anxious attachment activation.
        * **86-100 (Dangerous/Abusive):** Presence of Fear (Wizard Q5), Gaslighting (Q7/Q29), Coercion (Q17), or Sadism (Q8).

    ### OUTPUT FORMAT
    You must return ONLY a valid JSON object. Do not include markdown formatting (like \`\`\`json).

    JSON STRUCTURE:
    {
      "partner_analysis": {
        "is_narcissist_risk": boolean,
        "risk_level": "Low" | "Moderate" | "High" | "Severe",
        "traits_detected": ["List", "of", "detected", "traits"]
      },
      "user_analysis": {
        "likely_profile": "Anxious/Victim" | "Secure/Unhappy" | "Avoidant" | "Narcissistic/Controlling",
        "emotional_state": "String describing the user's psychological state (e.g., 'Hypervigilant', 'Resentful', 'Depressed')"
      },
      "relationship_health": {
        "toxicity_score": integer (0-100),
        "label": "Healthy" | "Stagnant" | "Toxic" | "Abusive",
        "red_flags": ["List", "of", "critical", "issues"]
      },
      "recommendation": "Short, direct advice string based on the data."
    }`;

    // Helper to get score safely
    const getScore = (id: number) => {
        const a = answers[id.toString()];
        return a ? a.score : 0;
    };

    // Construct detailed user profile for the AI
    const userProfile = `
    --- WIZARD DATA ---
    - Recent Conflict Style (Partner): ${conflictStyle}
    - Repair Frequency: ${session.repairFrequency || "Unknown"}
    - Biggest Fear: "${biggestFear}"
    - Partner Hurtful Behavior: "${hurtfulBehavior}"

    --- KEY QUESTION SCORES (1-5) ---
    - Q1 (Panic/Abandonment): ${getScore(1)}
    - Q8 (Malice/Intent): ${getScore(8)}
    - Q9 (Reassurance Need): ${getScore(9)}
    - Q29 (Gaslighting): ${getScore(29)}
    - Q30 (The Cycle): ${getScore(30)}
    - Q20 (Manager/Parent): ${getScore(20)}
    - Q17 (Coercion/Compliance): ${getScore(17)}
    `;

    const userPrompt = `
    ANALYZE THIS RELATIONSHIP DYNAMIC:
    ${userProfile}
    `;

    const logEntry = await startAiLog(context, {
        action: "assessNarcissism",
        model: model,
        prompt: userPrompt,
        sessionId: session.id
    });

    try {
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 1000,
            temperature: 0.5,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const usage = (msg as any).usage || { input_tokens: 0, output_tokens: 0 };
        const content = msg.content[0];

        if (content.type === 'text') {
            const firstBrace = content.text.indexOf('{');
            const lastBrace = content.text.lastIndexOf('}');

            if (firstBrace === -1 || lastBrace === -1) {
                throw new Error("No JSON object found in response");
            }

            const jsonStr = content.text.substring(firstBrace, lastBrace + 1);
            let parsedJson;
            try {
                parsedJson = JSON.parse(jsonStr);
            } catch (e) {
                console.error("Narcissism Assessment JSON Parse Error", e);
                // Fallback or throw
                throw new Error("Invalid JSON from AI");
            }

            // JOINING WITH DB UPDATE
            await context.entities.TestSession.update({
                where: { id: session.id },
                data: { narcissismAnalysis: parsedJson }
            });

            await completeAiLog(context, logEntry?.id, {
                duration: Date.now() - startTime,
                status: "success",
                response: jsonStr,
                usage: usage,
                model: model
            });

            return { json: parsedJson };
        }
        throw new Error("Invalid AI response type");

    } catch (e: any) {
        console.error("Narcissism Assessment Failed", e);
        await completeAiLog(context, logEntry?.id, {
            duration: Date.now() - startTime,
            status: "error",
            error: e.message,
            model: model
        });
        throw new Error("Failed to assess narcissism");
    }
};
