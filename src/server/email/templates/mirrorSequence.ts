import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// ==========================================
// EMAIL 1: THE COLD TRUTH (Immediate)
// Trigger: 5 min after completion
// Goal: Validation. "We see the pattern you can't see."
// ==========================================
export function getMirror1_ColdTruth(vars: PersonalizationVars) {
    const subject = `Analysis Result: ${vars.quick_overview_headline}`;

    const text = `
You just finished the assessment. That wasn't easy.

Your result badge is: [ ${vars.quick_overview_result_badge} ]

But a badge is just a label. The real story is in your data.
You told us: "${vars.pulse_summary}"

Right now, you are too close to the problem to see the pattern. We are the mirror.

See The Pattern: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}
  `;

    // HTML Content
    const contentHtml = `
      <p>You just finished the assessment. That wasn't easy.</p>
      
      <p>Your result badge is:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #FEF2F2; color: #DC2626; border: 2px solid #FCA5A5; padding: 12px 24px; font-weight: 800; font-size: 18px; letter-spacing: 1px; border-radius: 8px;">
           [ ${vars.quick_overview_result_badge} ]
        </span>
      </div>
      
      <p>But a badge is just a label. The real story is in your data.</p>
      <p>You told us:</p>
      
      <div style="background-color: #F8FAFC; border-left: 4px solid #64748B; padding: 20px; margin: 24px 0; font-style: italic; color: #475569;">
          "${vars.pulse_summary}"
      </div>
      
      <p>Right now, you are too close to the problem to see the pattern. We are the mirror.</p>
      
      <p style="text-align: center; margin: 40px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          See The Pattern →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

    return { subject, html: wrapHtml(contentHtml, subject), text };
}

// ==========================================
// EMAIL 2: THE "VITAL SIGN" SHOCK (1 Hour)
// Trigger: 1 hour later
// Goal: The Hook. Specific Metric.
// ==========================================
export function getMirror2_VitalSign(vars: PersonalizationVars) {
    const subject = `It’s not "communication issues" (It’s this score)`;

    const text = `
"We have communication issues."

Everyone says that. It's too vague to fix.

We analyzed your data, and the problem is specific: Your Repair Efficiency is ${vars.metric_repair_efficiency}%.

This number explains why your arguments feel like circles. It explains why you wake up the next day still feeling heavy.

The good news? High-efficiency repair is a skill, not a personality trait. Couples with high scores use 3 specific "exit codes" during fights.

We listed them in Chapter 2 of your report.

Read Chapter 2: The Communication Loop: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}
  `;

    const contentHtml = `
      <p><strong>"We have communication issues."</strong></p>
      
      <p>Everyone says that. It's too vague to fix.</p>
      
      <p>We analyzed your data, and the problem is specific:</p> 
      
      <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; font-size: 18px; color: #92400E;"><strong>Your Repair Efficiency is ${vars.metric_repair_efficiency}%</strong></p>
      </div>

      <p>This number explains why your arguments feel like circles. It explains why you wake up the next day still feeling heavy.</p>

      <p>The good news? High-efficiency repair is a <em>skill</em>, not a personality trait. Couples with high scores use 3 specific "exit codes" during fights.</p>
      
      <p>We listed them in Chapter 2 of your report.</p>
      
      <p style="text-align: center; margin: 40px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Read Chapter 2: The Communication Loop →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

    return { subject, html: wrapHtml(contentHtml, subject), text };
}

