import { type SoLEmailVars } from "../solPersonalization";
import { wrapHtml } from "../emailLayout";

// All copy: 4th grade English. Short sentences. No psychology jargon.
// Voice: simple, professional, calm, serious.

const SIGN_OFF = "— G.";
const SIGN_OFF_HTML = `<p>— G.</p>`;

type Email = { subject: string; html: string; text: string };
type TemplateFn = (vars: SoLEmailVars) => Email;

// =============================================================================
// SEQUENCE A — TEST ABANDONED
// User submitted email at the mid-test gate but did not finish all 30 questions.
// Goal: get them back to finish the test.
// =============================================================================

export const solAbandoned1: TemplateFn = (v) => {
  const subject = "You stopped halfway";
  const url = v.resume_test_url;
  const text = `
${v.first_name},

You started the Stay or Leave test. You stopped halfway.

The test takes 5 more minutes. Then you get your verdict.

Pick up where you left off:
${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>You started the Stay or Leave test. You stopped halfway.</p>
    <p>The test takes 5 more minutes. Then you get your verdict.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Pick up where I left off</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "5 more minutes to your verdict.");
  return { subject, html, text };
};

export const solAbandoned2: TemplateFn = (v) => {
  const subject = "Why people stop in the middle";
  const url = v.resume_test_url;
  const text = `
${v.first_name},

A lot of people stop the test in the middle. Not because they are lazy.

They stop because the questions get real.

That is the point of the test. The hard questions are where the answer lives.

If you can finish 15 more questions, you will know if your relationship is worth saving.

${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>A lot of people stop the test in the middle. Not because they are lazy.</p>
    <p>They stop because the questions get real.</p>
    <p>That is the point of the test. The hard questions are where the answer lives.</p>
    <p>If you can finish 15 more questions, you will know if your relationship is worth saving.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Finish the test</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "The hard questions are where the answer lives.");
  return { subject, html, text };
};

export const solAbandoned3: TemplateFn = (v) => {
  const subject = "Three answers";
  const url = v.resume_test_url;
  const text = `
${v.first_name},

The test gives you one of three answers.

Worth Saving. Your relationship has problems but it can be fixed.

High Risk. Things are bad. You need to be careful and decide soon.

Time to Leave. The numbers say to go. The choice is still yours.

You finished half the test. You can find out which one is yours in 5 minutes.

${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>The test gives you one of three answers.</p>
    <p><strong>Worth Saving.</strong> Your relationship has problems but it can be fixed.</p>
    <p><strong>High Risk.</strong> Things are bad. You need to be careful and decide soon.</p>
    <p><strong>Time to Leave.</strong> The numbers say to go. The choice is still yours.</p>
    <p>You finished half the test. You can find out which one is yours in 5 minutes.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">See my answer</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "Worth Saving, High Risk, or Time to Leave.");
  return { subject, html, text };
};

export const solAbandoned4: TemplateFn = (v) => {
  const subject = "Last few days";
  const url = v.resume_test_url;
  const text = `
${v.first_name},

Your test answers are saved for a few more days.

After that, they are gone. You would have to start over.

If you want your verdict, finish the test now.

${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>Your test answers are saved for a few more days.</p>
    <p>After that, they are gone. You would have to start over.</p>
    <p>If you want your verdict, finish the test now.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Finish the test</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "Your answers expire soon.");
  return { subject, html, text };
};

export const solAbandoned5: TemplateFn = (v) => {
  const subject = "Last note from us";
  const url = v.resume_test_url;
  const text = `
${v.first_name},

This is the last email from us about the test.

If you ever come back, the door is open. Just take the test from the start.

${url}

I hope you find clarity.

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>This is the last email from us about the test.</p>
    <p>If you ever come back, the door is open. Just take the test from the start.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Take the test</a></p>
    <p>I hope you find clarity.</p>
    ${SIGN_OFF_HTML}
  `, subject, "Final note. Door stays open.");
  return { subject, html, text };
};

// =============================================================================
// SEQUENCE B — TEST COMPLETED, NO PURCHASE
// User finished all 30 questions, has a verdict, did not pay $13.90.
// Goal: convert the lead.
// =============================================================================

