const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'server', 'ai.ts');

const newCode = `

// ============================================================================
// --- V2: MULTI-STAGE PARALLEL FULL REPORT GENERATION ---
// ============================================================================

export const prepareContext = (session: any) => {
    const answers = (session.answers as Record<string, any>) || {};
    const questions = require('../test/testConfig.js').TEST_CONFIG.questions as any[];
    const answerOptions = require('../test/testConfig.js').TEST_CONFIG.answerOptions as any[];

    const formattedAnswers = questions.map((q) => {
        const a = answers[q.id];
        if (!a) return null;
        const option = answerOptions.find((o) => o.id === a.answerId);
        return \`Q: "\${q.text}" -> A: "\${option?.text}" (Score: \${a.score})\`;
    }).filter(Boolean).join("\\n");

    const metrics = (session.advancedMetrics as Record<string, any>) || {};
    const configMetrics = require('../test/metricsConfig.js').METRICS_CONFIG as any[];

    const formattedMetrics = configMetrics.map((m: any) => {
        const val = metrics[m.id];
        return \`\${m.title}: \${val}\`;
    }).join("\\n");

    const userProfile = \`
    - Status: \${session.relationshipStatus}
    - Duration: \${session.relationshipDuration}
    - Conflict Freq: \${session.fightFrequency}
    - Repair Freq: \${session.repairFrequency}
    - Partner Style: \${session.partnerConflictStyle}
    - Biggest Fear: "\${session.biggestFear}"
    - Conflict Story: "\${session.conflictDescription || 'N/A'}"
    \`;

    return { formattedAnswers, formattedMetrics, userProfile };
};


// --- PROMPTS ---

const systemPromptPart1 = \`You are an expert Relationship Psychologist.
MISSION: Generate Phase 1 (Core Diagnosis) of the Relationship MRI Report.
OUTPUT FORMAT: VALID JSON ONLY. ESCAPE ALL DOUBLE QUOTES. No markdown.

JSON STRUCTURE:
{
  "chapter1_pulse": {
    "headline": "One punchy sentence summarizing the state",
    "summary": "One clinical sentence about overall health",
    "health_score": "NUMBER 0-100",
    "primary_diagnosis": "A specific label for the relationship's core issue",
    "action_priority": "The #1 dimension that needs immediate attention",
    "breakup_probability": "Low|Medium|High|Critical",
    "silent_killer": "The specific interaction pattern causing the decline",
    "timeline": {
        "year_1": "What happens in 12 months if nothing changes",
        "year_3": "What happens in 3 years",
        "year_5": "What happens in 5 years"
    },
    "short_term_forecast": "What will happen in 6 months if nothing changes (2-3 sentences)",
    "long_term_forecast": "What will happen in 5 years if nothing changes (2-3 sentences)",
    "dimensions": {
      "communication": { "score": NUMBER, "status": "Low|Medium|High" },
      "emotional_safety": { "score": NUMBER, "status": "Low|Medium|High" },
      "intimacy": { "score": NUMBER, "status": "Low|Medium|High|Critical" },
      "fairness": { "score": NUMBER, "status": "Low|Medium|High" },
      "shared_future": { "score": NUMBER, "status": "Low|Medium|High" }
    }
  },
  "multivariate_signature": {
    "pattern_name": "Unique 2-3 word name for their exact dynamic",
    "core_insight": "1-2 sentences on their deepest shared dynamic",
    "hidden_mechanism": "What is secretly driving their conflict"
  }
}\`;

const systemPromptPart2 = \`You are an expert Relationship Psychologist.
MISSION: Generate Phase 2 (Chapters 2-4) of the Relationship MRI Report.
CRITICAL: Align completely with the PRIMARY DIAGNOSIS provided in the prompt.
OUTPUT FORMAT: VALID JSON ONLY. ESCAPE ALL DOUBLE QUOTES. No markdown.

JSON STRUCTURE:
{
  "chapter2_communication": {
    "conflict_style": "Label their conflict pattern in 2-4 words",
    "teaser": "1-2 sentences that name the pattern and create curiosity",
    "metric_insight": "Connect to their Repair Efficiency metric",
    "repeat_loop": ["Sentence 1: exact loop", "Sentence 2: why apologies fail"],
    "repair_efficiency": "One insight about their repair attempts",
    "deep_dive": "3-4 sentences detailing the complete cycle",
    "why_repairs_fail": "2-3 sentences explaining why prepairs fail",
    "specific_triggers": ["Trigger 1 based on data", "Trigger 2", "Trigger 3"],
    "impact_on_other_dimensions": "2-3 sentences connecting this to another dimension"
  },
  "chapter3_security": {
    "anxiety_hypervigilance": "Rate their anxiety level",
    "teaser": "1-2 sentences about their core fear",
    "metric_insight": "Connect to Betrayal Vulnerability metric",
    "silent_secret": "Name their deepest unspoken fear",
    "deep_dive": "3-4 sentences about their anxiety pattern",
    "trust_erosion_pattern": "2-3 sentences explaining how trust erodes",
    "hypervigilance_triggers": ["Trigger 1", "Trigger 2", "Trigger 3"],
    "impact_on_daily_life": "2-3 sentences about how this shows up daily"
  },
  "chapter4_erotic": {
    "roommate_risk": "Rate the roommate risk",
    "teaser": "1-2 sentences about what's blocking intimacy",
    "metric_insight": "Connect to Erotic Death Spiral metric",
    "desire_gap": "Explain the ROOT CAUSE of low desire",
    "deep_dive": "3-4 sentences about desire mechanics",
    "desire_mechanics": "2-3 sentences explaining the psychological block",
    "specific_blockers": ["Blocker 1", "Blocker 2", "Blocker 3"],
    "polarity_analysis": "2-3 sentences about erotic polarity"
  }
}\`;

const systemPromptPart3 = \`You are an expert Relationship Psychologist.
MISSION: Generate Phase 3 (Chapters 5-8) of the Relationship MRI Report.
CRITICAL: Align completely with the PRIMARY DIAGNOSIS provided in the prompt.
OUTPUT FORMAT: VALID JSON ONLY. ESCAPE ALL DOUBLE QUOTES. No markdown.

JSON STRUCTURE:
{
  "chapter5_balance": {
    "teaser": "1-2 sentences about power imbalance",
    "metric_insight": "Connect to CEO vs Intern metric",
    "parent_child_dynamic": "Describe the power imbalance",
    "deep_dive": "3-4 sentences about the dynamic",
    "mental_load_breakdown": "2-3 sentences explaining mental load",
    "resentment_pattern": "2-3 sentences about how resentment builds",
    "impact_on_attraction": "2-3 sentences connecting to desire"
  },
  "chapter6_compass": {
    "teaser": "1-2 sentences about their alignment",
    "metric_insight": "Connect to Soulmate Sync metric",
    "existential_alignment": "Do they want the same future?",
    "detachment_warning": "If friction is eroding the vision, warn them",
    "deep_dive": "3-4 sentences about vision alignment",
    "vision_compatibility": "2-3 sentences about what they agree on",
    "dream_erosion": "2-3 sentences about how dreams fade",
    "trajectory_warning": "2-3 sentences about future risk"
  },
  "chapter7_synthesis": {
    "connection_1": "Connect TWO dimensions (2-3 sentences)",
    "connection_2": "Connect TWO other dimensions (2-3 sentences)"
  },
  "chapter8_roadmap": {
    "stop_doing": ["Stop [behavior 1]", "Stop [behavior 2]", "Stop [behavior 3]"],
    "scripts": ["Script 1: Exact phrase", "Script 2: Exact phrase"],
    "calendar": "Week 1: [action]. Week 2: [action]. Week 3: [action]. Week 4: [action]."
  }
}\`;

// --- RUNNERS ---

const runAiTask = async (
    name: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
    context: any,
    sessionId: string
) => {
    const startTime = Date.now();
    
    // We can't access startAiLog directly if it's not exported, so we just construct the fetch directly if needed.
    // However, startAiLog is top-level in ai.ts so it will be available to this appended code.

    // I will inline the usage of startAiLog since it's already in ai.ts context.
    
    let logEntry;
    try {
        logEntry = await context.entities.AiLog.create({
            data: {
                action: \`fullReportV2_\${name}\`,
                model: model,
                status: 'pending',
                requestPrompt: userPrompt.substring(0, 5000),
                sessionId: sessionId,
                duration: 0
            }
        });
    } catch(e) { console.error(e); }

    try {
        const AnthropicSdk = require('@anthropic-ai/sdk').default;
        const anthropicClient = new AnthropicSdk({
            apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_for_build',
        });

        const msg = await anthropicClient.messages.create({
            model,
            max_tokens: 4000,
            temperature: 0.7,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }]
        });

        const usage = (msg as any).usage || { input_tokens: 0, output_tokens: 0 };
        const content = msg.content[0];

        if (content.type !== 'text') throw new Error("Invalid AI response type");

        let jsonStr = content.text;
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        const parsed = JSON.parse(jsonStr);

        try {
            await context.entities.AiLog.update({
                where: { id: logEntry?.id },
                data: {
                    duration: (Date.now() - startTime) / 1000,
                    status: "success",
                    response: jsonStr.substring(0, 10000),
                    tokensUsed: usage.input_tokens + usage.output_tokens,
                    inputTokens: usage.input_tokens,
                    outputTokens: usage.output_tokens
                }
            });
        } catch(e) {}

        return parsed;
    } catch (e: any) {
        try {
            await context.entities.AiLog.update({
                where: { id: logEntry?.id },
                data: {
                    duration: (Date.now() - startTime) / 1000,
                    status: "error",
                    errorMessage: e.message
                }
            });
        } catch(e) {}
        throw new Error(\`\${name} Failed: \${e.message}\`);
    }
};

const runPart1 = async (model: string, sysPrompt: string, profile: string, metrics: string, ctx: any, sId: string) => {
    const user = \`PROFILE:\\n\${profile}\\n\\nMETRICS:\\n\${metrics}\`;
    return runAiTask("part1", model, sysPrompt, user, ctx, sId);
};

const runPart2 = async (model: string, sysPrompt: string, profile: string, metrics: string, answers: string, part1Ctx: string, ctx: any, sId: string) => {
    const user = \`CORE DIAGNOSIS TO ALIGN WITH:\\n\${part1Ctx}\\n\\nPROFILE:\\n\${profile}\\n\\nMETRICS:\\n\${metrics}\\n\\nANSWERS:\\n\${answers}\`;
    return runAiTask("part2", model, sysPrompt, user, ctx, sId);
};

const runPart3 = async (model: string, sysPrompt: string, profile: string, answers: string, part1Ctx: string, ctx: any, sId: string) => {
    const user = \`CORE DIAGNOSIS TO ALIGN WITH:\\n\${part1Ctx}\\n\\nPROFILE:\\n\${profile}\\n\\nANSWERS:\\n\${answers}\`;
    return runAiTask("part3", model, sysPrompt, user, ctx, sId);
};

// --- MAIN WRAPPER ---
import { GenerateFullReport } from 'wasp/server/operations';

export const generateFullReportV2: GenerateFullReport<any, any> = async (args, context) => {
    const startTime = Date.now();
    if (!args.sessionId) throw new Error('Session ID required');

    const session = await context.entities.TestSession.findUnique({
        where: { id: args.sessionId }
    });
    if (!session) throw new Error('Session not found');

    // Cache check
    if (session.fullReportV2 && Object.keys(session.fullReportV2 as object).length > 0) {
        return { json: session.fullReportV2 };
    }

    const { formattedAnswers, formattedMetrics, userProfile } = prepareContext(session);

    const fastModel = process.env.ANTHROPIC_MODEL_FAST || 'claude-3-haiku-20240307';
    const smartModel = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';

    // PART 1
    console.log("[generateFullReportV2] Starting Part 1...");
    const part1Result = await runPart1(fastModel, systemPromptPart1, userProfile, formattedMetrics, context, session.id);

    const part1Context = \`
    PRIMARY DIAGNOSIS: \${part1Result.chapter1_pulse?.primary_diagnosis}
    HEALTH SCORE: \${part1Result.chapter1_pulse?.health_score}
    MULTIVARIATE SIGNATURE: \${part1Result.multivariate_signature?.pattern_name}
    CORE INSIGHT: \${part1Result.multivariate_signature?.core_insight}
    HIDDEN MECHANISM: \${part1Result.multivariate_signature?.hidden_mechanism}
    \`;

    // PART 2 & 3 (Parallel)
    console.log("[generateFullReportV2] Starting Part 2 & 3 in parallel...");
    const [part2Result, part3Result] = await Promise.all([
        runPart2(smartModel, systemPromptPart2, userProfile, formattedMetrics, formattedAnswers, part1Context, context, session.id),
        runPart3(smartModel, systemPromptPart3, userProfile, formattedAnswers, part1Context, context, session.id)
    ]);

    // Aggregate
    const fullReportV2 = {
        ...part1Result,
        ...part2Result,
        ...part3Result
    };

    console.log("[generateFullReportV2] Completed. Saving to DB.");
    await context.entities.TestSession.update({
        where: { id: session.id },
        data: { fullReportV2 }
    });

    return { json: fullReportV2 };
};

`;

fs.appendFileSync(targetFile, newCode);
console.log('Appended successfully');
