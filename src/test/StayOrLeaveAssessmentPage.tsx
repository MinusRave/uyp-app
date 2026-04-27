import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { Loader2, Shield } from "lucide-react";
import {
  useQuery,
  getTestSession,
  generateStayOrLeaveAssessment,
  verifyPayment,
} from "wasp/client/operations";
import { trackPixelEvent } from "../analytics/pixel";
import { SOL_DIMENSION_LABELS, SOL_DIMENSIONS, type SoLDimension } from "./stayOrLeaveQuestions";
import {
  SOL_VERDICT_LABELS,
  SOL_RECOMMENDATION_LABELS,
  SOL_FINAL_ANSWER_LABELS,
  getBridgeLine,
  type SoLVerdict,
  type SoLRecommendation,
  type SoLFinalAnswer,
} from "./stayOrLeaveScoring";

const VERDICT_COLOR: Record<SoLVerdict, { bg: string; text: string; ring: string }> = {
  worth_saving: { bg: "bg-emerald-50 dark:bg-emerald-900/10", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-200 dark:ring-emerald-900/40" },
  high_risk: { bg: "bg-amber-50 dark:bg-amber-900/10", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-200 dark:ring-amber-900/40" },
  time_to_leave: { bg: "bg-red-50 dark:bg-red-900/10", text: "text-red-700 dark:text-red-300", ring: "ring-red-200 dark:ring-red-900/40" },
};

export default function StayOrLeaveAssessmentPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || params.get("session");
  const [verifying, setVerifying] = useState(true);
  const [generating, setGenerating] = useState(false);
  const purchaseFired = useRef(false);

  const { data: session, refetch } = useQuery(
    getTestSession,
    { sessionId: sessionId ?? undefined },
    { enabled: !!sessionId },
  );

  // Pixel Purchase event. eventID = Stripe checkout session id (matches CAPI sent
  // server-side from the webhook). Fires once when payment is confirmed.
  useEffect(() => {
    if (!session?.isPaid) return;
    if (purchaseFired.current) return;
    const stripeSessionId = (session as any).stripeCheckoutSessionId;
    if (!stripeSessionId) return; // Need this for dedup pair with CAPI
    purchaseFired.current = true;
    trackPixelEvent("Purchase", {
      value: 13.9,
      currency: "USD",
      content_name: "Stay or Leave Test - Full Assessment",
      content_type: "product",
      content_ids: ["stay-or-leave-assessment"],
      eventID: stripeSessionId,
    });
  }, [session?.isPaid, (session as any)?.stripeCheckoutSessionId]);

  // Verify payment on landing (handles webhook delay).
  useEffect(() => {
    if (!sessionId) {
      setVerifying(false);
      return;
    }
    (async () => {
      try {
        await verifyPayment({ sessionId });
        await refetch();
      } catch (e) {
        console.error("[verifyPayment] failed", e);
      } finally {
        setVerifying(false);
      }
    })();
  }, [sessionId]);

  // If paid but no AI yet, fire fallback generation.
  useEffect(() => {
    const sol = (session as any)?.stayOrLeaveData;
    if (!session || !session.isPaid || !sessionId) return;
    if (sol?.aiCommentary) return;
    if (generating) return;
    setGenerating(true);
    generateStayOrLeaveAssessment({ sessionId })
      .then(() => refetch())
      .catch((e) => console.error("[generateStayOrLeaveAssessment] failed", e))
      .finally(() => setGenerating(false));
  }, [session?.id, session?.isPaid, sessionId, generating]);

  if (verifying || !session) {
    return <Loading text="Loading your assessment..." />;
  }

  if (!session.isPaid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="font-bold text-foreground">This assessment hasn't been unlocked yet.</p>
          <Link to={`/sol-results?session=${session.id}`} className="text-primary underline text-sm">
            Go to the unlock page
          </Link>
        </div>
      </div>
    );
  }

  const sol = (session as any).stayOrLeaveData;
  if (!sol) {
    return <Loading text="Building your assessment..." />;
  }

  if (!sol.aiCommentary) {
    return <Loading text="Writing your full assessment. This takes about 30 seconds." />;
  }

  const verdict = sol.verdict as SoLVerdict;
  const recommendation = sol.recommendation as SoLRecommendation;
  // Backward-compat: pre-feature sessions don't have finalAnswer cached;
  // fall back to a sensible default from the verdict.
  const finalAnswer = (sol.finalAnswer as SoLFinalAnswer | undefined)
    ?? (verdict === "time_to_leave" ? "leave" : "stay") as SoLFinalAnswer;
  const colors = VERDICT_COLOR[verdict];
  const finalColor = finalAnswer === "stay"
    ? { bg: "bg-emerald-50 dark:bg-emerald-900/10", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-300 dark:ring-emerald-700/50" }
    : { bg: "bg-red-50 dark:bg-red-900/10", text: "text-red-700 dark:text-red-300", ring: "ring-red-300 dark:ring-red-700/50" };
  const ai = sol.aiCommentary as {
    opening: string;
    dimensions: Record<SoLDimension, string>;
    personalizedInsight: string;
    forecast: string;
    actionPlan: { week1: string; week2: string; week3: string; week4: string };
    closing: string;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-5 py-12 md:py-16 space-y-12">

        {/* FINAL ANSWER — climax of the product, top of the page */}
        <div className={`rounded-2xl ${finalColor.bg} ring-2 ${finalColor.ring} p-6 md:p-10 text-center space-y-3`}>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Your final answer
          </p>
          <p className={`text-6xl md:text-8xl font-black ${finalColor.text} tracking-tight`}>
            {SOL_FINAL_ANSWER_LABELS[finalAnswer]}
          </p>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-lg mx-auto pt-2">
            {getBridgeLine(verdict, finalAnswer)}
          </p>
          <p className="text-xs text-muted-foreground italic max-w-md mx-auto pt-1">
            This is what the data says. The choice is yours.
          </p>
        </div>

        {/* Verdict + recommendation context */}
        <div className={`rounded-2xl ${colors.bg} ring-1 ${colors.ring} p-5 md:p-6 text-center space-y-2`}>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Verdict
          </p>
          <h1 className={`text-2xl md:text-3xl font-black ${colors.text}`}>
            {SOL_VERDICT_LABELS[verdict]}
          </h1>
          <p className="text-sm text-foreground/80 font-bold">
            Recommendation: {SOL_RECOMMENDATION_LABELS[recommendation]}
          </p>
        </div>

        {/* Opening */}
        <Section title="What the test showed">
          <Prose text={ai.opening} />
        </Section>

        {/* 6 scores */}
        <Section title="Your 6 scores">
          <div className="space-y-4">
            {SOL_DIMENSIONS.map((d) => (
              <div key={d} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground">{SOL_DIMENSION_LABELS[d]}</h3>
                  <span className="text-xl font-black text-primary">{sol.scores[d]}/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-primary transition-all" style={{ width: `${sol.scores[d]}%` }} />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {ai.dimensions[d]}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Personalized insight */}
        <Section title="What's really going on">
          <Prose text={ai.personalizedInsight} />
        </Section>

        {/* Forecast */}
        <Section title="The next 12-18 months">
          <Prose text={ai.forecast} />
        </Section>

        {/* 4-week action plan */}
        <Section title="Your 4-week plan">
          <div className="space-y-3">
            {(["week1", "week2", "week3", "week4"] as const).map((wk, idx) => (
              <div key={wk} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Week {idx + 1}
                  </span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
                  {ai.actionPlan[wk]}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Closing + recommendation */}
        <Section title="Your recommendation">
          <Prose text={ai.closing} />
        </Section>

        {/* Disclaimer */}
        <div className="rounded-xl border border-border bg-muted/40 p-5 flex items-start gap-3">
          <Shield className="text-foreground/60 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            This assessment is a tool to help you think clearly. It is not therapy, legal advice, or a clinical diagnosis. The final choice is always yours.
          </p>
        </div>

        <footer className="text-center text-xs text-muted-foreground/60 pt-8 border-t border-border/50">
          <p>&copy; UnderstandYourPartner — Stay or Leave Test</p>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Prose({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-base leading-relaxed text-foreground/90">
          {p}
        </p>
      ))}
    </div>
  );
}

function Loading({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-3">
        <Loader2 className="animate-spin text-primary mx-auto" size={28} />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
