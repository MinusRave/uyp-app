import { useState } from "react";
import { type AuthUser } from "wasp/auth";
import { useQuery, getMarketingStats } from "wasp/client/operations";
import { Copy, Check } from "lucide-react";
import DefaultLayout from "../../layout/DefaultLayout";

type Row = { label: string; count: number; pct: number };

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // ignore
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white"
            title="Copy headline"
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
};

const StatCard = ({
    pct,
    headline,
    sample,
    small,
}: {
    pct: number;
    headline: string;
    sample: number;
    small?: boolean;
}) => {
    return (
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-5 border border-gray-200 dark:border-strokedark flex flex-col justify-between gap-3">
            <div>
                <div className={small ? "text-2xl font-bold" : "text-4xl font-bold text-primary"}>
                    {`${pct}%`}
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-snug">
                    {headline}
                </p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>sample: {sample}</span>
                <CopyButton text={`${pct}% of ${headline}`} />
            </div>
        </div>
    );
};

const AdminMarketingStatsPage = ({ user }: { user: AuthUser }) => {
    const { data, isLoading, error } = useQuery(getMarketingStats);

    if (isLoading || !data) {
        return <DefaultLayout user={user}>Loading...</DefaultLayout>;
    }
    if (error) {
        return <DefaultLayout user={user}>Error loading stats.</DefaultLayout>;
    }

    return (
        <DefaultLayout user={user}>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Marketing Stats
                    </h1>
                    <p className="text-gray-500">
                        Ready-to-paste headlines from your leads. Click "Copy" to grab the sentence
                        for an ad, email, or landing page.
                    </p>
                    <div className="mt-3 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>
                            <strong>{data.leadTotal}</strong> leads
                        </span>
                        <span>
                            <strong>{data.completedTotal}</strong> completed
                        </span>
                        <span>
                            <strong>{data.paidTotal}</strong> paid
                        </span>
                    </div>
                </div>

                {/* Single stats */}
                <section>
                    <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                        Overall lead stats
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.singleStats.map((s) => (
                            <StatCard
                                key={s.id}
                                pct={s.pct}
                                headline={s.label}
                                sample={s.total}
                            />
                        ))}
                    </div>
                </section>

                {/* Test results (12 Vital Signs + attachment + narcissism) */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Test results
                    </h2>
                    {data.resultStats.map((ct) => (
                        <div key={ct.id}>
                            <div className="mb-2 flex items-baseline gap-2">
                                <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                                    {ct.dimension}
                                </h3>
                                <span className="text-sm text-gray-500">— {ct.title}</span>
                            </div>
                            {ct.rows.length === 0 ? (
                                <div className="text-sm text-gray-500 italic">No data yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {ct.rows.map((row: Row) => (
                                        <StatCard
                                            key={`${ct.id}-${row.label}`}
                                            pct={row.pct}
                                            headline={`completed tests ${row.label}`}
                                            sample={ct.filterTotal}
                                            small
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                {/* Crosstabs */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Breakdowns by audience
                    </h2>
                    {data.crosstabs.map((ct) => (
                        <div key={ct.id}>
                            <div className="mb-2 flex items-baseline gap-2">
                                <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                                    {ct.dimension}
                                </h3>
                                <span className="text-sm text-gray-500">— {ct.title}</span>
                            </div>
                            {ct.rows.length === 0 ? (
                                <div className="text-sm text-gray-500 italic">No data yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {ct.rows.map((row: Row) => (
                                        <StatCard
                                            key={`${ct.id}-${row.label}`}
                                            pct={row.pct}
                                            headline={`${ct.title.split(" (")[0]} report: ${row.label}`}
                                            sample={ct.filterTotal}
                                            small
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>
        </DefaultLayout>
    );
};

export default AdminMarketingStatsPage;
