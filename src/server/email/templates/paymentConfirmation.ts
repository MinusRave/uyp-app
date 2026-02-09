import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Payment Confirmation Email: Sent immediately after successful payment
export function getPaymentConfirmationEmail(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Payment Confirmed - Your Report is Ready";

  const text = `Thank you for your purchase. Your payment has been processed successfully.

Your full relationship report is now unlocked and ready to view:

${vars.app_url}/results

If you have any questions, just reply to this email.

– The UYP Team`;

  const contentHtml = `
      <div style="background: linear-gradient(135deg, #8B55A5 0%, #BE185D 100%); padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
        <div style="width: 48px; height: 48px; background-color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B55A5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Payment Successful</h1>
      </div>

      <p>Thank you for your purchase. Your payment has been processed successfully.</p>
      
      <p><strong>Your full relationship report is now unlocked and ready to view.</strong></p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${vars.app_url}/results" class="button">
          View Your Report →
        </a>
      </p>
      
      <p>If you have any questions, just reply to this email.</p>
      
      <p>– The UYP Team</p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
