
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "Is this just generic relationship advice?",
        answer: "No. Everything is personalized to YOUR answers, YOUR attachment style, and YOUR specific conflict pattern. We cite your exact responses (e.g., 'Q7: Strongly Agree') throughout the report."
    },
    {
        question: "Can I share this with my partner?",
        answer: "Yes. We include a 'Partner Translation' section specifically written for them to understand your nervous system. You can also invite them to take the test for a couples compatibility report."
    },
    {
        question: "What if my partner won't read it?",
        answer: "The analysis includes strategies that work even if your partner doesn't change (yet). We focus on regulating YOUR nervous system first, which often shifts the dynamic naturally."
    },
    {
        question: "Is this a subscription?",
        answer: "No. One-time payment. Lifetime access. You can retake the assessment in 8 weeks (free) to track your progress."
    },
    {
        question: "What if this doesn't help?",
        answer: "60-day money-back guarantee. If you don't find at least ONE insight that shifts how you see your relationship, email us for a full refund or custom follow-up analysis."
    }
];

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-2 justify-center mb-8">
                <HelpCircle className="text-muted-foreground" size={20} />
                <h3 className="font-bold text-xl uppercase tracking-wider">Common Questions</h3>
            </div>

            {faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-xl overflow-hidden bg-card">
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left font-bold text-sm md:text-base hover:bg-secondary/5 transition-colors"
                    >
                        <span>{faq.question}</span>
                        {openIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {openIndex === index && (
                        <div className="p-4 pt-0 text-muted-foreground text-sm leading-relaxed animate-fade-in bg-secondary/5">
                            {faq.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FAQSection;
