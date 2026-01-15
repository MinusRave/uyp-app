import { type PersonalizationVars } from "../personalization";

// Email B4: "Your conflict results were unexpected" (24 hours later - Day 2)
export function getTeaserB4Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Your conflict style doesn't match your personality`;

    const pmLower = vars.PM_conflict < vars.SL_conflict;

    const text = `${vars.first_name},

I ran your conflict style analysis this morning.

Something stood out:

**Your Partner Model score (how you perceive your partner) doesn't match your Self Lens score (how you react).**

Here's what that means:

${pmLower
            ? `You think your partner handles conflict better than you do.

But your answers show you're actually *more* regulated during fights. You just don't give yourself credit.

This creates a weird dynamic: You defer to them during conflict, even when you're right, because you assume they're the "calm one."

They're not. You are. You just can't see it yet.`
            : `You think your partner escalates conflict more than you do.

But your answers show *you're* the one who needs resolution immediately. Your partner is actually trying to de-escalate by withdrawing.

You interpret their withdrawal as "stonewalling." They interpret your pursuit as "attacking."

Neither of you is wrong. You're just speaking different nervous system languages.`
        }

This is the kind of insight that changes relationships.

See Your Full Conflict Map ($39): ${process.env.WASP_WEB_CLIENT_URL}/results

Most couples fight about the same thing for years because they don't have this map.

You can have it in 2 minutes.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>I ran your conflict style analysis this morning.</p>
      
      <p>Something stood out:</p>
      
      <div style="background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0;">
        <p style="margin: 0; font-weight: 600;">Your Partner Model score (how you perceive your partner) doesn't match your Self Lens score (how you react).</p>
      </div>
      
      <p>Here's what that means:</p>
      
      ${pmLower
            ? `<p>You think your partner handles conflict better than you do.</p>
      
      <p>But your answers show you're actually <em>more</em> regulated during fights. You just don't give yourself credit.</p>
      
      <p>This creates a weird dynamic: You defer to them during conflict, even when you're right, because you assume they're the "calm one."</p>
      
      <p style="font-weight: 600; color: #DC2626;">They're not. You are. You just can't see it yet.</p>`
            : `<p>You think your partner escalates conflict more than you do.</p>
      
      <p>But your answers show <em>you're</em> the one who needs resolution immediately. Your partner is actually trying to de-escalate by withdrawing.</p>
      
      <p>You interpret their withdrawal as "stonewalling." They interpret your pursuit as "attacking."</p>
      
      <p style="font-weight: 600; color: #DC2626;">Neither of you is wrong. You're just speaking different nervous system languages.</p>`
        }
      
      <p>This is the kind of insight that changes relationships.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          See Your Full Conflict Map ($39) →
        </a>
      </p>
      
      <p>Most couples fight about the same thing for years because they don't have this map.</p>
      
      <p>You can have it in 2 minutes.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

// Email B5: "Your answer to Question #14 was fascinating" (48 hours later - Day 3)
export function getTeaserB5Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Only 12% of people answer Q14 the way you did`;

    const isHighIntentionality =
        vars.q14_answer === "Agree" || vars.q14_answer === "Strongly Agree";

    const text = `${vars.first_name},

Question 14 asks:

**"When my partner does something hurtful, I assume they meant to hurt me."**

You answered: **${vars.q14_answer}**

${isHighIntentionality
            ? `This is called **Intentionality Bias** — you attribute negative intent to neutral actions.

Here's why this matters:

When your partner forgets to text you back, you don't think "they're busy." You think "they don't care."

When they don't ask about your day, you don't think "they're distracted." You think "they're selfish."

**This isn't paranoia. It's a cognitive distortion caused by early attachment wounding.**

Your brain learned that people who love you will hurt you, so it scans for evidence of betrayal.

The problem? Your partner doesn't know you're doing this. So when you react to their "intent," they're confused — because they had no intent.

This is the loop that destroys intimacy.

Your full report shows you:
  → The exact childhood pattern that created this bias
  → How to reality-test your assumptions before reacting
  → The script to say "I'm triggered" without blaming them`
            : `This tells me you have **low Intentionality Bias** — you give your partner the benefit of the doubt.

This is rare. And powerful.

But here's the catch: Your other answers show you have **high Reassurance Seeking**. You don't assume bad intent, but you *need* constant proof of good intent.

This creates a paradox: You trust your partner, but you need them to prove it every day.

That's exhausting for both of you.

Your full report shows you how to break this cycle.`
        }

See Your Full Pattern ($39): ${process.env.WASP_WEB_CLIENT_URL}/results

This is the difference between reacting and responding.

– The UYP Team

