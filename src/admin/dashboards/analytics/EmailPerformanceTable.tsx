import { useQuery, getEmailStats } from "wasp/client/operations";

const EmailPerformanceTable = () => {
    const { data: stats, isLoading, error } = useQuery(getEmailStats);

    if (isLoading) return <div className="p-4">Loading email stats...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading email stats</div>;
    if (!stats) return null;

    // Transform to array and sort
    const rows = Object.entries(stats).map(([id, stat]) => ({
        id,
        ...stat,
        openRate: stat.sent > 0 ? (stat.opened / stat.sent) * 100 : 0,
        clickRate: stat.sent > 0 ? (stat.clicked / stat.sent) * 100 : 0
    })).sort((a, b) => a.id.localeCompare(b.id));

    // Helper to color code rates
    const getRateColor = (rate: number, type: 'open' | 'click') => {
        if (type === 'open') {
            if (rate > 40) return 'text-green-500';
            if (rate > 20) return 'text-yellow-500';
            return 'text-red-500';
        }
        // clicks
        if (rate > 5) return 'text-green-500';
        if (rate > 1) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1 mt-6">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Email Performance (Real-time)
            </h4>

            <div className="flex flex-col">
                <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Sent</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Opened</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Clicked</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Open %</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Click %</h5>
                    </div>
                </div>

                {rows.length === 0 && (
                    <div className="p-5 text-center text-gray-500">No email data checked yet.</div>
                )}

                {rows.map((row, key) => (
                    <div
                        className={`grid grid-cols-2 sm:grid-cols-6 ${key === rows.length - 1
                                ? ""
                                : "border-b border-stroke dark:border-strokedark"
                            }`}
                        key={key}
                    >
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <p className="hidden font-medium text-black dark:text-white sm:block">
                                {row.id}
                            </p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{row.sent}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-meta-3">{row.opened}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-meta-5">{row.clicked}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className={`font-medium ${getRateColor(row.openRate, 'open')}`}>
                                {row.openRate.toFixed(1)}%
                            </p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className={`font-medium ${getRateColor(row.clickRate, 'click')}`}>
                                {row.clickRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmailPerformanceTable;
