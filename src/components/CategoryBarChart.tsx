
import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle as XCircleIcon, ArrowRight } from 'lucide-react';

interface CategoryData {
    label: string;
    score: number;
    isBleedingNeck?: boolean;
}

interface CategoryBarChartProps {
    data: CategoryData[];
    averageScore?: number;
}

const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data, averageScore = 5.8 }) => {
    return (
        <div className="w-full space-y-4">
            {data.map((item, index) => {
                const isRed = item.score < 5;
                const isYellow = item.score >= 5 && item.score < 7;
                const isGreen = item.score >= 7;

                let colorClass = "bg-primary";
                if (isRed) colorClass = "bg-[#E74C3C]";
                if (isYellow) colorClass = "bg-[#F39C12]";
                if (isGreen) colorClass = "bg-[#27AE60]";

                return (
                    <div key={index} className="relative">
                        <div className="flex justify-between items-end mb-1">
                            <span className="font-medium text-sm md:text-base flex items-center gap-2">
                                {item.label}
                                {item.isBleedingNeck && (
                                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase animate-pulse">
                                        <AlertTriangle size={10} /> Bleeding Neck
                                    </span>
                                )}
                            </span>
                            <span className="font-bold tabular-nums flex items-center gap-2">
                                {item.score.toFixed(1)}/10
                                {isRed && <span className="text-red-500">🔴</span>}
                                {isYellow && <span className="text-yellow-500">⚠️</span>}
                            </span>
                        </div>

                        <div className="h-6 w-full bg-secondary/20 rounded-full overflow-hidden relative">
                            <div
                                className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2`}
                                style={{ width: `${item.score * 10}%`, transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Optional: Add striping or effects */}
                            </div>

                            {/* Average Line */}
                            <div
                                className="absolute top-0 bottom-0 border-l-2 border-dashed border-gray-400 z-10 opacity-50"
                                style={{ left: `${averageScore * 10}%` }}
                            ></div>
                        </div>

                        {/* Average Label only on first item to avoid clutter, or maybe just a legend */}
                        {index === 0 && (
                            <div
                                className="absolute -top-6 text-[10px] text-gray-400 font-medium transform -translate-x-1/2 whitespace-nowrap"
                                style={{ left: `${averageScore * 10}%` }}
                            >
                                Avg: {averageScore}
                            </div>
                        )}

                        {item.isBleedingNeck && (
                            <div className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                                <ArrowRight size={12} className="rotate-90 -mt-1" /> This is dragging down your entire relationship.
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryBarChart;
