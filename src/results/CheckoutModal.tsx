import { X, Lock, Check, Shield } from 'lucide-react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
    isLoading?: boolean;
}

export function CheckoutModal({ isOpen, onClose, onCheckout, isLoading = false }: CheckoutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Close"
                >
                    <X size={20} className="text-slate-600 dark:text-slate-400" />
                </button>

                {/* Content */}
                <div className="p-4 md:p-8 space-y-3 md:space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-1 md:space-y-2">
                        <div className="inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-primary/10 mb-2 md:mb-4">
                            <Lock size={20} className="text-primary md:w-8 md:h-8" />
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                            Unlock Your Full Report
                        </h2>
                        <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 hidden md:block">
                            Get instant access to everything you need to fix your relationship
                        </p>
                    </div>

                    {/* What's Included */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-base">Here's what you'll get instantly:</h3>
                        <ul className="space-y-1 md:space-y-2">
                            {[
                                'All 5 Core Dimensions (deep dive analysis)',
                                'Connecting the Dots (why problems repeat)',
                                '30-Day Action Plan (exact steps)',
                                '12 Advanced Metrics (your exact scores)',
                                'Lifetime access to your report'
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 md:gap-3">
                                    <Check size={14} className="text-green-500 shrink-0 mt-0.5 md:w-5 md:h-5" />
                                    <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-tight">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Proof - The individual "Aha!" moment - Hidden on very small screens if needed, or kept compact */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 md:p-4 rounded-xl border border-slate-100 dark:border-slate-800 italic text-slate-600 dark:text-slate-300 relative group">

                        <p className="text-xs md:text-sm leading-snug md:leading-relaxed pt-1">
                            I couldn't explain what was wrong, just that something was. The report gave me the exact words. Whether I show it to him or not, at least now I'm not crazy—I finally understand what's broken.
                        </p>
                        <div className="mt-1 md:mt-2 flex items-center gap-2">
                            <div className="flex text-yellow-500 text-[10px] md:text-xs">
                                {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-slate-900 dark:text-white">- Sarah, Verified User</span>
                        </div>
                    </div>

                    {/* Pricing - Compact on Mobile */}
                    <div className="bg-primary/5 rounded-xl p-3 md:p-6 text-center space-y-2 md:space-y-4 border-2 border-primary/20 relative overflow-hidden">
                        {/* Dynamic Urgency Badge */}
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-bl-lg uppercase tracking-wider">
                            Offer ends {new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>

                        <div className="flex flex-row items-baseline justify-center gap-3 md:flex-col md:gap-0">
                            <div className="flex items-end justify-center gap-1 md:mb-1">
                                <span className="text-xs md:text-lg text-slate-400 font-medium md:mb-1">Regular:</span>
                                <span className="text-sm md:text-xl text-slate-400 line-through decoration-slate-400/50">$197</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 md:gap-3">
                                <span className="text-4xl md:text-6xl font-black text-primary">${import.meta.env.REACT_APP_REPORT_PRICE || "29"}</span>
                            </div>
                        </div>

                        <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full mt-0 md:mt-2">
                            ONE-TIME PAYMENT • NO SUBSCRIPTION
                        </div>

                        {/* Guarantee moved here for proximity */}
                        <div className="flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 pt-1 md:pt-2 border-t border-slate-200 dark:border-slate-700 mt-1 md:mt-0">
                            <Shield size={12} className="text-primary md:w-3.5 md:h-3.5" />
                            <span>100% Money-back guarantee. Zero risk.</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onCheckout}
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-black text-base md:text-xl py-3 md:py-5 px-4 md:px-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 md:gap-3 group"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Yes, Unlock My Analysis
                                <Lock size={16} className="group-hover:scale-110 transition-transform md:w-5 md:h-5" />
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-[8px] md:text-[10px] text-slate-400">
                            By clicking above, you agree to Terms. 256-bit SSL encrypted.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
