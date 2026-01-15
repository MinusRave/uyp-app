import { type PersonalizationVars } from "../personalization";

// Email C1: "Your checkout is still open" (15 minutes after abandonment)
export function getCheckoutC1Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `You left something in your cart`;

    const text = `Hi ${vars.first_name},

I noticed you started checking out for your UnderstandYourPartner report, but didn't complete the payment.

Your session is still active. You can finish your purchase here:

Complete Your Purchase ($39): ${process.env.WASP_WEB_CLIENT_URL}/results

If you ran into a technical issue, just reply to this email and I'll help.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Hi ${vars.first_name},</p>
      
      <p>I noticed you started checking out for your UnderstandYourPartner report, but didn't complete the payment.</p>
      
      <p>Your session is still active. You can finish your purchase here:</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Complete Your Purchase ($39) →
        </a>
      </p>
      
      <p>If you ran into a technical issue, just reply to this email and I'll help.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

// Email C2: "Was it the price?" (2 hours later)
export function getCheckoutC2Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Quick question about your checkout`;

    const text = `${vars.first_name},

You were 30 seconds away from unlocking your full report.

I'm curious — what stopped you?

Was it:
  • The price? (We offer a 7-day money-back guarantee)
  • A technical issue? (I can send you a direct payment link)
  • Not sure it's worth it? (Read what others say below)

Just reply and let me know. I'll make it right.

Complete Your Purchase: ${process.env.WASP_WEB_CLIENT_URL}/results

---

**What people say after unlocking:**

*"Worth every penny. I've spent $1000s on therapy and this explained more in 10 minutes."* — Jessica L.

*"I was skeptical. Then I read the Conflict Loop section and literally gasped."* — Marcus T.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>You were 30 seconds away from unlocking your full report.</p>
      
      <p>I'm curious — what stopped you?</p>
      
      <p><strong>Was it:</strong></p>
      <ul style="color: #374151;">
        <li>The price? (We offer a 7-day money-back guarantee)</li>
        <li>A technical issue? (I can send you a direct payment link)</li>
        <li>Not sure it's worth it? (Read what others say below)</li>
      </ul>
      
      <p>Just reply and let me know. I'll make it right.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Complete Your Purchase →
        </a>
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p><strong>What people say after unlocking:</strong></p>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0; font-style: italic; color: #374151;">"Worth every penny. I've spent $1000s on therapy and this explained more in 10 minutes." — Jessica L.</p>
      </div>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0; font-style: italic; color: #374151;">"I was skeptical. Then I read the Conflict Loop section and literally gasped." — Marcus T.</p>
      </div>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

// Email C3: "Your report expires tonight" (6 hours later)
export function getCheckoutC3Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Last chance: Your analysis expires at midnight`;

    const text = `${vars.first_name},

Your completed test analysis will be archived tonight at midnight.

If you want to unlock your full report, you need to complete your purchase now.

Finish Checkout ($39): ${process.env.WASP_WEB_CLIENT_URL}/results

After midnight, you'll need to retake the entire 28-question test.

Don't lose your results.

– The UYP Team

---

**7-Day Money-Back Guarantee**  
If you read your report and don't find it valuable, reply within 7 days for a full refund. No questions asked.

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>Your completed test analysis will be <strong style="color: #DC2626;">archived tonight at midnight</strong>.</p>
      
      <p>If you want to unlock your full report, you need to complete your purchase now.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #DC2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Finish Checkout ($39) →
        </a>
      </p>
      
      <p style="color: #6b7280;">After midnight, you'll need to retake the entire 28-question test.</p>
      
      <p>Don't lose your results.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <div style="background-color: #ECFDF5; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-weight: 600; color: #065F46;">7-Day Money-Back Guarantee</p>
        <p style="margin: 10px 0 0 0; color: #374151;">If you read your report and don't find it valuable, reply within 7 days for a full refund. No questions asked.</p>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}
