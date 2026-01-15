import { type PersonalizationVars } from "../personalization";

export function getTestAbandon1Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const questionsLeft = 28 - vars.current_question;
    const isMoreThanHalf = vars.current_question >= 15;

    const subject = `Your relationship test is saved at question ${vars.current_question}/28`;

    const text = `Hi there,

I noticed you started the UnderstandYourPartner test but didn't finish.

Your progress is saved. You left off at question ${vars.current_question}/28.

${isMoreThanHalf
            ? `You're more than halfway there — just ${questionsLeft} questions left.`
            : `It takes about 8 minutes to complete. No right or wrong answers.`
        }

Continue Your Test: ${process.env.WASP_WEB_CLIENT_URL}/test

The sooner you finish, the sooner you'll see where you might be misreading your partner.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Hi there,</p>
      
      <p>I noticed you started the UnderstandYourPartner test but didn't finish.</p>
      
      <p>Your progress is saved. You left off at question <strong>${vars.current_question}/28</strong>.</p>
      
      ${isMoreThanHalf
            ? `<p>You're more than halfway there — just <strong>${questionsLeft} questions left</strong>.</p>`
            : `<p>It takes about 8 minutes to complete. No right or wrong answers.</p>`
        }
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/test" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Continue Your Test →
        </a>
      </p>
      
      <p>The sooner you finish, the sooner you'll see where you might be misreading your partner.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe from these emails</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

export function getTestAbandon2Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const questionsLeft = 28 - vars.current_question;

    const subject = `We analyzed your first ${vars.current_question} answers...`;

    const silenceSection = vars.has_high_silence_sensitivity
        ? `→ You answered "${vars.q4_answer}" to question 4 (about silence making you uncomfortable)
   This suggests you have high "Disconnect Sensitivity" — you feel emotional distance before it's actually there.`
        : "";

    const conflictSection = vars.has_conflict_avoidance
        ? `→ Your answers to questions 7 and 11 show a pattern we call "Conflict Foreclosure"
   You try to solve problems immediately, which can feel like pressure to your partner.`
        : "";

    const text = `Hi,

Even though you didn't finish, I ran your first ${vars.current_question} answers through our system.

Here's what stood out:

${silenceSection}

${conflictSection}

But here's the thing: I can't give you the full picture without all 28 answers.

The last ${questionsLeft} questions measure how your partner actually behaves vs. how you *think* they behave. That's where the real insight is.

Finish Your Test (${questionsLeft} questions left): ${process.env.WASP_WEB_CLIENT_URL}/test

This link expires in 48 hours.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Hi,</p>
      
      <p>Even though you didn't finish, I ran your first <strong>${vars.current_question} answers</strong> through our system.</p>
      
      <p>Here's what stood out:</p>
      
      ${silenceSection
            ? `<div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0;">
          <p style="margin: 0;">${silenceSection.replace(/\n/g, "<br>")}</p>
        </div>`
            : ""
        }
      
      ${conflictSection
            ? `<div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0;">
          <p style="margin: 0;">${conflictSection.replace(/\n/g, "<br>")}</p>
        </div>`
            : ""
        }
      
      <p>But here's the thing: <strong>I can't give you the full picture without all 28 answers.</strong></p>
      
      <p>The last ${questionsLeft} questions measure how your partner actually behaves vs. how you <em>think</em> they behave. That's where the real insight is.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/test" 
           style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Finish Your Test (${questionsLeft} questions left) →
        </a>
      </p>
      
      <p style="color: #6b7280; font-size: 14px;">This link expires in 48 hours.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}

export function getTestAbandon3Email(vars: PersonalizationVars): {
    subject: string;
    html: string;
    text: string;
} {
    const subject = `Your test expires tonight`;

    const text = `Hi,

Your saved test session will be archived tonight at midnight.

If you want to see your relationship analysis, you need to finish now.

Complete Test: ${process.env.WASP_WEB_CLIENT_URL}/test

After tonight, you'll need to start over from question 1.

– The UYP Team

Unsubscribe: ${vars.unsubscribe_url}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <p>Hi,</p>
      
      <p>Your saved test session will be <strong>archived tonight at midnight</strong>.</p>
      
      <p>If you want to see your relationship analysis, you need to finish now.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.WASP_WEB_CLIENT_URL}/test" 
           style="background-color: #DC2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
          Complete Test →
        </a>
      </p>
      
      <p style="color: #6b7280;">After tonight, you'll need to start over from question 1.</p>
      
      <p>– The UYP Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #6b7280;">
        <a href="${vars.unsubscribe_url}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;

    return { subject, html, text };
}
