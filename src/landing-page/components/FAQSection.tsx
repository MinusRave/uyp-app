import { useState } from "react";
import { ChevronDown, Shield, Brain, Users, Briefcase, Heart } from "lucide-react";

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            icon: Shield,
            question: "Is this private?",
            answer: "Yes. No sign-up required, and we delete all data after 30 days. Your partner will never see your answers unless you choose to share them."
        },
        {
            icon: Brain,
            question: "How is this different from a Cosmo quiz?",
            answer: "We analyze 50+ relationship dimensions using attachment theory and Gottman principles. You'll get a comprehensive personalized report with AI-powered insights, not generic advice."
        },
        {
            icon: Users,
            question: "Do I need my partner's permission?",
            answer: "No. This test is about YOUR perception and YOUR nervous system patterns. You can share the results later if you want, but it's designed for individual reflection first."
        },
        {
            icon: Briefcase,
            question: "What if we're already in therapy?",
            answer: "Perfect! Many therapists recommend this as homework. The report gives you concrete language to discuss your patterns and can accelerate your therapeutic progress."
        },
        {
            icon: Heart,
            question: "Is this only for couples in crisis?",
            answer: "No. Whether you're dating, married, or \"it's complicated,\" understanding your patterns prevents future conflicts and deepens connection."
        }
    ];

    return (
        <section className="py-24 bg-secondary/10">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Common Questions
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know before starting
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const Icon = faq.icon;
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center gap-4 p-6 text-left hover:bg-secondary/5 transition-colors"
                                >
                                    {/* Icon */}
                                    <div className="shrink-0 p-2 rounded-lg bg-primary/10">
                                        <Icon className="text-primary" size={20} />
                                    </div>

                                    {/* Question */}
                                    <span className="flex-1 font-semibold text-lg text-foreground">
                                        {faq.question}
                                    </span>

                                    {/* Chevron */}
                                    <ChevronDown
                                        className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""
                                            }`}
                                        size={20}
                                    />
                                </button>

                                {/* Answer */}
                                {isOpen && (
                                    <div className="px-6 pb-6 pt-2 pl-[72px] text-foreground/80 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
