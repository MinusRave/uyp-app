import React, { useState } from 'react';
import { X, Lock, Shield, CheckCircle2, Loader2, Zap, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface CheckoutConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    price: string;
    isRedirecting: boolean;
    lowestDimension?: string; // For personalization
    isCrisis?: boolean; // For crisis-specific messaging
}

const TESTIMONIALS = [
    {
        text: "It explained why I panic when he goes quiet. It's not rejection—he's trying not to explode. That ONE insight stopped our 3am fights.",
        author: "Sarah, together 6 years"
    },
    {
        text: "We hadn't had sex in 4 months. The report explained he needs emotional closeness FIRST, I need physical closeness first. Now we know how to bridge the gap.",
        author: "Mike, married 11 years"
    },
    {
        text: "I thought we wanted different things. Turns out we want the same thing, but our fears were making us pull in opposite directions.",
        author: "Jessica, together 3 years"
    },
    {
        text: "I was ready to leave. The compatibility score was 42%. But it showed me EXACTLY what to fix. We're at 68% now.",
        author: "David, married 9 years"
    }
];

// Personalization logic
function getPersonalizedHeader(lowestDimension?: string, isCrisis?: boolean) {
    if (isCrisis) return "You're about to get the answer: Stay or go?";

    switch (lowestDimension) {
        case 'communication':
            return "You're about to understand why you panic";
        case 'emotional_safety':
            return "You're about to feel safe again";
        case 'physical_intimacy':
            return "You're about to understand why they say 'no'";
        case 'priorities_fairness':
            return "You're about to stop feeling like their parent";
        case 'future_values':
            return "You're about to know if you're building the same future";
        default:
            return "You're about to get answers";
    }
}

function getPersonalizedSubheader(lowestDimension?: string, isCrisis?: boolean) {
    if (isCrisis) return "The honest answer you've been avoiding";

    switch (lowestDimension) {
        case 'communication':
            return "Why you panic when they go quiet";
        case 'emotional_safety':
            return "Why you don't feel safe with them";
        case 'physical_intimacy':
            return "Why the bedroom feels broken";
        case 'priorities_fairness':
            return "Why you're carrying everything";
        case 'future_values':
            return "Whether you're growing together or apart";
        default:
            return "The clarity you've been searching for";
    }
}

// Reorder benefits to show most relevant first
function getOrderedBenefits(lowestDimension?: string, isCrisis?: boolean) {
    const allBenefits = [
        { key: 'crisis', text: "Should I stay or go? (Get the honest answer.)", highlight: isCrisis },
        { key: 'validation', text: "Am I crazy? (No. Here's what's actually happening.)", highlight: false },
        { key: 'communication', text: "Why the SAME fight? (And how to stop it.)", highlight: lowestDimension === 'communication' },
        { key: 'intimacy', text: "Why they say 'no' to sex (It's not about you.)", highlight: lowestDimension === 'physical_intimacy' },
        { key: 'future', text: "Are we building the same future? (Or drifting apart?)", highlight: lowestDimension === 'future_values' },
    ];

    // Sort: highlighted first, then rest
    return allBenefits.sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0));
}

