import React from 'react';
import { Calendar, Users, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';

export function WhatsNextSection() {
    return (
        <section className="mb-24">
            <div className="flex items-center gap-2 mb-6">
                <ArrowRight className="text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">12. What's Next?</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-16">
                {/* OPTION 1: Retake */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-purple-600">
                        <Calendar size={24} />
                        <h3 className="font-bold text-lg">Track Progress</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                        Retake this assessment in 8 weeks to see if your nervous system is calming down.
                    </p>
                    <button className="w-full py-3 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                        Schedule Retake
                    </button>
                </div>

                {/* OPTION 2: Partner */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <Users size={24} />
                        <h3 className="font-bold text-lg">Partner View</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                        Invite your partner to take the test. We'll generate a combined COUPLES REPORT showing where you align and clash.
                    </p>
                    <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-md">
                        Invite My Partner
                    </button>
                </div>

                {/* OPTION 3: Therapy */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-4 text-pink-600">
                        <HeartHandshake size={24} />
                        <h3 className="font-bold text-lg">Professional Help</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                        If you need more support, we recommend Emotionally Focused Therapy (EFT).
                    </p>
                    <a href="#" className="w-full py-3 rounded-lg border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-400 font-bold hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors text-center block">
                        Find an EFT Therapist
                    </a>
                </div>
            </div>

            {/* Final Action Call */}
            <div className="bg-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/10 max-w-4xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight">The Difference is Action.</h3>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                    You just invested in understanding your relationship. Don't let it stop here.
                    Start with <span className="text-foreground font-bold underline decoration-primary/50 decoration-4">ONE emergency script</span>. Use it tomorrow.
                </p>

                <div className="inline-flex items-center gap-2 text-sm font-bold bg-background px-4 py-2 rounded-full shadow-sm border border-border text-muted-foreground">
                    <ShieldCheck size={16} className="text-green-500" />
                    60-Day Money-Back Guarantee
                </div>
            </div>
        </section>
    );
}
