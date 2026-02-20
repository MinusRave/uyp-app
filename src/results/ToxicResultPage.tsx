
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "wasp/client/operations";
import { getTestSession, finalizeToxicReport } from "wasp/client/operations";
import { Loader2, Download, Lock, CheckCircle, FileText, AlertTriangle } from "lucide-react";
import { cn } from "../client/utils";

export default function ToxicResultPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

    // We can also check for success=true from Stripe
    const paymentSuccess = searchParams.get("success") === "true";

    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState("Initializing...");
    const [error, setError] = useState<string | null>(null);

    // Fetch initial session state
    const { data: session, isLoading } = useQuery(getTestSession, { sessionId: sessionId || "" }, { enabled: !!sessionId });

    useEffect(() => {
        if (!sessionId) return;

        const generateReport = async () => {
            // Prevent double-call if already have URL or generating
            if (isGenerating || pdfUrl) return;
            // Also skip if we already have it in session (re-hydration handled below)
            if (session?.fullReport) return;

            setIsGenerating(true);
            try {
                setStatusMessage("Verifying secure payment...");
                // Wait a moment for webhook to process if coming from Stripe
                if (paymentSuccess) await new Promise(r => setTimeout(r, 2000));

                setStatusMessage("Analyzing your patterns...");
                // Phase 1: Tactics & Vulnerabilities
                await new Promise(r => setTimeout(r, 2500));

                setStatusMessage("Constructing 30-Day Strategic Plan...");
                // Call Heavy API
                const res = await finalizeToxicReport({ sessionId });

                setStatusMessage("Finalizing confidential report...");
                setPdfUrl(res.pdfUrl);
            } catch (err: any) {
                console.error("Report Generation Failed:", err);
                if (err.message && err.message.includes("Payment required")) {
                    setError("Payment not verified. Please contact support if you were charged.");
                } else {
                    setError("Analysis failed. Please refresh page.");
                }
            } finally {
                setIsGenerating(false);
            }
        };

        // If session loads and has report, just use it
        if (session?.fullReport && !pdfUrl) {
            // We need to re-fetch signed URL or maybe finalizeToxicReport handles idempotent re-sign
            finalizeToxicReport({ sessionId }).then(res => setPdfUrl(res.pdfUrl)).catch(e => console.error(e));
        } else if (session && !session.fullReport && !isGenerating && !pdfUrl) {
            // Only trigger generation if not done
            generateReport();
        }

    }, [sessionId, session, paymentSuccess]); // Dependencies

    if (!sessionId) return <div className="p-12 text-center text-red-500">Invalid Session.</div>;

    // Loading State (The "Hook" while waiting)
    if (isGenerating || (!pdfUrl && !error)) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">

                    {/* Pulsing Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500 animate-pulse" />

                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <Loader2 className="animate-spin text-red-500" size={40} />
                        <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping"></div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Generating Report</h2>
                    <p className="text-slate-400 text-sm mb-8 animate-pulse">{statusMessage}</p>

                    <div className="space-y-3 text-left pl-4">
                        <StepItem status={statusMessage.includes("Verifying") ? "current" : "done"} label="Payment Verification" />
                        <StepItem status={statusMessage.includes("Analyzing") ? "current" : statusMessage.includes("Verifying") ? "waiting" : "done"} label="Pattern Recognition Analysis" />
                        <StepItem status={statusMessage.includes("Constructing") ? "current" : statusMessage.includes("Finalizing") ? "done" : "waiting"} label="Strategic Plan Formulation" />
                        <StepItem status={statusMessage.includes("Finalizing") ? "current" : "waiting"} label="Secure PDF Encryption" />
                    </div>

                </div>
            </div>
        );
    }

    // Success State
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xl">

                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">Analysis Ready</h1>
                <p className="text-slate-500 mb-8">
                    Your confidential report has been generated and secured.
                </p>

                {error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
                        <AlertTriangle className="mx-auto mb-2" size={24} />
                        {error}
                        <button
                            onClick={() => window.location.reload()}
                            className="block w-full mt-4 bg-red-600 text-white py-2 rounded-lg font-bold"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <a
                        href={pdfUrl!}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
                    >
                        <Download size={20} />
                        Download PDF Report
                    </a>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400 mb-4">
                        A copy has also been sent to your email.
                    </p>
                    <div className="flex justify-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Lock size={12} /> Encrypted</span>
                        <span className="flex items-center gap-1"><FileText size={12} /> 15+ Pages</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StepItem({ status, label }: { status: "waiting" | "current" | "done", label: string }) {
    return (
        <div className={cn("flex items-center gap-3 transition-colors duration-500",
            status === "waiting" ? "opacity-30" : "opacity-100"
        )}>
            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300",
                status === "done" ? "bg-green-500 border-green-500 text-white" :
                    status === "current" ? "border-red-500 text-red-500 bg-red-500/10" : "border-slate-600 text-transparent"
            )}>
                {status === "done" && <CheckCircle size={12} />}
                {status === "current" && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            </div>
            <span className={cn("text-sm font-medium", status === "current" ? "text-white" : "text-slate-300")}>
                {label}
            </span>
        </div>
    )
}
