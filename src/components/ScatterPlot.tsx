
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';

interface ComparisonProps {
    userScore: { x: number, y: number }; // X: Duration (0-2, 3-7, 8+ mapped to 0-100?), Y: Score (0-100)
    userDurationLabel?: string;
}

export const ScatterPlot: React.FC<ComparisonProps> = ({ userScore, userDurationLabel = "3 years" }) => {
    // Generate scattered background data
    const generateDots = () => {
        const dots: { x: number, y: number, zone: string, type: string }[] = [];
        // Cluster 1: High score, varying time (Thriving)
        for (let i = 0; i < 30; i++) dots.push({ x: Math.random() * 100, y: 75 + Math.random() * 25, zone: 'thriving', type: 'average' });
        // Cluster 2: Mid score (Stable)
        for (let i = 0; i < 40; i++) dots.push({ x: Math.random() * 100, y: 55 + Math.random() * 20, zone: 'stable', type: 'average' });
        // Cluster 3: Low score (Crisis)
        for (let i = 0; i < 20; i++) dots.push({ x: Math.random() * 100, y: 15 + Math.random() * 35, zone: 'crisis', type: 'average' });

        return dots;
    };

    const data = [
        ...generateDots(),
        { x: userScore.x, y: userScore.y, type: 'user', label: 'YOU' }
    ];

    // Colored Background Zones could be done with ReferenceAreas, but simple colored bands might be cleaner

    return (
        <div className="w-full h-[400px] bg-white rounded-xl font-sans relative overflow-hidden">

            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{ top: 20, right: 30, bottom: 40, left: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

                    {/* X Axis - Duration Buckets */}
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="Duration"
                        domain={[0, 100]}
                        ticks={[16, 50, 83]}
                        tickFormatter={(val: number) => {
                            if (val === 16) return "Short (0-2y)";
                            if (val === 50) return "Mid (3-7y)";
                            if (val === 83) return "Long (8+y)";
                            return "";
                        }}
                        tick={{ fontSize: 12, fill: '#666' }}
                    />

                    {/* Y Axis - Relationship Score */}
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="Score"
                        domain={[0, 100]}
                        ticks={[15, 40, 60, 85]}
                        tickFormatter={(val: number) => {
                            if (val === 15) return "CRISIS";
                            if (val === 40) return "RISK";
                            if (val === 60) return "STABLE";
                            if (val === 85) return "THRIVING";
                            return "";
                        }}
                        tick={{ fontSize: 10, fill: '#666', fontWeight: 'bold' }}
                    />

                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={() => null} />

                    <Scatter name="Couples" data={data}>
                        {data.map((entry, index) => {
                            if (entry.type === 'user') {
                                return <Cell key={`cell-${index}`} fill="#E74C3C" stroke="#fff" strokeWidth={3} />;
                            }
                            return <Cell key={`cell-${index}`} fill="#CBD5E1" fillOpacity={0.6} />;
                        })}
                    </Scatter>

                    {/* Label for User */}
                    <ReferenceLine x={userScore.x} stroke="none" label={{
                        position: 'top',
                        value: 'YOU',
                        fill: '#E74C3C',
                        fontSize: 14,
                        fontWeight: 'bold',
                        dy: -10
                    }} />

                </ScatterChart>
            </ResponsiveContainer>

            {/* Zone Labels Overlay */}
            <div className="absolute left-14 right-4 top-4 bottom-10 -z-10 flex flex-col pointer-events-none opacity-20">
                <div className="flex-1 bg-green-100 border-b border-green-200" /> {/* Thriving */}
                <div className="flex-1 bg-yellow-50 border-b border-yellow-200" /> {/* Stable */}
                <div className="flex-1 bg-orange-100 border-b border-orange-200" /> {/* Risk */}
                <div className="flex-1 bg-red-100" /> {/* Crisis */}
            </div>

        </div>
    );
};
