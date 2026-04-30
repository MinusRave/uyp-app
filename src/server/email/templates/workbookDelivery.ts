import { wrapHtml } from "../emailLayout";

export function getWorkbookDeliveryEmail({
  downloadUrl,
}: {
  downloadUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = "Here's your workbook";

  const text = `Hi,

Your payment went through. Thank you.

Here are your two files:

${downloadUrl}

Save this email. The link works any time you need it again.

— UnderstandYourPartner`;

  const contentHtml = `
      <p>Hi,</p>

      <p>Your payment went through. Thank you.</p>

      <p>Here are your two files:</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${downloadUrl}" class="button">
          Get your workbook + bonus →
        </a>
      </p>

      <p style="font-size: 14px; color: #555;">Save this email. The link works any time you need it again.</p>

      <p>— UnderstandYourPartner</p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
