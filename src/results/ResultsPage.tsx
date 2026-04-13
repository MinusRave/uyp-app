import { useState } from "react";
import { Activity } from "lucide-react";
import { createCheckoutSession } from "wasp/client/operations";
import { trackPixelEvent } from "../analytics/pixel";
import { generateEventId } from "../analytics/eventId";

import { useResultsSession } from "./hooks/useResultsSession";
import { useScrollTracking } from "./hooks/useScrollTracking";
import { RelationshipScreen } from "./sections/RelationshipScreen";
import { PainMap } from "./sections/PainMap";
import { PatternBreaker } from "./sections/PatternBreaker";
import { GodfatherOffer } from "./sections/GodfatherOffer";
import { StickyMobileCTA } from "./components/StickyMobileCTA";

export default function ResultsPage() {
    const { session, isLoading, quickOverview, narcissismAnalysis } = useResultsSession();
    const { showStickyCTA, trackCTA, scrollToOffer } = useScrollTracking();

    const [addOrderBump, setAddOrderBump] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    // Checkout handler (preserved from TeaserPageNew)
    const handleCheckout = async (location: string) => {
        if (!session) return;
        trackCTA(location);
        setIsCheckoutLoading(true);

        const eventID = generateEventId();
        trackPixelEvent("InitiateCheckout", {
            content_name: "Full Relationship Report",
            content_category: "Report",
            value: addOrderBump ? 41 : 29,
            currency: "USD",
            eventID,
        });

        try {
            const checkout = await createCheckoutSession({
                sessionId: session.id,
                eventID,
                addWorkbook: addOrderBump,
            });
            if (checkout.sessionUrl) {
                window.location.href = checkout.sessionUrl;
            }
        } catch (e) {
            console.error(e);
            alert("Checkout failed. Please try again.");
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
                addOrderBump={addOrderBump}
                setAddOrderBump={setAddOrderBump}
            />
            <StickyMobileCTA show={showStickyCTA} onPress={scrollToOffer} />
        </div>
    );
}
