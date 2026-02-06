import { TestSession } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
    type StartTest,
    type SubmitAnswer,
    type CompleteTest,
    type GetTestSession,
} from "wasp/server/operations";
import { sendMagicLink } from "../auth/magicLink";

// --- Queries ---

import { sendCapiEvent } from "../server/analytics/metaCapi";

type CaptureLeadArgs = { sessionId: string; email: string; eventID?: string };

export const captureLead = async ({ sessionId, email, eventID }: CaptureLeadArgs, context: any) => {
    const session = await context.entities.TestSession.findUnique({
        where: { id: sessionId },
    });

    if (!session) {
        throw new HttpError(404, "Session not found");
    }

    // 1. Update TestSession with email
    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            email,
            // Set email sequence type for test abandonment if not completed
            emailSequenceType: !session.isCompleted ? "test_abandonment" : undefined,
        }
    });

    // 2. Send Magic Link
    await sendMagicLink(email, context);

    // 3. Send Meta CAPI Lead Event
    if (eventID) {
        // Run in background / don't await execution to avoid blocking response
        sendCapiEvent({
            eventName: 'Lead',
            eventId: eventID,
            eventSourceUrl: context.req?.headers?.referer || 'https://understandyourpartner.com/test',
            userData: {
                email: email,
                clientIp: context.req?.ip,
                userAgent: context.req?.headers?.['user-agent'],
                // Try to get fbp/fbc from cookies if available in context
                fbp: context.req?.cookies?.['_fbp'],
                fbc: context.req?.cookies?.['_fbc'],
            }
        });
    }

    // 4. Persist cookies to TestSession for future use (e.g. Purchase Webhook)
    const fbp = context.req?.cookies?.['_fbp'];
    const fbc = context.req?.cookies?.['_fbc'];
    if (fbp || fbc) {
        await context.entities.TestSession.update({
            where: { id: sessionId },
            data: {
                fbp: fbp || undefined,
                fbc: fbc || undefined
            }
        });
    }
};

export const getTestSession: GetTestSession<{ sessionId?: string }, TestSession | null> = async (
    args,
    context
) => {
    // 1. Try explicit session ID (from localStorage/client)
    if (args && args.sessionId) {
        return context.entities.TestSession.findUnique({
            where: { id: args.sessionId },
        });
    }

    // 2. Fallback: If user is logged in, find their latest session
    if (context.user) {
        // Search for session by UserID OR by Email (if unliked)
        // Prisma doesn't support complex OR across fields easily in one finding without raw query or explicit OR.
        // Let's use OR operator.
        return context.entities.TestSession.findFirst({
            where: {
                OR: [
                    { userId: context.user.id },
                    { email: context.user.email, userId: null } // Match email if session has no user yet
                ]
            },
            orderBy: { createdAt: "desc" },
        });
    }

    return null;
};

// --- Actions ---

// --- User Profile Type ---
export type UserProfile = {
    userGender: string;
    partnerGender: string;
    userAgeRange: string;
    partnerAgeRange: string;
    relationshipStatus: string;
    // Relationship history (optional)
    relationshipDuration?: string;
    livingTogether?: boolean;
    hasChildren?: boolean;
    previousRelationships?: string;
    previousMarriage?: boolean;
    majorLifeTransition?: string;
    // Partner behavior (optional)
    partnerConflictStyle?: string;
    fightFrequency?: string;
    repairFrequency?: string;
    partnerHurtfulBehavior?: string;
};

// Update startTest signature
// args: UserProfile & { fbclid?: string } | void

export const startTest: StartTest<UserProfile & { fbclid?: string } | void, TestSession> = async (args, context) => {
    // Create a new test session with profile data
    const session = await context.entities.TestSession.create({
        data: {
            userId: context.user ? context.user.id : undefined,
            currentQuestionIndex: 0,
            answers: {},
            // Profile data (optional at start)
            userGender: args?.userGender,
            partnerGender: args?.partnerGender,
            userAgeRange: args?.userAgeRange,
            partnerAgeRange: args?.partnerAgeRange,
            relationshipStatus: args?.relationshipStatus,
            // Relationship history
            relationshipDuration: args?.relationshipDuration,
            livingTogether: args?.livingTogether,
            hasChildren: args?.hasChildren,
            previousRelationships: args?.previousRelationships,
            previousMarriage: args?.previousMarriage,
            majorLifeTransition: args?.majorLifeTransition,
            // Partner behavior
            partnerConflictStyle: args?.partnerConflictStyle,
            fightFrequency: args?.fightFrequency,
            repairFrequency: args?.repairFrequency,
            partnerHurtfulBehavior: args?.partnerHurtfulBehavior,
            // Meta Attribution
            fbclid: args?.fbclid,
        },
    });

    return session;
};

