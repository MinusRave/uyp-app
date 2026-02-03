
import { type TestSession, type User } from "wasp/entities";
import { type GetTestSessions, type GetSessionDetail, type GetFunnelStats, type GetDemographicStats, type GetEmailStats } from "wasp/server/operations";
import { HttpError } from "wasp/server";

// --- Types ---

type GetTestSessionsArgs = {
    skip?: number;
    take?: number;
    statusFilter?: 'all' | 'completed' | 'paid' | 'abandoned';
    emailFilter?: string;
};

type GetTestSessionsResult = {
    sessions: TestSession[];
    totalCount: number;
};

type FunnelStats = {
    started: number;
    step1: number;
    step2: number;
    step3: number;
    step4: number;
    questionCounts: number[];
    onboarding: number;
    emailCaptured: number;
    completed: number;
    paid: number;
};

type DemographicStats = {
    genderDistribution: { [key: string]: number };
    ageDistribution: { [key: string]: number };
    relationshipStatus: { [key: string]: number };
    partnerConflictStyle: { [key: string]: number };
};

type EmailStat = {
    sent: number;
    opened: number;
    clicked: number;
};

type EmailStats = {
    [emailId: string]: EmailStat;
};

// --- Queries ---

export const getTestSessions: GetTestSessions<GetTestSessionsArgs, GetTestSessionsResult> = async (args, context) => {
    if (!context.user?.isAdmin) {
        throw new HttpError(401, "Unauthorized");
    }

    const { skip = 0, take = 10, statusFilter = 'all', emailFilter } = args;

    const where: any = {};

    if (emailFilter) {
        where.email = { contains: emailFilter, mode: 'insensitive' };
    }

    if (statusFilter === 'completed') {
        where.isCompleted = true;
    } else if (statusFilter === 'paid') {
        where.isPaid = true;
    } else if (statusFilter === 'abandoned') {
        where.isCompleted = false;
        where.email = { not: null }; // Has email but not completed
    }

    const [sessions, totalCount] = await Promise.all([
        context.entities.TestSession.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        username: true
                    }
                }
            }
        }),
        context.entities.TestSession.count({ where })
    ]);

    return { sessions, totalCount };
};

export const getSessionDetail: GetSessionDetail<{ sessionId: string }, TestSession | null> = async ({ sessionId }, context) => {
    if (!context.user?.isAdmin) {
        throw new HttpError(401, "Unauthorized");
    }

    return context.entities.TestSession.findUnique({
        where: { id: sessionId },
        include: {
            user: true
        }
    });
};

export const getFunnelStats: GetFunnelStats<void, FunnelStats> = async (_args, context) => {
    if (!context.user?.isAdmin) {
        throw new HttpError(401, "Unauthorized");
    }

    const started = await context.entities.TestSession.count();

    // Wizard Steps (onboardingStep)
    // Step 1 Completed means onboardingStep >= 1
    const step1 = await context.entities.TestSession.count({ where: { onboardingStep: { gte: 1 } } });
    const step2 = await context.entities.TestSession.count({ where: { onboardingStep: { gte: 2 } } });
    const step3 = await context.entities.TestSession.count({ where: { onboardingStep: { gte: 3 } } });
    const step4 = await context.entities.TestSession.count({ where: { onboardingStep: { gte: 4 } } });

    const onboarding = await context.entities.TestSession.count({ where: { onboardingStep: { gt: 0 } } }); // Keeping legacy metric
    const emailCaptured = await context.entities.TestSession.count({ where: { email: { not: null } } });
    const completed = await context.entities.TestSession.count({ where: { isCompleted: true } });
    const paid = await context.entities.TestSession.count({ where: { isPaid: true } });

    // Detailed Question Funnel
    // Get distribution of users by their current question index
    const progressGroups = await context.entities.TestSession.groupBy({
        by: ['currentQuestionIndex'],
        _count: { currentQuestionIndex: true }
    });

    // Create a map for easy lookup
    const progressMap = new Map<number, number>();
    progressGroups.forEach(g => {
        progressMap.set(g.currentQuestionIndex, g._count.currentQuestionIndex);
    });

    // Calculate funnel for each question (1 to 28)
    const totalQuestions = 28;
    const questionCounts: number[] = [];

    // For each question Q_i (1-indexed), the number of people who "reached" it
    // are those whose currentQuestionIndex >= i-1.
    // e.g. Reached Q1 (Index 0) = Anyone with Index >= 0 (Everyone started)
    // e.g. Reached Q2 (Index 1) = Anyone with Index >= 1
    for (let i = 0; i < totalQuestions; i++) {
        // Calculate sum of counts for all indices >= i
        let count = 0;
        // We iterate through all groups to sum up relevant counts
        // Optimization: In a huge DB this loop is fine as 'progressGroups' has max 29 entries (0-28)
        progressGroups.forEach(g => {
            if (g.currentQuestionIndex >= i) {
                count += g._count.currentQuestionIndex;
            }
        });
        questionCounts.push(count);
    }

    return {
        started,
        step1,
        step2,
        step3,
        step4,
        questionCounts,
        onboarding,
        emailCaptured,
        completed,
        paid
    };
};

