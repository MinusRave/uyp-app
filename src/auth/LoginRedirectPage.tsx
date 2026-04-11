import React, { useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import { useQuery, getTestSession } from 'wasp/client/operations';
import { useNavigate } from 'react-router';
import { Activity } from 'lucide-react';

export default function LoginRedirectPage() {
    const navigate = useNavigate();
    const { data: user, isLoading: isUserLoading } = useAuth();
    const { data: session, isLoading: isSessionLoading } = useQuery(getTestSession);

    useEffect(() => {
        if (isUserLoading || isSessionLoading) return;

        if (!user) {
            navigate('/login');
            return;
        }

        // Sessions are always linked to users (created with userId in saveCompletedTest)
        // No claimSession needed — just route based on session state
        if (session) {
            if (session.isPaid) {
                navigate(`/report?session_id=${session.id}`);
            } else {
                navigate(`/results?session=${session.id}`);
            }
        } else {
            navigate('/test');
        }
    }, [user, isUserLoading, session, isSessionLoading, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Activity className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Redirecting you to your dashboard...</p>
        </div>
    );
}
