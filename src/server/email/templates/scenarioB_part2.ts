import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email B4: "Why you attract the same type of person" (Day 2)
export function getTeaserB4Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Why you attract the same type of person";

  const lensDescription = vars.dominant_lens.replace(/_/g, " ");

  const text = `${vars.first_name},

Have you ever noticed that your relationships tend to follow a similar pattern?

Different face, different name, but eventually... the same problems?

That's because of your **${lensDescription}** lens.

It doesn't just filter how you react. It filters who you choose.

You are subconsciously drawn to partners who trigger this specific sensitivity because it feels "familiar" to your nervous system. Even if it's painful, it's predictable.

Your full report explains this "Attraction Loop" in detail—and how to break it.

Unlock The Answer ($15): ${process.env.WASP_WEB_CLIENT_URL}/results

We've already done the work. You just need to see it.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>${vars.first_name},</strong></p>
      
      <p>Have you ever noticed that your relationships tend to follow a similar pattern?</p>
      
      <p>Different face, different name, but eventually... <strong>the same problems?</strong></p>
      
      <p>That's because of your <strong style="color: #8B55A5;">${lensDescription}</strong> lens.</p>
      
      <p>It doesn't just filter how you react. It filters <em>who you choose</em>.</p>
      
      <p>You are subconsciously drawn to partners who trigger this specific sensitivity because it feels "familiar" to your nervous system. Even if it's painful, it's predictable.</p>
      
      <p>Your full report explains this "Attraction Loop" in detail—and how to break it.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Unlock The Answer ($15) →
        </a>
      </p>
      
      <p>We've already done the work. You just need to see it.</p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B5: "The 'Good Partner' Trap" (Day 3)
export function getTeaserB5Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "The 'Good Partner' Trap";

  const text = `${vars.first_name},

I see this in my practice every day.

You try to be the "good partner."

You swallow your complaints. You try to predict their needs. You walk on eggshells to avoid conflict.

You think you're saving the relationship.

Actually, you're suffocating it.

When you hide your true needs to "keep the peace," you aren't creating peace. You're creating an invisible wall.

Your partner can feel that wall. They might call it "distance" or say you're "hard to read."

In your report, I have a section called **"The resentment meter."** It shows you exactly where you're over-functioning and how to stop.

Stop working so hard. Start being real.

Get Your Relationship Map ($15): ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>${vars.first_name},</strong></p>
      
      <p>I see this in my practice every day.</p>
      
      <p>You try to be the "good partner."</p>
      
      <p>You swallow your complaints. You try to predict their needs. You walk on eggshells to avoid conflict.</p>
      
      <p>You think you're saving the relationship.</p>
      
      <p><strong>Actually, you're suffocating it.</strong></p>
      
      <p>When you hide your true needs to "keep the peace," you aren't creating peace. You're creating an invisible wall.</p>
      
      <p>Your partner can feel that wall. They might call it "distance" or say you're "hard to read."</p>
      
      <div style="background-color: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <p style="margin: 0; color: #1F2937;">In your report, I have a section called <strong>"The Resentment Meter."</strong> It shows you exactly where you're over-functioning and how to stop.</p>
      </div>
      
      <p>Stop working so hard. Start being real.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Get Your Relationship Map ($15) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B6: "A note from my clinical files" (Day 4)
export function getTeaserB6Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "A note from my clinical files";

  const text = `${vars.first_name},

I want to tell you about a couple I worked with recently. Let's call them Sarah and Mark.

Sarah had the same **${vars.dominant_lens.replace(/_/g, " ")}** pattern as you.

She thought Mark didn't care because he didn't reassure her constantly.
Mark thought Sarah was "too much" because she needed constant reassurance.

They were both good people. They were just stuck in a **Validation Loop**.

Once they saw their patterns on paper—the same map needed for you—everything changed.

Sarah realized Mark wasn't pulling away; he was just overwhelmed.
Mark realized Sarah wasn't "needy"; she was just wired for connection.

They didn't need years of therapy. They just needed a translator.

Your report *is* that translator.

Get The Same Protocol They Used ($15): ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>${vars.first_name},</strong></p>
      
      <p>I want to tell you about a couple I worked with recently. Let's call them Sarah and Mark.</p>
      
      <p>Sarah had the same <strong style="color: #8B55A5;">${vars.dominant_lens.replace(/_/g, " ")}</strong> pattern as you.</p>
      
      <p>She thought Mark didn't care because he didn't reassure her constantly.<br>
      Mark thought Sarah was "too much" because she needed constant reassurance.</p>
      
      <p>They were both good people. They were just stuck in a <strong>Validation Loop</strong>.</p>
      
      <p>Once they saw their patterns on paper—the same map created for you—everything changed.</p>
      
      <ul style="color: #374151;">
        <li>Sarah realized Mark wasn't pulling away; he was just overwhelmed.</li>
        <li>Mark realized Sarah wasn't "needy"; she was just wired for connection.</li>
      </ul>
      
      <p>They didn't need years of therapy. They just needed a translator.</p>
      
      <p><strong>Your report <em>is</em> that translator.</strong></p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Get The Same Protocol They Used ($15) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
