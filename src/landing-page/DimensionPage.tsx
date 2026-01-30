import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { routes } from "wasp/client/router";
import { ArrowRight, Activity, Brain, CheckCircle2, AlertCircle } from "lucide-react";
import { PILLAR_CONTENT } from "./content";

export default function DimensionPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const content = id ? PILLAR_CONTENT[id] : null;

    useEffect(() => {
        if (!content) {
            // If content doesn't exist, redirect to home (soft 404)
            navigate("/");
        }
    }, [content, navigate]);

    if (!content) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": content.title,
        "description": content.subtitle,
        "author": {
            "@type": "Organization",
            "name": "UnderstandYourPartner"
        },
        "publisher": {
            "@type": "Organization",
            "name": "UnderstandYourPartner",
            "logo": {
                "@type": "ImageObject",
                "url": "https://understandyourpartner.com/logo.png"
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans animate-fade-in">
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
            {/* HERO */}
            <header className="py-20 px-6 text-center border-b border-border/50 bg-secondary/5">
                <div className="max-w-3xl mx-auto">
                    <p className="text-primary font-bold uppercase tracking-wider text-sm mb-4">{content.subtitle}</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">{content.title}</h1>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                </div>
            </header>

            {/* SYMPTOM (The Pain) */}
            <section className="py-24 px-6 bg-card">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-start gap-6">
                        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-2xl text-red-600 shrink-0 hidden md:block">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{content.symptom.title}</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                "{content.symptom.desc}"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SCIENCE (The Reason) */}
            <section className="py-24 px-6 bg-background">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-start gap-6">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-2xl text-blue-600 shrink-0 hidden md:block">
                            <Brain size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{content.science.title}</h2>
                            <p className="text-lg text-foreground mb-6 leading-relaxed">
                                {content.science.desc}
                            </p>

                            <div className="bg-secondary/20 p-6 rounded-xl border-l-4 border-primary">
                                <span className="font-bold text-primary block mb-2 text-sm uppercase tracking-wide">The Hidden Mirror</span>
                                <p className="font-medium font-serif italic text-lg opacity-90">
                                    {content.science.mirror}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLUTION (The Fix) */}
            <section className="py-24 px-6 bg-primary/5 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center p-4 bg-background rounded-full shadow-lg mb-8 text-primary">
                        <Activity size={32} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">How we measure this.</h2>
                    <p className="text-lg text-muted-foreground mb-10">
                        {content.solution.desc}
                    </p>

                    <Link
                        to={routes.TestRoute.build()}
                        className="inline-flex px-10 py-5 bg-primary text-primary-foreground text-xl font-bold rounded-full shadow-xl hover:scale-105 transition-all items-center gap-3"
                    >
                        Measure My {content.solution.dimension} <ArrowRight />
                    </Link>
                    <p className="text-xs text-muted-foreground mt-4">Free scientific analysis • 10 minutes</p>
                </div>
            </section>

        </div>
    );
}
