import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface LensRadarProps {
    data: {
        dimension: string;
        score: number; // SL score (Sensory Load / Sensitivity) is usually what we map for "Shape"
    }[];
}

export const LensRadar: React.FC<LensRadarProps> = ({ data }) => {
    // Format data for ApexCharts
    // We want to visually represent the "Shape" of their sensitivity

    const series = [{
        name: 'Sensitivity Profile',
        data: data.map(d => Math.round(d.score)),
    }];

    const options: ApexOptions = {
        chart: {
            type: 'radar',
            toolbar: { show: false },
            dropShadow: { enabled: true, blur: 1, left: 1, top: 1 }
        },
        title: {
            text: undefined
        },
        stroke: {
            width: 2,
            colors: ['#2563eb'] // Primary Blue
        },
        fill: {
            opacity: 0.2,
            colors: ['#2563eb']
        },
        markers: {
            size: 4,
            colors: ['#fff'],
            strokeColors: '#2563eb',
            strokeWidth: 2,
        },
        xaxis: {
            categories: data.map(d => d.dimension.charAt(0).toUpperCase() + d.dimension.slice(1).replace('_', ' ')),
            labels: {
                show: true,
                style: {
                    colors: ['#64748b', '#64748b', '#64748b', '#64748b', '#64748b'], // Slate-500
                    fontSize: '11px',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                }
            }
        },
        yaxis: {
            show: false,
            min: 0,
            max: 100,
            tickAmount: 5,
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: '#e2e8f0',
                    connectorColors: '#e2e8f0',
                }
            }
        },
        tooltip: {
            y: {
                formatter: (val: number) => val + "% Intensity"
            }
        }
    };

    return (
        <div className="w-full h-64 md:h-80 relative z-10">
            <Chart options={options} series={series} type="radar" height="100%" />
        </div>
    );
};
