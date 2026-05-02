import { wrapHtml } from "../emailLayout";

export function getWorkbookDeliveryEmail({
  downloadUrl,
  hasCompanion,
}: {
  downloadUrl: string;
  hasCompanion?: boolean;
}): { subject: string; html: string; text: string } {
  const subject = "Here's your workbook";
  const filesLine = hasCompanion ? "Here are your two files:" : "Here is your file:";
  const buttonLabel = hasCompanion ? "Get your workbook + companion →" : "Get your workbook →";

  const text = `Hi,

Your payment went through. Thank you.

${filesLine}

${downloadUrl}

Save this email. The link works any time you need it again.

— UnderstandYourPartner`;

  const contentHtml = `
      <p>Hi,</p>

      <p>Your payment went through. Thank you.</p>

      <p>${filesLine}</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${downloadUrl}" class="button">
          ${buttonLabel}
        </a>
      </p>

      <p style="font-size: 14px; color: #555;">Save this email. The link works any time you need it again.</p>

      <p>— UnderstandYourPartner</p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
