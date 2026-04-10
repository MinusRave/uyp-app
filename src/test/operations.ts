import { TestSession } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
    type GetTestSession,
    type SaveCompletedTest,
    type DeactivateSession,
    type TrackQuizEvent,
} from "wasp/server/operations";

import crypto from "crypto";
// @ts-ignore
import { createUser } from "wasp/server/auth";
// @ts-ignore
import argon2 from "argon2";

import { sendCapiEvent } from "../server/analytics/metaCapi";
import { calculateScore } from "./scoring";
import { calculateAdvancedMetrics } from "./calculateMetrics";

// --- Types ---

export type UserProfile = {
    userGender: string;
    partnerGender: string;
    userAgeRange: string;
    partnerAgeRange: string;
    relationshipStatus: string;
    relationshipDuration?: string;
    livingTogether?: boolean;
    hasChildren?: boolean;
    previousRelationships?: string;
    previousMarriage?: boolean;
    majorLifeTransition?: string;
    partnerConflictStyle?: string;
    fightFrequency?: string;
    repairFrequency?: string;
    partnerHurtfulBehavior?: string;
    biggestFear?: string;
};

type DeviceInfo = {
    deviceType?: string;
    deviceOS?: string;
    deviceOSVersion?: string;
    deviceBrand?: string;
    deviceModel?: string;
    browser?: string;
    browserVersion?: string;
    screenResolution?: string;
    viewportSize?: string;
    deviceLanguage?: string;
    deviceTimezone?: string;
};

type Attribution = {
    fbclid?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
};

type AnswerEntry = {
    answerId: number;
    score: number;
    dimension: string;
    type: string;
};

// --- Queries ---

export const getTestSession: GetTestSession<{ sessionId?: string }, TestSession | null> = async (
    args,
    context
) => {
    // 1. Try explicit session ID
    if (args && args.sessionId) {
        const session = await context.entities.TestSession.findUnique({
            where: { id: args.sessionId },
        });
        // Return null if archived AND unpaid (expired session)
        if (session?.isArchived && !session?.isPaid) return null;
        return session;
    }

    // 2. Fallback: If user is logged in, find their latest ACTIVE session
    if (context.user) {
        return context.entities.TestSession.findFirst({
            where: {
                userId: context.user.id,
                OR: [
                    { isArchived: false },
                    { isPaid: true }
                ]
            },
            orderBy: [
                { isPaid: "desc" },
                { createdAt: "desc" }
            ],
        });
    }

    return null;
};

// --- Actions ---

// saveCompletedTest: Atomic operation that creates user + session with all quiz data
type SaveCompletedTestArgs = {
    email: string;
    profile: UserProfile;
    answers: Record<number, AnswerEntry>;
    attribution?: Attribution;
    deviceInfo?: DeviceInfo;
    eventID?: string;
    testType?: string;
};

type SaveCompletedTestResult = {
    sessionId: string;
    loginToken: string;
    email: string;
};

