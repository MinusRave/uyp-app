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

type CaptureLeadArgs = { sessionId: string; email: string };

export const captureLead = async ({ sessionId, email }: CaptureLeadArgs, context: any) => {
    // 1. Update TestSession with email
    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: { email }
    });

    // 2. Send Magic Link
    await sendMagicLink(email, context);
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

export const startTest: StartTest<UserProfile | void, TestSession> = async (args, context) => {
    // Create a new test session with profile data
    const session = await context.entities.TestSession.create({
        data: {
            userId: context.user ? context.user.id : undefined,
            currentQuestionIndex: 0,
            answers: {},
            // Profile data
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
        },
    });

    return session;
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

    // Calculate detailed scores
    const scoreResult = calculateScore(answersMap);

    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            isCompleted: true,
            scores: scoreResult as any,
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