P.S. — This one insight has saved more relationships than any other in our system.

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>Question 14 asks:</p>
      
      <div style="background-color: #F9FAFB; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0;">
        <p style="margin: 0; font-style: italic;">"When my partner does something hurtful, I assume they meant to hurt me."</p>
      </div>
      
      <p>You answered: <strong>${vars.q14_answer}</strong></p>
      
      ${isHighIntentionality
            ? `<p>This is called <strong>Intentionality Bias</strong> — you attribute negative intent to neutral actions.</p>
      
      <p>Here's why this matters:</p>
      
      <p>When your partner forgets to text you back, you don't think "they're busy." You think "they don't care."</p>
      
      <p>When they don't ask about your day, you don't think "they're distracted." You think "they're selfish."</p>
      
      <p style="font-weight: 600; color: #DC2626;">This isn't paranoia. It's a cognitive distortion caused by early attachment wounding.</p>
      
      <p>Your brain learned that people who love you will hurt you, so it scans for evidence of betrayal.</p>
      
      <p>The problem? Your partner doesn't know you're doing this. So when you react to their "intent," they're confused — because they had no intent.</p>
      
      <p>This is the loop that destroys intimacy.</p>
      
      <p>Your full report shows you:</p>
      <ul style="color: #374151;">
        <li>→ The exact childhood pattern that created this bias</li>
        <li>→ How to reality-test your assumptions before reacting</li>
        <li>→ The script to say "I'm triggered" without blaming them</li>
      </ul>`
            : `<p>This tells me you have <strong>low Intentionality Bias</strong> — you give your partner the benefit of the doubt.</p>
      
      <p>This is rare. And powerful.</p>
      
      <p>But here's the catch: Your other answers show you have <strong>high Reassurance Seeking</strong>. You don't assume bad intent, but you <em>need</em> constant proof of good intent.</p>
      
      <p>This creates a paradox: You trust your partner, but you need them to prove it every day.</p>
      
      <p>That's exhausting for both of you.</p>
      
      <p>Your full report shows you how to break this cycle.</p>`
        }
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          See Your Full Pattern ($39) →
        </a>
      </p>
      
      <p>This is the difference between reacting and responding.</p>
      
      <p>– The UYP Team</p>
      
      <p style="font-size: 14px; color: #6b7280;"><strong>P.S.</strong> — This one insight has saved more relationships than any other in our system.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

// Email B6: "Your science-based results are ready" (72 hours later - Day 4)
export function getTeaserB6Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `This isn't a personality quiz. It's neuroscience.`;

    const lensExplanation: Record<string, string> = {
        silence: `Your high Silence Sensitivity isn't "neediness."

It's your ventral vagal system (the part of your nervous system that craves connection) going into threat mode when it doesn't receive social cues.

Your partner's silence triggers a dorsal vagal shutdown response — the same response your body has when it's being abandoned.

**You're not overreacting. You're having a physiological survival response.**

The fix isn't "stop being sensitive." The fix is teaching your nervous system that silence ≠ abandonment.

Your report gives you the exact protocol.`,
        conflict: `Your high Conflict Sensitivity isn't "anxiety."

It's your sympathetic nervous system detecting unresolved threat. When there's tension, your body stays in fight-or-flight until it's resolved.

Your partner might be able to "let it go." You physiologically can't — not without explicit repair.

**You're not being difficult. Your nervous system requires closure to feel safe.**

The fix isn't "stop caring so much." The fix is teaching your partner your specific repair protocol.

Your report gives you the exact script.`,
        intentions: `Your Intentionality Bias isn't "paranoia."

It's your brain's threat-detection system over-indexing on negative cues. This happens when early relationships taught you that love = pain.

Your amygdala scans for evidence of betrayal to protect you from being blindsided again.

**You're not broken. You're hyper-vigilant because you had to be.**

The fix isn't "just trust more." The fix is reality-testing your assumptions before they become accusations.

Your report gives you the exact framework.`,
        reassurance: `Your need for Reassurance isn't "neediness."

It's your attachment system requiring explicit confirmation of safety. When you don't get it, your nervous system interprets it as threat.

Your partner might show love through actions. But your brain needs words to register safety.

**You're not high-maintenance. You have a specific reassurance language.**

The fix isn't "need less." The fix is teaching your partner your exact reassurance protocol.

Your report gives you the script.`,
        repair: `Your need for Repair isn't "holding grudges."

It's your nervous system requiring explicit closure before it can return to baseline. Without it, you stay in a low-grade threat state.

Your partner might think "we're fine" after a fight. Your body doesn't — not without explicit repair.

**You're not being petty. You're physiologically unable to reconnect without closure.**

The fix isn't "let it go faster." The fix is teaching your partner your specific repair sequence.

Your report gives you the protocol.`,
    };

    const explanation = lensExplanation[vars.dominant_dimension] || lensExplanation.silence;

    const text = `${vars.first_name},

I need to be clear about something:

**This isn't a BuzzFeed quiz.**

Your results are based on:
  • Internal Family Systems (IFS) — the gold standard in trauma therapy
  • Attachment Theory — 50+ years of peer-reviewed research
  • Polyvagal Theory — how your nervous system hijacks your behavior

When you see your full report, you'll notice we don't just tell you *what* you do.

We tell you *why* — at the neurological level.

Example:

${explanation}

This is clinical-grade analysis.

For $39.

Access Your Full Report: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

P.S. — We've had therapists buy this for their clients. It's that accurate.

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>${vars.first_name},</p>
      
      <p>I need to be clear about something:</p>
      
      <p style="font-size: 18px; font-weight: 600; color: #DC2626;">This isn't a BuzzFeed quiz.</p>
      
      <p>Your results are based on:</p>
      <ul style="color: #374151;">
        <li>Internal Family Systems (IFS) — the gold standard in trauma therapy</li>
        <li>Attachment Theory — 50+ years of peer-reviewed research</li>
        <li>Polyvagal Theory — how your nervous system hijacks your behavior</li>
      </ul>
      
      <p>When you see your full report, you'll notice we don't just tell you <em>what</em> you do.</p>
      
      <p>We tell you <em>why</em> — at the neurological level.</p>
      
      <p><strong>Example:</strong></p>
      
      <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; white-space: pre-line; color: #1F2937;">${explanation}</p>
      </div>
      
      <p>This is clinical-grade analysis.</p>
      
      <p>For $39.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Access Your Full Report →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <p style="font-size: 14px; color: #6b7280;"><strong>P.S.</strong> — We've had therapists buy this for their clients. It's that accurate.</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}