export const updateWizardProgress = async (args: any, context: any) => {
    if (!args.sessionId) throw new HttpError(400, "Session ID required");

    // Clean args to remove sessionId from data payload
    const data = { ...args };
    delete data.sessionId;

    // We update whatever profile fields are passed, plus the wizard step if provided
    // This allows for incremental saving
    await context.entities.TestSession.update({
        where: { id: args.sessionId },
        data: data
    });
};

type SubmitAnswerArgs = {
    sessionId: string;
    questionId: number;
    answerId: number;
    score: number; // 1-5
    dimension: string; // e.g., "silence_distance"
    type: string; // "PM" or "SL"
};

export const submitAnswer: SubmitAnswer<SubmitAnswerArgs, void> = async (
    args,
    context
) => {
    const { sessionId, questionId, answerId, score, dimension, type } = args;

    const session = await context.entities.TestSession.findUnique({
        where: { id: sessionId },
    });

    if (!session) {
        throw new HttpError(404, "Session not found");
    }

    // Update answers
    // We cast the JSON to any to modify it easily, then save back.
    // In a real app, strict typing for the JSON column is better.
    const currentAnswers = (session.answers as any) || {};

    currentAnswers[questionId] = {
        answerId,
        score,
        dimension,
        type,
        answeredAt: new Date().toISOString(),
    };

    // Determine if we need to advance the index
    // We trust the client to send the right QuestionId, but we can also calc max index here.
    // For MVP, simply updating currentQuestionIndex if this question is > current.
    // NOTE: Logic to advance index could be strictly sequential or flexible.
    // Let's assume sequential for safety:
    const nextIndex = Math.max(session.currentQuestionIndex, Object.keys(currentAnswers).length);

    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            answers: currentAnswers,
            currentQuestionIndex: nextIndex,
        },
    });
};

type CompleteTestArgs = {
    sessionId: string;
};

import { calculateScore } from "./scoring";
import { calculateAdvancedMetrics } from "./calculateMetrics";

export const completeTest: CompleteTest<CompleteTestArgs, void> = async (
    args,
    context
) => {
    const { sessionId } = args;

    const session = await context.entities.TestSession.findUnique({
        where: { id: sessionId },
    });

    if (!session) throw new HttpError(404, "Session not found");

    // Extract answers as { questionId: rawScore }
    const answers = (session.answers as Record<string, any>) || {};
    const answersMap: Record<number, number> = {};

    Object.keys(answers).forEach((k) => {
        answersMap[parseInt(k)] = answers[k].score;
    });

    // Build userProfile object from session data
    const userProfile = {
        userGender: session.userGender,
        partnerGender: session.partnerGender,
        userAgeRange: session.userAgeRange,
        partnerAgeRange: session.partnerAgeRange,
        relationshipStatus: session.relationshipStatus,
        relationshipDuration: session.relationshipDuration,
        livingTogether: session.livingTogether,
        hasChildren: session.hasChildren,
        previousRelationships: session.previousRelationships,
        previousMarriage: session.previousMarriage,
        majorLifeTransition: session.majorLifeTransition,
        partnerConflictStyle: session.partnerConflictStyle,
        fightFrequency: session.fightFrequency,
        repairFrequency: session.repairFrequency,
        partnerHurtfulBehavior: session.partnerHurtfulBehavior,
        biggestFear: session.biggestFear
    };

    // Calculate detailed scores WITH user profile data
    const scoreResult = calculateScore(answersMap, userProfile);
    const advancedMetrics = calculateAdvancedMetrics(answers, userProfile);

    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            isCompleted: true,
            scores: scoreResult as any,
            advancedMetrics: advancedMetrics as any,
            // Set email sequence type for teaser viewers (if not already paid)
            emailSequenceType: !session.isPaid ? "teaser_viewer" : undefined,
        },
    });
};

type ClaimSessionArgs = { sessionId: string };

export const claimSession = async ({ sessionId }: ClaimSessionArgs, context: any) => {
    if (!context.user) throw new HttpError(401, "Must be logged in to claim session");

    const session = await context.entities.TestSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new HttpError(404, "Session not found");

    // If session is already linked to ME, do nothing
    if (session.userId === context.user.id) return;

    // If session is linked to SOMEONE ELSE, forbid
    if (session.userId) {
        throw new HttpError(403, "Session already owned by another user");
    }

    // Link it
    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: { userId: context.user.id }
    });
};

type UpdateConflictArgs = { sessionId: string; description: string };

export const updateConflictDescription = async ({ sessionId, description }: UpdateConflictArgs, context: any) => {
    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: { conflictDescription: description }
    });
};
