
import { useState } from "react";
import { type AuthUser } from "wasp/auth";
import { useQuery, getTestSessions, getConversionFunnelMetrics, getSessionAnalytics } from "wasp/client/operations";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { Loader2, Calendar } from "lucide-react";
import { cn } from "../../../client/utils";
import { type TestSession } from "wasp/entities";
import { FunnelMetrics } from "./FunnelMetrics";
import { StatsOverview } from "./StatsOverview";
import { TrendChart } from "./TrendChart";

// Define a type that includes the relation, as Wasp/Prisma clients types usually return the raw model
// but the query is configured to include user.
type SessionWithUser = TestSession & {
    user: {
        email: string | null;
        username: string | null;
    } | null;
}

// Helper to get dominant lens
const getDominantLens = (session: any) => {
    const scores = (session.scores as any) || {};
    return scores.dominantLens ? scores.dominantLens.replace('_', ' ') : null;
};

// Helper to get compatibility (if available in scores, otherwise placeholder)
const getCompatibility = (session: any) => {
    // This depends on where we store it in scores
    return (session.scores as any)?.compatibility || null;
};

const SessionsPage = ({ user }: { user: AuthUser }) => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'paid' | 'abandoned'>('all');
    const [emailFilter, setEmailFilter] = useState("");

    // Global Date Filters
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    });

    // Funnel metrics filters
    const [funnelFilters, setFunnelFilters] = useState({
        trafficSource: 'all' as 'all' | 'meta' | 'direct',
        // dateFrom: '', // Removing redundant internal date state to use global
        // dateTo: '',   // Removing redundant internal date state to use global
        deviceType: 'all' as 'all' | 'mobile' | 'desktop' | 'tablet',
        excludeBots: true
    });

    const take = 10;
    const skip = (page - 1) * take;

    const { data, isLoading } = useQuery(getTestSessions, {
        skip,
        take,
        statusFilter,
        emailFilter: emailFilter || undefined,
    });

    // Fetch funnel metrics with filters
    const { data: funnelMetrics, isLoading: isLoadingMetrics } = useQuery(getConversionFunnelMetrics, {
        trafficSource: funnelFilters.trafficSource,
        dateFrom: dateRange.from || undefined,
        dateTo: dateRange.to || undefined,
        deviceType: funnelFilters.deviceType,
        excludeBots: funnelFilters.excludeBots
    });

    // Fetch Session Analytics (Aggregates & Trends)
    const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery(getSessionAnalytics, {
        dateFrom: dateRange.from || undefined,
        dateTo: dateRange.to || undefined
    });

    // Cast the data to include the user relation
    const sessions = (data?.sessions || []) as SessionWithUser[];

    return (
        <DefaultLayout user={user}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions Explorer</h1>
                    <p className="text-gray-500">Deep dive into user journeys and results.</p>
                </div>

                {/* Global Date Filter */}
                <div className="bg-white dark:bg-boxdark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-strokedark flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={18} />
                        <span className="font-bold text-sm">Global Date Range:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            className="rounded border border-stroke bg-transparent py-1 px-2 text-sm outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            className="rounded border border-stroke bg-transparent py-1 px-2 text-sm outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                        />
                    </div>
                    <button
                        onClick={() => setDateRange({ from: '', to: '' })}
                        className="text-xs text-primary hover:underline ml-auto"
                    >
                        Clear Dates
                    </button>
                </div>

                {/* New Stats Overview */}
                {analyticsData && (
                    <StatsOverview
                        summary={analyticsData.summary}
                        isLoading={isLoadingAnalytics}
                    />
                )}

                {/* Trend Chart */}
                {analyticsData && (
                    <TrendChart
                        dailyStats={analyticsData.dailyStats}
                        isLoading={isLoadingAnalytics}
                    />
                )}

                {/* Funnel Metrics Filters */}
                <div className="bg-white dark:bg-boxdark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                        Detailed Funnel Filters & Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Traffic Source */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Traffic Source
                            </label>
                            <select
                                value={funnelFilters.trafficSource}
                                onChange={(e) => setFunnelFilters({ ...funnelFilters, trafficSource: e.target.value as any })}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                            >
                                <option value="all">All Traffic</option>
                                <option value="meta">Meta Ads Only</option>
                                <option value="direct">Direct/Organic Only</option>
                            </select>
                        </div>

                        {/* Device Type */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Device Type
                            </label>
                            <select
                                value={funnelFilters.deviceType}
                                onChange={(e) => setFunnelFilters({ ...funnelFilters, deviceType: e.target.value as any })}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-3 text-sm outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                            >
                                <option value="all">All Devices</option>
                                <option value="mobile">Mobile Only</option>
                                <option value="desktop">Desktop Only</option>
                                <option value="tablet">Tablet Only</option>
                            </select>
                        </div>

                        {/* Exclude Bots */}
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                    type="checkbox"
                                    checked={funnelFilters.excludeBots}
                                    onChange={(e) => setFunnelFilters({ ...funnelFilters, excludeBots: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Exclude Bots
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Funnel Metrics */}
                {isLoadingMetrics ? (
                    <div className="bg-white dark:bg-boxdark p-8 rounded-lg shadow-sm border border-gray-200 dark:border-strokedark flex items-center justify-center">
                        <Loader2 className="animate-spin h-6 w-6 text-primary" />
                        <span className="ml-2 text-gray-500">Loading funnel metrics...</span>
                    </div>
                ) : funnelMetrics ? (
                    <FunnelMetrics metrics={funnelMetrics} filters={funnelFilters} />
                ) : null}

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-boxdark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-strokedark">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        className="w-full md:w-64 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full md:w-48 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="paid">Paid</option>
                        <option value="abandoned">Abandoned (with Email)</option>
                    </select>
                </div>

                {/* Table */}
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4 text-sm uppercase font-bold text-muted-foreground">
                                    <th className="py-4 px-4 min-w-[120px]">Date</th>
                                    <th className="py-4 px-4 min-w-[200px]">User / Source</th>
                                    <th className="py-4 px-4 min-w-[150px]">Max Meta Event</th>
                                    <th className="py-4 px-4 min-w-[180px]">Demographics</th>
                                    <th className="py-4 px-4 min-w-[200px]">State & Progress</th>
                                    <th className="py-4 px-4 min-w-[140px]">Mailing</th>
                                    <th className="py-4 px-4 min-w-[140px]">Result</th>
                                    <th className="py-4 px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={8} className="py-10 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="animate-spin h-5 w-5" /> Loading...
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && sessions.map((session) => (
                                    <tr key={session.id} className="border-b border-[#eee] hover:bg-gray-50 dark:hover:bg-meta-4/30 transition-colors last:border-b-0">

                                        {/* DATE */}
                                        <td className="py-4 px-4">
                                            <h5 className="font-medium text-black dark:text-white text-sm">{new Date(session.createdAt).toLocaleDateString()}</h5>
                                            <p className="text-xs text-gray-500">{new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>

                                        {/* USER / SOURCE */}
                                        <td className="py-4 px-4">
                                            <p className="font-bold text-black dark:text-white text-sm truncate max-w-[180px]" title={session.email || session.user?.email || "Anonymous"}>
                                                {session.email || session.user?.email || "Anonymous"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {session.fbclid ? (
                                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">META AD</span>
                                                ) : (
                                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">DIRECT</span>
                                                )}
                                                {session.user?.username && <span className="text-xs text-gray-400">@{session.user.username}</span>}
                                            </div>
                                        </td>

                                        {/* MAX META EVENT */}
                                        <td className="py-4 px-4">
                                            <MaxMetaEventBadge session={session} />
                                        </td>

                                        {/* DEMOGRAPHICS */}
                                        <td className="py-4 px-4">
                                            {(session.userGender || session.userAgeRange) ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-sm font-medium text-black dark:text-white">
                                                        <span className="capitalize">{session.userGender}</span>
                                                        {session.userAgeRange && <span className="text-gray-400 mx-1">•</span>}
                                                        <span>{session.userAgeRange}</span>
                                                    </div>
                                                    {session.relationshipStatus && (
                                                        <div className="text-xs text-gray-500 bg-gray-100 dark:bg-meta-4 w-fit px-2 py-0.5 rounded">
                                                            {session.relationshipStatus}
                                                            {session.relationshipDuration && ` (${session.relationshipDuration})`}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No profile data</span>
                                            )}
                                        </td>

                                        {/* STATE & PROGRESS */}
                                        <td className="py-4 px-4">
                                            <SessionStateBadge session={session} />
                                            <div className="mt-2">
                                                {/* Visual Progress Bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 max-w-[140px]">
                                                    <div
                                                        className={cn("h-1.5 rounded-full transition-all duration-500",
                                                            session.isPaid ? "bg-success" :
                                                                session.isCompleted ? "bg-primary" :
                                                                    (session.onboardingStep || 0) > 0 && session.currentQuestionIndex === 0 ? "bg-warning" : "bg-primary"
                                                        )}
                                                        style={{
                                                            width: session.isCompleted ? '100%' :
                                                                session.currentQuestionIndex > 0 ? `${Math.min((session.currentQuestionIndex / 28) * 100, 100)}%` :
                                                                    `${((session.onboardingStep || 0) / 4) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-1">
                                                    {session.isCompleted ? "Analysis Ready" :
                                                        session.currentQuestionIndex > 0 ? `Question ${session.currentQuestionIndex}/28` :
                                                            `Wizard Step ${session.onboardingStep || 0}/4`
                                                    }
                                                </p>
                                            </div>
                                        </td>

                                        {/* MAILING */}
                                        <td className="py-4 px-4">
                                            <EmailHistoryBadge session={session} />
                                        </td>

                                        {/* RESULT */}
                                        <td className="py-4 px-4">
                                            {session.isCompleted ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-primary capitalize text-sm">
                                                        {getDominantLens(session) || "Unknown Lens"}
                                                    </span>
                                                    {/* Placeholder for compatibility if we had it */}
                                                    {/* <span className="text-xs text-gray-500">Compat: 72%</span> */}
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-lg">•</span>
                                            )}
                                        </td>

                                        {/* ACTION */}
                                        <td className="py-4 px-4">
                                            <Link
                                                to={`/admin/sessions/${session.id}`}
                                                className="text-primary hover:text-primary/80 font-medium text-sm border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center py-4 px-4 border-t border-gray-100 dark:border-strokedark mt-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-sm rounded border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">Page {page}</span>
                        <button
                            disabled={!data || sessions.length < take}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 text-sm rounded border hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

const SessionStateBadge = ({ session }: { session: any }) => {
    if (session.isPaid) {
        return <span className="inline-flex rounded-md bg-success/10 py-0.5 px-2.5 text-xs font-bold text-success border border-success/20">PAID & VERIFIED</span>;
    }
    if (session.isCompleted) {
        return <span className="inline-flex rounded-md bg-primary/10 py-0.5 px-2.5 text-xs font-bold text-primary border border-primary/20">COMPLETED</span>;
    }
    if (session.email) {
        return <span className="inline-flex rounded-md bg-warning/10 py-0.5 px-2.5 text-xs font-bold text-warning border border-warning/20">EMAIL CAPTURED</span>;
    }

    // Detailed ongoing states
    if (session.currentQuestionIndex > 0) {
        return <span className="inline-flex rounded-md bg-gray-100 text-gray-600 py-0.5 px-2.5 text-xs font-bold border border-gray-200">IN TEST</span>;
    }
    if ((session.onboardingStep || 0) > 0) {
        return <span className="inline-flex rounded-md bg-purple-50 text-purple-600 py-0.5 px-2.5 text-xs font-bold border border-purple-100">WIZARD STEP {session.onboardingStep}</span>;
    }

    return <span className="inline-flex rounded-md bg-gray-50 text-gray-400 py-0.5 px-2.5 text-xs font-bold border border-gray-100">STARTED</span>;
};

const EmailHistoryBadge = ({ session }: { session: any }) => {
    // Return empty if no email captured or no sequence
    if (!session.email || !session.emailSequenceType) {
        return <span className="text-gray-300 text-xs">-</span>;
    }

    // Map sequence type to short readable name
    const getSequenceName = (type: string) => {
        switch (type) {
            case 'test_abandonment': return 'Test Aband.';
            case 'teaser_viewer': return 'Teaser';
            case 'checkout_abandonment': return 'Checkout';
            default: return type;
        }
    };

    const history = (session.emailSentHistory as any[]) || [];

    // If no emails sent yet but sequence is assigned
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase font-bold text-gray-500">{getSequenceName(session.emailSequenceType)}</span>
                <span className="text-[10px] text-gray-400 italic">Scheduled</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 items-start">
            <span className="text-[10px] uppercase font-bold text-gray-600">{getSequenceName(session.emailSequenceType)}</span>
            <div className="flex flex-wrap gap-1">
                {history.map((h, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200"
                        title={`Sent: ${new Date(h.sentAt).toLocaleString()}`}
                    >
                        {h.stage}
                    </span>
                ))}
            </div>
        </div>
    );
};

const MaxMetaEventBadge = ({ session }: { session: any }) => {
    // Priority Order: Purchase > InitiateCheckout > Lead > ViewContent

    if (session.isPaid) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-green-50 text-green-700 py-0.5 px-2.5 text-xs font-bold border border-green-200">
                PURCHASE
            </span>
        );
    }

    // Check if checkout was started (even if not paid)
    if (session.checkoutStartedAt) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 text-orange-700 py-0.5 px-2.5 text-xs font-bold border border-orange-200">
                INITIATE CHECKOUT
            </span>
        );
    }

    // Check if email was captured
    if (session.email) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 text-blue-700 py-0.5 px-2.5 text-xs font-bold border border-blue-200">
                LEAD
            </span>
        );
    }

    // Default fallback
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 text-gray-500 py-0.5 px-2.5 text-[10px] font-bold border border-gray-200">
            VIEW CONTENT
        </span>
    );
};

export default SessionsPage;
