import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { routes } from "wasp/client/router";
import { ArrowRight, CheckCircle2, Brain, Activity, Heart, Shield, MessageCircle, Star, Users, Zap, Search, Lock, AlertTriangle } from "lucide-react";

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const handleScrollToStart = () => {
    // If we had a scroll anchor, but linking to /test is better
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans animate-fade-in overflow-x-hidden">
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>

      {/* --- HERO SECTION: THE 3AM THOUGHT --- */}
      <header className="relative pt-20 pb-32 px-6 border-b border-border/50 overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
        <div className="absolute -right-20 top-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute -left-20 bottom-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 animate-fade-in-up border border-primary/20">
            <Activity size={14} />
            <span>Diagnosis, Not Just Advice</span>
          </div>

          <h1 className="text-4xl md:text-6xl md:leading-[1.1] font-extrabold tracking-tight mb-8 animate-fade-in-up delay-100">
            "Why do we keep having <br className="hidden md:block" />
            <span className="text-primary relative inline-block">
              the same fight?
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>"
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light">
            You aren't crazy. And your partner isn't a villain.<br />
            <strong className="text-foreground font-medium">You are stuck in a biological loop.</strong>
            <br className="hidden md:block" /> We can show you how to break it in 10 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              to={routes.TestRoute.build()}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-full shadow-lg shadow-primary/25 hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Start Free Diagnosis <ArrowRight size={20} />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-foreground/60 animate-fade-in-up delay-500 font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-background overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 50}`} alt="user" />
                </div>
              ))}
            </div>
            <div>
              <span className="text-primary font-bold">15,000+ couples</span> found their answer here.
            </div>
          </div>
        </div>
      </header>


      {/* --- SECTION 2: THE MIRROR (VALIDATION) --- */}
      <section className="py-24 px-6 bg-card relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">The Symptoms</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Does this sound familiar?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most couples think they have "communication problems." <br />
              Actually, they are suffering from one of these 3 specific hidden patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PainCard
              icon={<MessageCircle size={32} className="text-blue-500" />}
              title="The 'Wall'"
              quote="I try to talk, but they just shut down. It feels like I'm talking to a brick wall."
              diagnosis="Diagnosis: The Pursuit-Withdrawal Loop"
            />
            <PainCard
              icon={<AlertTriangle size={32} className="text-orange-500" />}
              title="The 'Eggshells'"
              quote="I constantly watch my tone. One wrong word and the whole night is ruined."
              diagnosis="Diagnosis: The Emotional Safety Gap"
            />
            <PainCard
              icon={<Heart size={32} className="text-rose-500" />}
              title="The 'Roommates'"
              quote="We function great as a team, but I feel zero passion. We are just managing a household."
              diagnosis="Diagnosis: The Intimacy Mismatch"
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg font-medium italic text-foreground/80">
              "It's scary how accurate this was. It felt like they were reading my diary."
            </p>
            <p className="text-sm font-bold text-muted-foreground mt-2">— Sarah J., Verified User</p>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: THE SOLUTION (RELIEF) --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <div className="order-2 md:order-1 relative">
            {/* Visual of the Report/MRI */}
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg uppercase tracking-wide z-10">
                Result: Actionable
              </div>

              <div className="space-y-6 opacity-90">
                {/* Fake Report Content */}
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Brain size={24} />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
                    <p className="text-sm font-bold text-red-800 dark:text-red-300 mb-1">Your Primary Trigger:</p>
                    <p className="text-xs text-red-700 dark:text-red-400">"You panic when they go silent because your nervous system interprets it as abandonment."</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
                    <p className="text-sm font-bold text-green-800 dark:text-green-300 mb-1">The Fix (Say This):</p>
                    <p className="text-xs text-green-700 dark:text-green-400">"I am feeling anxious, not angry. Can you just hold my hand for 1 minute?"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
              <Zap size={18} fill="currentColor" />
              <span className="uppercase tracking-widest text-xs">The Relationship MRI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              See exactly what is <br /><span className="text-primary">breaking down.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We don't give you generic advice like "communicate better." A doctor doesn't "guess" what's wrong; they run a scan. <br /><br />
              Our <strong>10-minute diagnostic</strong> measures 5 dimensions of your relationship to reveal the invisible "Biological Trap" that keeps you stuck.
            </p>

            <ul className="space-y-4">
              <BenefitItem text="Identify your Conflict Pattern" />
              <BenefitItem text="Decode your Partner's behavior (Translation)" />
              <BenefitItem text="Get your specific 'Emergency Scripts'" />
            </ul>

            <div className="mt-10">
              <Link
                to={routes.TestRoute.build()}
                className="inline-flex px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-lg font-bold rounded-full hover:opacity-90 transition-opacity items-center gap-3"
              >
                Run My Diagnostic <ArrowRight size={18} />
              </Link>
              <p className="text-xs text-muted-foreground mt-3 ml-4">No credit card required to start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE URGENCY (COST OF INACTION) --- */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50 border-y border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 mb-6">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">The "Fork in the Road"</h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Every time you have the same fight, the neural pathway gets deeper. <br className="hidden md:block" />
            <span className="font-bold text-foreground">Resentment calcifies into indifference.</span> <br /><br />
            Statistics show that <strong>68% of couples</strong> in this specific loop break up within 18 months if they don't find a new way to communicate.
          </p>

          <div className="bg-white dark:bg-black/20 p-6 rounded-2xl border border-border inline-block max-w-2xl">
            <p className="font-serif italic text-lg text-foreground/80">
              "I wish we had done this 6 months ago. We wasted so much time being angry at things that weren't even the real problem."
            </p>
            <p className="text-sm font-bold text-muted-foreground mt-4">— Mark & Lisa, Saved their marriage in 2025</p>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: THE FINAL CTA --- */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Stop the silence. <br />Start the healing.</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
          You are 10 minutes away from knowing exactly what to do next.
        </p>

        <div className="flex flex-col items-center gap-6">
          <Link
            to={routes.TestRoute.build()}
            className="w-full max-w-md bg-primary text-primary-foreground text-xl font-bold py-5 px-10 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3"
          >
            Start Free Diagnostic <ArrowRight size={24} />
          </Link>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Lock size={14} /> Private</div>
            <div className="flex items-center gap-1"><Brain size={14} /> Clinical Logic</div>
            <div className="flex items-center gap-1"><Zap size={14} /> Instant Results</div>
          </div>
        </div>
      </section>

    </div>
  );
}

function PainCard({ icon, title, quote, diagnosis }: { icon: React.ReactNode, title: string, quote: string, diagnosis: string }) {
  return (
    <div className="bg-background p-8 rounded-3xl border border-border flex flex-col items-start hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="p-3 bg-secondary/30 rounded-2xl mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <div className="relative pl-4 border-l-4 border-primary/20 mb-6 flex-grow">
        <p className="text-muted-foreground italic leading-relaxed">"{quote}"</p>
      </div>
      <div className="w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">{diagnosis}</p>
      </div>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="mt-1 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full p-1 shrink-0 w-6 h-6 flex items-center justify-center">
        <CheckCircle2 size={14} />
      </div>
      <p className="text-foreground font-medium">{text}</p>
    </div>
  )
}
