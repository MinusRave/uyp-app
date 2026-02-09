import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email B1: "Your [SCORE] is in the Yellow Zone" (Immediate after seeing teaser)
export function getTeaserB1Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "I saw your results.";

  const lensName = vars.dominant_lens.replace(/_/g, " ");

  // SNIPER INJECTION: Use AI Cold Truth if available, otherwise fallback to generic
  const openingHook = vars.ai_cold_truth
    ? `I was analyzing your answers and I need to be direct:
    
    "${vars.ai_cold_truth}"`
    : `You're seeing the relationship through the lens of ${lensName}.
    
    That's not a flaw. It's how you learned to stay safe.`;

  const text = `Hey,

I saw your results.

${openingHook}

But here's the problem: Your partner doesn't know this is happening. They just see you reacting.

Remember the blurred section on your report? Here's what's inside:

→ The Circuit Breaker Script (stops fights before they spiral)
→ Why your last fight really happened
→ What your partner is actually trying to say (translation guide)

This isn't therapy. It's a map of what's actually happening when you fight.

Unlock Your Report (~~$197~~ $29) → ${vars.app_url}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  // HTML VERSION
  const htmlHook = vars.ai_cold_truth
    ? `<p>I was analyzing your answers and I need to be direct:</p>
       <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px; margin: 24px 0; font-style: italic; color: #7F1D1D;">
          "${vars.ai_cold_truth}"
       </div>`
    : `<p>You're seeing the relationship through the lens of <strong style="color: #8B55A5;">${lensName}</strong>.</p>
       <p>That's not a flaw. It's how you learned to stay safe.</p>`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>I saw your results.</p>
      
      ${htmlHook}
      
      <p>But here's the problem: <strong>Your partner doesn't know this is happening.</strong> They just see you reacting.</p>
      
      <p style="font-size: 15px; color: #64748B; margin: 20px 0;">Remember the blurred section on your report? Here's what's inside:</p>
      
      <div style="background-color: #FAF8F5; border-left: 4px solid #8B55A5; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0; color: #334155;">→ The Circuit Breaker Script (stops fights before they spiral)</p>
        <p style="margin: 0 0 8px 0; color: #334155;">→ Why your last fight really happened</p>
        <p style="margin: 0; color: #334155;">→ What your partner is actually trying to say (translation guide)</p>
      </div>
      
      <p>This isn't therapy. It's a map of what's actually happening when you fight.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${vars.app_url}/results" class="button">
          Unlock Your Report (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B2: "The [DIMENSION] Loop" (1 hour later)
export function getTeaserB2Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "The loop you're stuck in";

  const text = `Hey,

I was looking at your answers again.

You panic when there's unresolved tension.

Not "I'm uncomfortable." More like "I can't think straight until we fix this."

That's why you need to talk it out NOW. Your partner probably needs space to process.

You: "We need to fix this right now."
Them: *pulls away*
You: *panic intensifies*
Them: *pulls away harder*

That's the loop.

Your report shows you exactly how to break it.

See Your Full Report (~~$197~~ $29) → ${vars.app_url}/results

This isn't a personality quiz. It's a map of what's actually happening.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>

      <p>I was looking at your answers again.</p>
      
      <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: 600; color: #92400E;">You panic when there's unresolved tension.</p>
      </div>
      
      <p>Not "I'm uncomfortable." More like <strong>"I can't think straight until we fix this."</strong></p>
      
      <p>That's why you need to talk it out NOW. Your partner probably needs space to process.</p>
      
      <div style="background-color: #FAF8F5; padding: 20px; margin: 24px 0; border-radius: 8px; font-family: monospace; font-size: 14px; line-height: 1.8;">
        <p style="margin: 0 0 8px 0; color: #DC2626;"><strong>You:</strong> "We need to fix this right now."</p>
        <p style="margin: 0 0 8px 0; color: #334155;"><strong>Them:</strong> <em>*pulls away*</em></p>
        <p style="margin: 0 0 8px 0; color: #DC2626;"><strong>You:</strong> <em>*panic intensifies*</em></p>
        <p style="margin: 0; color: #334155;"><strong>Them:</strong> <em>*pulls away harder*</em></p>
      </div>
      
      <p style="font-size: 18px; font-weight: 600; color: #122639;">That's the loop.</p>
      
      <p>Your report shows you exactly how to break it.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${vars.app_url}/results" class="button">
          See Your Full Report (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
        </a>
      </p>
      
      <p style="font-size: 14px; color: #64748B; font-style: italic;">This isn't a personality quiz. It's a map of what's actually happening.</p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B3: "Only 18% score like you" (3 hours later)
export function getTeaserB3Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Only 18% score like you";

  const dimensionMap: Record<string, { truth: string; fix: string }> = {
    silence: {
      truth: "You feel disconnection before it becomes a crisis. You're the early warning system.",
      fix: "The problem isn't that you're 'too sensitive.' The problem is you don't have a script for what to do when you feel it.",
    },
    conflict: {
      truth: "You notice tension that others miss. You're emotionally intelligent.",
      fix: "The problem isn't that you 'overthink.' The problem is you try to fix it alone, without giving your partner the map.",
    },
    intentions: {
      truth: "You assume your partner's actions have meaning. You're looking for connection.",
      fix: "The problem isn't that you 'read into things.' The problem is you're reading the wrong language.",
    },
    reassurance: {
      truth: "You value emotional connection and aren't afraid to ask for it.",
      fix: "The problem isn't that you're 'needy.' The problem is your partner doesn't know your specific reassurance language.",
    },
    repair: {
      truth: "You take emotional repair seriously. You don't sweep things under the rug.",
      fix: "The problem isn't that you 'hold grudges.' The problem is you need explicit closure that your partner might not know how to give.",
    },
  };

  const content = dimensionMap[vars.dominant_dimension] || dimensionMap.silence;

  const text = `Hey,

Most people who score high on ${vars.dominant_dimension} think something's wrong with them.

You probably do too.

Here's the truth:

${content.truth}

${content.fix}

Your full report gives you that script.

People pay $200/hour for couples therapy to learn this. You can get it for $29 (normally $197).

Unlock Your Report → ${vars.app_url}/results

– The UYP Team

P.S. — Only 18% of people have your exact scores. This isn't common. That's why it feels so lonely.

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p>Hey,</p>
      
      <p>Most people who score high on <strong>${vars.dominant_dimension}</strong> think something's wrong with them.</p>
      
      <p>You probably do too.</p>
      
      <p>Here's the truth:</p>
      
      <div style="background-color: #DBEAFE; border-left: 4px solid #3B82F6; padding: 20px; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: 600; color: #1E40AF;">${content.truth}</p>
      </div>
      
      <p>${content.fix}</p>
      
      <p><strong>Your full report gives you that script.</strong></p>
      
      <div style="background-color: #FAF8F5; padding: 20px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 8px 0; color: #64748B; font-size: 14px;">People pay $200/hour for couples therapy to learn this.</p>
        <p style="margin: 0; font-size: 18px; font-weight: 600; color: #122639;">You can get it for <span style="text-decoration: line-through; opacity: 0.6; color: #94A3B8;">$197</span> $29.</p>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${vars.app_url}/results" class="button">
          Unlock Your Report →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <p style="font-size: 14px; color: #64748B; margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
        <strong>P.S.</strong> — Only 18% of people have your exact scores. This isn't common. That's why it feels so lonely.
      </p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
