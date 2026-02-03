import React from 'react';
import { X, AlertTriangle, RefreshCw, Mail } from 'lucide-react';

interface CheckoutErrorModalProps {
    error: {
        title: string;
        message: string;
    };
    onClose: () => void;
    onRetry: () => void;
    onEmailFallback?: () => void;
}

const CheckoutErrorModal: React.FC<CheckoutErrorModalProps> = ({
    error,
    onClose,
    onRetry,
    onEmailFallback
}) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-background rounded-2xl p-0 max-w-[450px] w-full relative shadow-2xl border-0 overflow-hidden">
                {/* Header */}
                <div className="bg-yellow-500 text-white p-4 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white/70 hover:text-white bg-black/20 rounded-full p-1 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center justify-center gap-2">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold">{error.title}</h2>
                    </div>
                </div>

                <div className="p-8">
                    {/* Message */}
                    <p className="text-center text-lg mb-6 text-foreground">
                        {error.message}
                    </p>

                    {/* Reassurance */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl mb-6 text-center">
                        <p className="text-sm text-foreground/80">
                            ✓ Your results are <span className="font-bold">safe and saved</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                onClose();
                                onRetry();
                            }}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Retry Checkout
                        </button>

                        {onEmailFallback && (
                            <button
                                onClick={() => {
                                    onClose();
                                    onEmailFallback();
                                }}
                                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 rounded-xl border border-border transform transition active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Mail size={18} />
                                Email Me Instead
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full text-center text-sm text-muted-foreground hover:underline py-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutErrorModal;
