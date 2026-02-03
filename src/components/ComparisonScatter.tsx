import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';

interface ComparisonProps {
    userScore: { x: number, y: number };
}

export const ComparisonScatter: React.FC<ComparisonProps> = ({ userScore }) => {
    // Generate some fake "average" data for social proof
    const data = [
        { x: 30, y: 40, type: 'average' },
        { x: 45, y: 55, type: 'average' },
        { x: 20, y: 80, type: 'average' },
        { x: 60, y: 30, type: 'average' },
        { x: 75, y: 65, type: 'average' },
        { x: 50, y: 50, type: 'average' },
        { x: 40, y: 70, type: 'average' },
        { x: 80, y: 20, type: 'average' },
        { x: 25, y: 25, type: 'average' },
        { x: 55, y: 60, type: 'average' },
        { x: userScore.x, y: userScore.y, type: 'user' }, // The user
    ];

    return (
        <div className="w-full h-80 bg-white rounded-xl p-4 font-sans relative">
            <h4 className="text-center text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Couples in Crisis vs. You</h4>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis type="number" dataKey="x" name="Communication Safety" unit="%" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                    <YAxis type="number" dataKey="y" name="Emotional Intimacy" unit="%" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const dataPoint = payload[0].payload;
                            return (
                                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg text-xs">
                                    <p className="font-bold mb-1">{dataPoint.type === 'user' ? 'YOU ARE HERE' : 'Average Couple'}</p>
                                    <p className="text-gray-500">Intimacy: {dataPoint.y}%</p>
                                    <p className="text-gray-500">Safety: {dataPoint.x}%</p>
                                </div>
                            );
                        }
                        return null;
                    }} />

                    {/* Quadrant Labels */}
                    <ReferenceLine y={50} stroke="#E5E7EB" />
                    <ReferenceLine x={50} stroke="#E5E7EB" />

                    <Scatter name="Couples" data={data} fill="#8884d8">
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.type === 'user' ? '#EF4444' : '#E5E7EB'}
                                stroke={entry.type === 'user' ? '#B91C1C' : '#D1D5DB'}
                            />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>

            {/* Custom overlays for quadrant meanings if needed */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                {/* Can add background icons or labels here */}
            </div>
        </div>
    );
};
