
import React from 'react';
import ReactApexChart from 'react-apexcharts';

type TrendChartProps = {
    dailyStats: {
        date: string;
        started: number;
        leads: number;
        sales: number;
        conversionRate: number;
    }[];
    isLoading: boolean;
};

export const TrendChart = ({ dailyStats, isLoading }: TrendChartProps) => {
    if (isLoading) return <div>Loading chart...</div>;
    if (!dailyStats || dailyStats.length === 0) return <div className="text-center text-gray-500 py-10">No data for selected period</div>;

    const series = [
        {
            name: 'Tests Started',
            data: dailyStats.map(d => d.started),
            type: 'area'
        },
        {
            name: 'Leads',
            data: dailyStats.map(d => d.leads),
            type: 'column'
        },
        {
            name: 'Sales',
            data: dailyStats.map(d => d.sales),
            type: 'column'
        }
    ];

    const options: ApexCharts.ApexOptions = {
        chart: {
            height: 350,
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        stroke: {
            width: [2, 0, 0],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                columnWidth: '50%',
                borderRadius: 4
            }
        },
        fill: {
            opacity: [0.1, 0.8, 1],
            gradient: {
                inverseColors: false,
                shade: 'light',
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100]
            }
        },
        labels: dailyStats.map(d => d.date),
        markers: {
            size: 0
        },
        xaxis: {
            type: 'datetime',
            tooltip: {
                enabled: false
            }
        },
        yaxis: [
            {
                title: { text: 'Tests / Leads' },
            },
            {
                opposite: true,
                title: { text: 'Sales' },
            }
        ],
        colors: ['#3C50E0', '#10B981', '#F59E0B'], // Primary, Green, Orange
        legend: {
            position: 'top'
        },
        grid: {
            borderColor: '#f1f1f1',
        }
    };

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Traffic & Conversion Trend</h3>
            <div id="chartOne" className="-ml-5">
                <ReactApexChart options={options} series={series} type="line" height={350} />
            </div>
        </div>
    );
};
