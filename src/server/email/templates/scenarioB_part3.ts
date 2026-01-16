import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email B7: "The 6-second trick" (Day 5)
export function getTeaserB7Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "The 6-second trick that rewires your brain";

  const text = `${vars.first_name},

I want to give you a tool you can use tonight.

It's based on research by Dr. John Gottman, but tailored for your **${vars.dominant_lens.replace(/_/g, " ")}** lens.

It's called the "6-Second Micro-Connection."

Most couples kiss for 1 second. It's a habit, not a connection.

But a 6-second kiss (or hug) releases oxytocin. It tells your amygdala—the part of your brain scanning for threats—that you are safe.

For your specific profile, this is critical because:

${getLensSpecificTip(vars.dominant_lens)}

Your Relationship Guide is full of these micro-habit adjustments. They take seconds, but they change everything.

Get The Full Toolkit ($15): ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
  <p><strong>${vars.first_name},</strong></p>

  <p>I want to give you a tool you can use tonight.</p>

  <p>It's based on research by Dr. John Gottman, but tailored for your <strong style="color: #8B55A5;">${vars.dominant_lens.replace(/_/g, " ")}</strong> lens.</p>

  <p>It's called the <strong>"6-Second Micro-Connection."</strong></p>

  <p>Most couples kiss for 1 second. It's a habit, not a connection.</p>

  <p>But a 6-second kiss (or hug) releases oxytocin. It tells your amygdala—the part of your brain scanning for threats—that you are safe.</p>

  <p>For your specific profile, this is critical because:</p>

  <div style="background-color: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B55A5;">
    <p style="margin: 0; font-style: italic;">${getLensSpecificTip(vars.dominant_lens)}</p>
  </div>

  <p>Your Relationship Guide is full of these micro-habit adjustments. They take seconds, but they change everything.</p>

  <p style="text-align: center; margin: 30px 0;">
    <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
      Get The Full Toolkit ($15) →
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
    silence: "Your nervous system interprets distance as danger. This physical reset button proves valuable safety instantly.",
    conflict: "You physically hold tension in your body. This forces your shoulders to drop and your breathing to regulate.",
    intentions: "You spend a lot of time analyzing words. This bypasses the analytical brain and goes straight to the emotional brain.",
    reassurance: "You crave verbal validation, but physical validation is actually faster at calming your anxiety spike.",
    repair: "You wait for the 'perfect moment' to reconnect. This creates a moment without needing to talk it out first."
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

  const text = `${vars.first_name},

There is a concept in psychology called "pattern entrenchment."

Every time you repeat a loop—like the ${vars.dominant_lens} loop you're in—it's like carving a groove deeper into a dirt road.

The first time, it's easy to steer out.
The 50th time, your wheels just slide into the rut automatically.

You feel like you're choosing to react this way. Actually, you're just sliding into the groove.

You've waited long enough. The groove is getting deep.

Your Relationship Guide is the steering wheel.

Turn the wheel today ($15): ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
  <p><strong>${vars.first_name},</strong></p>

  <p>There is a concept in psychology called "pattern entrenchment."</p>

  <p>Every time you repeat a loop—like the <strong>${vars.dominant_lens.replace(/_/g, " ")}</strong> loop you're in—it's like carving a groove deeper into a dirt road.</p>

  <p>The first time, it's easy to steer out.<br>
  The 50th time, your wheels just slide into the rut automatically.</p>

  <p>You feel like you're choosing to react this way. Actually, you're just sliding into the groove.</p>

  <p><strong>You've waited long enough. The groove is getting deep.</strong></p>

  <p>Your Relationship Guide is the steering wheel.</p>

  <p style="text-align: center; margin: 30px 0;">
    <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
      Turn the wheel today ($15) →
    </a>
  </p>

  <p>– The UYP Team</p>

  <div class="footer">
    <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
  </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B9: "This cart is closing" (Day 7 / Final)
export function getTeaserB9Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Your analysis is being archived";

  const text = `${vars.first_name},

This is the last email regarding your test results.

We archive incomplete sessions after 7 days for privacy reasons.

If you want to understand your pattern, this is your moment.

Here is what you get for $15:
- Your core "Lens" breakdown
- The 3 triggers that set you off (and why)
- Custom scripts to stop the fights
- Your personal Relationship Operating Manual

Unlock Your Full Report ($15): ${process.env.WASP_WEB_CLIENT_URL}/results

Don't let this insight slip away.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
  <p><strong>${vars.first_name},</strong></p>

  <p>This is the last email regarding your test results.</p>

  <p>We archive incomplete sessions after 7 days for privacy reasons.</p>

  <p><strong>If you want to understand your pattern, this is your moment.</strong></p>

  <p>Here is what you get for $15:</p>

  <ul style="color: #374151;">
    <li>Your core "Lens" breakdown</li>
    <li>The 3 triggers that set you off (and why)</li>
    <li>Custom scripts to stop the fights</li>
    <li>Your personal Relationship Operating Manual</li>
  </ul>

  <p style="text-align: center; margin: 30px 0;">
    <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
      Unlock Your Full Report ($15) →
    </a>
  </p>

  <p>Don't let this insight slip away.</p>

  <p>– The UYP Team</p>

  <div class="footer">
    <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
  </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