const CheckoutConfirmationModal: React.FC<CheckoutConfirmationModalProps> = ({
    show,
    onClose,
    onConfirm,
    price,
    isRedirecting,
    lowestDimension,
    isCrisis
}) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    if (!show) return null;

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const personalizedHeader = getPersonalizedHeader(lowestDimension, isCrisis);
    const personalizedSubheader = getPersonalizedSubheader(lowestDimension, isCrisis);
    const orderedBenefits = getOrderedBenefits(lowestDimension, isCrisis);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
            <div className="bg-background rounded-2xl p-0 max-w-[540px] w-full my-8 relative shadow-2xl border border-border">

                {/* Header - PERSONALIZED */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center relative border-b border-border/50">
                    <button
                        onClick={onClose}
                        disabled={isRedirecting}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-background/80 rounded-full p-1.5 transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart size={20} className="text-primary" fill="currentColor" />
                        <h2 className="text-2xl font-bold text-foreground">
                            {personalizedHeader}
                        </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {personalizedSubheader}
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Emotional Benefits - PERSONALIZED ORDER */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">What You'll Finally Know:</h3>
                        <div className="space-y-3">
                            {orderedBenefits.map((benefit) => (
                                <BenefitItem
                                    key={benefit.key}
                                    text={benefit.text}
                                    highlight={benefit.highlight}
                                />
                            ))}
                        </div>
                    </div>

                    {/* What We Analyzed */}
                    <div className="bg-secondary/20 border border-border/50 rounded-xl p-4">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">We Analyzed 5 Dimensions</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span className="text-foreground/80">How you fight</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span className="text-foreground/80">How safe you feel</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span className="text-foreground/80">Your intimacy</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span className="text-foreground/80">Your fairness</span>
                            </div>
                            <div className="flex items-center gap-1.5 col-span-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span className="text-foreground/80">Your future alignment</span>
                            </div>
                        </div>
                    </div>

                    {/* The Promise */}
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl">
                        <p className="text-sm text-foreground/90 leading-relaxed">
                            <span className="font-bold text-primary">We tell you the truth.</span> Even if it hurts. Because you deserve clarity, not false hope.
                        </p>
                    </div>

                    {/* Price - IMPROVED ANCHORING */}
                    <div className="bg-secondary/20 border border-border/50 rounded-xl p-4 text-center">
                        <div className="text-xs text-muted-foreground mb-2">Couples therapy: $200-300/session</div>
                        <div className="flex items-center justify-center gap-3 mb-1">
                            <span className="text-3xl font-bold text-foreground">${price}</span>
                            <span className="text-lg text-muted-foreground line-through">$197</span>
                        </div>
                        <p className="text-xs text-muted-foreground">One-time payment. Instant access. No subscription.</p>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground border-t border-b border-border/50 py-3">
                        <div className="flex items-center gap-1">
                            <Lock size={12} className="text-green-600" />
                            <span>Secure Payment</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Shield size={12} className="text-blue-600" />
                            <span>60-Day Guarantee</span>
                        </div>
                    </div>

                    {/* Swipeable Testimonials */}
                    <div className="relative bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
                        <div className="p-4">
                            <p className="text-sm italic text-foreground/90 leading-relaxed h-20 flex items-center">
                                {TESTIMONIALS[currentTestimonial].text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                — {TESTIMONIALS[currentTestimonial].author}
                            </p>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1.5 shadow-sm transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft size={16} className="text-foreground" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1.5 shadow-sm transition-colors"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight size={16} className="text-foreground" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-1.5 pb-3">
                            {TESTIMONIALS.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentTestimonial(idx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentTestimonial
                                            ? 'bg-primary'
                                            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                        }`}
                                    aria-label={`Go to testimonial ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RISK REVERSAL - Guarantee Above CTA */}
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Shield size={20} className="text-green-600 dark:text-green-400" />
                            <span className="font-bold text-green-900 dark:text-green-300">60-Day Guarantee</span>
                        </div>
                        <p className="text-sm text-green-900 dark:text-green-200 text-center">
                            If you don't get at least ONE insight that shifts how you see your relationship, we'll refund you. No questions asked.
                        </p>
                    </div>

                    {/* CTA Buttons - ALWAYS VISIBLE */}
                    <div className="space-y-3 sticky bottom-0 bg-background pt-4 -mx-6 px-6 pb-6">
                        <button
                            onClick={onConfirm}
                            disabled={isRedirecting}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isRedirecting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Securing your checkout...</span>
                                </>
                            ) : (
                                <>
                                    <span>Get My Answers Now</span>
                                    <Zap size={18} fill="currentColor" />
                                </>
                            )}
                        </button>

                        {!isRedirecting && (
                            <button
                                onClick={onClose}
                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground hover:underline py-2 transition-colors"
                            >
                                Wait, go back
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function BenefitItem({ text, highlight = false }: { text: string; highlight?: boolean }) {
    return (
        <div className={`flex items-start gap-3 ${highlight ? 'bg-primary/5 -mx-2 px-2 py-1 rounded-lg' : ''}`}>
            <div className={`mt-0.5 rounded-full p-1 shrink-0 ${highlight
                    ? 'bg-primary/20 text-primary'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                <CheckCircle2 size={14} strokeWidth={3} />
            </div>
            <p className={`text-sm leading-relaxed ${highlight ? 'font-semibold text-foreground' : 'text-foreground/90'}`}>
                {text}
            </p>
        </div>
    );
}

export default CheckoutConfirmationModal;
