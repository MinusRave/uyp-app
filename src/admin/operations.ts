
import { type TestSession, type User } from "wasp/entities";
import { type GetTestSessions, type GetSessionDetail, type GetFunnelStats, type GetDemographicStats, type GetEmailStats, type GetAiLogs, type GetSessionAnalytics } from "wasp/server/operations";
import { HttpError } from "wasp/server";

// --- Types ---

type GetTestSessionsArgs = {
    skip?: number;
    take?: number;
    statusFilter?: 'all' | 'completed' | 'paid' | 'abandoned';
    emailFilter?: string;
    sourceFilter?: 'all' | 'meta' | 'google' | 'email' | 'direct';
    progressFilter?: 'all' | 'no_start' | 'in_progress' | 'completed';
    leadFilter?: 'all' | 'lead' | 'anonymous';
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

    const { skip = 0, take = 10, statusFilter = 'all', emailFilter, sourceFilter, progressFilter, leadFilter } = args;

    const where: any = {};

    if (emailFilter) {
        where.email = { contains: emailFilter, mode: 'insensitive' };
    }

    // Status Filter (Existing)
    if (statusFilter === 'completed') {
        where.isCompleted = true;
    } else if (statusFilter === 'paid') {
        where.isPaid = true;
    } else if (statusFilter === 'abandoned') {
        where.isCompleted = false;
        where.email = { not: null }; // Has email but not completed
    }

    // Lead Filter
    if (leadFilter === 'lead') {
        where.email = { not: null };
    } else if (leadFilter === 'anonymous') {
        where.email = null;
    }

    // Progress Filter
    if (progressFilter === 'no_start') {
        // Less than 2 questions answered
        where.currentQuestionIndex = { lt: 2 };
        // And not completed
        where.isCompleted = false;
    } else if (progressFilter === 'in_progress') {
        where.currentQuestionIndex = { gte: 2 };
        where.isCompleted = false;
    } else if (progressFilter === 'completed') {
        where.isCompleted = true;
    }

    // Source Filter
    if (sourceFilter === 'meta') {
        where.OR = [
            { utm_source: { contains: 'fb', mode: 'insensitive' } },
            { utm_source: { contains: 'ig', mode: 'insensitive' } },
            { utm_source: { contains: 'facebook', mode: 'insensitive' } },
            { utm_source: { contains: 'instagram', mode: 'insensitive' } },
            { referrer: { contains: 'facebook', mode: 'insensitive' } },
            { referrer: { contains: 'instagram', mode: 'insensitive' } }
        ];
    } else if (sourceFilter === 'email') {
        // Source is email (UTM) or Reactivated (Email Clicked)
        where.OR = [
            { utm_source: { contains: 'email', mode: 'insensitive' } },
            { utm_medium: { contains: 'email', mode: 'insensitive' } }
        ];
        // Note: We can't easily filter by JSON array content (emailSentHistory) in standard Prisma relational queries without raw query 
        // or using Postgres JSONB filter efficiently. For now, rely on UTM/Source capture.
    } else if (sourceFilter === 'google') {
        where.OR = [
            { utm_source: { contains: 'google', mode: 'insensitive' } },
            { referrer: { contains: 'google', mode: 'insensitive' } }
        ];
    } else if (sourceFilter === 'direct') {
        where.utm_source = null;
        where.referrer = null;
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

// Conversion Funnel Metrics for Analytics Dashboard
type ConversionFunnelMetrics = {
    totalSessions: number;
    testStarted: number;
    emailCaptured: number;
    resultsViewed: number;
    checkoutStarted: number;
    purchased: number;
};

export const getConversionFunnelMetrics = async (_args: void, context: any): Promise<ConversionFunnelMetrics> => {
    if (!context.user?.isAdmin) {
        throw new HttpError(401, "Unauthorized");
    }

    const [
        totalSessions,
        testStarted,
        emailCaptured,
        resultsViewed,
        checkoutStarted,
        purchased
    ] = await Promise.all([
        // Total sessions created
        context.entities.TestSession.count(),

        // Test started = anyone who progressed past initial creation (onboardingStep > 0 OR currentQuestionIndex > 0)
        context.entities.TestSession.count({
            where: {
                OR: [
                    { onboardingStep: { gt: 0 } },
                    { currentQuestionIndex: { gt: 0 } }
                ]
            }
        }),

        // Email captured
        context.entities.TestSession.count({
            where: { email: { not: null } }
        }),

        // Results viewed = completed test
        context.entities.TestSession.count({
            where: { isCompleted: true }
        }),

        // Checkout started
        context.entities.TestSession.count({
            where: { checkoutStartedAt: { not: null } }
        }),

        // Purchased
        context.entities.TestSession.count({
            where: { isPaid: true }
        })
    ]);

    return {
        totalSessions,
        testStarted,
        emailCaptured,
        resultsViewed,
        checkoutStarted,
        purchased
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

// --- AI Logs ---
type GetAiLogsArgs = {
    skip?: number;
    take?: number;
};
type GetAiLogsResult = {
    logs: any[];
    totalCount: number;
};

export const getAiLogs: GetAiLogs<GetAiLogsArgs, GetAiLogsResult> = async (args, context) => {
    if (!context.user?.isAdmin) throw new HttpError(401, "Unauthorized");
    const { skip = 0, take = 50 } = args;

    const [logs, totalCount] = await Promise.all([
        context.entities.AiLog.findMany({
            skip, take, orderBy: { createdAt: 'desc' }
        }),
        context.entities.AiLog.count()
    ]);

    // Enrich logs with User/Session info
    // Since AiLog.sessionId is loose (no relation), we fetch manually
    const sessionIds = logs.map(l => l.sessionId).filter(Boolean) as string[];

    let sessionMap: Record<string, any> = {};
    if (sessionIds.length > 0) {
        const sessions = await context.entities.TestSession.findMany({
            where: { id: { in: sessionIds } },
            select: {
                id: true,
                email: true,
                user: { select: { email: true } }
            }
        });

        sessions.forEach(s => {
            sessionMap[s.id] = s;
        });
    }

    const enrichedLogs = logs.map((log: any) => {
        const session = log.sessionId ? sessionMap[log.sessionId] : null;
        const userEmail = session?.user?.email || session?.email || null;

        return {
            ...log,
            userEmail
        };
    });

    return { logs: enrichedLogs, totalCount };
};

// --- Retrigger AI ---
import { generateQuickOverview, generateFullReport } from "../server/ai";

export const retriggerAiProcessing = async ({ sessionId }: { sessionId: string }, context: any) => {
    if (!context.user?.isAdmin) throw new HttpError(401, "Unauthorized");

    await context.entities.TestSession.update({
        where: { id: sessionId },
        data: {
            executiveAnalysis: null, // We keep the field nulling for cleanup
            quickOverview: null,
            fullReport: null,
        }
    });

    // Run in parallel
    await Promise.all([
        generateQuickOverview({ sessionId }, context),
        generateFullReport({ sessionId }, context)
    ]);

    return { success: true };
};

// --- Advanced Analytics ---

type GetSessionAnalyticsArgs = {
    dateFrom?: string;
    dateTo?: string;
};

type DailyAnalytics = {
    date: string;
    started: number;
    leads: number;
    sales: number;
    conversionRate: number;
};

type SessionAnalyticsResult = {
    summary: {
        totalStarted: number;
        totalCompletedNoEmail: number;
        totalLeads: number; // Email captured
        totalSales: number;
        conversionRate: number; // Sales / Leads
        completionRate: number; // Completed / Started
    };
    dailyStats: DailyAnalytics[];
};

export const getSessionAnalytics: GetSessionAnalytics<GetSessionAnalyticsArgs, SessionAnalyticsResult> = async (args, context) => {
    if (!context.user?.isAdmin) throw new HttpError(401, "Unauthorized");

    const { dateFrom, dateTo } = args;
    const where: any = {};

    if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const sessions = await context.entities.TestSession.findMany({
        where,
        select: {
            createdAt: true,
            isCompleted: true,
            email: true,
            isPaid: true,
            currentQuestionIndex: true,
            onboardingStep: true
        },
        orderBy: { createdAt: 'asc' }
    });

    let totalStarted = 0;
    let totalCompletedNoEmail = 0;
    let totalLeads = 0;
    let totalSales = 0;

    const dailyMap = new Map<string, { started: number, leads: number, sales: number }>();

    sessions.forEach(s => {
        // "Started" = answered at least 1 question
        const isStarted = s.currentQuestionIndex > 0 || (s.onboardingStep || 0) > 0;
        if (isStarted) totalStarted++;

        // "Lead" = email captured
        const isLead = !!s.email;
        if (isLead) totalLeads++;

        // "Completed No Email" = isCompleted true BUT no email (shouldn't happen often if flow is strict, but good to know)
        // Actually user request: "quante persone hanno completato il test ma non hanno inserito l email"
        // Usually completion implies email, but let's check
        if (s.isCompleted && !s.email) totalCompletedNoEmail++;

        // "Sale"
        if (s.isPaid) totalSales++;

        // Daily Aggr
        const day = s.createdAt.toISOString().split('T')[0];
        if (!dailyMap.has(day)) dailyMap.set(day, { started: 0, leads: 0, sales: 0 });
        const dayStats = dailyMap.get(day)!;

        if (isStarted) dayStats.started++;
        if (isLead) dayStats.leads++;
        if (s.isPaid) dayStats.sales++;
    });

    const dailyStats: DailyAnalytics[] = Array.from(dailyMap.entries()).map(([date, stats]) => ({
        date,
        started: stats.started,
        leads: stats.leads,
        sales: stats.sales,
        conversionRate: stats.leads > 0 ? (stats.sales / stats.leads) * 100 : 0
    })).sort((a, b) => a.date.localeCompare(b.date));

    return {
        summary: {
            totalStarted,
            totalCompletedNoEmail,
            totalLeads,
            totalSales,
            conversionRate: totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0,
            completionRate: totalStarted > 0 ? (totalLeads / totalStarted) * 100 : 0 // Proxying completion as lead capture for now
        },
        dailyStats
    };
};

export const deleteSession = async ({ sessionId }: { sessionId: string }, context: any) => {
    if (!context.user?.isAdmin) {
        throw new HttpError(401, "Unauthorized");
    }

    // Optional: Check if session exists first, but delete throws if not found usually or returns count
    // Prisma delete expects `where`.
    try {
        await context.entities.TestSession.delete({
            where: { id: sessionId }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete session:", error);
        throw new HttpError(500, "Failed to delete session");
    }
};
