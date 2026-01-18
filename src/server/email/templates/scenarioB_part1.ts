import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email B1: "I know exactly why you're struggling" (15 minutes after seeing teaser)
export function getTeaserB1Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "I know exactly why you're struggling";

  const text = `Hello,

I saw your results.

You are seeing the relationship through the lens of ${vars.dominant_lens.replace(/_/g, " ")}.

This isn't a flaw. It's a protection mechanism.

But here is the problem: Your partner doesn't know this is happening. They just see your reaction.

In your full Analysis Report, I explain exactly how this lens is distorting your communication—and how to turn it off.

I also give you 3 specific "Script Rewrites" to use the next time you feel triggered.

Unlock Your Full Analysis ($15, reduced from $49): ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hello,</strong></p>
      
      <p>I saw your results.</p>
      
      <p>You are seeing the relationship through the lens of <strong style="color: #8B55A5;">${vars.dominant_lens.replace(/_/g, " ")}</strong>.</p>
      
      <p>This isn't a flaw. It's a protection mechanism.</p>
      
      <p>But here is the problem: <strong>Your partner doesn't know this is happening.</strong> They just see your reaction.</p>
      
      <p>In your full Analysis Report, I explain exactly how this lens is distorting your communication—and how to turn it off.</p>
      
      <p>I also give you 3 specific "Script Rewrites" to use the next time you feel triggered.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Unlock Your Full Analysis (<span style="text-decoration: line-through; opacity: 0.7;">$49</span> $15) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B2: "The hidden pattern" (2 hours later)
export function getTeaserB2Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "The hidden pattern";

  // Use variables carefully - fallback if answers aren't what we expect, though personalization.ts ensures defaults
  const specificInsight = vars.has_high_silence_sensitivity
    ? `You answered "${vars.q4_answer}" to question 4 (about silence making you uncomfortable). This suggests you have high "Disconnect Sensitivity" — you feel emotional distance before it's actually there.`
    : `You noticed a mismatch in how you and your partner handle conflict.`;

  const text = `Hello,

I was looking at your results again...

${specificInsight}

But here's the twist: Your other answers show you have high Conflict Urgency. You don't fear silence, you fear *unresolved tension*.

This specific combination creates a pattern we call "The Pressure Cooker." You're calm until there's a fight, then you need resolution *immediately*.

Your partner probably needs space to process. You need closure now. That's the loop.

See Your Full Breakdown ($15, reduced from $49): ${process.env.WASP_WEB_CLIENT_URL}/results

This isn't a personality quiz. It's a map of your nervous system.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hello,</strong></p>

      <p>I was looking at your results again...</p>
      
      <div style="background-color: #FAF8F5; border-left: 4px solid #8B55A5; padding: 15px; margin: 20px 0; font-style: italic;">
        ${vars.has_high_silence_sensitivity
      ? `You answered "<strong>${vars.q4_answer}</strong>" to question 4 (about silence making you uncomfortable). <br><br>This suggests you have high "Disconnect Sensitivity" — you feel emotional distance before it's actually there.`
      : `You noticed a mismatch in how you and your partner handle conflict.`
    }
      </div>
      
      <p>But here's the twist: Your other answers show you have <strong>high Conflict Urgency</strong>. You don't just dislike silence, you fear <em>unresolved tension</em>.</p>
      
      <p>This specific combination creates a pattern we call "The Pressure Cooker." You're calm until there's a fight, then you need resolution <em>immediately</em>.</p>
      
      <p>Your partner probably needs space to process. You need closure now. That's the loop.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          See Your Full Breakdown (<span style="text-decoration: line-through; opacity: 0.7;">$49</span> $15) →
        </a>
      </p>
      
      <p>This isn't a personality quiz. It's a map of your nervous system.</p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B3: "You surprised me 😮" (3 hours later)
export function getTeaserB3Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Your hidden relationship superpower";

  const dimensionMap: Record<string, { weakness: string; strength: string; script: string }> = {
    silence: {
      weakness: "too sensitive",
      strength: "You feel disconnection before it becomes a crisis. You're the early warning system in your relationship.",
      script: "The problem isn't that you're \"too sensitive.\" The problem is you don't have a script for *what to do* when you feel it.",
    },
    conflict: {
      weakness: "overthink",
      strength: "You notice tension that others miss. You're emotionally intelligent.",
      script: "The problem isn't that you \"overthink.\" The problem is you try to fix it alone, without giving your partner the map.",
    },
    intentions: {
      weakness: "read into things",
      strength: "You assume your partner's actions have meaning. You're looking for connection.",
      script: "The problem isn't that you \"read into things.\" The problem is you're reading the wrong language.",
    },
    reassurance: {
      weakness: "needy",
      strength: "You value emotional connection and aren't afraid to ask for it.",
      script: "The problem isn't that you're \"needy.\" The problem is your partner doesn't know your specific reassurance language.",
    },
    repair: {
      weakness: "hold grudges",
      strength: "You take emotional repair seriously. You don't sweep things under the rug.",
      script: "The problem isn't that you \"hold grudges.\" The problem is you need explicit closure that your partner might not know how to give.",
    },
  };

  const content = dimensionMap[vars.dominant_dimension] || dimensionMap.silence;

  const text = `Hello,

Most people who score high on ${vars.dominant_dimension} see it as a weakness.

You probably do too.

But here's what you don't know:

${vars.dominant_dimension.toUpperCase()} IS ALSO YOUR GREATEST RELATIONSHIP STRENGTH.

Here's why:

${content.strength}

${content.script}

Your full report gives you that script.

People pay $200/hour for couples therapy to learn this.

You can get it for $15 (normally $49).

Unlock Your Full Analysis: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

P.S. — Only 18% of people have your exact profile. You're not broken. You're wired differently.

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p>Hello,</p>
      
      <p>Most people who score high on <strong>${vars.dominant_dimension}</strong> see it as a weakness.</p>
      
      <p>You probably do too.</p>
      
      <p>But here's what you don't know:</p>
      
      <div style="background-color: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <p style="margin: 0; font-weight: 700; color: #8B55A5; text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">${vars.dominant_dimension} is also your greatest relationship strength.</p>
      </div>
      
      <p>Here's why:</p>
      
      <p><strong>${content.strength}</strong></p>
      
      <p>${content.script}</p>
      
      <p><strong>Your full report gives you that script.</strong></p>
      
      <p>People pay $200/hour for couples therapy to learn this.</p>
      
      <p>You can get it for <span style="text-decoration: line-through; opacity: 0.7;">$49</span> $15.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Unlock Your Full Analysis →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <p style="font-size: 14px; color: #64748B; margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
        <strong>P.S.</strong> — Only 18% of people have your exact profile. You're not broken. You're wired differently.
      </p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
