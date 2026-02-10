import { useEffect, useRef, useCallback } from 'react';

export interface SessionTrackingData {
    sessionDuration: number; // in seconds
    lastActivityAt: Date;
    pageViews: Array<{ page: string; timestamp: string }>;
    interactionEvents: Array<{ type: string; target?: string; timestamp: string }>;
}

interface UseSessionTrackingOptions {
    sessionId: string;
    onUpdate?: (data: SessionTrackingData) => void;
    updateInterval?: number; // How often to send updates (ms), default 30s
}

/**
 * Hook to track user session behavior
 * Monitors activity, calculates duration, and tracks interactions
 */
export function useSessionTracking({
    sessionId,
    onUpdate,
    updateInterval = 30000 // 30 seconds
}: UseSessionTrackingOptions) {
    const sessionStartRef = useRef<Date>(new Date());
    const lastActivityRef = useRef<Date>(new Date());
    const pageViewsRef = useRef<Array<{ page: string; timestamp: string }>>([]);
    const interactionEventsRef = useRef<Array<{ type: string; target?: string; timestamp: string }>>([]);
    const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Track page view
    const trackPageView = useCallback((page: string) => {
        pageViewsRef.current.push({
            page,
            timestamp: new Date().toISOString(),
        });
        lastActivityRef.current = new Date();
    }, []);

    // Track interaction event
    const trackInteraction = useCallback((type: string, target?: string) => {
        interactionEventsRef.current.push({
            type,
            target,
            timestamp: new Date().toISOString(),
        });
        lastActivityRef.current = new Date();
    }, []);

    // Calculate session duration
    const getSessionDuration = useCallback(() => {
        const now = new Date();
        return Math.floor((now.getTime() - sessionStartRef.current.getTime()) / 1000);
    }, []);

    // Get current tracking data
    const getTrackingData = useCallback((): SessionTrackingData => {
        return {
            sessionDuration: getSessionDuration(),
            lastActivityAt: lastActivityRef.current,
            pageViews: [...pageViewsRef.current],
            interactionEvents: [...interactionEventsRef.current],
        };
    }, [getSessionDuration]);

    // Send update to parent
    const sendUpdate = useCallback(() => {
        if (onUpdate) {
            onUpdate(getTrackingData());
        }
    }, [onUpdate, getTrackingData]);

    // Track user activity
    useEffect(() => {
        const handleActivity = () => {
            lastActivityRef.current = new Date();
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const targetDesc = target.tagName + (target.id ? `#${target.id}` : '') +
                (target.className ? `.${target.className.split(' ')[0]}` : '');
            trackInteraction('click', targetDesc);
        };

        const handleScroll = () => {
            trackInteraction('scroll');
        };

        // Add event listeners
        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('touchstart', handleActivity);

        // Track initial page view
        trackPageView(window.location.pathname);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
        };
    }, [trackInteraction, trackPageView]);

    // Track page changes (for SPAs)
    useEffect(() => {
        trackPageView(window.location.pathname);
    }, [window.location.pathname, trackPageView]);

    // Periodic updates
    useEffect(() => {
        if (updateInterval > 0) {
            updateIntervalRef.current = setInterval(() => {
                sendUpdate();
            }, updateInterval);
        }

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
        };
    }, [updateInterval, sendUpdate]);

    // Send final update on unmount
    useEffect(() => {
        return () => {
            sendUpdate();
        };
    }, [sendUpdate]);

    // Track visibility changes (tab switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // User switched away - send update
                sendUpdate();
            } else {
                // User came back - update activity
                lastActivityRef.current = new Date();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [sendUpdate]);

    return {
        trackPageView,
        trackInteraction,
        getSessionDuration,
        getTrackingData,
        sendUpdate,
    };
}
