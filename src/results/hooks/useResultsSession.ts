import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useQuery, generateQuickOverview, generateFullReportV2, assessNarcissism, getTestSession, getSystemConfig } from "wasp/client/operations";
import { useAuth } from "wasp/client/auth";
import type { QuickOverviewData, NarcissismData } from "../types";

export function useResultsSession() {
    const navigate = useNavigate();
    const { data: user } = useAuth();

    // Session ID from URL or localStorage
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const urlSessionId = urlParams?.get("session") || urlParams?.get("sessionId") || urlParams?.get("session_id") || null;
    const localSessionId = typeof window !== "undefined" ? localStorage.getItem("uyp-session-id") : null;
    const sessionIdToUse = urlSessionId || localSessionId || undefined;

    // Fetch session
    const { data: session, isLoading, refetch } = useQuery(getTestSession, { sessionId: sessionIdToUse });

    // System config (for soft gate etc.)
    const { data: systemConfig } = useQuery(getSystemConfig);

    // AI content state
    const [quickOverview, setQuickOverview] = useState<QuickOverviewData | null>(null);
    const [narcissismAnalysis, setNarcissismAnalysis] = useState<NarcissismData | null>(null);

    // Guards
    const quickOverviewInitiated = useRef(false);
    const fullReportInitiated = useRef(false);
    const narcissismInitiated = useRef(false);

    // Persist URL session ID to localStorage
    useEffect(() => {
        if (urlSessionId) localStorage.setItem("uyp-session-id", urlSessionId);
    }, [urlSessionId]);

    // Redirect paid users to full report
    useEffect(() => {
        if (session?.isPaid) {
            navigate(urlSessionId ? `/report?session_id=${urlSessionId}` : "/report", { replace: true });
        }
    }, [session?.isPaid, urlSessionId, navigate]);

    // AI content polling & triggering
    useEffect(() => {
        if (!session || !session.id) return;

        // Quick Overview
        if (session.quickOverview && Object.keys(session.quickOverview as object).length > 0) {
            setQuickOverview(session.quickOverview as any);
            quickOverviewInitiated.current = true;
        } else if (!quickOverviewInitiated.current) {
            quickOverviewInitiated.current = true;
            generateQuickOverview({ sessionId: session.id }).catch(() => {
                quickOverviewInitiated.current = false;
            });
            // Poll until available
            const intervalId = setInterval(() => refetch(), 3000);
            return () => clearInterval(intervalId);
        }

        // Narcissism analysis
        if (session.narcissismAnalysis && Object.keys(session.narcissismAnalysis as object).length > 0) {
            setNarcissismAnalysis(session.narcissismAnalysis as any);
            narcissismInitiated.current = true;
        } else if (!narcissismInitiated.current) {
            narcissismInitiated.current = true;
            assessNarcissism({ sessionId: session.id }).catch(() => {
                narcissismInitiated.current = false;
            });
        }

        // Trigger full report V2 in background (what user pays for)
        if (!session.fullReportV2 && !fullReportInitiated.current) {
            fullReportInitiated.current = true;
            generateFullReportV2({ sessionId: session.id }).catch(() => {
                fullReportInitiated.current = false;
            });
        } else if (session.fullReportV2) {
            fullReportInitiated.current = true;
        }
    }, [session?.id, session?.quickOverview, session?.narcissismAnalysis, refetch]);

    // Analytics: page view
    useEffect(() => {
        if (session && typeof window !== "undefined" && (window as any).plausible) {
            (window as any).plausible("selling_page_view", {
                props: {
                    source: "quiz_completion",
                    user_pattern: (session as any)?.analysisResult?.patternName || "Unknown",
                },
            });
        }
    }, [session?.id]);

    return {
        session,
        isLoading,
        quickOverview,
        narcissismAnalysis,
        systemConfig,
        refetch,
    };
}