export const saveCompletedTest: SaveCompletedTest<SaveCompletedTestArgs, SaveCompletedTestResult> = async (
    args,
    context
) => {
    const normalizedEmail = args.email.toLowerCase();

    // 1. Find or create user
    let user: any = null;
    let rawToken = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await argon2.hash(rawToken);
    const providerData = JSON.stringify({
        hashedPassword,
        isEmailVerified: true
    });

    user = await context.entities.User.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
        include: { auth: { include: { identities: true } } }
    });

    if (!user) {
        // Create new user
        user = await createUser(
            { providerName: "email", providerUserId: normalizedEmail },
            providerData,
            { email: normalizedEmail }
        );
        console.log(`[saveCompletedTest] Created new user: ${user.id}`);
    } else {
        // Existing user: update password for auto-login (same pattern as verifyMagicLink)
        const auth = user.auth;
        const existingIdentity = auth?.identities?.find((i: any) => i.providerName === 'email');

        if (existingIdentity) {
            await context.entities.User.update({
                where: { id: user.id },
                data: {
                    auth: {
                        update: {
                            identities: {
                                update: {
                                    where: {
                                        providerName_providerUserId: {
                                            providerName: 'email',
                                            providerUserId: existingIdentity.providerUserId
                                        }
                                    },
                                    data: { providerData }
                                }
                            }
                        }
                    }
                }
            });
        } else if (auth) {
            await context.entities.User.update({
                where: { id: user.id },
                data: {
                    auth: {
                        update: {
                            identities: {
                                create: {
                                    providerName: 'email',
                                    providerUserId: normalizedEmail,
                                    providerData
                                }
                            }
                        }
                    }
                }
            });
        } else {
            await context.entities.User.update({
                where: { id: user.id },
                data: {
                    auth: {
                        create: {
                            identities: {
                                create: {
                                    providerName: 'email',
                                    providerUserId: normalizedEmail,
                                    providerData
                                }
                            }
                        }
                    }
                }
            });
        }
        console.log(`[saveCompletedTest] Updated auth for existing user: ${user.id}`);
    }

    // 2. Archive all active unpaid sessions for this user
    await context.entities.TestSession.updateMany({
        where: {
            userId: user.id,
            isArchived: false,
            isPaid: false,
        },
        data: { isArchived: true }
    });

    // 3. Build answers in DB format and calculate scores
    const answersForDb: Record<string, any> = {};
    const answersMap: Record<number, number> = {};

    Object.entries(args.answers).forEach(([qId, entry]) => {
        const id = parseInt(qId);
        answersForDb[qId] = {
            answerId: entry.answerId,
            score: entry.score,
            dimension: entry.dimension,
            type: entry.type,
            answeredAt: new Date().toISOString(),
        };
        answersMap[id] = entry.score;
    });

    const scoreResult = calculateScore(answersMap, args.profile);
    const advancedMetrics = calculateAdvancedMetrics(answersForDb, args.profile);

    // 4. Create TestSession with ALL data
    const session = await context.entities.TestSession.create({
        data: {
            userId: user.id,
            email: normalizedEmail,
            testType: args.testType || "standard",
            currentQuestionIndex: Object.keys(args.answers).length,
            isCompleted: true,
            answers: answersForDb,
            scores: scoreResult as any,
            advancedMetrics: advancedMetrics as any,
            emailSequenceType: "teaser_viewer",
            // Profile
            userGender: args.profile.userGender,
            partnerGender: args.profile.partnerGender,
            userAgeRange: args.profile.userAgeRange,
            partnerAgeRange: args.profile.partnerAgeRange,
            relationshipStatus: args.profile.relationshipStatus,
            relationshipDuration: args.profile.relationshipDuration,
            livingTogether: args.profile.livingTogether,
            hasChildren: args.profile.hasChildren,
            previousRelationships: args.profile.previousRelationships,
            previousMarriage: args.profile.previousMarriage,
            majorLifeTransition: args.profile.majorLifeTransition,
            partnerConflictStyle: args.profile.partnerConflictStyle,
            fightFrequency: args.profile.fightFrequency,
            repairFrequency: args.profile.repairFrequency,
            partnerHurtfulBehavior: args.profile.partnerHurtfulBehavior,
            biggestFear: args.profile.biggestFear,
            // Attribution
            fbclid: args.attribution?.fbclid,
            utm_source: args.attribution?.utm_source,
            utm_medium: args.attribution?.utm_medium,
            utm_campaign: args.attribution?.utm_campaign,
            utm_content: args.attribution?.utm_content,
            utm_term: args.attribution?.utm_term,
            referrer: args.attribution?.referrer,
            // Device
            deviceType: args.deviceInfo?.deviceType,
            deviceOS: args.deviceInfo?.deviceOS,
            deviceOSVersion: args.deviceInfo?.deviceOSVersion,
            deviceBrand: args.deviceInfo?.deviceBrand,
            deviceModel: args.deviceInfo?.deviceModel,
            browser: args.deviceInfo?.browser,
            browserVersion: args.deviceInfo?.browserVersion,
            screenResolution: args.deviceInfo?.screenResolution,
            viewportSize: args.deviceInfo?.viewportSize,
            deviceLanguage: args.deviceInfo?.deviceLanguage,
            deviceTimezone: args.deviceInfo?.deviceTimezone,
            // Cookies (for Purchase CAPI later)
            fbp: (context as any).req?.cookies?.['_fbp'],
            fbc: (context as any).req?.cookies?.['_fbc'],
            // Timestamps
            sessionStartedAt: new Date(),
            lastActivityAt: new Date(),
        },
    });

    // 5. Send Meta CAPI Lead event
    if (args.eventID) {
        sendCapiEvent({
            eventName: 'Lead',
            eventId: args.eventID,
            eventSourceUrl: (context as any).req?.headers?.referer || 'https://understandyourpartner.com/test',
            userData: {
                email: normalizedEmail,
                clientIp: (context as any).req?.ip,
                userAgent: (context as any).req?.headers?.['user-agent'],
                fbp: (context as any).req?.cookies?.['_fbp'],
                fbc: (context as any).req?.cookies?.['_fbc'],
            }
        });
    }

    console.log(`[saveCompletedTest] Created session ${session.id} for user ${user.id}`);

    return {
        sessionId: session.id,
        loginToken: rawToken,
        email: normalizedEmail,
    };
};

