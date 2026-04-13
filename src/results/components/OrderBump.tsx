import { Check, BookOpen } from "lucide-react";

type Props = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export function OrderBump({ checked, onChange }: Props) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`w-full text-left rounded-xl border-2 p-4 transition-all ${checked ? "border-primary bg-primary/5" : "border-dashed border-border hover:border-primary/50"}`}
        >
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                    {checked && <Check size={12} className="text-primary-foreground" />}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen size={14} className="text-primary" />
                        <p className="font-bold text-sm text-foreground">Add the 30-Day Workbook</p>
                        <span className="text-xs font-bold text-primary">+$12</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Daily guided exercises to rebuild your connection. Step by step, week by week.
                    </p>
                </div>
            </div>
        </button>
    );
}
