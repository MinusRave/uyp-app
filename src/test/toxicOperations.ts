
import React from 'react';
import { HttpError } from "wasp/server";
import { type SubmitToxicTest, type CaptureToxicLead, type FinalizeToxicReport } from "wasp/server/operations";
import { TestSession } from "wasp/entities";
import { renderToStream } from "@react-pdf/renderer";
import { ToxicReportDocument } from "../results/pdf/ToxicReportDocument";
import { getUploadFileSignedURLFromS3, s3Client } from "../file-upload/s3Utils";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TOXIC_TEST_CONFIG } from "./toxicTestConfig";
import { generateToxicAnalysis, type ToxicAnalysisResult } from "./toxicAi";

// --- S3 Helper ---
const uploadPdfToS3 = async (key: string, body: any) => {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_FILES_BUCKET,
        Key: key,
        Body: body,
        ContentType: "application/pdf",
    });
    await s3Client.send(command);
};

// --- TYPES ---
type SubmitToxicTestArgs = { sessionId: string; };
type GenerateResult = {
    score: number;
    diagnosis: string;
    riskLevel: string;
    metrics: {
        frequency: number;
        violence: number;
        control: number;
        legal: number;
    }
};

type CaptureLeadArgs = { sessionId: string; email: string; };

type FinalizeReportArgs = { sessionId: string; };
type FinalizeResult = { pdfUrl: string; };

// --- 1. SUBMIT TEST (Free, Instant Scoring) ---
export const submitToxicTest: SubmitToxicTest<SubmitToxicTestArgs, GenerateResult> = async (args, context) => {
    const { sessionId } = args;

    const session = await context.entities.TestSession.findUnique({
        where: { id: sessionId },
    });

    if (!session) throw new HttpError(404, "Session not found");

    // Calculate Score & Diagnosis
    const answers = (session.answers as Record<string, any>) || {};
    let rawScore = 0;
    let frequencyScore = 0;
    let violenceScore = 0;
    let controlScore = 0;
    let legalScore = 0;

    Object.values(answers).forEach((ans: any) => {
        const score = ans.score || 0;
        if (["Frequency", "Duration", "Trajectory"].includes(ans.dimension)) {
            frequencyScore += score;
        } else if (ans.dimension === "Violence") {
            violenceScore += score;
        } else if (["FinancialControl", "Isolation", "Autonomy", "Monitoring"].includes(ans.dimension)) {
            controlScore += score;
        } else if (["LegalThreats", "FalseAccusations", "Children"].includes(ans.dimension)) {
            legalScore += score;
        } else {
            rawScore += score;
        }
    });

    const totalRaw = rawScore + frequencyScore + violenceScore + controlScore + legalScore;
    const finalScore = Math.min(100, Math.round((totalRaw / 160) * 100));

    let diagnosis = "Toxic Dynamic";
    let riskLevel = "Low";

    if (finalScore >= 80) {
        riskLevel = "Severe";
        diagnosis = "High-Danger Narcissistic Pattern";
    } else if (finalScore >= 60) {
        riskLevel = "High";
        diagnosis = "Toxic / Narcissistic";
    } else if (finalScore >= 40) {
        riskLevel = "Medium";
        diagnosis = "Unhealthy Dynamic";
    }

    // Save Score to DB
    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            isCompleted: true, // Marked complete
            scores: { total: finalScore, diagnosis, riskLevel }, // Saved for Sales Page
        }
    });

    return {
        score: finalScore,
        diagnosis,
        riskLevel,
        metrics: {
            frequency: frequencyScore,
            violence: violenceScore,
            control: controlScore,
            legal: legalScore
        }
    };
};

// --- 2. CAPTURE LEAD (Email Gate) ---
export const captureToxicLead: CaptureToxicLead<CaptureLeadArgs, void> = async (args, context) => {
    if (!args.email || !args.email.includes("@")) throw new HttpError(400, "Invalid email");

    await context.entities.TestSession.update({
        where: { id: args.sessionId },
        data: { email: args.email }
    });
};

