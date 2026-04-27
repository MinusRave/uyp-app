import Anthropic from "@anthropic-ai/sdk";
import {
  STAY_OR_LEAVE_QUESTIONS,
  SOL_DIMENSIONS,
  SOL_DIMENSION_LABELS,
  type SoLDimension,
} from "../test/stayOrLeaveQuestions";
import {
  SOL_VERDICT_LABELS,
  SOL_RECOMMENDATION_LABELS,
  SOL_FINAL_ANSWER_LABELS,
  type SoLAnswers,
  type SoLResult,
  type SoLVerdict,
  type SoLRecommendation,
} from "../test/stayOrLeaveScoring";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy_key_for_build",
});

const SONNET_MODEL = process.env.ANTHROPIC_SONNET_MODEL || "claude-sonnet-4-6";
const HAIKU_MODEL = process.env.ANTHROPIC_HAIKU_MODEL || "claude-haiku-4-5-20251001";

// ============================================================================
// Shared prompt scaffolding
// ============================================================================

const TONE_RULES = `
WRITING RULES (these are non-negotiable):
- 4th grade English. Short sentences. Simple words.
- No psychology jargon. No "attachment style", "emotional regulation", "Cluster B".
- Direct. Calm. Serious. Not soft. Not mean.
- Reference what the person actually said in their answers.
- Do not start sentences with "I want you to know" or "It's important to remember".
- Do not say "based on your answers" — just say what you see.
`.trim();

function formatAnswersForPrompt(answers: SoLAnswers): string {
  const labelsByValue: Record<number, string> = {
    1: "strongly disagree",
    2: "disagree",
    3: "neutral",
    4: "agree",
    5: "strongly agree",
  };
  return STAY_OR_LEAVE_QUESTIONS.map((q) => {
    const ans = answers[q.id];
    const ansLabel = typeof ans === "number" ? `${ans} (${labelsByValue[ans] ?? "?"})` : "no answer";
    const reverseTag = q.reverse ? " [agree = unhealthy]" : "";
    return `Q${q.id} [${q.dimension}]${reverseTag}: "${q.text}" — answered ${ansLabel}`;
  }).join("\n");
}

function formatScores(result: SoLResult): string {
  return SOL_DIMENSIONS.map(
    (d) => `- ${SOL_DIMENSION_LABELS[d]}: ${result.scores[d]}/100`,
  ).join("\n");
}

// ============================================================================
// Pre-payment: small Haiku call for the personalized verdict line
// Shown above the sales-page CTA. Caches on stayOrLeaveData.verdictLine.
// ============================================================================

export async function generateVerdictLine(
  answers: SoLAnswers,
  result: SoLResult,
): Promise<{ text: string; usage: { input_tokens: number; output_tokens: number }; model: string }> {
  const verdictLabel = SOL_VERDICT_LABELS[result.verdict];
  const finalAnswerLabel = SOL_FINAL_ANSWER_LABELS[result.finalAnswer];

  const prompt = `
A person just finished a relationship test that helps them decide if they should stay with their partner or leave.

Their final verdict: ${verdictLabel}
Their binary final answer: ${finalAnswerLabel}
Their overall score: ${result.overall}/100

Their dimension scores:
${formatScores(result)}

Their answers (1 = strongly disagree, 5 = strongly agree):
${formatAnswersForPrompt(answers)}

YOUR TASK
Write 2 to 3 short sentences that tell them their verdict in plain English. Use one or two specific things they said as evidence. Do not list scores. Do not give a plan. Just name the verdict and one or two real reasons.

The binary answer is ${finalAnswerLabel}. You do NOT need to use that word in this short copy — it will be shown right next to your sentence.

${TONE_RULES}

Output ONLY the 2-3 sentences. No preamble. No markdown. No quotes around the answer.

Example shape (do not copy the words):
"Your verdict is High Risk. You said you walk on eggshells and that the same fight keeps coming back. Those two together are the reason."
`.trim();

  const msg = await anthropic.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 250,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return {
    text,
    usage: { input_tokens: msg.usage.input_tokens, output_tokens: msg.usage.output_tokens },
    model: HAIKU_MODEL,
  };
}

// ============================================================================
// Post-payment: 3 parallel Sonnet calls for the full assessment
// ============================================================================

