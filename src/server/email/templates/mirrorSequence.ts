import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// ==========================================
// MIRROR STRATEGY EMAIL SEQUENCE
// Redesigned per "Sell Like Crazy" playbook:
// - 2/3 value, 1/3 offer (value in body, offer in P.S.)
// - Subject lines: very short (2-4 words) OR very long
// - Tone: best friend, first person, "I" not "We"
// - Embedded commands for CTAs
// - Plain text preferred; minimal HTML styling
// ==========================================

const addUtm = (appUrl: string, stage: number, sessionId: string) => {
  return `${appUrl}/results?session=${sessionId}&utm_source=email&utm_medium=retention&utm_campaign=mirror&utm_content=mirror_${stage}`;
};

const signoff = `Talk soon,\nG.`;
const signoffHtml = `<p>Talk soon,<br/>G.</p>`;

// ==========================================
// EMAIL 1: THE PATTERN INTERRUPT (Immediate)
// Goal: VALUE — Give one real insight + actionable technique
// Playbook: Magic Lantern piece #1
// ==========================================
export function getMirror1_ColdTruth(vars: PersonalizationVars) {
  const subject = `Read this tonight`;
  const preheader = `One sentence that changes how your next fight ends.`;
  const link = addUtm(vars.app_url, 1, vars.session_id);

  const text = `
You just spent 10 minutes answering questions most people avoid for years. That took guts.

Here's something I want you to try tonight.

The next time you feel the tension rising — the familiar knot in your stomach, the urge to either snap or shut down — I want you to pause and say this to yourself:

"This is the ${vars.quick_overview_result_badge} pattern. It's happening again."

That's it. Don't fix anything. Don't say anything to your partner. Just name it silently.

Why this works: when you name what's happening, your brain switches from panic mode to thinking mode. You go from reacting to observing. That one shift changes everything.

One sentence. Tonight. Try it.

${signoff}

P.S. Your full analysis has 15 more techniques like this — specific to your pattern. Go ahead and open it here: ${link}

Unsubscribe: ${vars.unsubscribe_url}
  `;

  const contentHtml = `
    <p>You just spent 10 minutes answering questions most people avoid for years. That took guts.</p>

    <p>Here's something I want you to try tonight.</p>

    <p>The next time you feel the tension rising — the familiar knot in your stomach, the urge to either snap or shut down — I want you to pause and say this to yourself:</p>

    <p style="padding: 16px 20px; background-color: #F8F6F3; border-left: 3px solid #8B55A5; margin: 24px 0; font-style: italic;">
      "This is the ${vars.quick_overview_result_badge} pattern. It's happening again."
    </p>

    <p>That's it. Don't fix anything. Don't say anything to your partner. Just name it silently.</p>

    <p><strong>Why this works:</strong> when you name what's happening, your brain switches from panic mode to thinking mode. You go from reacting to observing. That one shift changes everything.</p>

    <p>One sentence. Tonight. Try it.</p>

    ${signoffHtml}

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E0D8; font-size: 14px; color: #64748B;">
      P.S. Your full analysis has 15 more techniques like this — specific to your pattern.
      <a href="${link}">Go ahead and open it here.</a>
    </p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject, preheader), text };
}

// ==========================================
// EMAIL 2: THE EXIT CODE (1 Hour)
// Goal: VALUE — Teach one actual "repair" technique
// Playbook: Magic Lantern piece #2
// ==========================================
export function getMirror2_VitalSign(vars: PersonalizationVars) {
  const subject = `Your bounce-back speed is ${vars.metric_repair_efficiency}%`;
  const preheader = `This is why your fights drag on for days.`;
  const link = addUtm(vars.app_url, 2, vars.session_id);

  const text = `
"We have communication issues."

Everyone says that. It's too vague to fix.

Your data tells a more specific story: your bounce-back speed is ${vars.metric_repair_efficiency}%.

This measures how fast you and your partner get back to normal after a fight. Low = fights drag on for days. High = you fight, you fix it, you move on.

Here's Exit Code #1 (couples with high repair scores all use this):

When a fight is escalating, one partner says: "I need 20 minutes. I'm not leaving the conversation — I'm pausing it so I can come back better."

That's it. Not "I need space" (feels like abandonment). Not storming out (feels like punishment). A specific time. A specific promise to return.

This works because a 20-minute break lets both of you calm down. When you come back, you can think clearly again instead of just reacting.

Try it next time. Even if it feels awkward.

${signoff}

P.S. Exit Codes #2 and #3 are in Chapter 2 of your report — they're designed for your specific situation. Claim your report here: ${link}

Unsubscribe: ${vars.unsubscribe_url}
  `;

  const contentHtml = `
    <p><strong>"We have communication issues."</strong></p>

    <p>Everyone says that. It's too vague to fix.</p>

    <p>Your data tells a more specific story: your <strong>bounce-back speed is ${vars.metric_repair_efficiency}%</strong>.</p>

    <p>This measures how fast you and your partner get back to normal after a fight. Low = fights drag on for days. High = you fight, you fix it, you move on.</p>

    <p><strong>Here's Exit Code #1</strong> (couples with high repair scores all use this):</p>

    <p style="padding: 16px 20px; background-color: #F8F6F3; border-left: 3px solid #8B55A5; margin: 24px 0;">
      When a fight is escalating, one partner says: <em>"I need 20 minutes. I'm not leaving the conversation — I'm pausing it so I can come back better."</em>
    </p>

    <p>That's it. Not "I need space" (feels like abandonment). Not storming out (feels like punishment). A specific time. A specific promise to return.</p>

    <p>This works because a 20-minute break lets both of you calm down. When you come back, you can think clearly again instead of just reacting.</p>

    <p>Try it next time. Even if it feels awkward.</p>

    ${signoffHtml}

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E0D8; font-size: 14px; color: #64748B;">
      P.S. Exit Codes #2 and #3 are in Chapter 2 of your report — designed for your specific situation.
      <a href="${link}">Claim your report here.</a>
    </p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject, preheader), text };
}

