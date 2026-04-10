import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, getTestSession } from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { Brain, Activity, Heart, FileText, Check } from "lucide-react";

const STEPS = [
    { icon: Brain, label: "Analyzing your answers", detail: "Mapping communication patterns" },
    { icon: Activity, label: "Calculating interpretive patterns", detail: "Cross-referencing 50+ dimensions" },
    { icon: Heart, label: "Identifying emotional mismatches", detail: "Attachment style + conflict triggers" },
    { icon: FileText, label: "Generating your profile", detail: "Building personalized diagnosis" },
];

export default function ProcessingPage() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);

    const localSessionId = typeof window !== 'undefined' ? localStorage.getItem("uyp-session-id") : null;
    const { data: session } = useQuery(getTestSession, { sessionId: localSessionId || undefined });

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setActiveStep(prev => {
                if (prev < STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 1100);

        const redirectTimer = setTimeout(() => {
            navigate(routes.TeaserRoute.to);
        }, 4500);

        return () => {
            clearInterval(stepInterval);
            clearTimeout(redirectTimer);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const progressPercent = ((activeStep + 1) / STEPS.length) * 100;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
            <div className="max-w-md w-full space-y-10">

                {/* Progress bar */}
                <div className="space-y-3">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progressPercent}%`, boxShadow: '0 0 12px hsl(var(--primary) / 0.4)' }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{Math.round(progressPercent)}% complete</p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx === activeStep;
                        const isDone = idx < activeStep;
                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                                    isActive
                                        ? 'bg-primary/5 border-primary/30 shadow-sm'
                                        : isDone
                                            ? 'bg-card border-border/50 opacity-60'
                                            : 'bg-card border-border/30 opacity-30'
                                }`}
                            >
                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isDone
                                        ? 'bg-success/10 text-success'
                                        : isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-muted text-muted-foreground'
                                }`}>
                                    {isDone ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                                </div>
                                <div className="text-left flex-1">
                                    <p className={`text-sm font-bold transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {step.label}{isActive && <span className="animate-pulse">...</span>}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{step.detail}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Note */}
                <p className="text-sm text-muted-foreground">
                    Please don't close this page
                </p>
            </div>
        </div>
    );
}
