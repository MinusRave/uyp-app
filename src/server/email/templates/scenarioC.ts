import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email C1: "You left this behind" (15 minutes after abandonment)
export function getCheckoutC1Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "You left this behind";

  const text = `Hey,

I noticed you started checking out but didn't finish.

Your analysis is ready.

Inside, you'll find:
- Why you keep having the same fight (The Loop)
- The exact words to stop it (The Script)
- How to get your partner to listen (The Translation)

Your session is still active.

Unlock Your Report (~~$197~~ $29) → ${process.env.WASP_WEB_CLIENT_URL}/results

If you had a technical issue, just reply to this email.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>I noticed you started checking out but didn't finish.</p>
      
      <p><strong>Your analysis is ready.</strong></p>
      
      <p>Inside, you'll find:</p>
      <ul style="color: #374151;">
        <li>Why you keep having the same fight (The Loop)</li>
        <li>The exact words to stop it (The Script)</li>
        <li>How to get your partner to listen (The Translation)</li>
      </ul>
      
      <p>Your session is still active.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Unlock Your Report (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
        </a>
      </p>
      
      <p>If you had a technical issue, just reply to this email.</p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email C2: "Was it the price?" (2 hours later)
export function getCheckoutC2Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Was it the price?";

  const text = `Hey,

You were 30 seconds away from unlocking your report.

I'm curious — what stopped you?

Was it:
1. The price? (People spend $200/hour on therapy. This is $29.)
2. Skepticism? (Is this real? Yes. It's based on 40 years of research.)
3. Fear? (It's scary to see the truth. But it's worse to stay blind.)

Whatever it is, you're at a fork in the road.

Path A: Do nothing. Keep having the same fight.
Path B: Spend $29. Get the map. Change the pattern.

It's up to you.

Finish Your Purchase (~~$197~~ $29) → ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>You were 30 seconds away from unlocking your report.</p>
      
      <p>I'm curious — what stopped you?</p>
      
      <p><strong>Was it:</strong></p>
      <ul style="color: #374151;">
        <li><strong>The price?</strong> (People spend $200/hour on therapy. This is $29.)</li>
        <li><strong>Skepticism?</strong> (Is this real? Yes. It's based on 40 years of research.)</li>
        <li><strong>Fear?</strong> (It's scary to see the truth. But it's worse to stay blind.)</li>
      </ul>
      
      <p>Whatever it is, you're at a fork in the road.</p>
      
      <div style="background-color: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; color: #64748B;">Path A: Do nothing. Keep having the same fight.</p>
        <p style="margin: 0; font-weight: 600; color: #0F172A;">Path B: Spend $29. Get the map. Change the pattern.</p>
      </div>
      
      <p>It's up to you.</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Finish Your Purchase (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email C3: "Expiring tonight" (6 hours later - tightened to be same day urgency)
export function getCheckoutC3Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Archiving this session";

  const text = `Hey,

Final heads up.

We can't keep unpaid sessions open forever.

Your analysis is scheduled to be archived.

If you want to understand your relationship pattern—and actually fix it—this is the moment.

Tomorrow, you'll have to start over.

Unlock Your Results Now (~~$197~~ $29) → ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>Final heads up.</p>
      
      <p>We can't keep unpaid sessions open forever.</p>
      
      <p><strong>Your analysis is scheduled to be archived.</strong></p>
      
      <p>If you want to understand your relationship pattern—and actually fix it—this is the moment.</p>
      
      <p>Tomorrow, you'll have to start over.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Unlock Your Results Now (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
