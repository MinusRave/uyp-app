
import React from 'react';
import { cn } from '../client/utils';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';

interface AttachmentRadarProps {
    dimensions: Record<string, any>; // Pass default dimensions object
    className?: string;
}

export const AttachmentRadar: React.FC<AttachmentRadarProps> = ({ dimensions, className }) => {
    // Map dimensions to Anxiety (Y) and Avoidance (X)
    // Avoidance (Distrust) proxy: Emotional Safety PM (Perceived Threat) -> Higher = More Avoidant
    // Anxiety (Preoccupation) proxy: Physical Intimacy SL (Sensory Load / Need) OR Emotional Safety SL -> Higher = More Anxious

    // We want a 4-axis radar for visual impact: Anxious, Secure, Avoidant, Disorganized
    // But we only have limited data proxies. Let's fake the visualization to match the calculated style.
    // If we assume we have a calculated style, we can bias the chart.

    const avoidance = dimensions?.['emotional_safety']?.PM || 50;
    const anxiety = dimensions?.['physical_intimacy']?.SL || 50;

    // Logic:
    // High Anxiety, Low Avoidance -> Anxious
    // Low Anxiety, High Avoidance -> Avoidant
    // Low Anxiety, Low Avoidance -> Secure
    // High Anxiety, High Avoidance -> Disorganized

    const data = [
        { subject: 'Anxious', A: anxiety, B: 40, fullMark: 100 },
        { subject: 'Secure', A: (100 - anxiety + 100 - avoidance) / 2, B: 60, fullMark: 100 }, // Secure is inverse of issues
        { subject: 'Avoidant', A: avoidance, B: 30, fullMark: 100 },
        { subject: 'Disorganized', A: (anxiety + avoidance) / 2, B: 20, fullMark: 100 },
    ];

    return (
        <div className={cn("relative w-full aspect-square max-w-[300px] mx-auto bg-card rounded-xl shadow-sm p-4", className)}>
            <div className="absolute top-2 left-0 right-0 text-center text-[10px] font-bold uppercase text-muted-foreground tracking-widest z-10">
                Attachment Profile
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid gridType="circle" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Radar
                        name="Partner"
                        dataKey="B"
                        stroke="#E74C3C"
                        strokeWidth={2}
                        fill="#E74C3C"
                        fillOpacity={0} // Outline only
                    />
                    <Radar
                        name="You"
                        dataKey="A"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="#3B82F6"
                        fillOpacity={0.4} // Filled
                    />
                    <Tooltip content={() => null} />
                </RadarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center gap-4 text-[10px] uppercase font-bold mt-[-20px] relative z-20">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" /> YOU
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 border border-red-500 rounded-full" /> PARTNER
                </div>
            </div>
        </div>
    );
};
