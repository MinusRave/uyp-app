import { Heart, AlertTriangle, MessageCircle, Sparkles } from "lucide-react";

export default function ValuePreviewSection() {
    const features = [
        {
            icon: Heart,
            title: "Your Compatibility Pulse",
            description: "See exactly how your nervous systems interact under stress—and your #1 repair opportunity.",
            badge: "GAMIFIED",
            color: "red"
        },
        {
            icon: AlertTriangle,
            title: "Partner's Red Flags (No Sugarcoating)",
            description: "We validate your pain first, then explain the nervous system reason behind their behavior.",
            badge: "VALIDATION-FIRST",
            color: "orange"
        },
        {
            icon: MessageCircle,
            title: "The Translator Tool",
            description: "Rewrite your texts in real-time to avoid triggering their defense mode.",
            badge: "AI-POWERED",
            color: "green"
        }
    ];

    const colorClasses = {
        red: {
            bg: "bg-red-50 dark:bg-red-900/10",
            border: "border-red-200 dark:border-red-800",
            icon: "text-red-600 dark:text-red-400",
            badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
        },
        orange: {
            bg: "bg-orange-50 dark:bg-orange-900/10",
            border: "border-orange-200 dark:border-orange-800",
            icon: "text-orange-600 dark:text-orange-400",
            badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
        },
        green: {
            bg: "bg-green-50 dark:bg-green-900/10",
            border: "border-green-200 dark:border-green-800",
            icon: "text-green-600 dark:text-green-400",
            badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
        }
    };

    return (
        <section className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6">
                        <Sparkles size={16} />
                        Peek Inside
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Here's What You'll Discover
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Not just generic advice—personalized insights based on your unique nervous system patterns.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const colors = colorClasses[feature.color as keyof typeof colorClasses];

                        return (
                            <div
                                key={index}
                                className={`relative ${colors.bg} rounded-2xl p-8 border ${colors.border} hover:shadow-lg transition-all hover:scale-105`}
                            >
                                {/* Badge */}
                                <div className={`inline-block ${colors.badge} px-3 py-1 rounded-full text-xs font-bold mb-4`}>
                                    {feature.badge}
                                </div>

                                {/* Icon */}
                                <div className="mb-4">
                                    <Icon className={colors.icon} size={40} strokeWidth={1.5} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3 text-foreground">
                                    {feature.title}
                                </h3>
                                <p className="text-foreground/80 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Visual Indicator */}
                                <div className="mt-6 pt-6 border-t border-current/10">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground/60">
                                        <div className="h-1.5 w-full bg-current/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-current/40 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        Plus: Pattern decoder, visual analytics, intervention scripts, and personalized partner communication tools
                    </p>
                </div>
            </div>
        </section>
    );
}
