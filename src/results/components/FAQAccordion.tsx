import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = { question: string; answer: string };

type Props = {
    items: FAQItem[];
};

export function FAQAccordion({ items }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                    >
                        <span className="text-sm font-bold text-foreground pr-4">{item.question}</span>
                        <ChevronDown
                            size={16}
                            className={`shrink-0 text-muted-foreground transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                        />
                    </button>
                    {openIndex === i && (
                        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