// ==========================================
// EMAIL 3: THE FORECAST (Day 1)
// Trigger: 24 Hours later
// Goal: Rational Fear. Crystal Ball.
// ==========================================
export function getMirror3_Forecast(vars: PersonalizationVars) {
    const subject = `A 5-year forecast for your relationship`;

    const text = `
In relationships, "drifting apart" isn't an accident. It's a mathematical trajectory.

We calculated your Sustainability Score at ${vars.metric_sustainability_score}%.

If you change nothing today, here is the AI model's prediction for your relationship in 5 years:

"${vars.forecast_short_term_teaser}..."

It's hard to read. But it's harder to live through.
The turn-by-turn roadmap to change this trajectory is waiting for you.

Change The Trajectory: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}
  `;

    const contentHtml = `
      <p>In relationships, "drifting apart" isn't an accident. It's a mathematical trajectory.</p>
      
      <p>We calculated your <strong>Sustainability Score</strong> at <strong>${vars.metric_sustainability_score}%</strong>.</p>
      
      <p>If you change nothing today, here is the AI model's prediction for your relationship in 5 years:</p>
      
      <div style="background-color: #F1F5F9; border-left: 4px solid #475569; padding: 20px; margin: 24px 0; font-family: monospace; font-size: 14px; line-height: 1.6; color: #334155;">
        "${vars.forecast_short_term_teaser}..."
      </div>
      
      <p>It's hard to read. But it's harder to live through.</p>
      <p>The turn-by-turn roadmap to change this trajectory is waiting for you.</p>
      
      <p style="text-align: center; margin: 40px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Change The Trajectory →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

    return { subject, html: wrapHtml(contentHtml, subject), text };
}

// ==========================================
// EMAIL 4: THE PARENT TRAP (Day 2)
// Trigger: 48 Hours later
// Goal: The dynamic. Manager vs Partner.
// ==========================================
export function getMirror4_Manager(vars: PersonalizationVars) {
    const subject = `Why you feel more like a manager than a partner`;

    const text = `
You act like a Manager because you're afraid if you stop, everything will collapse.

Your data proves it:
CEO vs Intern Score: ${vars.metric_ceo_vs_intern}%

Here is the Brutal Truth: You cannot desire someone you are managing. And they cannot desire someone who acts like their parent.

This imbalance is the #1 killer of intimacy (your Erotic Potential is ${vars.metric_erotic_potential}%).

Chapter 5 isn't advice. It's a resignation letter for your role as "The Manager".

Quit The Manager Role: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}
  `;

    const contentHtml = `
      <p>You act like a "Manager" because you're afraid if you stop, everything will collapse.</p>
      
      <p>Your data proves it:</p>
      
      <div style="padding: 15px; background: #F8FAFC; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #334155;"><strong>CEO vs Intern Score:</strong> <span style="color: #DC2626; font-weight: bold;">${vars.metric_ceo_vs_intern}%</span></p>
      </div>
      
      <p>Here is the Brutal Truth: <strong>You cannot desire someone you are managing.</strong> And they cannot desire someone who acts like their parent.</p>
      
      <p>This imbalance is the #1 killer of intimacy (Your <em>Erotic Potential</em> is only ${vars.metric_erotic_potential}%).</p>
      
      <p>Chapter 5 isn't advice. It's a resignation letter for your role as "The Manager".</p>
      
      <p style="text-align: center; margin: 40px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Quit The Manager Role →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

    return { subject, html: wrapHtml(contentHtml, subject), text };
}