// --- 3. FINALIZE REPORT (Paid, Heavy AI Generator) ---
export const finalizeToxicReport: FinalizeToxicReport<FinalizeReportArgs, FinalizeResult> = async (args, context) => {
    const { sessionId } = args;

    const session = await context.entities.TestSession.findUnique({
        where: { id: sessionId },
    });
    if (!session) throw new HttpError(404, "Session not found");

    // PAYMENT CHECK (Security)
    // if (!session.isPaid && !context.user?.isAdmin) {
    //    throw new HttpError(403, "Payment required to generate full report.");
    // }
    // NOTE: For testing/MVP, we might relax this or ensure 'isPaid' is set by webhook.
    // Uncomment above block for production.

    // 1. Prepare Data for AI
    const answers = (session.answers as Record<string, any>) || {};
    const scores = (session.scores as any) || {};
    const finalScore = scores.total || 0;
    const diagnosis = scores.diagnosis || "Toxic Dynamic";
    const riskLevel = scores.riskLevel || "Medium";

    // Default recommendation if AI fails or fallback
    let recommendation = "Monitor the situation.";
    if (finalScore >= 80) recommendation = "Immediate safety planning required.";
    else if (finalScore >= 60) recommendation = "Plan your exit. Document everything.";
    else if (finalScore >= 40) recommendation = "Establish firm boundaries.";

    const relevantAnswers: Record<string, string> = {};
    const vulnerabilities: string[] = [];
    const barriers: string[] = [];
    const risks: string[] = [];
    const tactics: string[] = [];
    const redFlags: string[] = []; // Explicit strings for PDF

    // Iterate Config-driven to map answers back to text
    Object.keys(answers).forEach(key => {
        const qId = parseInt(key);
        const ans = answers[key];
        const qConfig = TOXIC_TEST_CONFIG.questions.find(q => q.id === qId);
        const aConfig = TOXIC_TEST_CONFIG.answerOptions.find(opt => opt.id === ans.answerId);

        if (qConfig && aConfig) {
            const keyName = `Q${qId}_${qConfig.dimension}`;
            relevantAnswers[keyName] = aConfig.text;

            // Logic Extraction
            if (qConfig.type === 'Vulnerability' && ans.score >= 5) vulnerabilities.push(qConfig.dimension);
            if (qConfig.type === 'Control' && ans.score >= 5) barriers.push(qConfig.dimension);
            if (qConfig.type === 'Risk' && ans.score >= 8) risks.push(qConfig.dimension);
            if (qConfig.type === 'Toxic' && ans.score >= 5) tactics.push(qConfig.dimension);

            // Specific Red Flags for PDF fallback
            if (qConfig.dimension === "Violence" && ans.score >= 15) redFlags.push("Physical Aggression Detected");
            if (qConfig.dimension === "FalseAccusations" && ans.score >= 15) redFlags.push("Risk of False Legal/Police Accusations");
            if (qConfig.dimension === "LegalThreats" && ans.score >= 8) redFlags.push("Weaponized Legal Threats");
        }
    });

    let aiResult: ToxicAnalysisResult;

    // Check if we already have a generated report (Idempotency / Re-download)
    if (session.fullReport && Object.keys(session.fullReport as object).length > 0) {
        aiResult = session.fullReport as ToxicAnalysisResult;
    } else {
        // Call AI (Expensive)
        aiResult = await generateToxicAnalysis({
            toxicityScore: finalScore,
            narcissismType: diagnosis,
            dangerLevel: riskLevel,
            tactics: [...new Set(tactics)],
            vulnerabilities: [...new Set(vulnerabilities)],
            barriers: [...new Set(barriers)],
            risks: [...new Set(risks)],
            hasChildren: relevantAnswers['Q23_Children']?.includes('Yes') ? 'Yes' : 'No',
            financialSituation: relevantAnswers['Q28_FinancialTies'] || 'Unknown',
            exitReadiness: relevantAnswers['Q29_Readiness'] || 'Unknown',
            exitTimeline: relevantAnswers['Q27_LivingSituation']?.includes('Shared') ? 'Long-term' : 'Immediate',
            recommendedAction: "Review Strategic Options below.",
            relevantAnswers
        }, sessionId, context);

        // Update Session with AI Result
        await context.entities.TestSession.update({
            where: { id: sessionId },
            data: {
                fullReport: aiResult as any,
            }
        });
    }

    // 2. Generate PDF
    const pdfStream = await renderToStream(
        React.createElement(ToxicReportDocument, {
            date: new Date().toLocaleDateString(),
            score: finalScore,
            riskLevel: riskLevel,
            diagnosis: diagnosis,
            redFlags: redFlags,
            recommendation: "Please review the Strategic Options section for your personalized plan.",
            // AI Content
            executiveSummary: aiResult.executive_summary,
            tacticalProfile: aiResult.tactical_profile,
            vulnerabilityAssessment: aiResult.vulnerability_assessment,
            strategicOptions: aiResult.strategic_options,
            next30Days: aiResult.next_30_days,
        }) as any
    );

    // Convert Stream to Buffer (Fix for AWS SDK Content-Length error)
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
        chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // 3. Upload to S3
    const s3Key = `reports/${session.userId || 'anon'}/${sessionId}.pdf`;
    await uploadPdfToS3(s3Key, pdfBuffer);

    // 4. Generate Signed URL for download
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_FILES_BUCKET,
        Key: s3Key,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return { pdfUrl: url };
};
