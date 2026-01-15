import { ClipboardList, Brain, FileText, ArrowDown } from "lucide-react";

export default function ScientificSolutionSection() {
    const steps = [
        {
            icon: ClipboardList,
            title: "You Answer 28 Questions",
            description: "Deep-dive into how you interpret your partner's behavior and how you react in relational situations."
        },
        {
            icon: Brain,
            title: "AI Analyzes 50+ Dimensions",
            description: "We measure attachment patterns, conflict styles, nervous system triggers, and compatibility factors."
        },
        {
            icon: FileText,
            title: "You Get Your Personalized Roadmap",
            description: "Compatibility score, red flags analysis, intervention scripts, and communication tools."
        }
    ];

    return (
        <div className="bg-slate-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">
                        How Our Relationship Test Works
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        From Questions to Clarity in 3 Steps
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Most relationship quizzes just label you. We measure the gap between your perception and your reaction.
                    </p>
                </div>

                {/* Visual Flowchart */}
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
                    <div className="space-y-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index}>
                                    {/* Step Card */}
                                    <div className="flex gap-6 items-start bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
                                        {/* Step Number */}
                                        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                                            {index + 1}
                                        </div>

                                        {/* Icon */}
                                        <div className="shrink-0 p-3 rounded-xl bg-primary/10">
                                            <Icon className="text-primary" size={32} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Arrow (except for last step) */}
                                    {index < steps.length - 1 && (
                                        <div className="flex justify-center py-4">
                                            <ArrowDown className="text-primary/40" size={32} strokeWidth={2} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-500 italic">
                        Based on attachment theory, Gottman principles, and nervous system science
                    </p>
                </div>
            </div>
        </div>
    );
}
