
import React from 'react';

interface GaugeChartProps {
    score: number;
    label: string;
    riskLevel?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ score, label, riskLevel }) => {
    // Canvas config
    const width = 200;
    const height = 100;
    const cx = 100;
    const cy = 100;
    const radius = 90;
    const innerRadius = 60;

    // Helper to calc polar coords
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        // SVG starts angle 0 at 3 o'clock, clockwise.
        // We want 180 (left) to 360 (right). 
        // Or 180 (left) to 0 (right) counter-clockwise?
        // Let's use standard math: 0 is right. 180 is left. 
        // We want arc from 180 to 0 (clockwise from top? No, counter).
        // Standard SVG trig: 
        // x = cx + r * cos(a)
        // y = cy + r * sin(a)

        const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    // Helper to describe arc
    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        const d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    }

    // We want a donut segment.
    // path = Outer Arc + Line to Inner + Inner Arc (reverse) + Close
    const describeDonutSegment = (startAngle: number, endAngle: number, color: string) => {
        // Angles: 0 = Left (180 deg in polar), 100 = Right (360 deg in polar)
        // Let's map 0-100 range to 0-180 degrees.
        const startRad = startAngle * 1.8;
        const endRad = endAngle * 1.8;

        const outerStart = polarToCartesian(cx, cy, radius, endRad);
        const outerEnd = polarToCartesian(cx, cy, radius, startRad);

        const innerStart = polarToCartesian(cx, cy, innerRadius, endRad);
        const innerEnd = polarToCartesian(cx, cy, innerRadius, startRad);

        // Path
        // Move to Outer Start
        // Arc to Outer End
        // Line to Inner End
        // Arc to Inner Start (Reverse)
        // Close

        return (
            <path
                d={`
                    M ${outerStart.x} ${outerStart.y}
                    A ${radius} ${radius} 0 0 0 ${outerEnd.x} ${outerEnd.y}
                    L ${innerEnd.x} ${innerEnd.y}
                    A ${innerRadius} ${innerRadius} 0 0 1 ${innerStart.x} ${innerStart.y}
                    Z
                `}
                fill={color}
            />
        );
    };

    // Needle Logic
    const needleAngle = score * 1.8; // 0-100 -> 0-180 degrees
    // We need to map this to the SVG coords used above.
    // Above: 0 score = 0 degrees input to function -> polarToCartesian(..., 0) which does (0-180) = -180 rad. 
    // cos(-180) = -1. x = cx - r. Left. Correct. 

    const needleLen = 95;
    const needleTip = polarToCartesian(cx, cy, needleLen, needleAngle);

    // Dynamic color
    let statusColor = '#E74C3C'; // Red
    if (score > 30) statusColor = '#F39C12'; // Orange
    if (score > 70) statusColor = '#22C55E'; // Green

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[300px] relative">
                <svg viewBox="0 0 200 110" className="w-full h-auto overflow-visible">
                    {/* Zones */}
                    {describeDonutSegment(0, 30, '#E74C3C')}
                    {describeDonutSegment(30, 70, '#F39C12')}
                    {describeDonutSegment(70, 100, '#22C55E')}

                    {/* Needle */}
                    <line
                        x1={cx}
                        y1={cy}
                        x2={needleTip.x}
                        y2={needleTip.y}
                        stroke="#374151"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                    <circle cx={cx} cy={cy} r="6" fill="#374151" />
                </svg>
            </div>

            <div className="text-center relative z-10 -mt-2">
                <div className="text-5xl font-bold mb-1 tabular-nums" style={{ color: statusColor }}>{score}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{label}</div>

                {riskLevel && (
                    <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-xs font-bold uppercase border border-yellow-200 dark:border-yellow-800">
                        ⚠️ {riskLevel}
                    </div>
                )}
            </div>

            {/* Labels */}
            <div className="w-full flex justify-between text-[10px] uppercase font-bold text-muted-foreground mt-2 px-8 max-w-[300px]">
                <span>Crisis</span>
                <span>Stable</span>
                <span>Thriving</span>
            </div>
        </div>
    );
};

export default GaugeChart;