// Index signature is required so this type is assignable to SuperJSONObject
// (Wasp serializes operation return values through SuperJSON).
export interface SoLAiCommentary {
  opening: string;
  dimensions: { [k: string]: string };
  personalizedInsight: string;
  forecast: string;
  actionPlan: {
    week1: string;
    week2: string;
    week3: string;
    week4: string;
  };
  closing: string;
  [key: string]: any;
}

interface CallUsage {
  input_tokens: number;
  output_tokens: number;
  model: string;
}

// --- Call 1: per-dimension explanations (one structured-JSON call covering all 6) ---
async function generateDimensionExplanations(
  answers: SoLAnswers,
  result: SoLResult,
): Promise<{ data: Record<SoLDimension, string>; usage: CallUsage }> {
  const prompt = `
A person just finished a relationship test. You are writing the dimension-by-dimension breakdown of their assessment.

Final verdict: ${SOL_VERDICT_LABELS[result.verdict]}
Recommendation: ${SOL_RECOMMENDATION_LABELS[result.recommendation]}
Overall: ${result.overall}/100

Dimension scores:
${formatScores(result)}

All their answers:
${formatAnswersForPrompt(answers)}

YOUR TASK
For EACH of the 6 dimensions, write one paragraph (3 to 5 sentences) that:
- Names where they stand on this dimension.
- References at least one specific thing they said for THIS dimension.
- Says what the score means for their relationship.
- Does not give advice yet. Just explains.

${TONE_RULES}

Return a JSON object with these exact keys: "trust", "respect", "emotional_safety", "communication", "honesty", "change_over_time". The value of each key is the paragraph as a single string. No nested objects. No extra keys. No markdown. Just JSON.
`.trim();

  const msg = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 2500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const data = parseJsonStrict<Record<SoLDimension, string>>(text);

  return {
    data,
    usage: {
      input_tokens: msg.usage.input_tokens,
      output_tokens: msg.usage.output_tokens,
      model: SONNET_MODEL,
    },
  };
}

// --- Call 2: personalized insight (the deeper "what's really going on") ---
async function generatePersonalizedInsight(
  answers: SoLAnswers,
  result: SoLResult,
): Promise<{ text: string; usage: CallUsage }> {
  const prompt = `
A person just finished a relationship test. You are writing their personalized insight section. This is the part they paid to read.

Final verdict: ${SOL_VERDICT_LABELS[result.verdict]}
Recommendation: ${SOL_RECOMMENDATION_LABELS[result.recommendation]}
Weakest dimension: ${SOL_DIMENSION_LABELS[result.weakestDimension]} (${result.scores[result.weakestDimension]}/100)
Strongest dimension: ${SOL_DIMENSION_LABELS[result.strongestDimension]} (${result.scores[result.strongestDimension]}/100)

All their answers:
${formatAnswersForPrompt(answers)}

YOUR TASK
Write 2 to 3 short paragraphs that name the real story under their numbers. Look at:
- Where their weakest dimension hurts the most in their day-to-day.
- Any contradictions (e.g. they say they trust the partner but also check the phone).
- The pattern across what they said, not just one answer.

Write to them, not about them. Use "you" and "your".

${TONE_RULES}

Output the 2-3 paragraphs as plain text. Separate paragraphs with a blank line. No headings. No markdown. No JSON.
`.trim();

  const msg = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return {
    text,
    usage: {
      input_tokens: msg.usage.input_tokens,
      output_tokens: msg.usage.output_tokens,
      model: SONNET_MODEL,
    },
  };
}

