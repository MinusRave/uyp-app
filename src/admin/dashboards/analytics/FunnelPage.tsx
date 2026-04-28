
import { useState } from "react";
import { type AuthUser } from "wasp/auth";
import { useQuery, getFunnelStats, getQuizFunnelStats } from "wasp/client/operations";
import DefaultLayout from "../../layout/DefaultLayout";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { cn } from "../../../client/utils";

type ProductFilter = 'all' | 'stay-or-leave' | 'uyp';

const AdminFunnelPage = ({ user }: { user: AuthUser }) => {
    const [productFilter, setProductFilter] = useState<ProductFilter>('all');
    const { data: stats, isLoading } = useQuery(getFunnelStats, { productFilter });
    const { data: quizStats, isLoading: isLoadingQuiz } = useQuery(getQuizFunnelStats, { productFilter });

    const questionCategories = Array.from({ length: 28 }, (_, i) => `Q${i + 1}`);

    const series = [
        {
            name: "Sessions",
            data: stats ? [
                stats.started,
                stats.step1,
                stats.step2,
                stats.step3,
                stats.step4,
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
                horizontal: false,
                barHeight: '80%',
            },
        },
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories: [
                "Started",
                "Wizard Step 1",
                "Wizard Step 2",
                "Wizard Step 3",
                "Wizard Step 4",
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

                {/* Product Tabs — switch between Stay or Leave and UYP */}
                <div className="bg-white dark:bg-boxdark p-1 rounded-lg shadow-sm border border-gray-200 dark:border-strokedark inline-flex gap-1 self-start">
                    {([
                        { id: 'all', label: 'All Tests' },
                        { id: 'stay-or-leave', label: 'Stay or Leave' },
                        { id: 'uyp', label: 'Understand Your Partner' },
                    ] as const).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setProductFilter(tab.id)}
                            className={cn(
                                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                productFilter === tab.id
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
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

                {/* Pre-email Drop-off (anonymous QuizEvent tracking) */}
                <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-strokedark">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pre-Email Drop-off (Anonymous)</h2>
                        <p className="text-sm text-gray-500">
                            Where users abandon BEFORE submitting their email. Only counts visitors who clicked "Start the test".
                        </p>
                    </div>
                    {isLoadingQuiz ? (
                        <div className="h-[300px] flex items-center justify-center">Loading...</div>
                    ) : quizStats ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-meta-4 border border-gray-200 dark:border-strokedark">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Quiz Starts</p>
                                    <p className="text-2xl font-bold">{quizStats.quizStarts.toLocaleString()}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-meta-4 border border-gray-200 dark:border-strokedark">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Abandons</p>
                                    <p className="text-2xl font-bold text-red-600">{quizStats.quizAbandons.toLocaleString()}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-meta-4 border border-gray-200 dark:border-strokedark">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Leads (Email)</p>
                                    <p className="text-2xl font-bold text-primary">{quizStats.leads.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Start → Lead: {quizStats.startToLeadRate}%</p>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-50 dark:bg-meta-4 border border-gray-200 dark:border-strokedark">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Purchased</p>
                                    <p className="text-2xl font-bold text-success">{quizStats.purchased.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Lead → Paid: {quizStats.leadToPurchaseRate}%</p>
                                </div>
                            </div>

                            {quizStats.dropOffDistribution.length === 0 ? (
                                <div className="text-sm text-gray-500 italic py-8 text-center">
                                    No abandon events recorded yet for this filter. Once users start dropping off, you'll see the per-question distribution here.
                                </div>
                            ) : (
                                <ReactApexChart
                                    type="bar"
                                    height={350}
                                    series={[{
                                        name: "Abandons",
                                        data: quizStats.dropOffDistribution.map(d => d.count),
                                    }]}
                                    options={{
                                        chart: { type: "bar", toolbar: { show: false } },
                                        plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: "60%" } },
                                        dataLabels: { enabled: true },
                                        xaxis: {
                                            categories: quizStats.dropOffDistribution.map(d => `Q${d.questionIndex}`),
                                            title: { text: "Question index where user left" },
                                        },
                                        yaxis: { title: { text: "Number of users" } },
                                        colors: ["#EF4444"],
                                        title: { text: "Drop-off by Question", align: "left" },
                                    }}
                                />
                            )}
                        </>
                    ) : null}
                </div>

            </div>
        </DefaultLayout>
    );
};

export default AdminFunnelPage;