// ==========================================
// EMAIL 5: HOPE / COMPATIBILITY (Day 3)
// Trigger: 72 Hours later
// Goal: Pivot from pain to potential.
// ==========================================
export function getMirror5_Hope(vars: PersonalizationVars) {
    const subject = `You are actually compatible (Data proof)`;

    const text = `
I want to show you one number that should give you hope.

Compatibility Quotient: ${vars.metric_compatibility_quotient}%

This is the tragedy of your relationship. You value the same things. You want the same future. You are good teammates who have forgotten how to pass the ball.

Many couples break up because they are incompatible. You are at risk of breaking up simply because you are uncalibrated.

Don't throw away a high-compatibility match because of a fixable mechanical error.

Calibrate The Relationship: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}
  `;

    const contentHtml = `
      <p>I want to show you one number that should give you hope.</p>
      
      <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; font-size: 18px; color: #065F46;"><strong>Compatibility Quotient: ${vars.metric_compatibility_quotient}%</strong></p>
      </div>
      
      <p>This is the tragedy of your relationship. You value the same things. You want the same future. You are good teammates who have forgotten how to pass the ball.</p>
      
      <p>Many couples break up because they are <em>incompatible</em>. You are at risk of breaking up simply because you are <strong>uncalibrated</strong>.</p>
      
      <p>Don't throw away a high-compatibility match because of a fixable mechanical error.</p>
      
      <p style="text-align: center; margin: 40px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Calibrate The Relationship →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

    return { subject, html: wrapHtml(contentHtml, subject), text };
}

// ==========================================
// EMAIL 6: THE LOOP (Day 4)
// Trigger: 96 Hours later
// Goal: Logic. Remove shame.
// ==========================================
export function getMirror6_Loop(vars: PersonalizationVars) {
    const subject = `It’s a loop, not a flaw`;

    const text = `
You've probably tried talking. You've probably tried "trying harder."

The reason it failed isn't because you didn't try enough. It's because you are stuck in a Feedback Loop.

Trigger A (The Silence) 
  ↓
Reaction B (The Panic)
  ↓
Reaction C (The Shutdown)

Your report doesn't judge you. It maps the loop.
Once you see the map, you can stop walking in the circle.

See The Map: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}
  `;

    const contentHtml = `
      <p>You've probably tried talking. You've probably tried "trying harder."</p>
      
      <p>The reason it failed isn't because you didn't try enough. It's because you are stuck in a <strong>Feedback Loop</strong>.</p>
      
      <div style="text-align: center; background: #F8FAFC; padding: 30px; border-radius: 12px; margin: 30px 0;">
        <p style="color: #0F172A; font-weight: bold; margin-bottom: 5px;">Trigger A</p>
        <p style="color: #64748B; font-size: 14px;">(The Silence)</p>
        <p style="font-size: 24px; color: #94A3B8; margin: 5px 0;">↓</p>
        <p style="color: #0F172A; font-weight: bold; margin-bottom: 5px;">Reaction B</p>
        <p style="color: #64748B; font-size: 14px;">(The Panic)</p>
        <p style="font-size: 24px; color: #94A3B8; margin: 5px 0;">↓</p>
        <p style="color: #0F172A; font-weight: bold; margin-bottom: 5px;">Reaction C</p>
        <p style="color: #64748B; font-size: 14px;">(The Shutdown)</p>
      </div>
      
      <p>Your report doesn't judge you. It maps the loop.</p>
      <p>Once you see the map, you can stop walking in the circle.</p>
      
      <p style="text-align: center; margin: 40px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          See The Map →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

    return { subject, html: wrapHtml(contentHtml, subject), text };
}

// ==========================================
// EMAIL 7: THE ARCHIVE (Day 6 - Final)
// Trigger: 144 Hours Later
// Goal: Privacy Scarcity.
// ==========================================
export function getMirror7_Archive(vars: PersonalizationVars) {
    const subject = `Protecting your data (Deletion Warning)`;

    const text = `
We handle sensitive psychological profiles, and we take privacy seriously.

We do not keep detailed user reports on our active servers indefinitely.
Your analysis for ${vars.user_email} is scheduled for deletion in 24 hours.

If you don't unlock it, the data will be lost. You will have to retake the test (and pay full price) to see it.

This is the owner's manual for your relationship. Don't let it be deleted.

Secure My Report: ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}
  `;

    const contentHtml = `
      <p>We handle sensitive psychological profiles, and we take privacy seriously.</p>
      
      <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0; color: #991B1B;"><strong>We do not keep detailed user reports on our active servers indefinitely.</strong></p>
        <p style="margin: 10px 0 0 0; color: #7F1D1D;">Your analysis for <strong>${vars.user_email}</strong> is scheduled for deletion in 24 hours.</p>
      </div>

      <p>If you don't unlock it, the data will be lost. You will have to retake the test (and pay full price) to see it.</p>
      
      <p>This is the owner's manual for your relationship. Don't let it be deleted.</p>
      
      <p style="text-align: center; margin: 40px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Secure My Report →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

    return { subject, html: wrapHtml(contentHtml, subject), text };
}
