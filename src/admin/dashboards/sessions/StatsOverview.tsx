
import React from 'react';
import { ArrowUp, ArrowDown, Users, Mail, DollarSign, CheckCircle, Percent } from 'lucide-react';

type StatsOverviewProps = {
    summary: {
        totalStarted: number;
        totalCompletedNoEmail: number;
        totalLeads: number;
        totalSales: number;
        conversionRate: number;
        completionRate: number;
    };
    isLoading: boolean;
};

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full bg-opacity-10 ${color}`}>
            <Icon size={24} className={color.replace('bg-', 'text-').replace('/10', '')} />
        </div>
        <div className="mt-4 flex items-end justify-between">
            <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">{value}</h4>
                <span className="text-sm font-medium text-gray-500">{title}</span>
            </div>
        </div>
        {subValue && <div className="mt-2 text-xs text-gray-400">{subValue}</div>}
    </div>
);

export const StatsOverview = ({ summary, isLoading }: StatsOverviewProps) => {
    if (isLoading) return <div className="text-center py-4">Loading stats...</div>;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <StatCard
                title="Tests Started"
                value={summary.totalStarted}
                icon={Users}
                color="bg-primary/10 text-primary"
                subValue={`Completion Rate: ${summary.completionRate.toFixed(1)}%`}
            />
            <StatCard
                title="Leads (Emails)"
                value={summary.totalLeads}
                icon={Mail}
                color="bg-blue-100 text-blue-600"
                subValue={`${summary.totalCompletedNoEmail} completed w/o email`}
            />
            <StatCard
                title="Sales (Paid)"
                value={summary.totalSales}
                icon={DollarSign}
                color="bg-green-100 text-green-600"
            />
            <StatCard
                title="Conversion Rate"
                value={`${summary.conversionRate.toFixed(2)}%`}
                icon={Percent}
                color="bg-orange-100 text-orange-600"
                subValue="Sales / Leads"
            />
        </div>
    );
};
