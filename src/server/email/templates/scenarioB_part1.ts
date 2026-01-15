import { type PersonalizationVars } from "../personalization";

// Email B1: "Your Relationship Analysis is Complete" (Immediate)
export function getTeaserB1Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Your results are ready, ${vars.first_name}`;

    const triggersText = vars.top_3_triggers.map((t) => `  • ${t}`).join("\n");

    const text = `Hi ${vars.first_name},

Your UnderstandYourPartner analysis is complete.

Based on your 28 answers, we identified your dominant interpretive lens:

**${vars.dominant_lens.toUpperCase()}**

${vars.lens_short_description}

This is why you react the way you do when your partner:
${triggersText}

You saw the overview. But the full report shows you:
  ✓ The exact moments you misread your partner (and why)
  ✓ The hidden fear driving your reactions
  ✓ The 3 scripts that will de-escalate your next fight

Unlock Your Full Report ($39): ${process.env.WASP_WEB_CLIENT_URL}/results

Most people don't know this about themselves. You do now.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Hi ${vars.first_name},</p>
      
      <p>Your UnderstandYourPartner analysis is complete.</p>
      
      <p>Based on your 28 answers, we identified your dominant interpretive lens:</p>
      
      <div style="background-color: #EEF2FF; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h2 style="color: #4F46E5; margin: 0 0 10px 0; text-transform: capitalize;">${vars.dominant_lens}</h2>
        <p style="margin: 0; color: #1F2937;">${vars.lens_short_description}</p>
      </div>
      
      <p>This is why you react the way you do when your partner:</p>
      <ul style="color: #374151;">
        ${vars.top_3_triggers.map((t) => `<li>${t}</li>`).join("")}
      </ul>
      
      <p>You saw the overview. But the full report shows you:</p>
      <ul style="color: #374151;">
        <li>✓ The exact moments you misread your partner (and why)</li>
        <li>✓ The hidden fear driving your reactions</li>
        <li>✓ The 3 scripts that will de-escalate your next fight</li>
      </ul>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Unlock Your Full Report ($39) →
        </a>
      </p>
      
      <p>Most people don't know this about themselves. You do now.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

// Email B2: "Your answer to Question #4..." (1 hour later)
export function getTeaserB2Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Your answer to Q4 triggered something`;

    const isHighSilenceSensitivity =
        vars.q4_answer === "Strongly Agree" || vars.q4_answer === "Agree";

    const text = `${vars.first_name},

I'm looking at your answer to Question 4:

**"When my partner is silent, I assume something is wrong."**

You answered: **${vars.q4_answer}**

${isHighSilenceSensitivity
            ? `This answer activates what we call the **"Disconnect Alarm"** — your nervous system interprets silence as emotional abandonment.

Here's what's happening in your brain:

Your amygdala (threat detector) learned early in life that silence = danger. So when your partner goes quiet, your body floods with cortisol. You *feel* rejected, even if your partner is just tired.

The problem? Your partner doesn't know this is happening. To them, you're "overreacting." To you, they're "shutting you out."

**This is the mismatch.**

Your full report shows you:
  → The exact physiological pattern you're stuck in
  → Why your partner's silence isn't what you think it is
  → The 60-second grounding script to stop the spiral`
            : `This answer tells me you have **low Disconnect Sensitivity** — you're comfortable with silence.

But here's the twist: Question 11 shows you have **high Conflict Urgency**. You don't fear silence, you fear *unresolved tension*.

This specific combination creates a pattern we call "The Pressure Cooker." You're calm until there's a fight, then you need resolution *immediately*.

Your partner probably needs space to process. You need closure now. That's the loop.`
        }

See Your Full Breakdown ($39): ${process.env.WASP_WEB_CLIENT_URL}/results

This isn't a personality quiz. It's a map of your nervous system.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>I'm looking at your answer to Question 4:</p>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0;">
        <p style="margin: 0; font-style: italic;">"When my partner is silent, I assume something is wrong."</p>
      </div>
      
      <p>You answered: <strong>${vars.q4_answer}</strong></p>
      
      ${isHighSilenceSensitivity
            ? `<p>This answer activates what we call the <strong>"Disconnect Alarm"</strong> — your nervous system interprets silence as emotional abandonment.</p>
      
      <p>Here's what's happening in your brain:</p>
      
      <p>Your amygdala (threat detector) learned early in life that silence = danger. So when your partner goes quiet, your body floods with cortisol. You <em>feel</em> rejected, even if your partner is just tired.</p>
      
      <p>The problem? Your partner doesn't know this is happening. To them, you're "overreacting." To you, they're "shutting you out."</p>
      
      <p style="font-weight: 600; color: #DC2626;">This is the mismatch.</p>
      
      <p>Your full report shows you:</p>
      <ul style="color: #374151;">
        <li>→ The exact physiological pattern you're stuck in</li>
        <li>→ Why your partner's silence isn't what you think it is</li>
        <li>→ The 60-second grounding script to stop the spiral</li>
      </ul>`
            : `<p>This answer tells me you have <strong>low Disconnect Sensitivity</strong> — you're comfortable with silence.</p>
      
      <p>But here's the twist: Question 11 shows you have <strong>high Conflict Urgency</strong>. You don't fear silence, you fear <em>unresolved tension</em>.</p>
      
      <p>This specific combination creates a pattern we call "The Pressure Cooker." You're calm until there's a fight, then you need resolution <em>immediately</em>.</p>
      
      <p>Your partner probably needs space to process. You need closure now. That's the loop.</p>`
        }
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          See Your Full Breakdown ($39) →
        </a>
      </p>
      
      <p>This isn't a personality quiz. It's a map of your nervous system.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

// Email B3: "You surprised me 😮" (3 hours later)
export function getTeaserB3Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Your hidden relationship superpower`;

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

    const text = `${vars.first_name},

Most people who score high on ${vars.dominant_dimension} see it as a weakness.

You probably do too.

But here's what you don't know:

**${vars.dominant_dimension.toUpperCase()} is also your greatest relationship strength.**

Here's why:

${content.strength}

${content.script}

Your full report gives you that script.

People pay $200/hour for couples therapy to learn this.

You can get it for $39.

Unlock Your Full Analysis: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

P.S. — Only 18% of people have your exact profile. You're not broken. You're wired differently.

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>Most people who score high on <strong>${vars.dominant_dimension}</strong> see it as a weakness.</p>
      
      <p>You probably do too.</p>
      
      <p>But here's what you don't know:</p>
      
      <div style="background-color: #ECFDF5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
        <p style="margin: 0; font-weight: 600; color: #065F46; text-transform: uppercase;">${vars.dominant_dimension} is also your greatest relationship strength.</p>
      </div>
      
      <p>Here's why:</p>
      
      <p style="color: #374151;">${content.strength}</p>
      
      <p style="color: #374151;">${content.script}</p>
      
      <p><strong>Your full report gives you that script.</strong></p>
      
      <p>People pay $200/hour for couples therapy to learn this.</p>
      
      <p>You can get it for $39.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Unlock Your Full Analysis →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <p style="font-size: 14px; color: #6b7280;"><strong>P.S.</strong> — Only 18% of people have your exact profile. You're not broken. You're wired differently.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}
