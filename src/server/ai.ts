import Anthropic from '@anthropic-ai/sdk';
import { TranslateMessage, GenerateFullReport, GenerateQuickOverview } from 'wasp/server/operations';
import { METRICS_CONFIG } from '../test/metricsConfig.js';
import { TEST_CONFIG } from '../test/testConfig.js';

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_for_build',
});

// --- COST CALCULATION HELPER ---

const calculateAiCost = (model: string, inputTokens: number, outputTokens: number): number => {
    // Determine pricing based on model
    let inputPrice: number;
    let outputPrice: number;

    // Check if it's a fast model (Haiku)
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

// --- LOGGING HELPERS ---

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

// ... (finding where QuickOverviewArgs is defined)
export type ExecutiveAnalysisResult = {
    markdown: string;
};

export type ExecutiveAnalysisArgs = {
    dominantLens?: string;
    dimensions?: {
        id: string;
        sl: number;
        pm: number;
        state: string;
    }[];
    attachmentStyle?: string;
    phase?: string;
    userContext?: string;
    sessionId?: string;
};

// --- HELPER: 5-Profile Classification Logic ---
type UserAnswers = Record<string, { score: number }>;

const classifyProfile = (answers: UserAnswers, conflictStyle?: string): string => {
    const getScore = (id: number) => answers[id.toString()]?.score || 3;
    const agrees = (id: number) => getScore(id) >= 4;

    if (agrees(20) && agrees(19)) return "The Parentified Lover";
    if (agrees(21) || agrees(8) || agrees(7)) return "The Safety-Starved Partner";
    if (agrees(14) && agrees(1)) return "The Anxious Pursuer";
    if (agrees(13) && agrees(14)) return "The Burnt-Out Pursuer";
    if (agrees(13)) return "The Complacent Roommate";

    return "The Disconnected Partner";
};

const buildEnrichedContext = (scores: any, answers: any, session: any) => {
    const dominantLens = scores.dominantLens || "communication";
    const dominantScore = scores.dimensions?.[dominantLens]?.SL || 0;
    const context = `
    - **Relationship Status:** ${session.relationshipStatus || "Unknown"}
    - **Duration:** ${session.relationshipDuration || "Unknown"}
    - **Children:** ${session.hasChildren ? "Yes" : "No"}
    - **Living Together:** ${session.livingTogether ? "Yes" : "No"}
    `;
    return { dominantLens, dominantScore, context };
};



type TranslateMessageArgs = {
    userLens: string;
    partnerLens: string;
    message: string;
    sessionId?: string;
};

type TranslateMessageResult = {
    translatedMessage: string;
    analysis: string;
};

export const translateMessage: TranslateMessage<TranslateMessageArgs, TranslateMessageResult> = async (args, context) => {
    // Auth Check
    const startTime = Date.now();
    if (!context.user && !args.sessionId) throw new Error('Unauthorized.');

    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';
    const prompt = `Translate this text from lens ${args.userLens} to ${args.partnerLens}: "${args.message}"`;

    const logEntry = await startAiLog(context, {
        action: "translateMessage",
        model: model,
        prompt: prompt,
        sessionId: args.sessionId
    });

    try {
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 300,
            temperature: 0.5,
            system: "Output JSON: {translatedMessage, analysis}",
            messages: [{ role: "user", content: prompt }]
        });

        const usage = (msg as any).usage || { input_tokens: 0, output_tokens: 0 };
        const content = msg.content[0];
        let result = { translatedMessage: "Error", analysis: "Error" };

        if (content.type === 'text') {
            try {
                result = JSON.parse(content.text);
            } catch {
                result = { translatedMessage: content.text, analysis: "Optimization complete." };
            }
        }

        await completeAiLog(context, logEntry?.id, {
            duration: Date.now() - startTime,
            status: "success",
            response: JSON.stringify(result),
            usage: usage,
            model: model
        });

        return result;
    } catch (e: any) {
        await completeAiLog(context, logEntry?.id, {
            duration: Date.now() - startTime,
            status: "error",
            error: e.message,
            model: model
        });
        throw e;
    }
}


// --- NEW: Full Report Generation (8 Chapters) ---

