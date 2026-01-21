
import { type TestSession, type User } from "wasp/entities";
import { type GetTestSessions, type GetSessionDetail, type GetFunnelStats, type GetDemographicStats } from "wasp/server/operations";
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
    const onboarding = await context.entities.TestSession.count({ where: { onboardingStep: { gt: 0 } } });
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
