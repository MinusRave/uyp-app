import { Lock } from "lucide-react";

type Props = {
    show: boolean;
    onPress: () => void;
};

export function StickyMobileCTA({ show, onPress }: Props) {
    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 animate-in slide-in-from-bottom duration-300">
            <button
                onClick={onPress}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
                <Lock size={16} />
                Unlock Your Full Report — ${import.meta.env.REACT_APP_REPORT_PRICE || "29"}
            </button>
        </div>
    );
}
