import { type PersonalizationVars } from "../personalization";
import { wrapHtml } from "../emailLayout";

// Email B4: "Why you keep choosing the same person" (Day 2)
export function getTeaserB4Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Same person, different face";

  const lensDescription = vars.dominant_lens.replace(/_/g, " ");

  const text = `Hey,

Ever notice your relationships follow the same pattern?

Different person. Different name. But eventually... the same problems?

That's because of your ${lensDescription} lens.

It doesn't just filter how you react. It filters who you're attracted to.

You're drawn to people who trigger this specific thing because it feels "familiar." Even if it's painful, it's predictable.

Your report explains this—and how to break it.

Unlock The Answer (~~$197~~ $29) → ${process.env.WASP_WEB_CLIENT_URL}/results

We've already done the work. You just need to see it.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>Ever notice your relationships follow the same pattern?</p>
      
      <p>Different person. Different name. But eventually... <strong>the same problems?</strong></p>
      
      <p>That's because of your <strong style="color: #8B55A5;">${lensDescription}</strong> lens.</p>
      
      <p>It doesn't just filter how you react. It filters <em>who you're attracted to</em>.</p>
      
      <p>You're drawn to people who trigger this specific thing because it feels "familiar." Even if it's painful, it's predictable.</p>
      
      <p>Your report explains this—and how to break it.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Unlock The Answer (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
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

  const text = `Hey,

You try to be the "good partner."

You swallow your complaints. You predict their needs. You walk on eggshells to avoid conflict.

You think you're saving the relationship.

Actually, you're suffocating it.

When you hide your real needs to "keep the peace," you aren't creating peace. You're creating a wall.

Your partner can feel that wall. They might call it "distance" or say you're "hard to read."

In your report, there's a section called "The Resentment Meter." It shows you exactly where you're over-functioning and how to stop.

Stop working so hard. Start being real.

Get Your Report (~~$197~~ $29) → ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>You try to be the "good partner."</p>
      
      <p>You swallow your complaints. You predict their needs. You walk on eggshells to avoid conflict.</p>
      
      <p>You think you're saving the relationship.</p>
      
      <p><strong>Actually, you're suffocating it.</strong></p>
      
      <p>When you hide your real needs to "keep the peace," you aren't creating peace. You're creating a wall.</p>
      
      <p>Your partner can feel that wall. They might call it "distance" or say you're "hard to read."</p>
      
      <div style="background-color: #FAF8F5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E2E8F0;">
        <p style="margin: 0; color: #1F2937;">In your report, there's a section called <strong>"The Resentment Meter."</strong> It shows you exactly where you're over-functioning and how to stop.</p>
      </div>
      
      <p>Stop working so hard. Start being real.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Get Your Report (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}

// Email B6: "The 1:00 AM Silence" (Day 4)
export function getTeaserB6Email(vars: PersonalizationVars): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "The 1:00 AM silence";

  const text = `Hey,

You know the moment.

It’s 1:00 AM. The lights are off. Nobody is yelling.

But the silence is so loud it rings in your ears.

You are lying there thinking: "If they loved me, they would fix this."
They are lying there thinking: "If I say anything, it will just make it worse."

This isn't a lack of love. It's a translation error.

You are speaking Connection. They are hearing Criticism.
They are speaking Peace. You are hearing Indifference.

We call this "The Decoder Gap."

Your report translates their silence into English. And it translates your need into something they don't run from.

Stop guessing. Start understanding.

Get The Translator (~~$197~~ $29) → ${process.env.WASP_WEB_CLIENT_URL}/results

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

  const contentHtml = `
      <p><strong>Hey,</strong></p>
      
      <p>You know the moment.</p>
      
      <p>It’s 1:00 AM. The lights are off. Nobody is yelling.</p>
      
      <p><strong>But the silence is so loud it rings in your ears.</strong></p>
      
      <div style="background-color: #F8FAFC; border-left: 4px solid #475569; padding: 20px; margin: 24px 0; border-radius: 4px; font-style: italic; color: #334155;">
        <p style="margin: 0 0 8px 0;">You are lying there thinking: "If they loved me, they would fix this."</p>
        <p style="margin: 0;">They are lying there thinking: "If I say anything, it will just make it worse."</p>
      </div>
      
      <p>This isn't a lack of love. It's a translation error.</p>
      
      <ul style="color: #374151;">
        <li style="margin-bottom: 8px;">You are speaking <strong>Connection</strong>. They are hearing <strong>Criticism</strong>.</li>
        <li>They are speaking <strong>Peace</strong>. You are hearing <strong>Indifference</strong>.</li>
      </ul>
      
      <p>We call this "The Decoder Gap."</p>
      
      <p>Your report translates their silence into English. And it translates your need into something they don't run from.</p>
      
      <p><strong>Stop guessing. Start understanding.</strong></p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/results" class="button">
          Get The Translator (<span style="text-decoration: line-through; opacity: 0.6;">$197</span> $29) →
        </a>
      </p>
      
      <p>– The UYP Team</p>
      
      <div class="footer">
        <a href="${vars.unsubscribe_url}">Unsubscribe from these emails</a>
      </div>
  `;

  return { subject, html: wrapHtml(contentHtml, subject), text };
}
