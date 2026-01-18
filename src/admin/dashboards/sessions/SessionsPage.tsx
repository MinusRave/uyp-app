
import { useState } from "react";
import { type AuthUser } from "wasp/auth";
import { useQuery, getTestSessions } from "wasp/client/operations";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { Loader2 } from "lucide-react";
import { cn } from "../../../client/utils";
import { type TestSession } from "wasp/entities";

// Define a type that includes the relation, as Wasp/Prisma clients types usually return the raw model
// but the query is configured to include user.
type SessionWithUser = TestSession & {
    user: {
        email: string | null;
        username: string | null;
    } | null;
}

const SessionsPage = ({ user }: { user: AuthUser }) => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'paid' | 'abandoned'>('all');
    const [emailFilter, setEmailFilter] = useState("");

    const take = 10;
    const skip = (page - 1) * take;

    const { data, isLoading } = useQuery(getTestSessions, {
        skip,
        take,
        statusFilter,
        emailFilter: emailFilter || undefined,
    });

    // Cast the data to include the user relation
    const sessions = (data?.sessions || []) as SessionWithUser[];

    return (
        <DefaultLayout user={user}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions Explorer</h1>
                    <p className="text-gray-500">View and analyze individual user sessions.</p>
                </div>

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
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Date</th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">User / Email</th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Progress</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={5} className="py-5 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="animate-spin h-5 w-5" /> Loading...
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {!isLoading && sessions.map((session) => (
                                    <tr key={session.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">{new Date(session.createdAt).toLocaleDateString()}</h5>
                                            <p className="text-sm">{new Date(session.createdAt).toLocaleTimeString()}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{session.email || session.user?.email || "Anonymous"}</p>
                                            {session.user?.username && <p className="text-sm text-gray-500">@{session.user.username}</p>}
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <StatusBadge session={session} />
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white inline-block sm:block">Step {session.currentQuestionIndex}</p>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1 max-w-[100px]">
                                                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((session.currentQuestionIndex / 30) * 100, 100)}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <Link
                                                    to={`/admin/sessions/${session.id}`}
                                                    className="hover:text-primary"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center py-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {page}</span>
                        <button
                            disabled={!data || data.sessions.length < take}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

const StatusBadge = ({ session }: { session: any }) => {
    if (session.isPaid) {
        return <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">Paid</span>;
    }
    if (session.isCompleted) {
        return <span className="inline-flex rounded-full bg-primary bg-opacity-10 py-1 px-3 text-sm font-medium text-primary">Completed</span>;
    }
    if (session.email) {
        return <span className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">Email Captured</span>;
    }
    return <span className="inline-flex rounded-full bg-gray-500 bg-opacity-10 py-1 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">Started</span>;
};

export default SessionsPage;
