import { type TestSession } from "wasp/entities";
import { SOL_VERDICT_LABELS, SOL_RECOMMENDATION_LABELS, type SoLVerdict, type SoLRecommendation } from "../../test/stayOrLeaveScoring";

// Minimal personalization for the Stay-or-Leave email sequences.
// Far smaller than the UYP version — S-o-L emails are simple and short by design.

export interface SoLEmailVars {
  first_name: string;
  verdict_label: string | null;
  recommendation_label: string | null;
  resume_test_url: string;
  unlock_assessment_url: string;
  unsubscribe_url: string;
  session_id: string;
  app_url: string;
}

function firstNameFromEmail(email: string | null | undefined): string {
  if (!email) return "there";
  const local = email.split("@")[0] ?? "";
  if (!local) return "there";
  // Convert "marta.rossi" / "marta_rossi" / "marta-rossi" to "Marta".
  const first = local.split(/[._-]/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function buildSoLEmailVars(
  session: TestSession,
  appUrl: string,
  apiUrl: string,
): SoLEmailVars {
  const sol = (session as any).stayOrLeaveData ?? null;
  const verdict: SoLVerdict | null = sol?.verdict ?? null;
  const recommendation: SoLRecommendation | null = sol?.recommendation ?? null;

  return {
    first_name: firstNameFromEmail(session.email),
    verdict_label: verdict ? SOL_VERDICT_LABELS[verdict] : null,
    recommendation_label: recommendation ? SOL_RECOMMENDATION_LABELS[recommendation] : null,
    resume_test_url: `${appUrl}/stay-or-leave?session=${session.id}`,
    unlock_assessment_url: `${appUrl}/sol-results?session=${session.id}&utm_source=email&utm_medium=retention`,
    unsubscribe_url: `${apiUrl}/api/unsubscribe?sessionId=${session.id}`,
    session_id: session.id,
    app_url: appUrl,
  };
}
