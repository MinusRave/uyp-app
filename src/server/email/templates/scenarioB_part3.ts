import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email B7: "The 6-second trick" (Day 5)
export function getTeaserB7Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "The 6-second trick";

  const text = `Hey,

I want to give you something you can use tonight.

It's called the "6-Second Reset."

Most couples kiss for 1 second. It's a habit, not a connection.

But a 6-second kiss (or hug) does something different. It tells the part of you that's scanning for threats: "You're safe."

For your specific pattern, this matters because:

${getLensSpecificTip(vars.dominant_lens)}

Your report is full of these tiny adjustments. They take seconds, but they change everything.

Get The Full Toolkit (~~$197~~ $29) → ${vars.app_url}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
  <p><strong>Hey,</strong></p>

  <p>I want to give you something you can use tonight.</p>

  <p>It's called the <strong>"6-Second Reset."</strong></p>

  <p>Most couples kiss for 1 second. It's a habit, not a connection.</p>

  <p>But a 6-second kiss (or hug) does something different. It tells the part of you that's scanning for threats: "You're safe."</p>

  <p>For your specific pattern, this matters because:</p>

  <div style="background-color: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B55A5;">
    <p style="margin: 0; font-style: italic;">${getLensSpecificTip(vars.dominant_lens)}</p>
  </div>

  <p>Your report is full of these tiny adjustments. They take seconds, but they change everything.</p>

  <p style="text-align: center; margin: 30px 0;">
    <a href="${vars.app_url}/results" class="button">
      Get The Full Toolkit (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
    </a>
  </p>

  <p>– The UYP Team</p>

  <div class="footer">
    <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
  </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

function getLensSpecificTip(lens: string): string {
  const tips: Record<string, string> = {
    silence: "You feel distance as danger. This physical reset proves safety instantly.",
    conflict: "You hold tension. This forces your shoulders to drop and your breathing to slow.",
    intentions: "You analyze words constantly. This bypasses thinking and goes straight to feeling.",
    reassurance: "You want words, but touch actually calms you faster.",
    repair: "You wait for the 'perfect moment' to reconnect. This creates one without talking."
  };
  return tips[lens] || tips.silence;
}

// Email B8: "The cost of waiting" (Day 6)
export function getTeaserB8Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "The cost of waiting";

  const text = `Hey,

Every time you repeat the same loop, it gets harder to break.

It's like a groove in a dirt road.

The first time, it's easy to steer out.
The 50th time, your wheels just slide into the rut automatically.

That's why our data shows that 68% of couples in the Yellow Zone move to Crisis (Red Zone) within 18 months if they don't change the pattern.

You feel like you're choosing to react this way. You're not. You're just sliding into the groove.

You've waited long enough. The groove is getting deep.

Your report is the steering wheel.

Turn the wheel today (~~$197~~ $29) → ${vars.app_url}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
  <p><strong>Hey,</strong></p>

  <p>Every time you repeat the same loop, it gets harder to break.</p>

  <p>It's like a groove in a dirt road.</p>

  <p>The first time, it's easy to steer out.<br>
  The 50th time, your wheels just slide into the rut automatically.</p>

  <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 24px 0; border-radius: 4px;">
    <p style="margin: 0; font-weight: 600; color: #92400E;">Our data shows that 68% of couples in the Yellow Zone move to Crisis (Red Zone) within 18 months if they don't change the pattern.</p>
  </div>

  <p>You feel like you're choosing to react this way. You're not. You're just sliding into the groove.</p>

  <p><strong>You've waited long enough. The groove is getting deep.</strong></p>

  <p>Your report is the steering wheel.</p>

  <p style="text-align: center; margin: 30px 0;">
    <a href="${vars.app_url}/results" class="button">
      Turn the wheel today (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
    </a>
  </p>

  <p>– The UYP Team</p>

  <div class="footer">
    <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
  </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B9: "Last chance" (Day 7 / Final)
export function getTeaserB9Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Your analysis is being archived";

  const text = `Hey,

This is the last email about your results.

We archive incomplete sessions after 7 days for privacy.

If you want to understand your pattern, this is your moment.

Here's what you get for $29 (normally $197):
- Your core pattern breakdown
- The 3 triggers that set you off (and why)
- Scripts to stop the fights
- Your personal relationship manual

Unlock Your Report (~~$197~~ $29) → ${vars.app_url}/results

Don't let this slip away.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
  <p><strong>Hey,</strong></p>

  <p>This is the last email about your results.</p>

  <p>We archive incomplete sessions after 7 days for privacy.</p>

  <p><strong>If you want to understand your pattern, this is your moment.</strong></p>

  <p>Here's what you get for <span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29:</p>

  <ul style="color: #374151;">
    <li>Your core pattern breakdown</li>
    <li>The 3 triggers that set you off (and why)</li>
    <li>Scripts to stop the fights</li>
    <li>Your personal relationship manual</li>
  </ul>

  <p style="text-align: center; margin: 30px 0;">
    <a href="${vars.app_url}/results" class="button">
      Unlock Your Report (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
    </a>
  </p>

  <p>Don't let this slip away.</p>

  <p>– The UYP Team</p>

  <div class="footer">
    <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
  </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