// ==========================================
// EMAIL 3: THE REFRAME (24 Hours)
// Goal: VALUE — The compatibility reframe (moved from M5)
// Playbook: Magic Lantern piece #3
// ==========================================
export function getMirror3_Forecast(vars: PersonalizationVars) {
  const subject = `You're compatible`;
  const preheader = `This number surprised me. It should surprise you too.`;
  const link = addUtm(vars.app_url, 3, vars.session_id);

  const text = `
I want to show you one number that should change how you see everything.

How well you two fit together: ${vars.metric_compatibility_quotient}%

I know — you probably expected bad news. But this is the tragedy of your situation: you value the same things. You want the same future. You are good teammates who have forgotten how to pass the ball.

Most couples who break up are genuinely incompatible — different values, different life goals, different visions. That's not you.

You're at risk of breaking up because you're out of sync. The parts work. The timing is off.

Here's one thing to sit with today: the next time you feel frustrated with your partner, ask yourself — "Is this a values problem, or a timing problem?"

If the answer is timing (and based on your data, it almost certainly is), that changes everything. Because timing can be fixed. Being wrong for each other can't.

${signoff}

P.S. Your report contains the exact step-by-step plan for your specific pattern — step by step, week by week. Open it here: ${link}

Unsubscribe: ${vars.unsubscribe_url}
  `;

  const contentHtml = `
    <p>I want to show you one number that should change how you see everything.</p>

    <p style="padding: 16px 20px; background-color: #ECFDF5; border-left: 3px solid #10B981; margin: 24px 0; font-size: 18px;">
      <strong>How well you two fit together: ${vars.metric_compatibility_quotient}%</strong>
    </p>

    <p>I know — you probably expected bad news. But this is the tragedy of your situation: you value the same things. You want the same future. You are good teammates who have forgotten how to pass the ball.</p>

    <p>Most couples who break up are genuinely incompatible — different values, different life goals, different visions. <strong>That's not you.</strong></p>

    <p>You're at risk of breaking up because you're <strong>uncalibrated</strong>. The machine works. The settings are off.</p>

    <p>Here's one thing to sit with today: the next time you feel frustrated with your partner, ask yourself — <em>"Is this a values problem, or a timing problem?"</em></p>

    <p>If the answer is timing (and based on your data, it almost certainly is), that changes everything. Because timing can be fixed. Being wrong for each other can't.</p>

    ${signoffHtml}

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E0D8; font-size: 14px; color: #64748B;">
      P.S. Your report contains the exact step-by-step plan for your specific pattern — step by step, week by week.
      <a href="${link}">Open it here.</a>
    </p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject, preheader), text };
}

// ==========================================
// EMAIL 4: THE MANAGER TRAP (48 Hours)
// Goal: VALUE + SOFT OFFER — Genuine insight about the dynamic
// Playbook: Value body, offer in P.S.
// ==========================================
export function getMirror4_Manager(vars: PersonalizationVars) {
  const subject = `Manager or partner?`;
  const preheader = `The #1 thing that kills desire. And you're doing it.`;
  const link = addUtm(vars.app_url, 4, vars.session_id);

  const text = `
I need to tell you something uncomfortable.

Your "who does more" score is ${vars.metric_ceo_vs_intern}%.

This means one of you is carrying way more than the other. One of you is "managing" — tracking the groceries, the appointments, the kids' schedules, the emotional temperature of the house. The other is "reporting in."

Here's the brutal truth: you cannot desire someone you are managing. And they cannot desire someone who acts like their parent.

This is the #1 thing that kills desire. (Your spark score is ${vars.metric_erotic_potential}% — and now you know why.)

One thing you can try this week: pick ONE task you've been managing and fully hand it over. Not "can you handle this?" (that's still managing). Just stop doing it. Let it be imperfect. Let the ball drop if it drops.

This feels terrifying. But it's the only way to stop being the CEO and start being the partner again.

${signoff}

P.S. Chapter 5 of your report is essentially a resignation letter from the Manager role — with scripts for having the conversation without it turning into a fight. Go ahead and read it: ${link}

Unsubscribe: ${vars.unsubscribe_url}
  `;

  const contentHtml = `
    <p>I need to tell you something uncomfortable.</p>

    <p>Your <strong>CEO vs Intern Score is ${vars.metric_ceo_vs_intern}%</strong>.</p>

    <p>This means there's a significant power imbalance in your relationship. One of you is "managing" — tracking the groceries, the appointments, the kids' schedules, the emotional temperature of the house. The other is "reporting in."</p>

    <p>Here's the brutal truth: <strong>you cannot desire someone you are managing.</strong> And they cannot desire someone who acts like their parent.</p>

    <p>This is the #1 thing that kills desire. (Your spark score is ${vars.metric_erotic_potential}% — and now you know why.)</p>

    <p><strong>One thing you can try this week:</strong> pick ONE task you've been managing and fully hand it over. Not "can you handle this?" (that's still managing). Just stop doing it. Let it be imperfect. Let the ball drop if it drops.</p>

    <p>This feels terrifying. But it's the only way to stop being the CEO and start being the partner again.</p>

    ${signoffHtml}

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E0D8; font-size: 14px; color: #64748B;">
      P.S. Chapter 5 of your report is essentially a resignation letter from the Manager role — with scripts for having the conversation without it turning into a fight.
      <a href="${link}">Go ahead and read it.</a>
    </p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject, preheader), text };
}

// ==========================================
// EMAIL 5: THE LOOP (72 Hours)
// Goal: VALUE + SOFT OFFER — Map the feedback loop
// Playbook: Value body, offer in P.S.
// ==========================================
export function getMirror5_Hope(vars: PersonalizationVars) {
  const subject = `It's a loop, not a flaw`;
  const preheader = `Neither of you is the problem. Here's what is.`;
  const link = addUtm(vars.app_url, 5, vars.session_id);

  const text = `
You've probably tried talking. You've probably tried "trying harder."

The reason it failed isn't because you didn't try enough. It's because you're stuck in a feedback loop.

Here's how it works in your relationship:

  Something triggers Partner A (usually feeling ignored, criticized, or controlled)
      |
  Partner A reacts (pursues, demands, criticizes)
      |
  Partner B feels attacked and shuts down (withdraws, stonewalls, goes silent)
      |
  Partner A interprets the silence as rejection — and pursues harder
      |
  The cycle repeats. Faster each time.

Neither of you is "the problem." You're both reacting to each other's reactions. It's a system, not a character flaw.

The moment you see it as a loop instead of a flaw, everything changes. You stop blaming each other and start interrupting the pattern.

That's step one. You just took it.

${signoff}

P.S. Your report maps YOUR specific version of this loop — with the exact trigger points and the specific sentences that break the cycle for your dynamic. Check it out here: ${link}

Unsubscribe: ${vars.unsubscribe_url}
  `;

  const contentHtml = `
    <p>You've probably tried talking. You've probably tried "trying harder."</p>

    <p>The reason it failed isn't because you didn't try enough. It's because you're stuck in a <strong>feedback loop</strong>.</p>

    <p>Here's how it works in your relationship:</p>

    <div style="padding: 20px; background-color: #F8F6F3; border-radius: 8px; margin: 24px 0; font-size: 14px; line-height: 1.8;">
      Something triggers Partner A (feeling ignored, criticized, or controlled)<br/>
      &nbsp;&nbsp;&darr;<br/>
      Partner A reacts (pursues, demands, criticizes)<br/>
      &nbsp;&nbsp;&darr;<br/>
      Partner B feels attacked and shuts down (withdraws, stonewalls)<br/>
      &nbsp;&nbsp;&darr;<br/>
      Partner A interprets the silence as rejection — pursues harder<br/>
      &nbsp;&nbsp;&darr;<br/>
      <em>The cycle repeats. Faster each time.</em>
    </div>

    <p>Neither of you is "the problem." You're both reacting to each other's reactions. It's a system, not a character flaw.</p>

    <p><strong>The moment you see it as a loop instead of a flaw, everything changes.</strong> You stop blaming each other and start interrupting the pattern.</p>

    <p>That's step one. You just took it.</p>

    ${signoffHtml}

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E0D8; font-size: 14px; color: #64748B;">
      P.S. Your report maps YOUR specific version of this loop — with the exact trigger points and the specific sentences that break the cycle.
      <a href="${link}">Check it out here.</a>
    </p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject, preheader), text };
}

// ==========================================
// EMAIL 6: THE FORECAST (96 Hours)
// Goal: OFFER (with value context) — Show what's at stake
// Playbook: The 1/3 offer email. Value context, then direct offer.
// ==========================================
export function getMirror6_Loop(vars: PersonalizationVars) {
  const subject = `What happens in 5 years if you change nothing`;
  const preheader = `Your data paints a clear picture. Here it is.`;
  const link = addUtm(vars.app_url, 6, vars.session_id);

  const text = `
Over the last few days, I've shown you:

- Your pattern (${vars.quick_overview_result_badge})
- Your repair score (${vars.metric_repair_efficiency}%)
- Your compatibility (${vars.metric_compatibility_quotient}%)
- The Manager dynamic (${vars.metric_ceo_vs_intern}%)
- The loop you're stuck in

You now understand more about your relationship than most couples learn in a year of therapy.

But understanding isn't enough. Understanding without action is just awareness of the problem while it gets worse.

Your long-term outlook score is ${vars.metric_sustainability_score}%.

Here's what that number means in plain English:

"${vars.forecast_short_term_teaser}"

Your full report contains:
- The exact scripts for YOUR trigger points
- A 30-day action plan (week by week)
- 5 optional clinical guides (add any for $2.99 each)
- Your 5-year trajectory with specific intervention windows

It's $9.99. Less than two coffees.

Go ahead and unlock it now: ${link}

${signoff}

Unsubscribe: ${vars.unsubscribe_url}
  `;

  const contentHtml = `
    <p>Over the last few days, I've shown you:</p>

    <ul style="padding-left: 20px;">
      <li>Your pattern (${vars.quick_overview_result_badge})</li>
      <li>Your repair score (${vars.metric_repair_efficiency}%)</li>
      <li>Your compatibility (${vars.metric_compatibility_quotient}%)</li>
      <li>The Manager dynamic (${vars.metric_ceo_vs_intern}%)</li>
      <li>The loop you're stuck in</li>
    </ul>

    <p>You now understand more about your relationship than most couples learn in a year of therapy.</p>

    <p>But understanding isn't enough. Understanding without action is just awareness of the problem while it gets worse.</p>

    <p>Your <strong>Sustainability Score is ${vars.metric_sustainability_score}%</strong>.</p>

    <p>Here's what that number means in plain English:</p>

    <p style="padding: 16px 20px; background-color: #F8F6F3; border-left: 3px solid #64748B; margin: 24px 0; font-style: italic; font-size: 14px;">
      "${vars.forecast_short_term_teaser}"
    </p>

    <p>Your full report contains:</p>
    <ul style="padding-left: 20px;">
      <li>The exact scripts for YOUR trigger points</li>
      <li>A 30-day action plan (week by week)</li>
      <li>5 optional clinical guides (add any for $2.99 each)</li>
      <li>Your 5-year trajectory with specific intervention windows</li>
    </ul>

    <p>It's $9.99. Less than two coffees.</p>

    <p style="margin: 30px 0;">
      <a href="${link}" style="background-color: #8B55A5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
        Unlock my full report now &rarr;
      </a>
    </p>

    ${signoffHtml}
  `;

  return { subject, html: wrapHtml(contentHtml, subject, preheader), text };
}

// ==========================================
// EMAIL 7: THE FAREWELL (Day 6 - Final)
// Goal: Genuine goodbye + scarcity in P.S.
// Playbook: Value/humanity first, urgency second
// ==========================================
export function getMirror7_Archive(vars: PersonalizationVars) {
  const subject = `One last thing`;
  const preheader = `This is the last email. I mean it.`;
  const link = addUtm(vars.app_url, 7, vars.session_id);

  const text = `
This is the last email I'll send you about this.

I want you to know something, regardless of whether you ever open the report:

The pattern you're in is not your fault. It's not your partner's fault either. It's a system you both fell into — and the fact that you took the assessment means you're the one willing to look at it honestly. That takes more courage than most people have.

Whatever you decide to do from here — whether you get the report, see a therapist, or just carry the insights from these emails into your next conversation — I hope it helps.

You deserve a relationship where you feel seen, not managed. Where fights end in repair, not resentment. Where intimacy isn't a memory.

That's still possible.

${signoff}

P.S. For privacy reasons, we archive detailed session data after 7 days. Your analysis (including your personalized scripts and action plan) will be removed from our servers tomorrow. If you want to keep it, go ahead and secure it now: ${link}

Unsubscribe: ${vars.unsubscribe_url}
  `;

  const contentHtml = `
    <p>This is the last email I'll send you about this.</p>

    <p>I want you to know something, regardless of whether you ever open the report:</p>

    <p>The pattern you're in is not your fault. It's not your partner's fault either. It's a system you both fell into — and the fact that you took the assessment means you're the one willing to look at it honestly. That takes more courage than most people have.</p>

    <p>Whatever you decide to do from here — whether you get the report, see a therapist, or just carry the insights from these emails into your next conversation — I hope it helps.</p>

    <p><strong>You deserve a relationship where you feel seen, not managed. Where fights end in repair, not resentment. Where intimacy isn't a memory.</strong></p>

    <p>That's still possible.</p>

    ${signoffHtml}

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E0D8; font-size: 14px; color: #64748B;">
      P.S. For privacy reasons, we archive detailed session data after 7 days. Your analysis (including your personalized scripts and action plan) will be removed from our servers tomorrow.
      <a href="${link}">Go ahead and secure it now.</a>
    </p>
  `;

  return { subject, html: wrapHtml(contentHtml, subject, preheader), text };
}
