import React, { useState } from "react";
import { Loader2, Mail, ShieldCheck, Lock as LockIcon, X } from "lucide-react";

interface EmailCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => Promise<void>;
    isSubmitting: boolean;
}

export default function EmailCaptureModal({ isOpen, onClose, onSubmit, isSubmitting }: EmailCaptureModalProps) {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        await onSubmit(email);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border-2 border-primary/20 p-6 md:p-8 relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    aria-label="Close popup"
                >
                    <X size={20} />
                </button>

                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <Mail size={32} />
                </div>

                <div className="text-center space-y-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Save Your Results
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Enter your email to securely unlock and save your comprehensive relationship report.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="w-full p-4 rounded-xl border border-input bg-background text-base focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <LockIcon size={20} />}
                                {isSubmitting ? "Unlocking..." : "Unlock Full Report"}
                            </span>
                        </button>
                        <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5 opacity-80">
                            <ShieldCheck size={12} className="text-green-600" />
                            100% Secure. We respect your privacy & zero spam.
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-left space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-100">
                            <span className="text-blue-600 dark:text-blue-400">✓</span>
                            <span className="font-medium">Fully encrypted & confidential</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-100">
                            <span className="text-blue-600 dark:text-blue-400">✓</span>
                            <span className="font-medium">Never shared with third parties</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
