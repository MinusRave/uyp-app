import { useState, useEffect, useRef } from "react";

export function useScrollTracking() {
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const scrollDepthTracked = useRef<Set<number>>(new Set());

    // Sticky CTA visibility
    useEffect(() => {
        const offerSection = document.getElementById("offer");
        if (!offerSection) return;

        let hasScrolledPastHero = false;
        const handleScroll = () => {
            hasScrolledPastHero = window.scrollY > 600;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowStickyCTA(!entry.isIntersecting && hasScrolledPastHero);
            },
            { threshold: 0.1 }
        );
        observer.observe(offerSection);

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
