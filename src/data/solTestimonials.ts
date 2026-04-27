import type { SoLVerdict } from "../test/stayOrLeaveScoring";

// Fake testimonials. 4th grade English. Realistic first names + ages.
// Mix across all three verdicts so the sales page can show matched social proof.
// Replace with real testimonials once collected.

export interface SoLTestimonial {
  name: string;
  age: number;
  verdict: SoLVerdict;
  text: string;
}

export const SOL_TESTIMONIALS: SoLTestimonial[] = [
  {
    name: "Marta",
    age: 34,
    verdict: "high_risk",
    text: "I took the test at 1am after a fight. The verdict said High Risk. I was waiting to be told I was making it up. I wasn't.",
  },
  {
    name: "Daniel",
    age: 31,
    verdict: "time_to_leave",
    text: "I knew the answer. I just needed to read it from someone else. The test gave me that. Three weeks later, I left. I sleep now.",
  },
  {
    name: "Sara",
    age: 28,
    verdict: "worth_saving",
    text: "We have problems. The test said Worth Saving. I cried. My partner read the report with me. We started couples therapy the next week.",
  },
  {
    name: "Tom",
    age: 42,
    verdict: "high_risk",
    text: "The 6 scores showed me which parts were sick and which parts were still alive. I had been treating the whole thing like it was dead.",
  },
  {
    name: "Elena",
    age: 36,
    verdict: "time_to_leave",
    text: "I asked my friends and they said leave. I asked my mom and she said stay. I needed something that wasn't on a side. The test was that.",
  },
  {
    name: "Kevin",
    age: 29,
    verdict: "worth_saving",
    text: "I paid $13.90. I read it twice. It told me what I was getting wrong as much as what she was. We are still together. We are working.",
  },
  {
    name: "Anna",
    age: 39,
    verdict: "high_risk",
    text: "Honest test. No fluff. The recommendation said Be Careful. I didn't like it. Six months later, I get why.",
  },
];
