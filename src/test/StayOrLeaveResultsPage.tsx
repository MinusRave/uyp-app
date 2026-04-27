import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowRight, Loader2, Lock, Shield, Check, ChevronDown } from "lucide-react";
import { useQuery, getTestSession, createStayOrLeaveCheckoutSession } from "wasp/client/operations";
import {
  SOL_DIMENSION_LABELS,
  SOL_DIMENSIONS,
  type SoLDimension,
} from "./stayOrLeaveQuestions";
import {
  SOL_VERDICT_LABELS,
  SOL_FINAL_ANSWER_LABELS,
  getBridgeLine,
  type SoLVerdict,
  type SoLRecommendation,
  type SoLFinalAnswer,
} from "./stayOrLeaveScoring";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";
import { SOL_TESTIMONIALS } from "../data/solTestimonials";

const VERDICT_COLOR: Record<SoLVerdict, { bg: string; text: string; ring: string }> = {
  worth_saving: { bg: "bg-emerald-50 dark:bg-emerald-900/10", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-200 dark:ring-emerald-900/40" },
  high_risk: { bg: "bg-amber-50 dark:bg-amber-900/10", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-200 dark:ring-amber-900/40" },
  time_to_leave: { bg: "bg-red-50 dark:bg-red-900/10", text: "text-red-700 dark:text-red-300", ring: "ring-red-200 dark:ring-red-900/40" },
};

// Fascinations per verdict — every bullet maps to a real section the user
// actually reads in the paid assessment. 3rd grade English. Curiosity-driven.
const FASCINATIONS: Record<SoLVerdict, string[]> = {
  time_to_leave: [
    "The 2 scores that pushed your answer to LEAVE",
    "Your 6 scores, one by one — what each one really says about you",
    "The one answer that does not fit the rest — and what it really tells us",
    "Where you end up in 1 to 2 years if nothing changes",
    "Day 1 to Day 28: what to do, week by week",
  ],
  high_risk: [
    "Why your answer is what it is — and how close it is to flipping the other way",
    "Your 6 scores, one by one — and the 2 that dragged you down",
    "The one answer that does not fit the rest — and the real story behind it",
    "Where your relationship goes in 12 to 18 months — and the one thing that can change it",
    "Day 1 to Day 28: what to do, week by week",
  ],
  worth_saving: [
    "Why your answer is STAY — and the score that made it clear",
    "Your 6 scores, one by one — and your strongest one (your real strength)",
    "Where you keep getting stuck — and why",
    "What stays good, what slips, what to watch in 12 to 18 months",
    "Day 1 to Day 28: what to do, week by week",
  ],
};

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "How is this different from a free attachment style quiz?",
    a: "Free quizzes give you a label. This gives you a verdict, scored on 6 dimensions, with a real recommendation. Plus a written analysis built from your specific answers. The free quiz tells you what you are. This tells you what to do.",
  },
  {
    q: "Is this therapy?",
    a: "No. Therapy is a long process with a person. This is the diagnostic part — what comes before therapy. A couples therapist takes 4 to 6 sessions to find the same pattern this finds in 10 minutes.",
  },
  {
    q: "Can the test be wrong?",
    a: "The verdict is math. Your answers in. Scores out. Threshold rules deciding the bucket. It cannot lie about what you said. If you answered carefully, the verdict reflects you.",
  },
  {
    q: "Can I share this with my partner?",
    a: "Yes. Some people do. Some don't. Either way it is yours to keep.",
  },
  {
    q: "Are my answers private?",
    a: "Yes. We do not share or sell your data. You can delete your session anytime.",
  },
  {
    q: "What if I'm the problem?",
    a: "The test does not pick a side. It looks at the whole relationship. If something is on you, the analysis will say so. If it isn't, it won't.",
  },
];