type GenerateFullReportArgs = {
    sessionId: string;
};

type FullReportResult = {
    json: any;
};

export const generateFullReport: GenerateFullReport<GenerateFullReportArgs, FullReportResult> = async (args, context) => {
    const startTime = Date.now();
    if (!args.sessionId) throw new Error('Session ID required');

    // 1. Fetch Data
    const session = await context.entities.TestSession.findUnique({
        where: { id: args.sessionId }
    });
    if (!session) throw new Error('Session not found');

    // CACHE HIT
    if (session.fullReport && Object.keys(session.fullReport as object).length > 0) {
        return { json: session.fullReport };
    }

    // 2. Prepare Context for AI
    const answers = (session.answers as Record<string, any>) || {};
    const questions = TEST_CONFIG.questions as any[];
    const answerOptions = TEST_CONFIG.answerOptions as any[];

    const formattedAnswers = questions.map((q) => {
        const a = answers[q.id];
        if (!a) return null;
        const option = answerOptions.find((o) => o.id === a.answerId);
        return `Q: "${q.text}" -> A: "${option?.text}" (Score: ${a.score})`;
    }).filter(Boolean).join("\n");

    const metrics = (session.advancedMetrics as Record<string, any>) || {};
    const configMetrics = METRICS_CONFIG as any[];

    const formattedMetrics = configMetrics.map((m) => {
        const val = metrics[m.id];
        return `${m.title}: ${val}`;
    }).join("\n");

    const userProfile = `
    - Status: ${session.relationshipStatus}
    - Duration: ${session.relationshipDuration}
    - Conflict Freq: ${session.fightFrequency}
    - Repair Freq: ${session.repairFrequency}
    - Partner Style: ${session.partnerConflictStyle}
    - Biggest Fear: "${session.biggestFear}"
    - Conflict Story: "${session.conflictDescription || 'N/A'}"
    `;

    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';

    const systemPrompt = `You are an expert Relationship Psychologist and Senior UX Copywriter.
    MISSION: Analyze the couple's data and write the "Relationship MRI Report" (8 Chapters).
    
    OUTPUT FORMAT INSTRUCTIONS:
    - You must output VALID JSON only.
    - No Markdown formatting (no \`\`\`json blocks).
    - No introductory text. No "Here is the JSON".
    - CRITICAL: ESCAPE ALL DOUBLE QUOTES within string values (e.g. "He said \\"Hello\\"").
    - CRITICAL: Ensure the JSON is COMPLETE and NOT TRUNCATED. Close all arrays and objects properly.
    - If approaching token limit, prioritize completing the JSON structure over adding more content.
    
    JSON STRUCTURE WITH DETAILED FIELD INSTRUCTIONS:
    {
      "chapter1_pulse": {
        "headline": "One punchy sentence summarizing the relationship's current state (e.g. 'You're stuck in a loop, but it's fixable')",
        "summary": "One clinical sentence about overall health (e.g. 'This relationship is showing signs of chronic repair failure')",
        "short_term_forecast": "What will happen in 6 months if nothing changes (2-3 sentences, specific to their conflict pattern)",
        "long_term_forecast": "What will happen in 5 years if nothing changes (2-3 sentences, paint the picture of slow erosion)",
        "dimensions": {
          "communication": { "score": NUMBER, "status": "Low|Medium|High" },
          "emotional_safety": { "score": NUMBER, "status": "Low|Medium|High" },
          "intimacy": { "score": NUMBER, "status": "Low|Medium|High|Critical" },
          "fairness": { "score": NUMBER, "status": "Low|Medium|High" },
          "shared_future": { "score": NUMBER, "status": "Low|Medium|High" }
        }
      },
      "chapter2_communication": {
        "conflict_style": "Label their conflict pattern in 2-4 words (e.g. 'Pursuer-Withdrawer', 'Mutual Escalation', 'Silent Treatment')",
        "teaser": "FREE CONTENT: 1-2 sentences that name the pattern and create curiosity (e.g. 'Your conflict pattern has a name: Pursuer-Shutdown. One of you chases resolution, the other needs space—creating a vicious cycle.')",
        "metric_insight": "FREE CONTENT: Connect to their Repair Efficiency metric (e.g. 'Your Repair Efficiency score of 79% shows you bounce back quickly, but the same fight keeps returning because you're not addressing the root pattern.')",
        "repeat_loop": [
          "Sentence 1: Describe the exact loop they're stuck in (e.g. 'She brings up an issue, he shuts down, she escalates, he withdraws further')",
          "Sentence 2: Explain WHY apologies don't work for them (e.g. 'Apologies fail because they're used as exits, not repairs')"
        ],
        "repair_efficiency": "One insight about their repair attempts (e.g. 'Your repair attempts happen too late—after the damage is done')",
        "deep_dive": "PAID CONTENT: 3-4 sentences detailing the complete cycle with specific roles (e.g. 'The cycle starts when [Partner A] brings up an issue. [Partner B] feels overwhelmed and shuts down or walks away. This triggers [Partner A]'s anxiety, making them pursue harder. [Partner B] withdraws further to protect themselves.')",
        "why_repairs_fail": "PAID CONTENT: 2-3 sentences explaining why their specific repair attempts don't work (e.g. 'Your apologies work quickly, but they're Band-Aids on bullet wounds. You reconnect fast without addressing WHY the shutdown happens.')",
        "specific_triggers": [
          "Trigger 1 from their data (e.g. 'Money conversations, especially unexpected expenses')",
          "Trigger 2 from their data (e.g. 'Feeling unheard or dismissed during conflict')",
          "Trigger 3 from their data (e.g. 'Bringing up past unresolved issues')"
        ],
        "impact_on_other_dimensions": "PAID CONTENT: 2-3 sentences connecting this to another dimension (e.g. 'This shutdown pattern is directly triggering your sexual rejection sensitivity. When they walk away from arguments, your nervous system interprets it as emotional rejection.')"
      },
      "chapter3_security": {
        "anxiety_hypervigilance": "Rate their anxiety level (e.g. 'High Alert - Walking on Eggshells Daily' or 'Moderate - Occasional Hypervigilance')",
        "teaser": "FREE CONTENT: 1-2 sentences about their core fear (e.g. 'You don't fear abandonment—you fear becoming invisible. When they shut down, you question if your feelings matter.')",
        "metric_insight": "FREE CONTENT: Connect to Betrayal Vulnerability metric (e.g. 'Your Betrayal Vulnerability score of 67% indicates moderate trust erosion. You trust their intentions, but specific triggers spike your nervous system.')",
        "silent_secret": "Name their deepest unspoken fear (2-3 sentences, e.g. 'You fear that if you stop managing everything, the relationship will collapse. This fear is creating the very distance you're trying to prevent.')",
        "deep_dive": "PAID CONTENT: 3-4 sentences about their anxiety pattern (e.g. 'Your baseline anxiety is low, but specific situations trigger hypervigilance: money conflicts, feeling sexually rejected, or when they withdraw emotionally. In these moments, you shift from secure to anxious.')",
        "trust_erosion_pattern": "PAID CONTENT: 2-3 sentences explaining how trust erodes (e.g. 'Trust erodes not through betrayal, but through accumulated micro-abandonments. Each time they shut down during conflict, your brain registers it as I don't matter enough.')",
        "hypervigilance_triggers": [
          "Trigger 1 (e.g. 'Partner withdrawing during conflict')",
          "Trigger 2 (e.g. 'Sexual rejection, even when they're just tired')",
          "Trigger 3 (e.g. 'Money disagreements that feel like value conflicts')"
        ],
        "impact_on_daily_life": "PAID CONTENT: 2-3 sentences about how this shows up daily (e.g. 'This hypervigilance doesn't show up as constant anxiety—it's situational. You're calm 90% of the time, but when triggered, you can't tolerate unresolved tension.')"
      },
      "chapter4_erotic": {
        "roommate_risk": "Rate the roommate risk (e.g. 'High Risk - Intimacy has become transactional' or 'Medium Risk - Spark is fading')",
        "teaser": "FREE CONTENT: 1-2 sentences about what's blocking intimacy (e.g. 'Your intimacy isn't dying from lack of attraction—it's suffocating under the weight of resentment and duty.')",
        "metric_insight": "FREE CONTENT: Connect to Erotic Death Spiral metric (e.g. 'Your Erotic Death Spiral score of 40% shows medium risk. The spark exists (Hidden Spark: 70%), but it's buried under mental load and fear of rejection.')",
        "desire_gap": "Explain the ROOT CAUSE of low desire (2-3 sentences, link it to mental load, resentment, or anxiety. e.g. 'Desire is blocked by resentment. You can't want someone you're parenting.')",
        "deep_dive": "PAID CONTENT: 3-4 sentences about desire mechanics (e.g. 'Desire is blocked by two forces: (1) Sexual rejection sensitivity has turned sex into a referendum on your worth, and (2) You sometimes agree to sex to keep the peace, which means intimacy is becoming a chore.')",
        "desire_mechanics": "PAID CONTENT: 2-3 sentences explaining the psychological block (e.g. 'Your brain can't switch from manager mode to lover mode when you feel like their parent. Desire requires polarity—you need to feel like equals.')",
        "specific_blockers": [
          "Blocker 1 (e.g. 'Resentment from feeling like the manager')",
          "Blocker 2 (e.g. 'Fear of sexual rejection feels like personal rejection')",
          "Blocker 3 (e.g. 'Mental load: can't relax into desire when tracking everything')"
        ],
        "polarity_analysis": "PAID CONTENT: 2-3 sentences about erotic polarity (e.g. 'Erotic polarity requires psychological separation—you can't desire someone you're parenting. When one partner carries the mental load, they become the responsible one, killing sexual tension.')"
      },
      "chapter5_balance": {
        "teaser": "FREE CONTENT: 1-2 sentences about power imbalance (e.g. 'One of you is the Manager, the other is the Employee. This power imbalance is quietly killing your attraction.')",
        "metric_insight": "FREE CONTENT: Connect to CEO vs Intern metric (e.g. 'Your CEO vs Intern score of 67% shows a significant power imbalance. You feel like their parent or manager, which creates resentment and kills erotic polarity.')",
        "parent_child_dynamic": "Describe the power imbalance (2-3 sentences, e.g. 'One of you is the Manager, the other is the Employee. This kills polarity and breeds resentment.')",
        "deep_dive": "PAID CONTENT: 3-4 sentences about the Manager-Employee dynamic (e.g. 'You oscillate between equal partners and Manager-Employee, especially around money and household decisions. The manager carries the mental load: tracking bills, planning logistics, worrying about the future.')",
        "mental_load_breakdown": "PAID CONTENT: 2-3 sentences explaining mental load (e.g. 'Mental load isn't about tasks—it's about the invisible labor of anticipating, planning, and worrying. You track what needs to be done, when, and how.')",
        "resentment_pattern": "PAID CONTENT: 2-3 sentences about how resentment builds (e.g. 'Resentment builds not from the tasks themselves, but from the invisibility of your labor. You feel like you're the only one who cares enough to worry.')",
        "impact_on_attraction": "PAID CONTENT: 2-3 sentences connecting to desire (e.g. 'Attraction requires polarity: the tension between two equals. When one partner becomes the manager, polarity collapses. You can't desire someone you have to manage.')"
      },
      "chapter6_compass": {
        "teaser": "FREE CONTENT: 1-2 sentences about their alignment (e.g. 'You share the same dream, but daily conflict is making you question if you want to build it together.')",
        "metric_insight": "FREE CONTENT: Connect to Soulmate Sync metric (e.g. 'Your Soulmate Sync score of 100% shows deep alignment on values and life goals. This is your superpower—but it's being eroded by daily friction.')",
        "existential_alignment": "Do they want the same future? (e.g. 'Aligned on values, misaligned on execution' or 'Deep alignment - this is a strength')",
        "detachment_warning": "If friction is eroding the vision, warn them (2 sentences, e.g. 'Even though you share the same dream, daily conflict is making you question if you want to build it together.')",
        "deep_dive": "PAID CONTENT: 3-4 sentences about vision alignment (e.g. 'You're aligned on the destination (kids, career, lifestyle), but misaligned on the journey. You rarely dream or have fun anymore, which means the vision is intact but the daily experience is draining.')",
        "vision_compatibility": "PAID CONTENT: 2-3 sentences about what they agree on (e.g. 'Your existential alignment is a rare strength. You want the same things: [specific goals]. But alignment on the what doesn't guarantee alignment on the how.')",
        "dream_erosion": "PAID CONTENT: 2-3 sentences about how dreams fade (e.g. 'Dreams erode not from disagreement, but from exhaustion. When every conversation becomes a negotiation, you stop dreaming together.')",
        "trajectory_warning": "PAID CONTENT: 2-3 sentences about future risk (e.g. 'If you keep treating the relationship like a project to manage rather than a partnership to enjoy, you'll arrive at your shared future feeling like strangers.')"
      },
      "chapter7_synthesis": {
        "connection_1": "Connect TWO dimensions (2-3 sentences, e.g. 'Your Manager-Employee dynamic is directly killing libido. You can't desire someone you have to parent.')",
        "connection_2": "Connect TWO other dimensions (2-3 sentences, e.g. 'Your fear of abandonment triggers their fear of engulfment, creating a vicious cycle in every conflict.')"
      },
      "chapter8_roadmap": {
        "stop_doing": [
          "Stop [specific behavior from their data] (e.g. 'Stop bringing up past mistakes during new conflicts')",
          "Stop [specific behavior from their data] (e.g. 'Stop expecting them to read your mind about what you need')",
          "Stop [specific behavior from their data] (e.g. 'Stop using apologies as exits instead of repairs')"
        ],
        "scripts": [
          "Script 1: Exact phrase for [their specific conflict trigger] (e.g. 'I notice I'm getting defensive. Can we pause for 10 minutes and try again?')",
          "Script 2: Exact phrase for [their repair failure] (e.g. 'I'm sorry I shut down. What I was feeling was overwhelm, not rejection of you.')"
        ],
        "calendar": "Week 1: [specific action]. Week 2: [specific action]. Week 3: [specific action]. Week 4: [specific action]. (Base this on their biggest issue - e.g. if repair is broken, focus on repair rituals)"
      }
    }
    
    CRITICAL RULES:
    1. Use their ACTUAL conflict description, relationship duration, and answer patterns
    2. Be SPECIFIC, not generic (e.g. don't say "communication issues", say "You escalate when he withdraws")
    3. Connect insights to their MRI metrics (e.g. if Betrayal Vulnerability is high, mention trust erosion)
    4. Make forecasts REALISTIC and based on their data
    5. Scripts must be EXACT phrases they can use verbatim`;

    const userPrompt = `
    ANALYZE THIS COUPLE:
    --- PROFILING DATA ---
    ${userProfile}
    --- MRI METRICS ---
    ${formattedMetrics}
    --- RAW ANSWERS ---
    ${formattedAnswers}
    --- INSTRUCTIONS ---
    Generate the 8-Chapter Report defined in your system prompt.
    `;

    const logEntry = await startAiLog(context, {
        action: "fullReport",
        model: model,
        prompt: userPrompt,
        sessionId: session.id
    });

    try {
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 16384, // Increased to 16k for comprehensive 8-chapter reports
            temperature: 0.7,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const usage = (msg as any).usage || { input_tokens: 0, output_tokens: 0 };
        const stopReason = (msg as any).stop_reason;

        // Check if response was truncated
        if (stopReason === 'max_tokens') {
            console.error("Full Report: AI response was truncated due to max_tokens limit");
            console.error("Output tokens used:", usage.output_tokens);
            throw new Error("AI response truncated - report too long for single generation. Consider breaking into smaller chunks.");
        }

        const content = msg.content[0];
        if (content.type === 'text') {
            // Extract JSON from response
            const firstBrace = content.text.indexOf('{');
            const lastBrace = content.text.lastIndexOf('}');

            if (firstBrace === -1 || lastBrace === -1) {
                console.error("Full Report: No JSON object found in response");
                console.error("Raw AI Response:", content.text);
                throw new Error("No JSON object found in AI response");
            }

            const jsonStr = content.text.substring(firstBrace, lastBrace + 1);

            let parsedJson;
            try {
                parsedJson = JSON.parse(jsonStr);
            } catch (parseError: any) {
                console.error("Full Report JSON Parse Error");
                console.error("Parse Error Message:", parseError.message);
                console.error("Raw JSON String (first 1000 chars):", jsonStr.substring(0, 1000));
                console.error("Raw JSON String (last 1000 chars):", jsonStr.substring(Math.max(0, jsonStr.length - 1000)));
                console.error("JSON String Length:", jsonStr.length);
                console.error("Full AI Response Length:", content.text.length);

                // Log to AI log for debugging
                await completeAiLog(context, logEntry?.id, {
                    duration: Date.now() - startTime,
                    status: "error",
                    error: `JSON Parse Error: ${parseError.message}`,
                    response: content.text.substring(0, 10000),
                    usage: usage,
                    model: model
                });

                throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
            }

            // SAVE TO DB
            await context.entities.TestSession.update({
                where: { id: session.id },
                data: { fullReport: parsedJson }
            });

            await completeAiLog(context, logEntry?.id, {
                duration: Date.now() - startTime,
                status: "success",
                response: jsonStr.substring(0, 10000),
                usage: usage,
                model: model
            });

            return { json: parsedJson };
        }
        throw new Error("Invalid AI response type");

    } catch (e: any) {
        console.error("Report Generation Failed", e);
        await completeAiLog(context, logEntry?.id, {
            duration: Date.now() - startTime,
            status: "error",
            error: e.message,
            model: model
        });
        throw new Error("Failed to generate report");
    }
};

