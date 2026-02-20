
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { captureToxicLead } from "wasp/client/operations";
import { Lock, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "../client/utils";

export default function ToxicEmailGate() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Simple validation
    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) {
            setError("Session ID missing. Please retake the test.");
            return;
        }
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await captureToxicLead({ sessionId, email });
            // Redirect to Sales Page with same session ID
            navigate(`/toxic-offer?sessionId=${sessionId}`);
        } catch (err: any) {
            console.error("Lead capture failed", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-100">

            {/* Container */}
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                {/* Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-orange-600" />

                {/* Header */}
                <div className="text-center space-y-4 mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-2">
                        <Lock className="text-red-500" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Get Your Personalized Analysis
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Your 30 answers reveal <strong>YOUR</strong> specific situation.
                        Not generic advice. Your pattern. Her tactics. Your options.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="sr-only">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                            disabled={isSubmitting}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/30 p-3 rounded-lg border border-red-900/50">
                            <AlertTriangle size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white text-slate-950 font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-slate-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                Get My Analysis <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer / Trust Badges */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col gap-3 text-center">
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium tracking-wide uppercase">
                        <span className="flex items-center gap-1.5"><Lock size={12} /> Confidential</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>Unsubscribe Anytime</span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                        We respect your privacy. Reports are generated securely.
                    </p>
                </div>

            </div>
        </div>
    );
}
