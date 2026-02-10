import { TrendingUp, Users, Mail, ShoppingCart, CreditCard, DollarSign, Filter } from 'lucide-react';

interface FunnelMetricsProps {
    metrics: {
        totalSessions: number;
        testStarted: number;
        emailCaptured: number;
        resultsViewed: number;
        checkoutStarted: number;
        purchased: number;
    };
    filters?: {
        trafficSource?: string;
        dateFrom?: string;
        dateTo?: string;
        deviceType?: string;
        excludeBots?: boolean;
    };
}

export function FunnelMetrics({ metrics, filters }: FunnelMetricsProps) {
    const calculateRate = (numerator: number, denominator: number) => {
        if (denominator === 0) return 0;
        return Math.round((numerator / denominator) * 100);
    };

    const stages = [
        {
            name: 'Sessions',
            icon: Users,
            count: metrics.totalSessions,
            rate: 100,
            color: 'bg-gray-500',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            textColor: 'text-gray-700'
        },
        {
            name: 'Test Started',
            icon: TrendingUp,
            count: metrics.testStarted,
            rate: calculateRate(metrics.testStarted, metrics.totalSessions),
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-700',
            benchmark: '40-60%'
        },
        {
            name: 'Email Captured',
            icon: Mail,
            count: metrics.emailCaptured,
            rate: calculateRate(metrics.emailCaptured, metrics.testStarted),
            color: 'bg-indigo-500',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            textColor: 'text-indigo-700',
            benchmark: '60-80%'
        },
        {
            name: 'Results Viewed',
            icon: TrendingUp,
            count: metrics.resultsViewed,
            rate: calculateRate(metrics.resultsViewed, metrics.emailCaptured),
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            textColor: 'text-purple-700',
            benchmark: '90%+'
        },
        {
            name: 'Checkout Started',
            icon: ShoppingCart,
            count: metrics.checkoutStarted,
            rate: calculateRate(metrics.checkoutStarted, metrics.resultsViewed),
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-700',
            benchmark: '30-50%'
        },
        {
            name: 'Purchased',
            icon: CreditCard,
            count: metrics.purchased,
            rate: calculateRate(metrics.purchased, metrics.checkoutStarted),
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-700',
            benchmark: '70-85%'
        }
    ];

    const overallConversion = calculateRate(metrics.purchased, metrics.totalSessions);

    const getHealthStatus = (rate: number, benchmark?: string) => {
        if (!benchmark) return null;

        const [min, max] = benchmark.replace('%', '').replace('+', '').split('-').map(Number);

        if (benchmark.includes('+')) {
            return rate >= min ? 'good' : 'poor';
        }

        if (rate >= min && rate <= (max || min)) return 'good';
        if (rate < min) return 'poor';
        return 'excellent';
    };

    return (
        <div className="space-y-6">
            {/* Overall Conversion */}
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-6 border-2 border-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Overall Conversion Rate
                        </h3>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-primary">{overallConversion}%</span>
                            <span className="text-sm text-gray-500">
                                ({metrics.purchased} / {metrics.totalSessions} sessions)
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Benchmark</div>
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">5-15%</div>
                        <div className={`text-xs font-bold mt-1 ${overallConversion >= 10 ? 'text-green-600' :
                            overallConversion >= 5 ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                            {overallConversion >= 10 ? '✓ Excellent' :
                                overallConversion >= 5 ? '⚠ Good' :
                                    '✗ Needs Work'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Funnel Stages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stages.map((stage, index) => {
                    const Icon = stage.icon;
                    const health = getHealthStatus(stage.rate, stage.benchmark);

                    return (
                        <div
                            key={stage.name}
                            className={`relative rounded-xl p-5 border-2 ${stage.bgColor} ${stage.borderColor} transition-all hover:shadow-md`}
                        >
                            {/* Stage Number */}
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{index + 1}</span>
                            </div>

                            {/* Icon & Name */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${stage.color} bg-opacity-10`}>
                                    <Icon className={stage.textColor} size={20} />
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                    {stage.name}
                                </h4>
                            </div>

                            {/* Metrics */}
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-3xl font-black ${stage.textColor}`}>
                                        {stage.rate}%
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ({stage.count.toLocaleString()})
                                    </span>
                                </div>

                                {/* Benchmark */}
                                {stage.benchmark && (
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-xs text-gray-500">Target: {stage.benchmark}</span>
                                        {health && (
                                            <span className={`text-xs font-bold ${health === 'excellent' ? 'text-green-600' :
                                                health === 'good' ? 'text-green-600' :
                                                    'text-red-600'
                                                }`}>
                                                {health === 'excellent' ? '✓ Excellent' :
                                                    health === 'good' ? '✓ Good' :
                                                        '✗ Below Target'}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Visual Progress Bar */}
                            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${stage.color} transition-all duration-500`}
                                    style={{ width: `${stage.rate}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-2">
                    Conversion Rate Calculation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div>• <strong>Test Started:</strong> % of total sessions who started test</div>
                    <div>• <strong>Email Captured:</strong> % of test starters who submitted email</div>
                    <div>• <strong>Results Viewed:</strong> % of email submitters who completed test</div>
                    <div>• <strong>Checkout Started:</strong> % of result viewers who initiated checkout</div>
                    <div>• <strong>Purchased:</strong> % of checkout initiators who completed payment</div>
                    <div>• <strong>Overall:</strong> % of total sessions who purchased</div>
                </div>
            </div>
        </div>
    );
}