// --- Call 3: opening + forecast + 4-week action plan + closing ---
async function generateOpeningForecastPlanAndClosing(
  answers: SoLAnswers,
  result: SoLResult,
): Promise<{
  data: {
    opening: string;
    forecast: string;
    actionPlan: { week1: string; week2: string; week3: string; week4: string };
    closing: string;
  };
  usage: CallUsage;
}> {
  const finalAnswerLabel = SOL_FINAL_ANSWER_LABELS[result.finalAnswer];

  const prompt = `
A person just finished a relationship test and paid $13.90 for their full assessment. You are writing the opening, the forecast, the 4-week action plan, and the closing of their report.

Final verdict: ${SOL_VERDICT_LABELS[result.verdict]}
Recommendation: ${SOL_RECOMMENDATION_LABELS[result.recommendation]}
BINARY FINAL ANSWER: ${finalAnswerLabel}
Overall: ${result.overall}/100
Weakest dimension: ${SOL_DIMENSION_LABELS[result.weakestDimension]} (${result.scores[result.weakestDimension]}/100)
Strongest dimension: ${SOL_DIMENSION_LABELS[result.strongestDimension]} (${result.scores[result.strongestDimension]}/100)

Dimension scores:
${formatScores(result)}

All their answers:
${formatAnswersForPrompt(answers)}

THE BINARY ANSWER IS ${finalAnswerLabel}. THIS IS NON-NEGOTIABLE.
The product is called "Stay or Leave Test". The user paid for a clear answer. The math says ${finalAnswerLabel}. Your job is to explain WHY, not to soften it or hedge it.

Use the word "${finalAnswerLabel}" explicitly in the OPENING and the CLOSING. Do not invert it. Do not add caveats like "but only you can decide" — there will be a separate disclaimer for that. Your job is the data-backed answer.

CRITICAL — HOW TO HANDLE THE VERDICT-vs-FINAL-ANSWER COMBO:
The user sees both their verdict (${SOL_VERDICT_LABELS[result.verdict]}) and the binary final answer (${finalAnswerLabel}). These two together can feel contradictory if you don't handle the framing right. Read the rule for THIS specific combo carefully:

${
  result.verdict === "high_risk" && result.finalAnswer === "stay"
    ? `THIS COMBO: High Risk + STAY.
Frame: "High Risk" describes the CURRENT STATE. "Stay" describes the BEST PATH FORWARD. They are not contradictory.
Do: explain that what is broken is fixable AND what is whole is still real. Both are true at the same time.
Do NOT: write as if everything is fine ("don't worry, you're great!" — this is gaslighting given their scores).
Do NOT: catastrophize ("things are bad, run!" — wrong, the data says stay-and-work).`
    : result.verdict === "high_risk" && result.finalAnswer === "leave"
    ? `THIS COMBO: High Risk + LEAVE.
Frame: This is a TRAJECTORY CALL, not a death sentence on their relationship. Recovery odds from where they stand today are low — that is a different statement than "your relationship was always doomed."
Do: explain the specific reason recovery odds are low (cite their weakest dimensions, the contradiction in their answers, etc.).
Do NOT: write as if the relationship was doomed from the start. They had a chance once. The data says they don't have one now from this position.
Do NOT: tell them to "leave him/her" as imperative. Tell them what the DATA shows, and what the TRAJECTORY looks like if they stay.`
    : result.verdict === "worth_saving" && result.finalAnswer === "stay"
    ? `THIS COMBO: Worth Saving + STAY.
Frame: The verdict and final answer agree. Confirm without being smug. They came here because something is off — that is real. The data says it is fixable, not that it is fine.
Do: validate their concern AND confirm the foundation.
Do NOT: write as if there's nothing wrong. They scored Worth Saving, not Perfect.`
    : `THIS COMBO: Time to Leave + LEAVE.
Frame: The verdict and final answer agree. The user came here suspecting this. The numbers confirm it. Do not be cruel, but do not soften either.
Do: validate the long arc of what they have been carrying. Reference their specific answers that prove it is not in their head.
Do NOT: be preachy about leaving. State what the data says and let it stand.`
}

CRITICAL TONE — READ TWICE
This is a Professional Decision Tool. We are NOT timid. We are NOT a fortune cookie. We give a real verdict, a real forecast, and a real 4-week plan.

Be like a competent doctor: confident on the data, prescriptive on the steps, honest about probability (not prophecy). Examples:

GOOD doctor tone:
"Your trust score is 35. You said you check their phone. That is the trust break, in one sentence."
"Couples in this score range typically reach Time to Leave within 12-18 months without intervention. About 60% drop further. About 30% stabilize but stay miserable. About 10% pull out — but only when they act in the next 90 days."
"Week 1: Stop checking their phone. Every check confirms the break."

