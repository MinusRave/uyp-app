
import Anthropic from '@anthropic-ai/sdk';
import { HttpError } from "wasp/server";

// We need to import the DB context type if possible, or use 'any' for now
// Reusing the client init from server/ai.ts would be ideal, but it's not exported.
// Let's create a new instance here or refactor server/ai.ts to export it. 
// For speed/safety, I'll instantiate it here with the same env var.

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

// --- HELPER: Logging (Simplified version of server/ai.ts) ---
// In a real refactor, we should export startAiLog from server/ai.ts
const logAiRequest = async (context: any, action: string, model: string, prompt: string, sessionId: string) => {
    try {
        return await context.entities.AiLog.create({
            data: {
                action,
                model,
                status: 'pending',
                requestPrompt: prompt.substring(0, 5000),
                sessionId,
                duration: 0
            }
        });
    } catch (e) {
        console.error("Failed to log AI request", e);
        return null; // Don't block flow
    }
};

const completeAiRequest = async (context: any, logId: string, data: any) => {
    if (!logId) return;
    try {
        await context.entities.AiLog.update({
            where: { id: logId },
            data: {
                duration: data.duration,
                status: data.status,
                response: data.response ? data.response.substring(0, 10000) : null,
                usage: data.usage,
                errorMessage: data.error
            }
        });
    } catch (e) {
        console.error("Failed to update AI log", e);
    }
};

type ToxicAnalysisInput = {
    toxicityScore: number;
    narcissismType: string;
    dangerLevel: string;
    tactics: string[];
    vulnerabilities: string[];
    barriers: string[];
    risks: string[];
    hasChildren: string;
    financialSituation: string;
    exitReadiness: string;
    exitTimeline: string;
    recommendedAction: string;
    relevantAnswers: Record<string, string>; // "Q1_gaslighting": "Answer text"
};

export type ToxicAnalysisResult = {
    executive_summary: string;
    tactical_profile: string;
    vulnerability_assessment: string;
    strategic_options: string;
    next_30_days: string;
};

export const generateToxicAnalysis = async (
    input: ToxicAnalysisInput,
    sessionId: string,
    context: any
): Promise<ToxicAnalysisResult> => {
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620';
    const startTime = Date.now();

    // 1. Construct the MEGA-PROMPT
    const prompt = `You are a men's relationship analyst creating a personalized toxic relationship assessment report.

SUBJECT DATA:
- Toxicity Score: ${input.toxicityScore}/100
- Narcissism Type: ${input.narcissismType}
- Danger Level: ${input.dangerLevel}
- Detected Tactics: ${input.tactics.join(", ")}
- His Vulnerabilities: ${input.vulnerabilities.join(", ")}
- Exit Barriers: ${input.barriers.join(", ")}
- Risk Factors: ${input.risks.join(", ")}
- Children: ${input.hasChildren}
- Financial Ties: ${input.financialSituation}
- Readiness: ${input.exitReadiness}
- Timeline: ${input.exitTimeline}
- Recommended Action: ${input.recommendedAction}

SPECIFIC QUIZ ANSWERS:
${Object.entries(input.relevantAnswers).map(([k, v]) => `- ${k}: "${v}"`).join("\n")}

TONE REQUIREMENTS:
- Direct, tactical, brother-to-brother
- No therapy-speak or empowerment language
- Use his specific examples from quiz
- Actionable insights only
- Honest, even if harsh

Generate these 5 sections in valid JSON format:
{
  "executive_summary": "3 paragraphs: What's happening, Why it works on him, Bottom line assessment. Max 250 words.",
  "tactical_profile": "Analyze top 3 manipulation tactics: How it works, Why she uses it, Pattern to watch. Max 300 words.",
  "vulnerability_assessment": "Why he's susceptible: Exploited traits, Weaponization, Examples. Max 250 words.",
  "strategic_options": "Based on danger level: Exit/Protect/Document steps. Numbered steps. Max 300 words.",
  "next_30_days": "Weekly action plan (Week 1-4). Concrete, actionable. Max 250 words."
}

CRITICAL:
- Use "she/her" for partner
- Use "you" for him
- Reference his specific quiz answers
- Stay under word limits
- JSON ONLY. NO MARKDOWN.
`;

    // 2. Log Start
    const logEntry = await logAiRequest(context, "generateToxicReport", model, prompt, sessionId);

    try {
        // 3. Call AI
        const msg = await anthropic.messages.create({
            model: model,
            max_tokens: 4000,
            temperature: 0.7,
            system: "You are a specialized analyst. Output valid JSON only.",
            messages: [{ role: "user", content: prompt }]
        });

        // 4. Parse Response
        const content = msg.content[0];
        if (content.type !== 'text') throw new Error("Invalid AI response type");

        let jsonStr = content.text;
        // Attempt to extract JSON if wrapped in markdown
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        const result = JSON.parse(jsonStr) as ToxicAnalysisResult;

        // 5. Log Success
        await completeAiRequest(context, logEntry?.id, {
            duration: Date.now() - startTime,
            status: "success",
            response: jsonStr,
            usage: (msg as any).usage
        });

        return result;

    } catch (e: any) {
        console.error("AI Generation Failed", e);
        // 6. Log Failure
        await completeAiRequest(context, logEntry?.id, {
            duration: Date.now() - startTime,
            status: "error",
            error: e.message
        });

        // Return fallback/error content so the user still gets a PDF even if AI fails
        return {
            executive_summary: "Analysis unavailable due to high demand. Please consult the raw scores.",
            tactical_profile: "Analysis unavailable.",
            vulnerability_assessment: "Analysis unavailable.",
            strategic_options: "Review the general safety guide.",
            next_30_days: "Focus on safety and documentation."
        };
    }
};
