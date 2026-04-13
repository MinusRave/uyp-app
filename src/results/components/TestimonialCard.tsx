import { Star, Quote } from "lucide-react";

type Props = {
    text: string;
    author: string;
    detail?: string;
};

export function TestimonialCard({ text, author, detail }: Props) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
            </div>
            <div className="relative">
                <Quote size={20} className="absolute -top-1 -left-1 text-primary/20" />
                <p className="text-sm text-foreground leading-relaxed pl-4 italic">
                    {text}
                </p>
            </div>
            <div>
                <p className="text-sm font-bold text-foreground">{author}</p>
                {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
            </div>
        </div>
    );
}
