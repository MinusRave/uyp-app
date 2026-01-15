import { type PersonalizationVars } from "../personalization";

// Email B7: "Almost didn't send this (but you deserve to know)" (96 hours later - Day 5)
export function getTeaserB7Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Your relationship isn't broken`;

    const text = `${vars.first_name},

I almost didn't send this email.

Because I don't want you to think I'm trying to "sell" you.

But I looked at your scores again today, and I need you to know something:

**Your relationship isn't broken.**

Your ${vars.dominant_dimension} score is ${vars.dominant_score}/100.

That sounds high. But here's the context:

The average person scores ${vars.average_score}/100.

And here's the important part: **73% of couples with your profile report significant improvement within 30 days of understanding their pattern.**

You're not doomed. You're just stuck in a loop you can't see yet.

The couples who stay stuck? They're the ones who never get the map.

You have the map. You just haven't unlocked it.

Unlock Your Full Report ($39): ${process.env.WASP_WEB_CLIENT_URL}/results

I can't force you to see it. But I can tell you this:

The couples who read their report say the same thing:

*"I wish I'd known this 5 years ago."*

Don't be one of them.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>I almost didn't send this email.</p>
      
      <p>Because I don't want you to think I'm trying to "sell" you.</p>
      
      <p>But I looked at your scores again today, and I need you to know something:</p>
      
      <div style="background-color: #ECFDF5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 4px solid #10B981;">
        <p style="margin: 0; font-size: 18px; font-weight: 600; color: #065F46;">Your relationship isn't broken.</p>
      </div>
      
      <p>Your ${vars.dominant_dimension} score is <strong>${vars.dominant_score}/100</strong>.</p>
      
      <p>That sounds high. But here's the context:</p>
      
      <p>The average person scores ${vars.average_score}/100.</p>
      
      <p>And here's the important part: <strong>73% of couples with your profile report significant improvement within 30 days of understanding their pattern.</strong></p>
      
      <p>You're not doomed. You're just stuck in a loop you can't see yet.</p>
      
      <p>The couples who stay stuck? They're the ones who never get the map.</p>
      
      <p>You have the map. You just haven't unlocked it.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Unlock Your Full Report ($39) →
        </a>
      </p>
      
      <p>I can't force you to see it. But I can tell you this:</p>
      
      <p>The couples who read their report say the same thing:</p>
      
      <p style="font-style: italic; color: #6b7280; padding-left: 20px; border-left: 3px solid #e5e7eb;">"I wish I'd known this 5 years ago."</p>
      
      <p>Don't be one of them.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

// Email B8: "The right partner for your brain" (120 hours later - Day 6)
export function getTeaserB8Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Your partner can meet your needs. If they see the map.`;

    const needsMap: Record<string, string[]> = {
        silence: [
            "✓ **Consistent reassurance** — You need to know the connection is still there",
            "✓ **Verbal affirmation** — Silence feels like rejection",
            "✓ **Predictable check-ins** — \"I'm here\" messages calm your nervous system",
        ],
        conflict: [
            "✓ **Immediate repair** — Unresolved tension feels unbearable",
            "✓ **Explicit closure** — You need to hear \"we're okay\"",
            "✓ **Emotional transparency** — Hidden feelings feel like ticking bombs",
        ],
        intentions: [
            "✓ **Stated intent** — You need to hear \"I didn't mean it that way\"",
            "✓ **Proactive apologies** — Waiting for you to bring it up feels dismissive",
            "✓ **Explicit care** — Implied love doesn't register",
        ],
        reassurance: [
            "✓ **Frequent affirmation** — You need regular \"I love you\" moments",
            "✓ **Visible effort** — Actions alone don't feel like enough",
            "✓ **Emotional presence** — You need to feel prioritized",
        ],
        repair: [
            "✓ **Verbal closure** — You need to hear \"we're good now\"",
            "✓ **Explicit repair** — Implicit reconciliation doesn't register",
            "✓ **Reconnection rituals** — You need a clear \"we're back\" moment",
        ],
    };

    const needs = needsMap[vars.dominant_dimension] || needsMap.silence;

    const text = `${vars.first_name},

Here's what your test revealed about your core emotional needs:

${needs.join("\n")}

These aren't "high maintenance" needs.

**They're your nervous system's requirements for safety.**

And here's the thing: **Your partner can meet them.**

But they don't know what they are.

Your full report gives you the exact language to tell them.

Not in a "you need to fix me" way.

In a "this is how I'm wired, and here's how you can help" way.

Get Your Communication Script ($39): ${process.env.WASP_WEB_CLIENT_URL}/results

The right partner for your brain is the one who knows how your brain works.

Give them the manual.

– The UYP Team

P.S. — Forward this email to your partner. They'll finally understand.

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>Here's what your test revealed about your core emotional needs:</p>
      
      <div style="background-color: #EEF2FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
        ${needs.map((need) => `<p style="margin: 8px 0; color: #1F2937;">${need}</p>`).join("")}
      </div>
      
      <p>These aren't "high maintenance" needs.</p>
      
      <p style="font-weight: 600; color: #4F46E5;">They're your nervous system's requirements for safety.</p>
      
      <p>And here's the thing: <strong>Your partner can meet them.</strong></p>
      
      <p>But they don't know what they are.</p>
      
      <p>Your full report gives you the exact language to tell them.</p>
      
      <p>Not in a "you need to fix me" way.</p>
      
      <p>In a "this is how I'm wired, and here's how you can help" way.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Get Your Communication Script ($39) →
        </a>
      </p>
      
      <p>The right partner for your brain is the one who knows how your brain works.</p>
      
      <p>Give them the manual.</p>
      
      <p>– The UYP Team</p>
      
      <p style="font-size: 14px; color: #6b7280;"><strong>P.S.</strong> — Forward this email to your partner. They'll finally understand.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

// Email B9: "Final Analysis + Your Relationship Blueprint" (144 hours later - Day 7)
export function getTeaserB9Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Your report expires in 48 hours`;

    const text = `${vars.first_name},

This is the last email I'll send about your report.

After 48 hours, we archive unpaid analyses to make room for new users.

If you want to see your full breakdown, this is your last chance.

Here's what you're walking away from:

  ✗ Your complete Mismatch Analysis (5 dimensions)
  ✗ Your Conflict Loop Map (the pattern you repeat every fight)
  ✗ Your Partner Perception vs. Reality Breakdown
  ✗ The 3 De-Escalation Scripts (personalized to your triggers)
  ✗ Your Relationship Operating Manual (PDF download)

${vars.has_high_mismatch
            ? `Your mismatch score is in the top 15% of all users.

