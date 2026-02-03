import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';

const data = [
    { month: 'Now', with: 50, without: 50 },
    { month: '3mo', with: 65, without: 40 },
    { month: '6mo', with: 75, without: 30 },
    { month: '12mo', with: 85, without: 20 },
    { month: '18mo', with: 90, without: 15 },
    { month: '24mo', with: 95, without: 10 },
];

export function TrajectoryChart() {
    return (
        <div className="w-full h-[300px] mt-4 font-sans text-sm">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWithout" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis hide domain={[0, 100]} />

                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="with"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorWith)"
                        name="With Intervention"
                    />
                    <Area
                        type="monotone"
                        dataKey="without"
                        stroke="#ef4444"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorWithout)"
                        name="Without Intervention"
                    />

                    <ReferenceDot x="Now" y={50} r={6} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
                    <ReferenceLine x="Now" stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'YOU ARE HERE', position: 'top', fill: '#3b82f6', fontSize: 12, fontWeight: 'bold' }} />
                </AreaChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-medium">
                <div className="flex items-start gap-2 text-emerald-600">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-0.5" />
                    <div>
                        <div className="font-bold">WITH Intervention</div>
                        <div className="text-muted-foreground font-normal">Stabilization & Growth</div>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-red-600">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-0.5" />
                    <div>
                        <div className="font-bold">WITHOUT Intervention</div>
                        <div className="text-muted-foreground font-normal">Risk of Detachment</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
