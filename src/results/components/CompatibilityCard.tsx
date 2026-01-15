import React from 'react';
import { cn } from "../../client/utils";
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';

interface CompatibilityData {
    overallScore: number;
    breakdown: {
        dimension: string;
        score: number;
        status: string; // 'aligned' | 'mismatched' | 'opposite'
        insight: string;
    }[];
    riskLevel: string; // 'low' | 'medium' | 'high'
    topRecommendation: string;
}

interface CompatibilityCardProps {
    data: CompatibilityData;
}

export function CompatibilityCard({ data }: CompatibilityCardProps) {
    const getRiskColor = (level: string) => {
        switch (level) {
            case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-primary';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600 dark:text-green-400';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'aligned': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'mismatched': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'opposite': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <AlertTriangle className="w-5 h-5 text-muted-foreground" />;
        }
    };

    return (
        <div className="bg-card w-full rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Compatibility Pulse</h3>
                        <p className="text-muted-foreground">How your nervous systems interact under stress.</p>
                    </div>

                    <div className={cn("px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider flex items-center gap-2", getRiskColor(data.riskLevel))}>
                        <TrendingUp size={16} />
                        {data.riskLevel === 'low' ? 'Strong Connection' : data.riskLevel === 'medium' ? 'Mixed Signals' : 'Critical Risk'}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Overall Score */}
                    <div className="flex flex-col items-center justify-center p-6 bg-accent/30 rounded-2xl border border-border/50">
                        <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-background bg-card shadow-inner mb-4">
                            <span className={cn("text-4xl font-black", getScoreColor(data.overallScore))}>
                                {data.overallScore}%
                            </span>
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Harmony Score</span>
                    </div>

                    {/* Breakdown */}
                    <div className="md:col-span-2 space-y-4">
                        {data.breakdown.map((item, idx) => (
                            <div key={idx} className="bg-background p-4 rounded-xl border border-border/50 hover:border-border transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        {getStatusIcon(item.status)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between w-full">
                                            <h4 className="font-bold text-sm">{item.dimension}</h4>
                                            <span className="text-xs font-mono text-muted-foreground">{item.score}/100</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-500",
                                                    item.status === 'aligned' ? 'bg-green-500' :
                                                        item.status === 'mismatched' ? 'bg-yellow-500' : 'bg-red-500'
                                                )}
                                                style={{ width: `${item.score}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                            {item.insight}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendation */}
                <div className="mt-8 pt-8 border-t border-border">
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 flex gap-4 items-start">
                        <div className="bg-primary/20 text-primary p-2 rounded-full shrink-0">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-primary mb-1">Top Recommendation</h4>
                            <p className="text-foreground/90 font-medium">{data.topRecommendation}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
