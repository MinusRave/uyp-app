import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClosingCTASection() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>

            <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
                {/* Main Content */}
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                    Ready to Break the Pattern?
                </h2>
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Take the 10-minute test and see what's really happening in your relationship.
                </p>

                {/* CTA Button */}
                <Link
                    to="/test"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                    Break the Cycle
                    <ArrowRight size={20} />
                </Link>

                {/* Trust Indicators */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>No sign-up required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>Results in 10 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>Used by 500+ couples this month</span>
                    </div>
                </div>

                {/* Social Proof */}
                <div className="mt-12 pt-8 border-t border-border/50">
                    <p className="text-sm text-muted-foreground italic">
                        "This test gave me the language I needed to finally explain what I've been feeling for years."
                    </p>
                    <p className="text-sm font-medium text-foreground mt-2">— Recent user</p>
                </div>
            </div>
        </section>
    );
}
