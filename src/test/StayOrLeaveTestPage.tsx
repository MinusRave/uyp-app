import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import {
  startStayOrLeaveSession,
  completeStayOrLeaveTest,
  trackMetaCapiEvent,
  saveStayOrLeaveAnswers,
  getTestSession,
  useQuery,
} from "wasp/client/operations";
import {
  STAY_OR_LEAVE_QUESTIONS,
  SOL_EMAIL_GATE_AFTER_QUESTION,
} from "./stayOrLeaveQuestions";
import type { SoLAnswers } from "./stayOrLeaveScoring";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

const LOCAL_STORAGE_KEY = "sol-quiz-state-v1";

type LocalState = {
  answers: SoLAnswers;
  currentIndex: number;
  sessionId: string | null;
};

function loadState(): LocalState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { answers: {}, currentIndex: 0, sessionId: null };
    const parsed = JSON.parse(raw);
    return {
      answers: parsed.answers ?? {},
      currentIndex: parsed.currentIndex ?? 0,
      sessionId: parsed.sessionId ?? null,
    };
  } catch {
    return { answers: {}, currentIndex: 0, sessionId: null };
  }
}

function saveState(state: LocalState) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

function clearState() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
}

export default function StayOrLeaveTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSessionId = searchParams.get("session");

  const [answers, setAnswers] = useState<SoLAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hydrating, setHydrating] = useState(!!urlSessionId);
  const hydrationDone = useRef(false);

  // Server-side recovery: if URL has ?session=XYZ, fetch from server.
  // Server is the source of truth — works across devices/browsers (email links).
  const { data: serverSession, isLoading: isLoadingSession } = useQuery(
    getTestSession,
    { sessionId: urlSessionId ?? undefined },
    { enabled: !!urlSessionId },
  );

  useEffect(() => {
    if (!urlSessionId) {
      // No session in URL → fall back to localStorage (same-browser resume).
      if (!hydrationDone.current) {
        const restored = loadState();
        setAnswers(restored.answers);
        setCurrentIndex(restored.currentIndex);
        setSessionId(restored.sessionId);
        hydrationDone.current = true;
      }
      return;
    }
    if (isLoadingSession) return;
    if (hydrationDone.current) return;

    if (serverSession) {
      // Already paid? Send them to their assessment.
      if ((serverSession as any).isPaid) {
        navigate(`/assessment?session_id=${serverSession.id}`);
        return;
      }
      // Already completed? Send them to the sales page.
      if ((serverSession as any).isCompleted) {
        navigate(`/sol-results?session=${serverSession.id}`);
        return;
      }
      const restoredAnswers = (serverSession.answers as unknown as SoLAnswers) || {};
      const answeredCount = Object.keys(restoredAnswers).length;
      // Resume right after the last answered question, capped at total length.
      const resumeIndex = Math.min(answeredCount, STAY_OR_LEAVE_QUESTIONS.length - 1);
      setAnswers(restoredAnswers);
      setCurrentIndex(resumeIndex);
      setSessionId(serverSession.id);
      saveState({ answers: restoredAnswers, currentIndex: resumeIndex, sessionId: serverSession.id });
    } else {
      // Bad/expired session id: fall back to fresh start.
      const restored = loadState();
      setAnswers(restored.answers);
      setCurrentIndex(restored.currentIndex);
      setSessionId(restored.sessionId);
    }
    hydrationDone.current = true;
    setHydrating(false);
  }, [urlSessionId, serverSession, isLoadingSession, navigate]);

  // Fire ViewContent (Pixel + CAPI) once on first quiz view.
  const viewContentFired = useRef(false);
  useEffect(() => {
    if (viewContentFired.current) return;
    viewContentFired.current = true;
    const eventID = generateEventId();
    trackPixelEvent("ViewContent", {
      content_name: "Stay or Leave Test - Quiz",
      content_category: "Test",
      eventID,
    });
    trackMetaCapiEvent({
      eventName: "ViewContent",
      eventID,
      eventSourceUrl: window.location.href,
      customData: {
        content_name: "Stay or Leave Test - Quiz",
        content_category: "Test",
      },
    }).catch((e) => console.error("[CAPI ViewContent] failed", e));
  }, []);

  // Persist on every change.
  useEffect(() => {
    saveState({ answers, currentIndex, sessionId });
  }, [answers, currentIndex, sessionId]);

  const totalQuestions = STAY_OR_LEAVE_QUESTIONS.length;
  const progress = (currentIndex / totalQuestions) * 100;
  const currentQuestion = STAY_OR_LEAVE_QUESTIONS[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleAnswer = (value: number) => {
    if (!currentQuestion) return;
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    // Fire-and-forget server sync. The server is source of truth post-email-gate
    // so the user can resume on a different device via the email link.
    if (sessionId) {
      saveStayOrLeaveAnswers({
        sessionId,
        answers: updatedAnswers,
        currentQuestionIndex: currentIndex + 1,
      }).catch((e) => console.error("[saveStayOrLeaveAnswers] failed (non-fatal)", e));
    }

    // After a brief beat, advance.
    setTimeout(() => goNext(updatedAnswers), 220);
  };

  const goNext = (updatedAnswers: SoLAnswers) => {
    const nextIndex = currentIndex + 1;
    // Trigger the email gate exactly once: after answering the gate question.
    if (currentIndex + 1 === SOL_EMAIL_GATE_AFTER_QUESTION && !sessionId) {
      setShowEmailGate(true);
      return;
    }
    if (nextIndex >= totalQuestions) {
      submitFinal(updatedAnswers);
      return;
    }
    setCurrentIndex(nextIndex);
  };

  const goBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSubmitting(true);
    try {
      const result = await startStayOrLeaveSession({
        sessionId: sessionId ?? undefined,
        email,
        partialAnswers: answers,
      });
      setSessionId(result.sessionId);

      // Lead event: Pixel + CAPI deduped on shared eventID.
      const leadEventID = generateEventId();
      trackPixelEvent("Lead", {
        content_name: "Stay or Leave - Email Gate",
        eventID: leadEventID,
      });
      trackMetaCapiEvent({
        sessionId: result.sessionId,
        eventName: "Lead",
        eventID: leadEventID,
        eventSourceUrl: window.location.href,
        customData: {
          content_name: "Stay or Leave - Email Gate",
        },
      }).catch((err) => console.error("[CAPI Lead] failed", err));

      setShowEmailGate(false);
      setCurrentIndex(SOL_EMAIL_GATE_AFTER_QUESTION); // resume on Q16
    } catch (err: any) {
      setEmailError(err?.message || "Something went wrong. Try again.");
    } finally {
      setEmailSubmitting(false);
    }
  };

  const submitFinal = async (finalAnswers: SoLAnswers) => {
    if (!sessionId) {
      // Edge case: somehow finished without an email-gated session.
      // Force the gate now.
      setShowEmailGate(true);
      return;
    }
    setSubmitting(true);
    try {
      await completeStayOrLeaveTest({
        sessionId,
        answers: finalAnswers,
      });
      clearState();
      navigate(`/sol-results?session=${sessionId}`);
    } catch (err) {
      console.error("[completeStayOrLeaveTest] failed", err);
      setSubmitting(false);
      alert("Something went wrong. Please try again.");
    }
  };

  if (urlSessionId && (isLoadingSession || hydrating) && !hydrationDone.current) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-primary mx-auto" size={28} />
          <p className="text-sm text-muted-foreground">Picking up where you left off...</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-primary mx-auto" size={32} />
          <p className="text-sm text-muted-foreground">Reading your answers...</p>
        </div>
      </div>
    );
  }

  if (showEmailGate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Halfway there
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-foreground">
              Almost there.
            </h1>
            <p className="text-base text-muted-foreground">
              Where should we send your results?
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 rounded-xl border-2 border-border bg-card text-base text-center focus:border-primary focus:outline-none"
              autoFocus
            />
            {emailError && (
              <p className="text-sm text-red-500 text-center">{emailError}</p>
            )}
            <button
              type="submit"
              disabled={emailSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {emailSubmitting ? "Saving..." : "Keep going"}
              {!emailSubmitting && <ArrowRight size={18} />}
            </button>
            <p className="text-xs text-center text-muted-foreground">
              We send your results here. We do not share your email.
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full space-y-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center leading-snug">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {LIKERT_OPTIONS.map((opt) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(opt.value)}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card hover:border-primary/40 text-foreground"
                  }`}
                >
                  <span className="text-base font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {currentIndex > 0 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={goBack}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
