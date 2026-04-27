import { emailSender } from "wasp/server/email";
import { type PersonalizationVars, buildPersonalizationData } from "./personalization";
import { buildSoLEmailVars } from "./solPersonalization";
import { type TestSession } from "wasp/entities";

// Import new Mirror Sequence templates
import {
    getMirror1_ColdTruth,
    getMirror2_VitalSign,
    getMirror3_Forecast,
    getMirror4_Manager,
    getMirror5_Hope,
    getMirror6_Loop,
    getMirror7_Archive
} from "./templates/mirrorSequence";

// Stay-or-Leave sequences (4th-grade English, two flows)
import {
    solAbandoned1, solAbandoned2, solAbandoned3, solAbandoned4, solAbandoned5,
    solCompleted1, solCompleted2, solCompleted3, solCompleted4, solCompleted5,
} from "./templates/solSequences";

// Email template selector — UYP (Mirror Strategy)
function getEmailTemplate(
    scenario: string,
    stage: number
): ((vars: PersonalizationVars) => { subject: string; html: string; text: string }) | null {
    if (scenario === "teaser_viewer") {
        switch (stage) {
            case 1: return getMirror1_ColdTruth;
            case 2: return getMirror2_VitalSign;
            case 3: return getMirror3_Forecast;
            case 4: return getMirror4_Manager;
            case 5: return getMirror5_Hope;
            case 6: return getMirror6_Loop;
            case 7: return getMirror7_Archive;
            default: return null;
        }
    }
    return null;
}

// Email template selector — Stay or Leave Test
function getSoLTemplate(scenario: string, stage: number) {
    if (scenario === "sol_test_abandoned") {
        switch (stage) {
            case 1: return solAbandoned1;
            case 2: return solAbandoned2;
            case 3: return solAbandoned3;
            case 4: return solAbandoned4;
            case 5: return solAbandoned5;
            default: return null;
        }
    }
    if (scenario === "sol_test_completed_no_purchase") {
        switch (stage) {
            case 1: return solCompleted1;
            case 2: return solCompleted2;
            case 3: return solCompleted3;
            case 4: return solCompleted4;
            case 5: return solCompleted5;
            default: return null;
        }
    }
    return null;
}

const SOL_SEQUENCES = ["sol_test_abandoned", "sol_test_completed_no_purchase"];

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

        const appUrl = process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000";
        const apiUrl = process.env.WASP_API_SERVER_URL || "http://localhost:3001";

        let emailContent: { subject: string; html: string; text: string };

        if (SOL_SEQUENCES.includes(session.emailSequenceType)) {
            // Stay-or-Leave path: simple personalization, no caching needed.
            const solVars = buildSoLEmailVars(session, appUrl, apiUrl);
            const templateFn = getSoLTemplate(session.emailSequenceType, stage);
            if (!templateFn) {
                console.error(`No SoL template found for ${session.emailSequenceType} stage ${stage}`);
                return false;
            }
            emailContent = templateFn(solVars);
        } else {
            // Legacy UYP path
            let personalizationData: PersonalizationVars;
            if (session.personalizationData && (session.personalizationData as any).session_id) {
                personalizationData = session.personalizationData as unknown as PersonalizationVars;
            } else {
                personalizationData = buildPersonalizationData(session, appUrl, apiUrl);
                await context.entities.TestSession.update({
                    where: { id: session.id },
                    data: { personalizationData: personalizationData as any },
                });
            }
            const templateFn = getEmailTemplate(session.emailSequenceType, stage);
            if (!templateFn) {
                console.error(`No template found for scenario ${session.emailSequenceType} stage ${stage}`);
                return false;
            }
            emailContent = templateFn(personalizationData);
        }

        // Derive Tracking ID
        let emailCode = "X0";
        if (session.emailSequenceType === "teaser_viewer") emailCode = `M${stage}`;
        if (session.emailSequenceType === "sol_test_abandoned") emailCode = `SA${stage}`;
        if (session.emailSequenceType === "sol_test_completed_no_purchase") emailCode = `SC${stage}`;

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

    // Check if in test mode (shorter delays for testing)
    const isTestMode = process.env.EMAIL_RETENTION_TEST_MODE === "true";
    const MINUTE = 60 * 1000;

    // Stay-or-Leave: ABANDONED — get them back to finish.
    // Stage 1 immediate (15 min after they hit the gate, the job will catch up).
    // Then 1h, 24h, 72h, 168h (7 days).
    if (scenario === "sol_test_abandoned") {
        if (isTestMode) return stage === 1 ? 0 : stage * MINUTE;
        switch (stage) {
            case 1: return 0;
            case 2: return 1 * HOUR;
            case 3: return 24 * HOUR;
            case 4: return 72 * HOUR;
            case 5: return 168 * HOUR;
            default: return 0;
        }
    }

    // Stay-or-Leave: COMPLETED, NO PURCHASE — convert the lead.
    // 30 min, 2h, 24h, 72h, 168h.
    if (scenario === "sol_test_completed_no_purchase") {
        if (isTestMode) return stage === 1 ? 0 : stage * MINUTE;
        switch (stage) {
            case 1: return 30 * 60 * 1000;
            case 2: return 2 * HOUR;
            case 3: return 24 * HOUR;
            case 4: return 72 * HOUR;
            case 5: return 168 * HOUR;
            default: return 0;
        }
    }

    if (scenario === "teaser_viewer") {
        if (isTestMode) {
            // Test mode: immediate, 1min, 2min, 3min, etc.
            return stage === 1 ? 0 : stage * MINUTE;
        }

        // New Mirror Strategy Timing:
        // Stage 1: Immediate (0)
        // Stage 2: 1 Hour
        // Stage 3: Day 1 (24h)
        // Stage 4: Day 2 (48h)
        // Stage 5: Day 3 (72h)
        // Stage 6: Day 4 (96h)
        // Stage 7: Day 6 (144h) - Final "24h left" warning
        switch (stage) {
            case 1:
                return 0; // Immediate
            case 2:
                // 1 Hour after the first email/event
                // Note: The job calculates delay from LAST email or updatedAt.
                // If stage 1 is sent at T=0. Stage 2 requires 1 hour delay from T=0.
                return 1 * HOUR;
            case 3:
                return 24 * HOUR; // Day 1
            case 4:
                return 48 * HOUR; // Day 2
            case 5:
                return 72 * HOUR; // Day 3
            case 6:
                return 96 * HOUR; // Day 4
            case 7:
                return 144 * HOUR; // Day 6
            default:
                return 0;
        }
    }

    return 0;
}
