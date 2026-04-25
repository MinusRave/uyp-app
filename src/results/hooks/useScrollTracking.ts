import { useState, useEffect, useRef } from "react";

export function useScrollTracking(ready: boolean = true) {
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const scrollDepthTracked = useRef<Set<number>>(new Set());

    // Sticky CTA visibility.
    // Show when the user has scrolled past the hero AND the offer card is not currently in view.
    // Both signals update the state: scroll events (for the hero threshold) and the
    // IntersectionObserver (for whether the offer card is visible).
    useEffect(() => {
        if (!ready) return;

        let observer: IntersectionObserver | null = null;
        let retryTimer: ReturnType<typeof setTimeout> | null = null;
        let retries = 0;
        let isOfferVisible = false;

        const update = () => {
            const pastHero = window.scrollY > 600;
            setShowStickyCTA(!isOfferVisible && pastHero);
        };

        const handleScroll = () => update();
        window.addEventListener("scroll", handleScroll, { passive: true });

        const attach = () => {
            const offerSection = document.getElementById("offer");
            if (!offerSection) {
                if (retries++ < 40) retryTimer = setTimeout(attach, 250);
                return;
            }
            observer = new IntersectionObserver(
                ([entry]) => {
                    isOfferVisible = entry.isIntersecting;
                    update();
                },
                { threshold: 0.1 },
            );
            observer.observe(offerSection);
        };
        attach();

        // Evaluate once at mount in case the user landed already-scrolled (e.g. back button).
        update();

        return () => {
            observer?.disconnect();
            if (retryTimer) clearTimeout(retryTimer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [ready]);

    // Scroll depth analytics
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const scrollPercent = scrollTop / docHeight;

            const depths = [0.25, 0.5, 0.75, 1.0];
            depths.forEach((depth) => {
                if (scrollPercent >= depth && !scrollDepthTracked.current.has(depth)) {
                    scrollDepthTracked.current.add(depth);
                    if (typeof window !== "undefined" && (window as any).plausible) {
                        (window as any).plausible("scroll_depth", { props: { depth: `${depth * 100}%` } });
                    }
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const trackCTA = (location: string) => {
        if (typeof window !== "undefined" && (window as any).plausible) {
            (window as any).plausible("cta_clicked", {
                props: { button_location: location, button_text: "Get Instant Access Now" },
            });
        }
    };

    const scrollToOffer = () => {
        const el = document.getElementById("offer");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return { showStickyCTA, trackCTA, scrollToOffer };
}
