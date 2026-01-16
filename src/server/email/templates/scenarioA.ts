import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email 1: "You were 5 minutes away..."
export function getTestAbandon1Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "You were 5 minutes away from clarity...";

  const text = `You were 5 minutes away...

You started the UnderstandYourPartner test but didn't finish.

The answers you gave so far paint an interesting picture, but without the full 28 answers, the analysis is incomplete.

Finishing the test is the only way to get your personalized Relationship Guide.

Continue Your Test: ${process.env.WASP_WEB_CLIENT_URL}/test

The sooner you finish, the sooner you'll see where you might be misreading your partner.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p>You started the UnderstandYourPartner test but didn't finish.</p>
      
      <p>The answers you gave so far paint an interesting picture, but without the full 28 answers, the analysis is incomplete.</p>
      
      <p>Finishing the test is the only way to get your personalized Relationship Guide.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/test" class="button">
          Continue Your Test →
        </a>
      </p>
      
      <p>The sooner you finish, the sooner you'll see where you might be misreading your partner.</p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email 2: "The pattern doesn't disappear..."
export function getTestAbandon2Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "The pattern doesn't disappear just because you closed the tab.";

  const text = `The pattern doesn't disappear...

We noticed you still haven't finished your test.

Avoiding the analysis is a common response to relationship anxiety. Often, we fear what we might find out about ourselves.

But understanding your partner starts with understanding your own reactions. Clarity is better than uncertainty.

Continue Your Test: ${process.env.WASP_WEB_CLIENT_URL}/test

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p>We noticed you still haven't finished your test.</p>
      
      <p>Avoiding the analysis is a common response to relationship anxiety. Often, we fear what we might find out about ourselves.</p>
      
      <p>But understanding your partner starts with understanding your own reactions. <strong>Clarity is better than uncertainty.</strong></p>
      
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

// Email 3: "Your partner is waiting..."
export function getTestAbandon3Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Your partner is waiting (even if they don't know it).";

  const text = `Your partner is waiting...

This is the last reminder to finish your test.

We delete incomplete sessions after 7 days to protect your privacy.

Don't let this opportunity for clarity slip away. It takes just a few more minutes to uncover patterns that might save you years of misunderstanding.

Continue Your Test: ${process.env.WASP_WEB_CLIENT_URL}/test

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p>This is the last reminder to finish your test.</p>
      
      <p>We delete incomplete sessions after 7 days to protect your privacy.</p>
      
      <p><strong>Don't let this opportunity for clarity slip away.</strong> It takes just a few more minutes to uncover patterns that might save you years of misunderstanding.</p>
      
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
