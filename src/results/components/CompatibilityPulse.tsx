import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CompatibilityPulseProps {
    score: number;
}

export function CompatibilityPulse({ score }: CompatibilityPulseProps) {
    // Gauge Data: 4 Zones
    const data = [
        { name: 'Toxic', value: 25, color: '#ef4444' },     // Red
        { name: 'Volatile', value: 25, color: '#f97316' },  // Orange
        { name: 'Workable', value: 25, color: '#eab308' },  // Yellow
        { name: 'Thriving', value: 25, color: '#22c55e' },  // Green
    ];

    // Calculate needle rotation
    // 180 degrees total. 0 score = 180 deg (left), 100 score = 0 deg (right)
    // Recharts starts at 0 (right) and goes CCW.
    // Actually, let's map it: 0% -> 180deg, 100% -> 0deg.
    const needleRotation = 180 - (score / 100) * 180;

    const RADIAN = Math.PI / 180;
    const cx = "50%";
    const cy = "70%"; // Push down to make semi-circle sit well

    return (
        <div className="w-full h-[300px] relative flex flex-col items-center justify-end overflow-hidden">
            <ResponsiveContainer width="100%" height="150%">
                <PieChart>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={data}
                        cx="50%"
                        cy="70%"
                        innerRadius="60%"
                        outerRadius="90%"
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Needle Layer */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
                {/* We need strictly controlled SVG for needle to ensure smooth rotation */}
                <div className="w-full h-full relative">
                    <div
                        className="absolute left-1/2 top-[70%] w-[140px] h-[4px] bg-slate-800 dark:bg-white origin-left transition-transform duration-1000 ease-out rounded-full shadow-xl"
                        style={{
                            transform: `rotate(-${180 - (score * 1.8)}deg) translateX(-50%)`, // Correct pivot logic
                            marginLeft: 0,
                            marginTop: '-2px'
                        }}
                    >
                        {/* Needle Head */}
                        <div className="w-4 h-4 bg-slate-800 dark:bg-white rounded-full absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-20 w-full flex justify-between px-10 text-xs font-bold text-muted-foreground uppercase tracking-widest max-w-lg mx-auto">
                <span>Critical</span>
                <span>Thriving</span>
            </div>

            <div className="absolute bottom-6 text-center">
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Your Score</div>
                <div className="text-5xl font-extrabold text-foreground">{score}%</div>
            </div>
        </div>
    );
}