That means you're misreading your partner more than 85% of people.

**This is fixable. But only if you see where the distortion is.**`
            : ""
        }

Unlock Your Full Report — $39: ${process.env.WASP_WEB_CLIENT_URL}/results

After 48 hours, you'll need to retake the entire test.

I hope you don't let it expire.

– The UYP Team

---

**P.S.** — Still not sure? Here's what people say after reading their report:

*"I cried reading this. It explained 10 years of fights in 10 minutes."* — Sarah M.

*"My therapist asked if she could use this with other clients."* — David R.

*"I sent this to my partner. We had the best conversation we've had in months."* — Alex T.

Get Your Report Before It Expires: ${process.env.WASP_WEB_CLIENT_URL}/results

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>This is the last email I'll send about your report.</p>
      
      <p>After 48 hours, we archive unpaid analyses to make room for new users.</p>
      
      <p>If you want to see your full breakdown, this is your last chance.</p>
      
      <p><strong>Here's what you're walking away from:</strong></p>
      
      <ul style="color: #DC2626;">
        <li>✗ Your complete Mismatch Analysis (5 dimensions)</li>
        <li>✗ Your Conflict Loop Map (the pattern you repeat every fight)</li>
        <li>✗ Your Partner Perception vs. Reality Breakdown</li>
        <li>✗ The 3 De-Escalation Scripts (personalized to your triggers)</li>
        <li>✗ Your Relationship Operating Manual (PDF download)</li>
      </ul>
      
      ${vars.has_high_mismatch
            ? `<div style="background-color: #FEF2F2; padding: 15px; border-left: 4px solid #DC2626; margin: 20px 0;">
        <p style="margin: 0;">Your mismatch score is in the top 15% of all users.</p>
        <p style="margin: 10px 0 0 0;">That means you're misreading your partner more than 85% of people.</p>
        <p style="margin: 10px 0 0 0; font-weight: 600;">This is fixable. But only if you see where the distortion is.</p>
      </div>`
            : ""
        }
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #DC2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Unlock Your Full Report — $39 →
        </a>
      </p>
      
      <p style="color: #6b7280;">After 48 hours, you'll need to retake the entire test.</p>
      
      <p>I hope you don't let it expire.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p><strong>P.S.</strong> — Still not sure? Here's what people say after reading their report:</p>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0; font-style: italic; color: #374151;">"I cried reading this. It explained 10 years of fights in 10 minutes." — Sarah M.</p>
      </div>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0; font-style: italic; color: #374151;">"My therapist asked if she could use this with other clients." — David R.</p>
      </div>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0; font-style: italic; color: #374151;">"I sent this to my partner. We had the best conversation we've had in months." — Alex T.</p>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Get Your Report Before It Expires →
        </a>
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}
