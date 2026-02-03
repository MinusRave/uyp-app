import { emailSender } from "wasp/server/email";
import { type PersonalizationVars, buildPersonalizationData } from "./personalization";
import { type TestSession } from "wasp/entities";

// Import all email templates
import {
    getTestAbandon1Email,
    getTestAbandon2Email,
    getTestAbandon3Email,
} from "./templates/scenarioA";

import {
    getTeaserB1Email,
    getTeaserB2Email,
    getTeaserB3Email,
} from "./templates/scenarioB_part1";

import {
    getTeaserB4Email,
    getTeaserB5Email,
    getTeaserB6Email,
} from "./templates/scenarioB_part2";

import {
    getTeaserB7Email,
    getTeaserB8Email,
    getTeaserB9Email,
} from "./templates/scenarioB_part3";

import {
    getCheckoutC1Email,
    getCheckoutC2Email,
    getCheckoutC3Email,
} from "./templates/scenarioC";

// Email template selector
function getEmailTemplate(
    scenario: string,
    stage: number
): ((vars: PersonalizationVars) => { subject: string; html: string; text: string }) | null {
    if (scenario === "test_abandonment") {
        switch (stage) {
            case 1:
                return getTestAbandon1Email;
            case 2:
                return getTestAbandon2Email;
            case 3:
                return getTestAbandon3Email;
            default:
                return null;
        }
    }

    if (scenario === "teaser_viewer") {
        switch (stage) {
            case 1:
                return getTeaserB1Email;
            case 2:
                return getTeaserB2Email;
            case 3:
                return getTeaserB3Email;
            case 4:
                return getTeaserB4Email;
            case 5:
                return getTeaserB5Email;
            case 6:
                return getTeaserB6Email;
            case 7:
                return getTeaserB7Email;
            case 8:
                return getTeaserB8Email;
            case 9:
                return getTeaserB9Email;
            default:
                return null;
        }
    }

    if (scenario === "checkout_abandonment") {
        switch (stage) {
            case 1:
                return getCheckoutC1Email;
            case 2:
                return getCheckoutC2Email;
            case 3:
                return getCheckoutC3Email;
            default:
                return null;
        }
    }

    return null;
}

// Main email sending function
export async function sendRetentionEmail(
    session: TestSession,
    stage: number,
    context: any
): Promise<boolean> {
    try {
        if (!session.email) {
            console.error(`Session ${session.id} has no email address`);
            return false;
        }

        if (!session.emailSequenceType) {
            console.error(`Session ${session.id} has no email sequence type`);
            return false;
        }

        // Get personalization data (from cache or build fresh)
        let personalizationData: PersonalizationVars;
        if (session.personalizationData) {
            personalizationData = session.personalizationData as unknown as PersonalizationVars;
        } else {
            const appUrl = process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000";
            const apiUrl = process.env.WASP_API_SERVER_URL || "http://localhost:3001";
            personalizationData = buildPersonalizationData(session, appUrl, apiUrl);

            // Cache it
            await context.entities.TestSession.update({
                where: { id: session.id },
                data: { personalizationData: personalizationData as any },
            });
        }

        // Get email template
        const templateFn = getEmailTemplate(session.emailSequenceType, stage);
        if (!templateFn) {
            console.error(
                `No template found for scenario ${session.emailSequenceType} stage ${stage}`
            );
            return false;
        }

        // Generate email content
        const emailContent = templateFn(personalizationData);

        // Derive Tracking ID (e.g., A1, B3, C2)
        let emailCode = "X0";
        if (session.emailSequenceType === "test_abandonment") emailCode = `A${stage}`;
        if (session.emailSequenceType === "teaser_viewer") emailCode = `B${stage}`;
        if (session.emailSequenceType === "checkout_abandonment") emailCode = `C${stage}`;

        // Send email with Custom Args for Tracking
        await emailSender.send({
            to: session.email,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html,
            // @ts-ignore - Wasp types might not explicitly show this, but SendGrid provider handles it
            customArgs: {
                session_id: session.id,
                stage: stage.toString(),
                scenario: session.emailSequenceType,
                email_id: emailCode
            }
        });

        // Track email sent
        await trackEmailSent(session.id, stage, emailCode, context);

        console.log(
            `Sent ${session.emailSequenceType} email stage ${stage} (${emailCode}) to ${session.email}`
        );

        return true;
    } catch (error) {
        console.error(`Error sending retention email to session ${session.id}:`, error);
        return false;
    }
}

// Track email sent in history
async function trackEmailSent(
    sessionId: string,
    stage: number,
    emailId: string,
    context: any
): Promise<void> {
    const session = await context.entities.TestSession.findUnique({
        where: { id: sessionId },
    });

    if (!session) return;

    const history = (session.emailSentHistory as any[]) || [];
    history.push({
        stage,
        emailId, // Saved so we can match it in the webhook
        sentAt: new Date().toISOString(),
        opened: false,
        clicked: false,
    });

    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            emailSentHistory: history as any,
            retentionEmailStage: stage,
            lastRetentionEmailSentAt: new Date(),
        },
    });
}

// Get delay in milliseconds for each stage
export function getDelayForStage(scenario: string, stage: number): number {
    const HOUR = 60 * 60 * 1000;
    const DAY = 24 * HOUR;

    // Check if in test mode (shorter delays for testing)
    const isTestMode = process.env.EMAIL_RETENTION_TEST_MODE === "true";
    const MINUTE = 60 * 1000;

    if (scenario === "test_abandonment") {
        if (isTestMode) {
            // Test mode: 1 min, 2 min, 3 min
            return stage * MINUTE;
        }
        // Production: 2 hours, 24 hours, 48 hours
        switch (stage) {
            case 1:
                return 2 * HOUR;
            case 2:
                return 24 * HOUR;
            case 3:
                return 48 * HOUR;
            default:
                return 0;
        }
    }

    if (scenario === "teaser_viewer") {
        if (isTestMode) {
            // Test mode: immediate, 1min, 2min, 3min, etc.
            return stage === 1 ? 0 : stage * MINUTE;
        }
        // Production timing
        switch (stage) {
            case 1:
                return 0; // Immediate
            case 2:
                return 1 * HOUR;
            case 3:
                return 3 * HOUR;
            case 4:
                return 24 * HOUR; // Day 2
            case 5:
                return 48 * HOUR; // Day 3
            case 6:
                return 72 * HOUR; // Day 4
            case 7:
                return 96 * HOUR; // Day 5
            case 8:
                return 120 * HOUR; // Day 6
            case 9:
                return 144 * HOUR; // Day 7
            default:
                return 0;
        }
    }

    if (scenario === "checkout_abandonment") {
        if (isTestMode) {
            // Test mode: 1 min, 2 min, 3 min
            return stage * MINUTE;
        }
        // Production: 15 minutes, 2 hours, 6 hours
        switch (stage) {
            case 1:
                return 15 * MINUTE;
            case 2:
                return 2 * HOUR;
            case 3:
                return 6 * HOUR;
            default:
                return 0;
        }
    }

    return 0;
}
