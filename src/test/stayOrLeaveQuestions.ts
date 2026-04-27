export type SoLDimension =
  | "trust"
  | "respect"
  | "emotional_safety"
  | "communication"
  | "honesty"
  | "change_over_time";

export interface SoLQuestion {
  id: number;
  dimension: SoLDimension;
  text: string;
  reverse: boolean;
}

// 30 questions, 5 per dimension, interleaved so the user cannot guess what's next.
// Likert 1-5: 1 = strongly disagree, 5 = strongly agree.
// reverse: when true, agreement is unhealthy and the score is inverted before averaging.
export const STAY_OR_LEAVE_QUESTIONS: SoLQuestion[] = [
  { id: 1,  dimension: "trust",             text: "I believe my partner tells me the truth.",                                  reverse: false },
  { id: 2,  dimension: "respect",           text: "My partner treats me like an equal.",                                       reverse: false },
  { id: 3,  dimension: "emotional_safety",  text: "I can show my real feelings around my partner.",                            reverse: false },
  { id: 4,  dimension: "communication",     text: "We can talk about hard things without it turning into a fight.",            reverse: false },
  { id: 5,  dimension: "honesty",           text: "I have caught my partner in a lie.",                                        reverse: true  },
  { id: 6,  dimension: "change_over_time",  text: "Things have gotten worse over the last year.",                              reverse: true  },
  { id: 7,  dimension: "trust",             text: "I can count on my partner when things get hard.",                           reverse: false },
  { id: 8,  dimension: "emotional_safety",  text: "I feel like I have to walk on eggshells around my partner.",                reverse: true  },
  { id: 9,  dimension: "respect",           text: "My partner makes fun of me in a way that hurts.",                           reverse: true  },
  { id: 10, dimension: "honesty",           text: "My partner is open about money, plans, and other people in their life.",   reverse: false },
  { id: 11, dimension: "communication",     text: "The same fight comes up again and again with no fix.",                      reverse: true  },
  { id: 12, dimension: "change_over_time",  text: "We are better at fixing problems now than we used to be.",                  reverse: false },
  { id: 13, dimension: "trust",             text: "I check my partner's phone or messages because I do not trust them.",      reverse: true  },
  { id: 14, dimension: "communication",     text: "My partner hears me out before they react.",                                reverse: false },
  { id: 15, dimension: "respect",           text: "My partner listens when I talk about something that matters to me.",        reverse: false },
  { id: 16, dimension: "emotional_safety",  text: "I am scared of how my partner reacts when they are angry.",                 reverse: true  },
  { id: 17, dimension: "honesty",           text: "My partner says one thing and does another.",                               reverse: true  },
  { id: 18, dimension: "change_over_time",  text: "I miss who my partner used to be.",                                         reverse: true  },
  { id: 19, dimension: "trust",             text: "I worry my partner is hiding something from me.",                           reverse: true  },
  { id: 20, dimension: "respect",           text: "My partner puts me down in front of other people.",                         reverse: true  },
  { id: 21, dimension: "communication",     text: "When we fight, one of us stops talking for hours or days.",                 reverse: true  },
  { id: 22, dimension: "emotional_safety",  text: "I feel safe being myself with my partner.",                                 reverse: false },
  { id: 23, dimension: "honesty",           text: "I trust what my partner tells me about where they are and who they are with.", reverse: false },
  { id: 24, dimension: "change_over_time",  text: "My partner has worked on themselves over time.",                            reverse: false },
  { id: 25, dimension: "trust",             text: "My partner keeps the promises they make to me.",                            reverse: false },
  { id: 26, dimension: "respect",           text: "My partner respects my time and my needs.",                                 reverse: false },
  { id: 27, dimension: "emotional_safety",  text: "I keep things to myself to avoid a fight.",                                 reverse: true  },
  { id: 28, dimension: "communication",     text: "We say sorry when one of us hurts the other.",                              reverse: false },
  { id: 29, dimension: "honesty",           text: "My partner has hidden things from me and I found out later.",               reverse: true  },
  { id: 30, dimension: "change_over_time",  text: "I have changed who I am to keep the peace.",                                reverse: true  },
];

// The email gate is shown after this question (halfway point).
export const SOL_EMAIL_GATE_AFTER_QUESTION = 15;

export const SOL_DIMENSIONS: SoLDimension[] = [
  "trust",
  "respect",
  "emotional_safety",
  "communication",
  "honesty",
  "change_over_time",
];

export const SOL_DIMENSION_LABELS: Record<SoLDimension, string> = {
  trust: "Trust",
  respect: "Respect",
  emotional_safety: "Emotional Safety",
  communication: "Communication",
  honesty: "Honesty",
  change_over_time: "Change Over Time",
};
