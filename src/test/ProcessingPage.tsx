import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, getTestSession } from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { Loader2 } from "lucide-react";
import { cn } from "../client/utils";

const LOADING_MESSAGES = [
    "Analyzing your answers...",
    "Calculating interpretive patterns...",
    "Identifying emotional mismatches...",
    "Generating your profile..."
];

export default function ProcessingPage() {
    const navigate = useNavigate();
    const [messageIndex, setMessageIndex] = useState(0);

    // Get Session to check payment status
    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;
    const { data: session } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

    useEffect(() => {
        // Rotate messages
        const messageInterval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        }, 1500);

        // Redirect after fake processing (4.5s)
        const redirectTimer = setTimeout(() => {
            if (session?.isPaid) {
                navigate(routes.ReportRoute.to);
            } else {
                navigate(routes.TeaserRoute.to);
            }
        }, 4500);

        return () => {
            clearInterval(messageInterval);
            clearTimeout(redirectTimer);
        };
    }, [navigate, session]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">

            <div className="relative mb-8">
                {/* Ping animation effect */}
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </div>

            <h2 className="animate-fade-in text-2xl font-bold text-foreground md:text-3xl transition-opacity duration-300">
                {LOADING_MESSAGES[messageIndex]}
            </h2>

            <p className="mt-4 text-muted-foreground animate-pulse">
                Do not close this page...
            </p>

        </div>
    );
}
