import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email A1: "We saved your answers" (1 hour after abandonment)
export function getTestAbandon1Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "We saved your answers";

  const text = `Hey,

You didn't finish the relationship test.

No worries—life happens.

We saved your answers so you don't have to start over.

You were getting to the important part. The part effectively tells you why you keep having the same fight.

Finish Your Test → ${process.env.WASP_WEB_CLIENT_URL}/test

It takes about 3 minutes from where you left off.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>You didn't finish the relationship test.</p>
      
      <p>No worries—life happens.</p>
      
      <p>We saved your answers so you don't have to start over.</p>
      
      <p>You were getting to the important part. The part that effectively tells you <strong>why you keep having the same fight.</strong></p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/test" class="button">
          Finish Your Test →
        </a>
      </p>
      
      <p style="color: #64748B; font-size: 14px;">It takes about 3 minutes from where you left off.</p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email A2: "It's scary" (1 day later)
export function getTestAbandon2Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Is it scary?";

  const text = `Hey,

I'll be honest.

A lot of people stop the test halfway through.

Why? Because seeing the pattern on paper makes it real.

It's easier to think "we just had a bad week" than to admit "we're stuck in a loop."

But you can't fix what you don't name.

68% of couples who take this test say just *seeing* the results changed how they treat each other.

Name the problem. Break the loop.

Continue Your Test → ${process.env.WASP_WEB_CLIENT_URL}/test

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>I'll be honest.</p>
      
      <p>A lot of people stop the test halfway through.</p>
      
      <p><strong>Why? Because seeing the pattern on paper makes it real.</strong></p>
      
      <p>It's easier to think "we just had a bad week" than to admit "we're stuck in a loop."</p>
      
      <p>But you can't fix what you don't name.</p>
      
      <div style="background-color: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B55A5;">
        <p style="margin: 0; color: #374151;">68% of couples who take this test say just <em>seeing</em> the results changed how they treat each other.</p>
      </div>
      
      <p>Name the problem. Break the loop.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/test" class="button">
          Continue Your Test →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email A3: "Deleting your draft" (2 days later)
export function getTestAbandon3Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Deleting your draft in 24 hours";

  const text = `Hey,

Quick heads up.

We delete incomplete test sessions after 7 days to protect user privacy.

Your answers are scheduled for deletion tomorrow.

If you don't finish now, you'll have to start over from question #1.

Finish Your Test (3 minutes) → ${process.env.WASP_WEB_CLIENT_URL}/test

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>Quick heads up.</p>
      
      <p>We delete incomplete test sessions after 7 days to protect user privacy.</p>
      
      <p><strong>Your answers are scheduled for deletion tomorrow.</strong></p>
      
      <p>If you don't finish now, you'll have to start over from question #1.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/test" class="button">
          Finish Your Test (3 minutes) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