// --- NEW: Quick Overview (Haiku Fast Model) ---

type GenerateQuickOverviewArgs = {
    sessionId: string;
};

type QuickOverviewResult = {
    json: any;
};

export const generateQuickOverview: GenerateFullReport<GenerateQuickOverviewArgs, QuickOverviewResult> = async (args, context) => {
    const startTime = Date.now();
    if (!args.sessionId) throw new Error('Session ID required');

    const session = await context.entities.TestSession.findUnique({
        where: { id: args.sessionId }
    });
    if (!session) throw new Error('Session not found');

    // CACHE HIT
    if (session.quickOverview && Object.keys(session.quickOverview as object).length > 0) {
        return { json: session.quickOverview };
    }

    const metrics = (session.advancedMetrics as Record<string, any>) || {};
    const configMetrics = METRICS_CONFIG as any[];
    const formattedMetrics = configMetrics.map((m: any) => `${m.title}: ${metrics[m.id]}`).join("\n");

    const userProfile = `
    - Status: ${session.relationshipStatus}
    - Duration: ${session.relationshipDuration}
    - Conflict Freq: ${session.fightFrequency}
    - Biggest Fear: "${session.biggestFear}"
    `;

    const model = process.env.ANTHROPIC_MODEL_FAST || 'claude-3-haiku-20240307';

    const systemPrompt = `You are an expert Relationship Psychologist. Provide a "Quick Overview" of the relationship based on the metrics. 
    OUTPUT INSTRUCTIONS:
    - You must output VALID JSON only.
    - No Markdown. No introductory text. No "Here is the JSON".
    - Structure:
    {
      "hero": { "headline": "string", "result_badge": "string" },
      "pulse": { "summary": "string" }
    }`;

    // Note: We use the system prompt variable now
    const userPrompt = `User Profile: ${userProfile} ... MRI Metrics: ${formattedMetrics}`;

    const logEntry = await startAiLog(context, {
        action: "quickOverview",
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
            } catch (parseError) {
                console.error("QuickOverview JSON Parse Error. Raw Text:", content.text);
                throw parseError;
            }

            // SAVE TO DB
            await context.entities.TestSession.update({
                where: { id: session.id },
                data: { quickOverview: parsedJson }
            });

            await completeAiLog(context, logEntry?.id, {
                duration: Date.now() - startTime,
                status: "success",
                response: content.text,
                usage: usage,
                model: model
            });

            return { json: parsedJson };
        }
        throw new Error("Invalid AI response type");

    } catch (e: any) {
        console.error("Quick Overview Failed", e);
        await completeAiLog(context, logEntry?.id, {
            duration: Date.now() - startTime,
            status: "error",
            error: e.message,
            model: model
        });
        throw new Error("Failed to generate quick overview");
    }
};
