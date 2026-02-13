import React, { useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import { useQuery, getTestSession } from 'wasp/client/operations';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function LoginRedirectPage() {
    const navigate = useNavigate();
    const { data: user, isLoading: isUserLoading } = useAuth();
    const { data: session, isLoading: isSessionLoading, refetch: refetchSession } = useQuery(getTestSession);

    useEffect(() => {
        const handleRedirect = async () => {
            if (isUserLoading) return;

            if (!user) {
                navigate('/login');
                return;
            }

            // Try to claim session from localStorage if it exists/differs
            const localSessionId = localStorage.getItem("uyp-session-id");
            if (localSessionId) {
                try {
                    // We import claimSession dynamically to avoid top-level SSR issues if any, 
                    // though standard import works fine in Wasp.
                    const { claimSession } = await import('wasp/client/operations');
                    await claimSession({ sessionId: localSessionId });
                    await refetchSession(); // Refresh session data after claim
                } catch (e) {
                    console.log("Session claim info/error:", e);
                    // Continue even if claim fails (e.g. already owned or invalid)
                }
            }

            // Allow a small delay or check isSessionLoading
            if (isSessionLoading && !session) return;

            // Re-check session after potential claim
            // We might need to wait for refetch. 
            // Actually, if we await refetchSession(), 'session' variable in closure 
            // might be stale. We should rely on the *next* render cycle or use the refetched result if returned.
            // But useQuery refetch returns a promise with data? 
            // Wasp/Tanstack Query refetch returns { data, ... }.

            // Simpler approach: 
            // 1. If localSessionId exists, call claim.
            // 2. Then proceed.
            // The useEffect will re-run if session changes? 
            // If we cause a DB update, getTestSession (if using invalidation) should auto-update.
            // claiming session might not automatically invalidate getTestSession query unless we configured it.
            // 'claimSession' action entity is TestSession, so Wasp SHOULD invalidate getTestSession.
        };

        handleRedirect();
    }, [user, isUserLoading, navigate]);

    // Separate effect for routing based on session data
    useEffect(() => {
        if (isUserLoading || isSessionLoading) return;
        if (!user) return; // Handled above

        if (session) {
            if (session.isPaid) {
                navigate('/report');
            } else {
                navigate('/results');
            }
        } else {
            // Wait a bit? Or assume no session.
            // If we just claimed, session might be loading again.
            // If isSessionLoading is false and session is null, really no session.
            navigate('/test');
        }
    }, [session, isSessionLoading, user, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Activity className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Redirecting you to your dashboard...</p>
        </div>
    );
}
