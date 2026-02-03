
import React, { useEffect, useState } from 'react';
import { X, Clock, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

interface ExitIntentModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (email: string) => Promise<void>;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ show, onClose, onSave }) => {
    const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59 });
    const [email, setEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(email);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-background rounded-2xl p-0 max-w-[500px] w-full relative shadow-2xl border-0 overflow-hidden">
                {/* Header */}
                <div className="bg-red-600 text-white p-4 text-center font-bold text-sm md:text-base flex items-center justify-center gap-2">
                    <Clock size={16} />
                    YOUR ANALYSIS EXPIRES IN 23 HOURS
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white/70 hover:text-white bg-black/20 rounded-full p-1 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <p className="text-lg font-medium leading-relaxed mb-6">
                        You just spent 18 minutes answering 32 questions about the most important relationship in your life.
                    </p>

                    <div className="space-y-3 mb-8 bg-secondary/10 p-4 rounded-xl">
                        <p className="font-bold text-sm text-foreground">But here's what happens if you leave:</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <X className="text-red-500 shrink-0" size={16} /> This analysis gets deleted
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <X className="text-red-500 shrink-0" size={16} /> You'll have to retake the entire assessment
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <X className="text-red-500 shrink-0" size={16} /> The $29 special pricing expires
                        </div>
                    </div>

                    <p className="text-center font-bold text-xl mb-4">Don't let 18 minutes go to waste.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            required
                            className="w-full p-4 rounded-xl border-2 border-primary/20 bg-background text-lg text-center"
                            placeholder="Enter your email to save results"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 text-lg"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <>SAVE MY ANALYSIS <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <button onClick={onClose} className="w-full text-center text-sm text-muted-foreground mt-4 hover:underline">
                        No thanks, I'll risk losing it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExitIntentModal;
