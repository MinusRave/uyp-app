import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

// Exit intent heuristics tuned for cold Meta traffic:
// - Fire only once per session.
// - Require meaningful engagement (scrolled past the hero) before any trigger.
// - Desktop: mouseleave at the top edge.
// - Mobile + desktop: visibilitychange (tap home, switch app, background tab) — the real exit signal.
// - Fallback: 75s time — catches idle readers who've engaged but parked without buying.
const SCROLL_GUARD_PX = 800;
const TIME_FALLBACK_MS = 75_000;
const MIN_ENGAGEMENT_MS = 20_000; // visibilitychange only counts after this

export default function ExitIntentPopup({ onCTAClick }: { onCTAClick: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('exitIntentShown')) return;

        const pageLoadedAt = Date.now();
        let hasEngaged = window.scrollY > SCROLL_GUARD_PX;

        const trigger = () => {
            if (sessionStorage.getItem('exitIntentShown')) return;
            if (!hasEngaged) return;
            sessionStorage.setItem('exitIntentShown', 'true');
            setIsVisible(true);
        };

        const handleScroll = () => {
            if (!hasEngaged && window.scrollY > SCROLL_GUARD_PX) hasEngaged = true;
        };

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                // Tiny delay filters out accidental top-bar grazes.
                setTimeout(trigger, 100);
            }
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'hidden' && Date.now() - pageLoadedAt >= MIN_ENGAGEMENT_MS) {
                trigger();
            }
        };

        const timer = setTimeout(trigger, TIME_FALLBACK_MS);
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('visibilitychange', handleVisibility);
            clearTimeout(timer);
        };
    }, []);

    const closePopup = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border-2 border-primary/20 p-8 relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    aria-label="Close popup"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                            Wait — You Spent 10 Minutes Answering.
                        </h2>
                        <p className="text-xl font-bold text-primary">
                            Your Analysis Is Ready.
                        </p>
                    </div>

                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Your personalized relationship diagnosis is sitting on our server right now.
                        <br /><br />
                        What if it contains <strong>THE insight</strong> that finally makes everything click?
                        <br />
                        What if it's the missing piece you've been searching for?
                    </p>

                    <div className="pt-2">
                        <button
                            onClick={() => {
                                onCTAClick();
                                closePopup();
                            }}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            Show Me My Analysis - $9.99
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={closePopup}
                            className="mt-4 text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                            No thanks, I'll figure it out on my own
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