export const solCompleted1: TemplateFn = (v) => {
  const verdictLine = v.verdict_label
    ? `Your verdict: ${v.verdict_label}.`
    : `Your verdict is ready.`;
  const subject = v.verdict_label
    ? `Your verdict: ${v.verdict_label}`
    : "Your verdict is ready";
  const url = v.unlock_assessment_url;
  const text = `
${v.first_name},

${verdictLine}

You finished the test. The full assessment is waiting for you.

It tells you why your verdict is what it is. In plain English. Based on what you said.

Unlock it for $13.90:
${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p><strong>${verdictLine}</strong></p>
    <p>You finished the test. The full assessment is waiting for you.</p>
    <p>It tells you why your verdict is what it is. In plain English. Based on what you said.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Unlock my assessment — $13.90</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "Your full assessment is waiting.");
  return { subject, html, text };
};

export const solCompleted2: TemplateFn = (v) => {
  const subject = "$13.90 vs $900";
  const url = v.unlock_assessment_url;
  const text = `
${v.first_name},

A couples therapist costs about $150 a session. They need 4 to 6 sessions to even see what is wrong.

That is six weeks and around $900 before they help.

Your assessment costs $13.90. You can read it tonight.

It is not therapy. It is the part that comes before therapy. The part that tells you what is wrong, in plain English, based on your answers.

${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>A couples therapist costs about $150 a session. They need 4 to 6 sessions to even see what is wrong.</p>
    <p>That is six weeks and around $900 before they help.</p>
    <p><strong>Your assessment costs $13.90. You can read it tonight.</strong></p>
    <p>It is not therapy. It is the part that comes before therapy. The part that tells you what is wrong, in plain English, based on your answers.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Unlock my assessment</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "Less than a takeout dinner. Read it tonight.");
  return { subject, html, text };
};

export const solCompleted3: TemplateFn = (v) => {
  const subject = "What is in your assessment";
  const url = v.unlock_assessment_url;
  const recRow = v.recommendation_label
    ? `Your final recommendation. Yours says <strong>${v.recommendation_label}</strong>.`
    : `Your final recommendation.`;
  const text = `
${v.first_name},

When you unlock your assessment, you get four things.

1. The reason your verdict is what it is. Written in plain English using what you said.

2. Your 6 scores explained. Trust. Respect. Emotional Safety. Communication. Honesty. Change Over Time.

3. Your story. The pattern under the numbers. The real thing going on for you.

4. Your final recommendation. ${v.recommendation_label ? `Yours says ${v.recommendation_label}.` : ""}

It is one PDF you can read in 10 minutes. $13.90.

${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>When you unlock your assessment, you get four things.</p>
    <ol>
      <li>The reason your verdict is what it is. Written in plain English using what you said.</li>
      <li>Your 6 scores explained. Trust. Respect. Emotional Safety. Communication. Honesty. Change Over Time.</li>
      <li>Your story. The pattern under the numbers. The real thing going on for you.</li>
      <li>${recRow}</li>
    </ol>
    <p>It is one read you can finish in 10 minutes. $13.90.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Unlock my assessment</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "Four things you'll see when you unlock.");
  return { subject, html, text };
};

export const solCompleted4: TemplateFn = (v) => {
  const subject = "Did you decide?";
  const url = v.unlock_assessment_url;
  const text = `
${v.first_name},

A few days have passed. Did you decide?

If you are still stuck, the assessment will help. It does not tell you what to do. It shows you why you feel the way you feel, and what your numbers mean.

Sometimes the hardest part is just seeing it on paper.

${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>A few days have passed. Did you decide?</p>
    <p>If you are still stuck, the assessment will help. It does not tell you what to do. It shows you why you feel the way you feel, and what your numbers mean.</p>
    <p>Sometimes the hardest part is just seeing it on paper.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Unlock my assessment</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "Sometimes you just need to see it on paper.");
  return { subject, html, text };
};

export const solCompleted5: TemplateFn = (v) => {
  const subject = "Last reminder";
  const url = v.unlock_assessment_url;
  const text = `
${v.first_name},

This is the last email from us about your assessment.

If you want to read it, the link is below. $13.90, one time.

If not, no problem. We hope you find your answer.

${url}

${SIGN_OFF}

Unsubscribe: ${v.unsubscribe_url}
  `.trim();
  const html = wrapHtml(`
    <p>${v.first_name},</p>
    <p>This is the last email from us about your assessment.</p>
    <p>If you want to read it, the link is below. $13.90, one time.</p>
    <p>If not, no problem. We hope you find your answer.</p>
    <p style="margin: 24px 0;"><a href="${url}" style="background-color:#8B55A5;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Unlock my assessment</a></p>
    ${SIGN_OFF_HTML}
  `, subject, "Final note.");
  return { subject, html, text };
};
