import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Legend } from 'recharts';

interface DualAttachmentRadarProps {
    dimensions: Record<string, any>;
}

export function DualAttachmentRadar({ dimensions }: DualAttachmentRadarProps) {
    // 1. Calculate User Scores
    const userAvoidance = dimensions?.['emotional_safety']?.PM || 50; // Perceived Threat -> Avoidance
    const userAnxiety = dimensions?.['physical_intimacy']?.SL || 50;  // Need for closeness -> Anxiety

    // 2. Estimate Partner Scores (Opposite Reaction Pattern)
    // In many cycles, High Anxiety maps to High Avoidance in partner, and vice versa.
    let partnerAvoidance = 50;
    let partnerAnxiety = 50;

    if (userAnxiety > 60) {
        // User is Anxious -> Partner likely Avoidant
        partnerAvoidance = Math.min(userAnxiety + 10, 95);
        partnerAnxiety = 30;
    } else if (userAvoidance > 60) {
        // User is Avoidant -> Partner likely Anxious
        partnerAnxiety = Math.min(userAvoidance + 10, 95);
        partnerAvoidance = 30;
    } else {
        // User is Secure-ish -> Partner likely similar or average
        partnerAvoidance = 45;
        partnerAnxiety = 45;
    }

    // 3. Map to 4 Axes
    const calculateAxes = (anx: number, avoid: number) => {
        return {
            anxious: anx,
            avoidant: avoid,
            secure: (100 - anx + 100 - avoid) / 2,
            disorganized: (anx + avoid) / 2
        };
    };

    const userAxes = calculateAxes(userAnxiety, userAvoidance);
    const partnerAxes = calculateAxes(partnerAnxiety, partnerAvoidance);

    const data = [
        { subject: 'Anxious', A: userAxes.anxious, B: partnerAxes.anxious, fullMark: 100 },
        { subject: 'Secure', A: userAxes.secure, B: partnerAxes.secure, fullMark: 100 },
        { subject: 'Avoidant', A: userAxes.avoidant, B: partnerAxes.avoidant, fullMark: 100 },
        { subject: 'Disorganized', A: userAxes.disorganized, B: partnerAxes.disorganized, fullMark: 100 },
    ];

    return (
        <div className="w-full aspect-square max-w-[400px] mx-auto relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }} />

                    <Radar
                        name="YOU (Blue)"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="#3b82f6"
                        fillOpacity={0.4}
                    />
                    <Radar
                        name="PARTNER (Red)"
                        dataKey="B"
                        stroke="#ef4444"
                        strokeWidth={3}
                        fill="#ef4444"
                        fillOpacity={0} // Outline only per request
                        strokeDasharray="4 4"
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: number, name: string) => [Math.round(value), name === 'A' ? 'You' : 'Partner']}
                    />
                </RadarChart>
            </ResponsiveContainer>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-xs font-bold uppercase">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500/40 border-2 border-blue-500 rounded-sm" />
                    <span>You</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-red-500 border-dashed rounded-sm" />
                    <span>Partner (Est.)</span>
                </div>
            </div>
        </div>
    );
}
