
import { type AuthUser } from "wasp/auth";
import { useQuery, getFunnelStats } from "wasp/client/operations";
import DefaultLayout from "../../layout/DefaultLayout";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const AdminFunnelPage = ({ user }: { user: AuthUser }) => {
    const { data: stats, isLoading } = useQuery(getFunnelStats);

    const questionCategories = Array.from({ length: 28 }, (_, i) => `Q${i + 1}`);

    const series = [
        {
            name: "Sessions",
            data: stats ? [
                stats.started,
                ...(stats.questionCounts || []), // Detailed questions
                stats.completed,
                stats.onboarding,
                stats.emailCaptured,
                stats.paid
            ] : []
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "bar",
            height: 1000, // Increased height for more categories
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
                barHeight: '80%',
            },
        },
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories: [
                "Started",
                ...questionCategories,
                "Completed",
                "Onboarding",
                "Email Captured",
                "Paid"
            ],
        },
        colors: ['#3C50E0'],
        title: {
            text: "User Conversion Funnel (Detail)",
            align: 'left'
        }
    };

    return (
        <DefaultLayout user={user}>
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Funnel Analysis</h1>
                    <p className="text-gray-500">Track user conversion through key milestones.</p>
                </div>

                <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-strokedark">
                    {isLoading ? (
                        <div className="h-[350px] flex items-center justify-center">Loading...</div>
                    ) : (
                        <div id="funnelChart">
                            <ReactApexChart options={options} series={series} type="bar" height={1000} />
                        </div>
                    )}
                </div>

                {/* Metric Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white dark:bg-boxdark rounded-lg border border-gray-200 dark:border-strokedark">
                            <p className="text-sm text-gray-500">Conversion to Email</p>
                            <p className="text-2xl font-bold text-primary">{((stats.emailCaptured / stats.started) * 100).toFixed(1)}%</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-boxdark rounded-lg border border-gray-200 dark:border-strokedark">
                            <p className="text-sm text-gray-500">Conversion to Completion</p>
                            <p className="text-2xl font-bold text-primary">{((stats.completed / stats.started) * 100).toFixed(1)}%</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-boxdark rounded-lg border border-gray-200 dark:border-strokedark">
                            <p className="text-sm text-gray-500">Conversion to Paid</p>
                            <p className="text-2xl font-bold text-primary">{((stats.paid / stats.started) * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                )}

            </div>
        </DefaultLayout>
    );
};

export default AdminFunnelPage;