export const getDemographicStats: GetDemographicStats<void, DemographicStats> = async (_args, context) => {
    if (!context.user?.isAdmin) {
        throw new HttpError(401, "Unauthorized");
    }

    // Prisma groupBy is good for simple counts, but for distribution we might need multiple queries or raw query.
    // Using groupBy for efficiency.

    const genderGroups = await context.entities.TestSession.groupBy({
        by: ['userGender'],
        _count: { userGender: true },
        where: { userGender: { not: null } }
    });

    const ageGroups = await context.entities.TestSession.groupBy({
        by: ['userAgeRange'],
        _count: { userAgeRange: true },
        where: { userAgeRange: { not: null } }
    });

    const statusGroups = await context.entities.TestSession.groupBy({
        by: ['relationshipStatus'],
        _count: { relationshipStatus: true },
        where: { relationshipStatus: { not: null } }
    });

    const conflictGroups = await context.entities.TestSession.groupBy({
        by: ['partnerConflictStyle'],
        _count: { partnerConflictStyle: true },
        where: { partnerConflictStyle: { not: null } }
    });

    const formatGroup = (groups: any[], key: string) => {
        const dist: { [key: string]: number } = {};
        groups.forEach(g => {
            if (g[key]) dist[g[key]] = g._count[key];
        });
        return dist;
    };

    return {
        genderDistribution: formatGroup(genderGroups, 'userGender'),
        ageDistribution: formatGroup(ageGroups, 'userAgeRange'),
        relationshipStatus: formatGroup(statusGroups, 'relationshipStatus'),
        partnerConflictStyle: formatGroup(conflictGroups, 'partnerConflictStyle'),
    };
};

export const getEmailStats: GetEmailStats<void, EmailStats> = async (_args, context) => {
    if (!context.user?.isAdmin) {
        throw new HttpError(401, "Unauthorized");
    }

    // Fetch only the emailSentHistory field to minimize data transfer
    const sessions = await context.entities.TestSession.findMany({
        select: {
            emailSentHistory: true
        }
    });

    const stats: EmailStats = {};

    for (const session of sessions) {
        const history = session.emailSentHistory as any[];
        if (!Array.isArray(history)) continue;

        for (const event of history) {
            // Determine the key (A1, B3, C2)
            // Fallback: If emailId is missing (old data), try to guess or skip
            // New format has emailId. Old format has stage but no scenario context in the event object itself unless we infer it.
            // But wait, the session was not fetched with sequence type.
            // Actually, we should assume new data has emailId.
            const id = event.emailId;
            if (!id) continue;

            if (!stats[id]) {
                stats[id] = { sent: 0, opened: 0, clicked: 0 };
            }

            stats[id].sent++;
            if (event.opened) stats[id].opened++;
            if (event.clicked) stats[id].clicked++;
        }
    }

    return stats;
};
