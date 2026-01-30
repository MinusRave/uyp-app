import React from "react";
import { Link } from "react-router-dom";
import { routes } from "wasp/client/router";
import { ArrowRight, CheckCircle2, Brain, Activity, Heart, Shield, MessageCircle, Star, Users } from "lucide-react";
import { cn } from "../client/utils";

export default function LandingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "UnderstandYourPartner",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans animate-fade-in">
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>

      {/* HERO SECTION */}
      <header className="relative overflow-hidden pt-20 pb-32 px-6 border-b border-border/50">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-8 animate-fade-in-up">
            <Brain size={16} /> Scientific Relationship Analysis
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
            Stop guessing <br className="hidden md:block" />
            <span className="text-primary">why you fight.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            It’s not just "miscommunication." It’s a mismatch in how your bodies process stress.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              to={routes.TestRoute.build()}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Start Free Analysis <ArrowRight size={20} />
            </Link>
            <span className="text-sm text-muted-foreground mt-2 sm:mt-0 sm:ml-4">
              Takes 10 mins • No credit card required
            </span>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in-up delay-500">
            <Users size={16} /> Joined by 15,000+ couples
          </div>
        </div>
      </header>

      {/* PROBLEM SECTION - "The Mirror" */}
      <section className="py-24 px-6 bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Does this sound like your relationship?</h2>
            <p className="text-muted-foreground">The pattern is usually the same, even if the topic changes.</p>
          </div>

          <div className="grid gap-6">
            <ProblemCard
              icon={<MessageCircle className="text-orange-500" />}
              title="The Infinite Argument"
              desc="You have the same fight over and over. Different subject, same exhausting feeling."
              mirror="Why it happens: Your brain is trying to solve a logic problem, but your partner is having a safety problem."
            />
            <ProblemCard
              icon={<Shield className="text-blue-500" />}
              title="The Distance"
              desc="When things get tough, one of you shuts down or pulls away."
              mirror="What it feels like: You feel ignored. They feel overwhelmed. Neither of you feels heard."
            />
            <ProblemCard
              icon={<Activity className="text-red-500" />}
              title="The Eggshells"
              desc="You overthink what to say to avoid triggering a reaction."
              mirror="The reality: You are managing their emotions instead of being a partner."
            />
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION - "The Science" */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <div className="order-2 md:order-1 relative">
            {/* Abstract visual representation of the graph */}
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-transparent rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative z-10 p-8 bg-background border border-border shadow-2xl rounded-2xl max-w-sm w-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-bold">Your Compatibility Pulse</span>
                    <span className="text-green-500 font-mono">Loading...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-secondary rounded-full w-3/4" />
                    <div className="h-2 bg-secondary rounded-full w-1/2" />
                    <div className="h-2 bg-secondary rounded-full w-5/6" />
                  </div>
                  <div className="pt-4 flex gap-2 text-xs text-muted-foreground">
                    <Activity size={12} />
                    <span>Analyzing Attachment Style...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              See the <span className="text-primary">hidden pattern</span> causing the chaos.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We don't give you generic advice like "communicate better." We use a 64-dimensional psychological model to map exactly where your instincts collide.
            </p>

            <div className="space-y-6">
              <Feature
                title="Identify Your Trigger Loops"
                desc="Translation: Find out exactly what specific tone, look, or phrase sets your body on fire before you even know you're mad."
              />
              <Feature
                title="Decode Your Partner's Silence"
                desc="Translation: Understand why they pull away (it’s usually not because they don't care, but because they care too much causing overload)."
              />
              <Feature
                title="Get actionable scripts"
                desc="Translation: Know the exact words to say to stop a fight in 30 seconds."
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6 text-yellow-500">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" />)}
          </div>
          <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground mb-8 leading-relaxed">
            "I cried reading my report. Not because it was sad, but because for the first time someone explained that I'm not 'crazy' or 'needy'. It was just my body trying to protect me."
          </blockquote>
          <cite className="not-italic font-bold text-lg text-primary">— Emma R., Verified User</cite>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to stop the cycle?</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
          Get your comprehensive analysis in 10 minutes.
        </p>
        <Link
          to={routes.TestRoute.build()}
          className="inline-flex px-10 py-5 bg-primary text-primary-foreground text-xl font-bold rounded-full shadow-xl hover:scale-105 transition-all items-center gap-3"
        >
          Start Free Analysis <ArrowRight />
        </Link>
      </section>

    </div>
  );
}

function ProblemCard({ icon, title, desc, mirror }: { icon: React.ReactNode, title: string, desc: string, mirror: string }) {
  return (
    <div className="bg-background p-6 rounded-2xl border border-border flex flex-col md:flex-row gap-6 items-start hover:border-primary/50 transition-colors">
      <div className="p-3 bg-secondary/50 rounded-xl shrink-0">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{desc}</p>
        <div className="bg-primary/5 p-4 rounded-lg text-sm border-l-4 border-primary/20">
          <span className="font-bold text-primary mr-1">The Truth:</span>
          {mirror}
        </div>
      </div>
    </div>
  )
}

function Feature({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full p-1 shrink-0 w-6 h-6 flex items-center justify-center">
        <CheckCircle2 size={14} />
      </div>
      <div>
        <h4 className="font-bold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
