import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email C1: "You left something in your cart" (15 minutes after abandonment)
export function getCheckoutC1Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "You left something in your cart";

  const text = `Hi,

I noticed you started checking out for your UnderstandYourPartner report, but didn't complete the payment.

Your session is still active. You can finish your purchase here:

Complete Your Purchase ($15, reduced from $49): ${process.env.WASP_WEB_CLIENT_URL}/results

If you ran into a technical issue, just reply to this email and I'll help.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p>Hi,</p>
      
      <p>I noticed you started checking out for your UnderstandYourPartner report, but didn't complete the payment.</p>
      
      <p>Your session is still active. You can finish your purchase here:</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Complete Your Purchase (<span style="text-decoration: line-through; opacity: 0.7;">$49</span> $15) →
        </a>
      </p>
      
      <p>If you ran into a technical issue, just reply to this email and I'll help.</p>
      
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
  const subject = "Quick question about your checkout";

  const text = `Hello,

You were 30 seconds away from unlocking your full report.

I'm curious — what stopped you?

Was it:
  • The price? (The report is a one-time payment)
  • A technical issue? (I can send you a direct payment link)
  • Not sure it's worth it? (Read what others say below)

Just reply and let me know. I'll make it right.

Complete Your Purchase ($15, reduced from $49): ${process.env.WASP_WEB_CLIENT_URL}/results

---

What people say after unlocking:

"Worth every penny. I've spent $1000s on therapy and this explained more in 10 minutes." — Jessica L.

"I was skeptical. Then I read the Conflict Loop section and literally gasped." — Marcus T.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p>Hello,</p>
      
      <p>You were 30 seconds away from unlocking your full report.</p>
      
      <p>I'm curious — what stopped you?</p>
      
      <p><strong>Was it:</strong></p>
      <ul style="color: #374151;">
        <li>The price? (The report is a one-time payment)</li>
        <li>Timing? (The report is instant)</li>
        <li>Skeptical? (We are based on 40 years of research)</li>
      </ul>
      
      <p>Your session is about to expire.</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Last Chance to Unlock (<span style="text-decoration: line-through; opacity: 0.7;">$49</span> $15) →
        </a>
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p><strong>What people say after unlocking:</strong></p>
      
      <div style="background-color: #FAF8F5; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0; font-style: italic; color: #374151;">"Worth every penny. I've spent $1000s on therapy and this explained more in 10 minutes." — Jessica L.</p>
      </div>
      
      <div style="background-color: #FAF8F5; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0; font-style: italic; color: #374151;">"I was skeptical. Then I read the Conflict Loop section and literally gasped." — Marcus T.</p>
      </div>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email C3: "Your report expires tonight" (6 hours later)
export function getCheckoutC3Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Last chance: Your analysis expires at midnight";

  const text = `Hello,

Your completed test analysis will be archived tonight at midnight.

If you want to unlock your full report, you need to complete your purchase now.

Your session is about to expire.

Last Chance to Unlock ($15, reduced from $49): ${process.env.WASP_WEB_CLIENT_URL}/results

After midnight, you'll need to retake the entire 28-question test.

Don't lose your results.

– The UYP Team

---

---

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p>Hello,</p>
      
      <p>Your completed test analysis will be <strong style="color: #BE185D;">archived tonight at midnight</strong>.</p>
      
      <p>If you want to unlock your full report, you need to complete your purchase now.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Finish Checkout (<span style="text-decoration: line-through; opacity: 0.7;">$49</span> $15) →
        </a>
      </p>
      
      <p style="color: #64748B;">After midnight, you'll need to retake the entire 28-question test.</p>
      
      <p>Don't lose your results.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      

      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
