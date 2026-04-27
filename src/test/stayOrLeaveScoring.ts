import {
  STAY_OR_LEAVE_QUESTIONS,
  SOL_DIMENSIONS,
  type SoLDimension,
  type SoLQuestion,
} from "./stayOrLeaveQuestions";

export type SoLAnswers = Record<number, number>; // questionId -> 1..5

export type SoLVerdict = "worth_saving" | "high_risk" | "time_to_leave";
export type SoLRecommendation = "keep_working_on_it" | "be_careful" | "leave";
// The product is called "Stay or Leave Test". After all the analysis we owe
// the user a binary answer. This is that answer — derived from the scores,
// not from the AI. Deterministic, defensible.
export type SoLFinalAnswer = "stay" | "leave";

export type SoLScores = Record<SoLDimension, number>; // 0..100, higher = healthier

export interface SoLResult {
  scores: SoLScores;
  overall: number;
  verdict: SoLVerdict;
  recommendation: SoLRecommendation;
  finalAnswer: SoLFinalAnswer;
  weakestDimension: SoLDimension;
  strongestDimension: SoLDimension;
}

// Convert a single Likert answer to a 0-100 health score, handling reverse-coded items.
function answerToHealthScore(answer: number, question: SoLQuestion): number {
  const clamped = Math.min(5, Math.max(1, answer));
  const raw = question.reverse ? 6 - clamped : clamped;
  return ((raw - 1) / 4) * 100;
}

export function computeSoLScores(answers: SoLAnswers): SoLScores {
  const sums: Record<SoLDimension, { total: number; count: number }> = {
    trust: { total: 0, count: 0 },
    respect: { total: 0, count: 0 },
    emotional_safety: { total: 0, count: 0 },
    communication: { total: 0, count: 0 },
    honesty: { total: 0, count: 0 },
    change_over_time: { total: 0, count: 0 },
  };

  for (const q of STAY_OR_LEAVE_QUESTIONS) {
    const a = answers[q.id];
    if (typeof a !== "number") continue;
    sums[q.dimension].total += answerToHealthScore(a, q);
    sums[q.dimension].count += 1;
  }

  const scores = {} as SoLScores;
  for (const d of SOL_DIMENSIONS) {
    const { total, count } = sums[d];
    scores[d] = count === 0 ? 0 : Math.round(total / count);
  }
  return scores;
}

// Verdict thresholds:
//   - any single dimension < 25  OR  overall < 40         -> time_to_leave
//   - overall 40..69                                       -> high_risk
//   - overall >= 70                                        -> worth_saving
export function computeVerdict(scores: SoLScores): {
  verdict: SoLVerdict;
  recommendation: SoLRecommendation;
  overall: number;
} {
  const dimensionValues = SOL_DIMENSIONS.map((d) => scores[d]);
  const overall = Math.round(
    dimensionValues.reduce((sum, v) => sum + v, 0) / dimensionValues.length,
  );
  const minDim = Math.min(...dimensionValues);

  let verdict: SoLVerdict;
  if (minDim < 25 || overall < 40) {
    verdict = "time_to_leave";
  } else if (overall < 70) {
    verdict = "high_risk";
  } else {
    verdict = "worth_saving";
  }

  const recommendation: SoLRecommendation =
    verdict === "worth_saving"
      ? "keep_working_on_it"
      : verdict === "high_risk"
        ? "be_careful"
        : "leave";

  return { verdict, recommendation, overall };
}

// The binary "Stay or Leave" answer — what the product literally promises.
// Derived deterministically from scores + verdict so the AI cannot disagree.
//
// Rules:
//   verdict = worth_saving                       -> stay (always)
//   verdict = time_to_leave                      -> leave (always)
//   verdict = high_risk:
//     - if any single dimension <= 35            -> leave (red flag in a critical area)
//     - else if overall >= 55                    -> stay (recoverable territory)
//     - else (overall 40-54, no red flag)        -> leave (default to honest hard answer)
export function computeFinalAnswer(scores: SoLScores, verdict: SoLVerdict, overall: number): SoLFinalAnswer {
  if (verdict === "worth_saving") return "stay";
  if (verdict === "time_to_leave") return "leave";

  const minDim = Math.min(...SOL_DIMENSIONS.map((d) => scores[d]));
  if (minDim <= 35) return "leave";
  if (overall >= 55) return "stay";
  return "leave";
}

export function computeSoLResult(answers: SoLAnswers): SoLResult {
  const scores = computeSoLScores(answers);
  const { verdict, recommendation, overall } = computeVerdict(scores);
  const finalAnswer = computeFinalAnswer(scores, verdict, overall);

  let weakestDimension: SoLDimension = SOL_DIMENSIONS[0];
  let strongestDimension: SoLDimension = SOL_DIMENSIONS[0];
  for (const d of SOL_DIMENSIONS) {
    if (scores[d] < scores[weakestDimension]) weakestDimension = d;
    if (scores[d] > scores[strongestDimension]) strongestDimension = d;
  }

  return {
    scores,
    overall,
    verdict,
    recommendation,
    finalAnswer,
    weakestDimension,
    strongestDimension,
  };
}

// Display helpers
export const SOL_VERDICT_LABELS: Record<SoLVerdict, string> = {
  worth_saving: "Worth Saving",
  high_risk: "High Risk",
  time_to_leave: "Time to Leave",
};

export const SOL_RECOMMENDATION_LABELS: Record<SoLRecommendation, string> = {
  keep_working_on_it: "Keep Working On It",
  be_careful: "Be Careful",
  leave: "Leave",
};

export const SOL_FINAL_ANSWER_LABELS: Record<SoLFinalAnswer, string> = {
  stay: "STAY",
  leave: "LEAVE",
};

// Bridge lines that resolve the verdict-vs-final-answer cognitive dissonance.
// Specifically: "High Risk + STAY" must not feel like contradiction, and
// "High Risk + LEAVE" must not feel like a death sentence.
export function getBridgeLine(verdict: SoLVerdict, finalAnswer: SoLFinalAnswer): string {
  const key = `${verdict}__${finalAnswer}`;
  switch (key) {
    case "worth_saving__stay":
      return "The data confirms what you came here for: this is fixable. The foundation is still real.";
    case "high_risk__stay":
      return "Yes, you are in difficult territory. And yes, the data still says stay. What is broken is fixable. What is whole is still real. The full reasoning explains both.";
    case "high_risk__leave":
      return "This is not a death sentence on your relationship. It is a trajectory call. The data says recovery odds from where you stand today are low. The full reasoning shows you why — and what you would actually be choosing.";
    case "time_to_leave__leave":
      return "You did not need a test to feel this. The numbers confirm what you have been carrying. The full reasoning shows the specific reasons — and what comes next.";
    default:
      // Defensive: shouldn't happen given the algorithm, but never crash.
      return "The full reasoning is in the assessment below.";
  }
}