BAD timid tone (do NOT do):
"You might possibly want to consider that there could be some trust concerns."
"The future is uncertain and depends on many factors."
"It might be helpful to perhaps think about reducing phone checking."

Hard rules:
- Never use: "might", "could be", "possibly", "perhaps", "you may want to consider"
- Never tell them WHAT to decide ("leave him", "stay"). Tell them what the DATA says. The decision is theirs.
- Use specific numbers from their answers and their scores.
- The forecast names probabilities, not certainties. Say "typically", "roughly X%", "this score profile usually".
- The action plan is prescriptive. "Do X." "Stop Y." "On day Z." Not "you might try".
- Reference the user's actual answers. Show them you read what they said.

YOUR TASK
Write four pieces:

1. OPENING (2 short paragraphs)
Paragraph 1: name what the test showed in plain language. Be direct.
Paragraph 2: tell them what they will read — opening, scores, story, forecast, 4-week plan, recommendation.

2. FORECAST (2-3 short paragraphs)
The realistic 12-18 month trajectory if nothing changes. Use probabilistic language ("typically", "roughly X%"). Give the range of outcomes (best/middle/worst). Tie the forecast to their specific weakest dimensions. End with the trigger condition that flips the trajectory ("the one thing that changes this").

3. ACTION PLAN — 4 weeks, 1 specific action per week
Each week: 2-3 short sentences. Concrete and prescriptive. Tied to their weakest dimension or to the contradiction in their answers. Each week builds on the previous.
- Week 1: a stop-doing or start-doing action they can execute today
- Week 2: a conversation or measurement step
- Week 3: a behavior change with a tracking element
- Week 4: a reassessment or escalation step

4. CLOSING (2 short paragraphs)
Paragraph 1: state the binary answer explicitly. Open with "The data says: ${finalAnswerLabel}." Then 2-3 sentences explaining why, tied to their specific answers.
Paragraph 2: a short, calm note about agency. The data is clear; the choice is theirs. No therapy claim. No legal claim.

${TONE_RULES}

Return STRICT JSON with this exact shape (no extra keys, no markdown):
{
  "opening": "Paragraph 1.\\n\\nParagraph 2.",
  "forecast": "Paragraph 1.\\n\\nParagraph 2.\\n\\nParagraph 3.",
  "actionPlan": {
    "week1": "Week 1 actions...",
    "week2": "Week 2 actions...",
    "week3": "Week 3 actions...",
    "week4": "Week 4 actions..."
  },
  "closing": "Paragraph 1.\\n\\nParagraph 2."
}
`.trim();

  const msg = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const data = parseJsonStrict<{
    opening: string;
    forecast: string;
    actionPlan: { week1: string; week2: string; week3: string; week4: string };
    closing: string;
  }>(text);

  return {
    data,
    usage: {
      input_tokens: msg.usage.input_tokens,
      output_tokens: msg.usage.output_tokens,
      model: SONNET_MODEL,
    },
  };
}

export async function generateAssessment(
  answers: SoLAnswers,
  result: SoLResult,
): Promise<{ commentary: SoLAiCommentary; usages: CallUsage[] }> {
  const [dimensions, insight, openForecast] = await Promise.all([
    generateDimensionExplanations(answers, result),
    generatePersonalizedInsight(answers, result),
    generateOpeningForecastPlanAndClosing(answers, result),
  ]);

  const commentary: SoLAiCommentary = {
    opening: openForecast.data.opening,
    dimensions: dimensions.data,
    personalizedInsight: insight.text,
    forecast: openForecast.data.forecast,
    actionPlan: openForecast.data.actionPlan,
    closing: openForecast.data.closing,
  };

  return {
    commentary,
    usages: [dimensions.usage, insight.usage, openForecast.usage],
  };
}

// ============================================================================
// Helpers
// ============================================================================

// Strict JSON parse that tolerates Claude wrapping output in ```json fences or
// adding a leading explanation. Throws if no parseable JSON is found.
function parseJsonStrict<T>(raw: string): T {
  const trimmed = raw.trim();

  // Strip markdown code fences if present.
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = fenced ? fenced[1] : trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    // Last-ditch: find the first { ... } block.
    const match = candidate.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse JSON from Claude output: " + raw.slice(0, 200));
  }
}
