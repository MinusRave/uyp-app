
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const LOADING_MESSAGES = [
    "Analyzing communication patterns...",
    "Identifying emotional triggers...",
    "Calibrating attachment style...",
    "Calculating relationship sustainability...",
    "Detecting hidden dynamics...",
    "Formulating your personalized profile..."
];

export function ProcessingOverlay({ isVisible }: { isVisible: boolean }) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        }, 800);

        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md p-6 text-center animate-in fade-in duration-300">
            <div className="relative mb-8">
                {/* Ping animation effect */}
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm shadow-xl border border-primary/20">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground md:text-3xl transition-all duration-300 animate-fade-in min-h-[4rem] max-w-md">
                {LOADING_MESSAGES[messageIndex]}
            </h2>

            <p className="mt-4 text-muted-foreground animate-pulse text-sm font-medium uppercase tracking-wide">
                Please wait, do not close or refresh...
            </p>
        </div>
    );
}
