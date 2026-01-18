
import { type AuthUser } from "wasp/auth";
import { useQuery, getDemographicStats } from "wasp/client/operations";
import DefaultLayout from "../../layout/DefaultLayout";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const AdminDemographicsPage = ({ user }: { user: AuthUser }) => {
    const { data: stats, isLoading } = useQuery(getDemographicStats);

    if (isLoading || !stats) {
        return <DefaultLayout user={user}>Loading...</DefaultLayout>;
    }

    // Helper to init charts
    const createChartData = (distribution: Record<string, number>, title: string): { series: number[], options: ApexOptions } => {
        const labels = Object.keys(distribution);
        const series = Object.values(distribution);

        return {
            series,
            options: {
                chart: { type: 'pie' },
                labels,
                title: { text: title, align: 'left' },
                colors: ['#3C50E0', '#80CAEE', '#0FADCF', '#6577F3', '#8FD0EF'],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: { width: 200 },
                        legend: { position: 'bottom' }
                    }
                }]
            }
        };
    };

    const genderChart = createChartData(stats.genderDistribution, "User Gender");
    const ageChart = createChartData(stats.ageDistribution, "User Age Range");
    const relStatusChart = createChartData(stats.relationshipStatus, "Relationship Status");
    const conflictChart = createChartData(stats.partnerConflictStyle, "Partner Conflict Style");

    return (
        <DefaultLayout user={user}>
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Demographics</h1>
                    <p className="text-gray-500">Understand who is taking the test.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard title="User Gender">
                        <ReactApexChart options={genderChart.options} series={genderChart.series} type="pie" width={380} />
                    </ChartCard>
                    <ChartCard title="Age Range">
                        <ReactApexChart options={ageChart.options} series={ageChart.series} type="pie" width={380} />
                    </ChartCard>
                    <ChartCard title="Relationship Status">
                        <ReactApexChart options={relStatusChart.options} series={relStatusChart.series} type="pie" width={380} />
                    </ChartCard>
                    <ChartCard title="Partner Conflict Style">
                        <ReactApexChart options={conflictChart.options} series={conflictChart.series} type="pie" width={380} />
                    </ChartCard>
                </div>
            </div>
        </DefaultLayout>
    );
};

const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-strokedark flex flex-col items-center">
        {children}
    </div>
);

export default AdminDemographicsPage;
