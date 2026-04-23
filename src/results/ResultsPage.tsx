import { useEffect, useRef, useState } from "react";
import { Activity } from "lucide-react";
import { createCheckoutSession, startOffer } from "wasp/client/operations";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";

import { useResultsSession } from "./hooks/useResultsSession";
import { useScrollTracking } from "./hooks/useScrollTracking";
import { RelationshipScreen } from "./sections/RelationshipScreen";
import { PainMap } from "./sections/PainMap";
import { PatternBreaker } from "./sections/PatternBreaker";
import { GodfatherOffer } from "./sections/GodfatherOffer";
import { StickyMobileCTA } from "./components/StickyMobileCTA";
import ExitIntentPopup from "./ExitIntentPopup";
import { computeAddonsTotal, isBundleAvailable } from "../payment/addons";

const REPORT_PRICE = parseFloat(import.meta.env.REACT_APP_REPORT_PRICE || "9.99");

export default function ResultsPage() {
    const { session, isLoading, quickOverview, narcissismAnalysis } = useResultsSession();
    const { showStickyCTA, trackCTA, scrollToOffer } = useScrollTracking(!!session && !session.isPaid);

    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [offerStartedAt, setOfferStartedAt] = useState<Date | null>(null);
    const [bundleAvailable, setBundleAvailable] = useState(true);
    const offerStartInitiated = useRef(false);

    // Start the 15-min bundle timer on first view. Idempotent server-side.
    useEffect(() => {
        if (!session?.id || session.isPaid || offerStartInitiated.current) return;
        offerStartInitiated.current = true;
        const existing = (session as any).offerStartedAt;
        if (existing) {
            const startedAt = new Date(existing);
            setOfferStartedAt(startedAt);
            setBundleAvailable(isBundleAvailable(startedAt));
            return;
        }
        startOffer({ sessionId: session.id })
            .then((result) => {
                const startedAt = new Date(result.offerStartedAt);
                setOfferStartedAt(startedAt);
                setBundleAvailable(isBundleAvailable(startedAt));
            })
            .catch((e) => console.error("[startOffer] failed:", e));
    }, [session?.id, session?.isPaid]);

    // Checkout handler (preserved from TeaserPageNew)
    const handleCheckout = async (location: string) => {
        if (!session) return;
        trackCTA(location);
        setIsCheckoutLoading(true);

        const eventID = generateEventId();
        const addonsSubtotal = bundleAvailable ? computeAddonsTotal(selectedAddons) : selectedAddons.length * 2.99;
        const totalValue = REPORT_PRICE + addonsSubtotal;
        trackPixelEvent("InitiateCheckout", {
            content_name: "Full Relationship Report",
            content_category: "Report",
            value: totalValue,
            currency: "USD",
            eventID,
        });

        try {
            const checkout = await createCheckoutSession({
                sessionId: session.id,
                eventID,
                addonIds: selectedAddons,
            });
            if (checkout.sessionUrl) {
                window.location.href = checkout.sessionUrl;
            }
        } catch (e: any) {
            console.error(e);
            const statusCode = e?.statusCode || e?.status;
            if (statusCode === 410) {
                setBundleAvailable(false);
                if (selectedAddons.length === 6) setSelectedAddons([]);
                alert("The $9.99 bundle just ended. Please pick the guides you want.");
            } else {
                alert("Checkout failed. Please try again.");
            }
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    // Loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Activity className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    // No session
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center space-y-4 p-8">
                    <p className="text-xl font-bold">Session not found</p>
                    <p className="text-muted-foreground">Your session may have expired or you're on a different device.</p>
                    <a href="/test" className="text-primary font-bold hover:underline">Take the assessment &rarr;</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <RelationshipScreen session={session} quickOverview={quickOverview} />
            <PainMap session={session} quickOverview={quickOverview} narcissismAnalysis={narcissismAnalysis} />
            <PatternBreaker session={session} narcissismAnalysis={narcissismAnalysis} />
            <GodfatherOffer
                session={session}
                quickOverview={quickOverview}
                narcissismAnalysis={narcissismAnalysis}
                onCheckout={handleCheckout}
                isCheckoutLoading={isCheckoutLoading}
                selectedAddons={selectedAddons}
                setSelectedAddons={setSelectedAddons}
                offerStartedAt={offerStartedAt}
                bundleAvailable={bundleAvailable}
                onBundleExpire={() => {
                    setBundleAvailable(false);
                    if (selectedAddons.length === 6) setSelectedAddons([]);
                }}
            />
            <StickyMobileCTA show={showStickyCTA} onPress={scrollToOffer} />
            <ExitIntentPopup onCTAClick={() => handleCheckout("exit_intent")} />
        </div>
    );
}