export default function StayOrLeaveResultsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session");

  const { data: session, isLoading } = useQuery(
    getTestSession,
    { sessionId: sessionId ?? undefined },
    { enabled: !!sessionId },
  );

  const [bridgeShown, setBridgeShown] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Show the "you finished the test" bridge for ~1.2s before revealing the sales page.
  useEffect(() => {
    if (!session) return;
    const t = setTimeout(() => setBridgeShown(true), 1200);
    return () => clearTimeout(t);
  }, [session]);

  const sol = (session as any)?.stayOrLeaveData ?? null;

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!sol || !sol.verdict) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-foreground font-bold">We couldn't find your results.</p>
          <a href="/" className="text-primary underline text-sm">Take the test</a>
        </div>
      </div>
    );
  }

  if (session.isPaid) {
    // Already paid — go straight to the assessment.
    navigate(`/assessment?session_id=${session.id}`);
    return null;
  }

  if (!bridgeShown) {
    return <BridgeView />;
  }

  return (
    <SalesView
      sessionId={session.id}
      verdict={sol.verdict as SoLVerdict}
      recommendation={sol.recommendation as SoLRecommendation}
      finalAnswer={(sol.finalAnswer ?? (sol.verdict === "time_to_leave" ? "leave" : "stay")) as SoLFinalAnswer}
      overall={sol.overall}
      scores={sol.scores}
      verdictLine={sol.verdictLine}
      isCheckoutLoading={isCheckoutLoading}
      onCheckout={async () => {
        setIsCheckoutLoading(true);
        const eventID = generateEventId();
        trackPixelEvent("InitiateCheckout", {
          content_name: "Stay or Leave Test - Full Assessment",
          content_category: "Assessment",
          value: 13.9,
          currency: "USD",
          eventID,
        });
        try {
          const result = await createStayOrLeaveCheckoutSession({
            sessionId: session.id,
            eventID,
          });
          if (result.sessionUrl) window.location.href = result.sessionUrl;
        } catch (e) {
          console.error("[checkout] failed", e);
          alert("Something went wrong. Please try again.");
          setIsCheckoutLoading(false);
        }
      }}
    />
  );
}

function BridgeView() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Test complete
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-foreground leading-snug">
          You finished the test.
        </h1>
        <p className="text-base text-muted-foreground">
          Now see if your relationship is worth saving.
        </p>
        <Loader2 className="animate-spin text-primary mx-auto mt-4" size={20} />
      </div>
    </div>
  );
}

interface SalesViewProps {
  sessionId: string;
  verdict: SoLVerdict;
  recommendation: SoLRecommendation;
  finalAnswer: SoLFinalAnswer;
  overall: number;
  scores: Record<SoLDimension, number>;
  verdictLine: string | null;
  isCheckoutLoading: boolean;
  onCheckout: () => void;
}