// deactivateSession: Archives a session (for retake)
type DeactivateSessionArgs = { sessionId: string };

export const deactivateSession: DeactivateSession<DeactivateSessionArgs, void> = async (
    args,
    context
) => {
    if (!context.user) throw new HttpError(401, "Must be logged in");

    const session = await context.entities.TestSession.findUnique({
        where: { id: args.sessionId },
    });

    if (!session) throw new HttpError(404, "Session not found");
    if (session.userId !== context.user.id) throw new HttpError(403, "Not your session");
    if (session.isPaid) throw new HttpError(400, "Cannot deactivate a paid session");

    await context.entities.TestSession.update({
        where: { id: args.sessionId },
        data: { isArchived: true },
    });
};

// trackQuizEvent: Lightweight analytics event (no PII, no session link)
type TrackQuizEventArgs = {
    type: "quiz_start" | "quiz_abandon";
    questionIndex?: number;
    deviceType?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
};

export const trackQuizEvent: TrackQuizEvent<TrackQuizEventArgs, void> = async (
    args,
    context
) => {
    await context.entities.QuizEvent.create({
        data: {
            type: args.type,
            questionIndex: args.questionIndex,
            deviceType: args.deviceType,
            referrer: args.referrer,
            utm_source: args.utm_source,
            utm_medium: args.utm_medium,
        },
    });
};

// --- Kept Operations ---

type UpdateConflictArgs = { sessionId: string; description: string };

export const updateConflictDescription = async ({ sessionId, description }: UpdateConflictArgs, context: any) => {
    const session = await context.entities.TestSession.update({
        where: { id: sessionId },
        data: { conflictDescription: description },
    });
    return session;
};

type UpdateSessionActivityArgs = {
    sessionId: string;
    sessionDuration?: number;
    pageViews?: Array<{ page: string; timestamp: string }>;
    interactionEvents?: Array<{ type: string; target?: string; timestamp: string }>;
};

export const updateSessionActivity = async (
    { sessionId, sessionDuration, pageViews, interactionEvents }: UpdateSessionActivityArgs,
    context: any
) => {
    const updateData: any = {
        lastActivityAt: new Date(),
    };

    if (sessionDuration !== undefined) {
        updateData.sessionDuration = sessionDuration;
    }

    if (pageViews) {
        updateData.pageViews = pageViews;
    }

    if (interactionEvents) {
        updateData.interactionEvents = interactionEvents;
    }

    const session = await context.entities.TestSession.update({
        where: { id: sessionId },
        data: updateData,
    });

    return session;
};
