import React from 'react';
import { Sparkles, Heart, Activity, Repeat, Zap, FileText, MessageCircle, Target } from 'lucide-react';

export default function WhatYouGetSection() {
    return (
        <section className="space-y-8">
            <div className="text-center mb-12">
                <h3 className="font-bold text-3xl mb-3 text-primary">What You're About To Unlock</h3>
                <p className="text-muted-foreground text-lg">Your complete relationship diagnostic + action plan</p>
            </div>

            {/* Main Deliverables */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* 1. The Mirror */}
                <DeliverableCard
                    icon={<Sparkles className="text-purple-500" size={24} />}
                    title="The Mirror: Executive Summary"
                    description="AI deep-dive into what's actually happening in your relationship"
                    benefits={[
                        "Why you're stuck (the real reason, not the surface one)",
                        "Your specific trap (e.g., 'The Panic Loop', 'The Wall')",
                        "What's bleeding trust (the invisible wounds)"
                    ]}
                />

                {/* 2. Health Check */}
                <DeliverableCard
                    icon={<Heart className="text-red-500" size={24} />}
                    title="Health Check: Compatibility Score"
                    description="Should you stay or go? Get the honest answer."
                    benefits={[
                        "Your compatibility score (0-100)",
                        "Reality check verdict (no sugar-coating)",
                        "Breakdown by dimension (where you're strong vs. bleeding)"
                    ]}
                />

                {/* 3. Pattern Analysis */}
                <DeliverableCard
                    icon={<Repeat className="text-orange-500" size={24} />}
                    title="Pattern Analysis: Your Loop"
                    description="Why you keep having the SAME fight"
                    benefits={[
                        "The cycle you're stuck in (visualized)",
                        "Conflict decoder (what the fight is REALLY about)",
                        "Your nervous system dynamics (anxious vs. avoidant)"
                    ]}
                />

                {/* 4. Emergency Scripts */}
                <DeliverableCard
                    icon={<Zap className="text-yellow-500" size={24} />}
                    title="Emergency Scripts"
                    description="The exact words to say when you're triggered"
                    benefits={[
                        "In-the-moment scripts (stop the spiral)",
                        "Repair scripts (reconnect after a fight)",
                        "Partner translations (what they REALLY mean)"
                    ]}
                />

            </div>

            {/* 5 Dimension Deep Dives */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Target className="text-primary" size={28} />
                    <h4 className="font-bold text-2xl">5 Dimension Deep Dives</h4>
                </div>
                <p className="text-muted-foreground mb-6">For each dimension, you get a complete analysis + action plan:</p>

                <div className="grid md:grid-cols-5 gap-4 mb-6">
                    <DimensionPill text="How you fight" />
                    <DimensionPill text="How safe you feel" />
                    <DimensionPill text="Your intimacy" />
                    <DimensionPill text="Your fairness" />
                    <DimensionPill text="Your future" />
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                    <AnalysisItem
                        title="Score & State Diagnosis"
                        description="Where you fall on the spectrum + your specific state (e.g., 'Hyper-Vigilance', 'The Parent-Child Trap')"
                    />
                    <AnalysisItem
                        title="Why You're Stuck"
                        description="The biological/psychological trap you've fallen into"
                    />
                    <AnalysisItem
                        title="The Protocol"
                        description="Step-by-step actions to break the pattern (starting tonight)"
                    />
                    <AnalysisItem
                        title="The Scripts"
                        description="Word-for-word what to say in the moment + how to repair"
                    />
                    <AnalysisItem
                        title="Partner Translation"
                        description="Why they do what they do (it's not what you think)"
                    />
                </div>
            </div>

            {/* Bonus/Additional */}
            <div className="grid md:grid-cols-2 gap-4">
                <BonusItem
                    icon={<Activity className="text-blue-500" size={20} />}
                    text="Relationship trajectory (where you're headed)"
                />
                <BonusItem
                    icon={<MessageCircle className="text-green-500" size={20} />}
                    text="Conflict autopsy (your specific fight, decoded)"
                />
                <BonusItem
                    icon={<FileText className="text-indigo-500" size={20} />}
                    text="Attachment style analysis (anxious, avoidant, secure)"
                />
                <BonusItem
                    icon={<Sparkles className="text-pink-500" size={20} />}
                    text="Comparison to 15,000+ couples"
                />
            </div>

            {/* The Promise */}
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl">
                <p className="text-foreground/90 leading-relaxed">
                    <span className="font-bold text-primary text-lg">We tell you the truth.</span><br />
                    What's going on, how it should go, and how to make it work. No fluff. No generic advice. Just honest analysis + real guidance.
                </p>
            </div>
        </section>
    );
}

function DeliverableCard({ icon, title, description, benefits }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    benefits: string[];
}) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-4">
                <div className="mt-1">{icon}</div>
                <div>
                    <h4 className="font-bold text-lg mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <ul className="space-y-2">
                {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-foreground/80">{benefit}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function DimensionPill({ text }: { text: string }) {
    return (
        <div className="bg-primary/10 border border-primary/30 rounded-full px-3 py-2 text-xs font-medium text-center">
            {text}
        </div>
    );
}

function AnalysisItem({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
            <div>
                <h5 className="font-bold text-sm mb-0.5">{title}</h5>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function BonusItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2 bg-secondary/20 border border-border/50 rounded-xl px-4 py-3">
            {icon}
            <span className="text-sm font-medium">{text}</span>
        </div>
    );
}