function SalesView({
  verdict,
  finalAnswer,
  overall,
  scores,
  verdictLine,
  isCheckoutLoading,
  onCheckout,
}: SalesViewProps) {
  const verdictLabel = SOL_VERDICT_LABELS[verdict];
  const finalAnswerLabel = SOL_FINAL_ANSWER_LABELS[finalAnswer];
  const colors = VERDICT_COLOR[verdict];
  const finalColor = finalAnswer === "stay"
    ? { bg: "bg-emerald-50 dark:bg-emerald-900/10", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-300 dark:ring-emerald-700/50" }
    : { bg: "bg-red-50 dark:bg-red-900/10", text: "text-red-700 dark:text-red-300", ring: "ring-red-300 dark:ring-red-700/50" };

  // Pick 2-3 testimonials skewed toward the verdict so the social proof feels matched.
  const testimonials = useMemo(() => {
    const matched = SOL_TESTIMONIALS.filter((t) => t.verdict === verdict).slice(0, 2);
    const rest = SOL_TESTIMONIALS.filter((t) => t.verdict !== verdict).slice(0, 1);
    return [...matched, ...rest];
  }, [verdict]);

  const fascinations = FASCINATIONS[verdict];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-5 py-12 md:py-16 space-y-12">

        {/* 1. VERDICT REVEAL */}
        <div className={`rounded-2xl ${colors.bg} ring-1 ${colors.ring} p-6 md:p-8 text-center space-y-3`}>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Your verdict
          </p>
          <h1 className={`text-3xl md:text-5xl font-black ${colors.text}`}>
            {verdictLabel}
          </h1>
          {verdictLine && (
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-md mx-auto pt-2">
              {verdictLine}
            </p>
          )}
        </div>

        {/* 1b. FINAL BINARY ANSWER — with verdict-aware bridge line */}
        <div className={`rounded-2xl ${finalColor.bg} ring-2 ${finalColor.ring} p-6 md:p-8 text-center space-y-3`}>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            If you had to choose right now, the data says
          </p>
          <p className={`text-5xl md:text-7xl font-black ${finalColor.text} tracking-tight`}>
            {finalAnswerLabel}
          </p>
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed max-w-lg mx-auto pt-2">
            {getBridgeLine(verdict, finalAnswer)}
          </p>
        </div>

        {/* 2. SCORES */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">
            Your 6 scores
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SOL_DIMENSIONS.map((d) => (
              <div key={d} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">{SOL_DIMENSION_LABELS[d]}</span>
                  <span className="text-sm font-black text-primary">{scores[d]}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${scores[d]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center pt-1">
            Higher means healthier. Overall: {overall}/100.
          </p>
        </div>

        {/* 2b. WHY PAY — handles "I got the answer free, why pay?" objection */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-foreground leading-snug text-center">
            You have the answer. Now what?
          </h2>
          <div className="space-y-4 max-w-lg mx-auto text-base md:text-lg text-foreground/85 leading-relaxed">
            <p>You got your answer. Stay, or leave. That part is free.</p>
            <p>But the answer is just one word. One word is not a plan.</p>
            <p>If your answer is STAY, you still don't know what to fix.</p>
            <p>If your answer is LEAVE, you still don't know why. You could do it all over again with the next person.</p>
            <p className="font-bold text-foreground">$13.90 gives you the rest.</p>
            <p>Why your answer is what it is. What your relationship looks like in 12 to 18 months. What to do in week 1, 2, 3, and 4. All written from what you said.</p>
            <p className="text-foreground font-bold pt-2">The answer is a word. The rest is a path.</p>
          </div>
        </div>

        {/* 3. SALES CARD — fascinations + price + primary CTA + guarantee */}
        <div className="rounded-3xl border-2 border-primary/30 bg-card p-6 md:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground leading-snug">
              You answered 30 questions. Now read what they really say.
            </h2>
            <p className="text-base text-muted-foreground">
              Built from your specific answers. In plain English. Tonight.
            </p>
          </div>

          {/* Fascinations (replaces the old "What's locked" list) */}
          <div className="space-y-2.5 bg-muted/40 rounded-xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              What you'll read
            </p>
            {fascinations.map((line, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <Lock size={14} className="text-primary mt-1 shrink-0" />
                <span className="text-foreground leading-relaxed">{line}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="text-center space-y-2 pt-2">
            <p className="text-sm uppercase tracking-widest font-bold text-muted-foreground">
              One-time payment
            </p>
            <p className="text-5xl font-black text-primary">$13.90</p>
            <p className="text-sm text-muted-foreground italic">
              A small price for real clarity.
            </p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onCheckout}
            disabled={isCheckoutLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold py-5 rounded-full shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isCheckoutLoading ? "Processing..." : "Unlock My Assessment"}
            {!isCheckoutLoading && <ArrowRight size={20} />}
          </button>

          {/* Guarantee */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Shield className="text-yellow-600 dark:text-yellow-400 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1 text-sm">30-day money-back. No questions.</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Read the assessment. If it does not tell you something true about your relationship — full refund. No forms. No follow-up emails. Just your money back.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-muted/30 rounded-xl p-3">
            <Shield className="text-foreground/60 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Secure one-time payment. Instant access. We do not share your data.
            </p>
          </div>
        </div>

        {/* 4. METHODOLOGY (small trust block) */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            How this works
          </p>
          <div className="space-y-2">
            {[
              "Built on Gottman Method, attachment theory, and 40+ years of research.",
              "30 questions. 6 dimensions. Scored 0 to 100 on a strict scale.",
              "This is not therapy. It is the diagnostic that comes before therapy works.",
              "Your answers are private. Your data is never sold.",
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Check size={14} className="text-primary mt-1 shrink-0" />
                <span className="text-foreground/80 leading-relaxed">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. TESTIMONIALS */}
        {testimonials.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">
              People who took the test
            </h3>
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm text-foreground leading-relaxed italic">"{t.text}"</p>
                <p className="text-xs text-muted-foreground mt-2">
                  — {t.name}, {t.age}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 6. SECONDARY CTA — for users who scrolled past the main card */}
        <div className="rounded-2xl border-2 border-primary/30 bg-card p-6 text-center space-y-4 shadow-md">
          <p className="text-base font-bold text-foreground">Ready to read it?</p>
          <p className="text-3xl font-black text-primary">$13.90</p>
          <button
            onClick={onCheckout}
            disabled={isCheckoutLoading}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold py-4 px-10 rounded-full shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
          >
            {isCheckoutLoading ? "Processing..." : "Unlock My Assessment"}
            {!isCheckoutLoading && <ArrowRight size={18} />}
          </button>
        </div>

        {/* 7. FAQ */}
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-black text-foreground text-center">
            Common questions
          </h3>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <FAQRow key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* 8. FINAL CTA */}
        <div className="text-center space-y-4 py-4">
          <p className="text-lg md:text-xl font-bold text-foreground">
            Decide tonight. $13.90.
          </p>
          <button
            onClick={onCheckout}
            disabled={isCheckoutLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold py-5 px-10 rounded-full shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isCheckoutLoading ? "Processing..." : "Unlock My Assessment"}
            {!isCheckoutLoading && <ArrowRight size={20} />}
          </button>
        </div>

        <footer className="text-center text-xs text-muted-foreground/60 pt-8 border-t border-border/50 space-y-2">
          <p>This is not therapy or legal advice. The choice is yours.</p>
          <p>&copy; UnderstandYourPartner — Stay or Leave Test</p>
        </footer>
      </div>
    </div>
  );
}

function FAQRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-bold text-sm text-foreground">{q}</span>
        <ChevronDown
          size={18}
          className={`text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-sm text-foreground/80 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
