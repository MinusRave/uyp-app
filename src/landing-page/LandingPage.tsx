import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { routes } from "wasp/client/router";
import {
  ArrowRight,
  Brain,
  Activity,
  Shield,
  Zap,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Search,
  FileText,
  TrendingUp,
  HeartHandshake,
  Microscope
} from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground font-sans animate-fade-in overflow-x-hidden">
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>

      {/* --- HERO SECTION: THE DIAGNOSIS --- */}
      <header className="relative pt-24 pb-32 px-6 border-b border-border/50 overflow-hidden">
        {/* Abstract "MRI Scan" Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-20" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 -z-10 mix-blend-soft-light" />

        <div className="max-w-5xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-up border border-primary/20 backdrop-blur-sm">
            <Microscope size={14} />
            <span>Clinical Relationship Diagnostics</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 animate-fade-in-up delay-100 leading-tight">
            Why do repetitive fights <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 relative">
              happen to good couples?
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light">
            It’s not your personality. It’s not "communication issues." <br />
            <strong className="text-foreground font-medium">You are stuck in a biological feedback loop.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
            <Link
              to={routes.TestRoute.build()}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground text-lg font-bold rounded-full shadow-2xl shadow-primary/25 hover:scale-105 hover:shadow-xl transition-all flex items-center justify-center gap-3 ring-4 ring-primary/10"
            >
              Start Diagnostic Scan <ArrowRight size={20} />
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground animate-fade-in-up delay-400">
            Takes 10 minutes • No account required to start • 100% Private
          </p>
        </div>
      </header>


      {/* --- SECTION 2: THE 3 SILENT KILLERS (CLINICAL LABELS) --- */}
      <section className="py-24 px-6 bg-card/50 relative border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">The Pathology</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">The 3 "Silent Killers"</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most couples we analyze aren't "falling out of love." They are suffering from a mechanical breakdown in one of these three specific systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PathologyCard
              title="The Pursuit-Withdrawal Loop"
              subtitle="System: Communication"
              description="One partner feels anxious and chases connection. The other feels overwhelmed and withdraws for peace. The more you chase, the more they run."
              icon={<Activity className="text-red-500" size={32} />}
            />
            <PathologyCard
              title="The Emotional Safety Gap"
              subtitle="System: Nervous System"
              description="One of you measures safety by 'connection', the other by 'calm'. You are speaking different biological languages during conflict."
              icon={<Shield className="text-amber-500" size={32} />}
            />
            <PathologyCard
              title="The Manager-Employee Dynamic"
              subtitle="System: Desire & Power"
              description="One carries the mental load (Manager). The other feels nagged (Employee). Intimacy cannot survive in a parent-child dynamic."
              icon={<Zap className="text-purple-500" size={32} />}
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: THE MECHANISM (HOW IT WORKS) --- */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">

          <div className="order-2 md:order-1 relative">
            {/* Visual Abstraction of the Scan */}
            <div className="relative z-10 grid gap-4">
              <DimensionBar label="Communication Style" score={34} color="bg-red-500" />
              <DimensionBar label="Emotional Safety" score={62} color="bg-amber-500" />
              <DimensionBar label="Intimacy & Desire" score={28} color="bg-rose-500" />
              <DimensionBar label="Fairness & Mental Load" score={45} color="bg-blue-500" />
              <DimensionBar label="Future Alignment" score={88} color="bg-green-500" />
            </div>
            {/* Glow behind */}
            <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 rounded-full" />

            <div className="mt-8 p-6 bg-card border border-border rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Search size={20} className="text-primary" />
                <span className="font-bold text-sm uppercase text-muted-foreground">Detected Pattern</span>
              </div>
              <p className="font-medium text-lg">"Anxious-Avoidant Trap"</p>
              <p className="text-sm text-muted-foreground mt-1">High Intensity Conflict × Low Repair Efficiency</p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
              <Brain size={18} />
              <span className="uppercase tracking-widest text-xs">The Methodology</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              We measure what <br /><span className="text-primary">you can't see.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A doctor doesn't guess what's wrong with your heart; they run an MRI. <br /><br />
              We use <strong>Clinical Psychology</strong> to map the invisible "Vital Signs" of your relationship. We don't ask "how do you feel?". We measure <strong>how you function</strong>.
            </p>

            <ul className="space-y-4">
              <CheckItem text="Identify your Conflict Loop Pattern" />
              <CheckItem text="Measure your Repair Efficiency Score" />
              <CheckItem text="Forecast your 5-Year Sustainability" />
            </ul>

            <div className="mt-10">
              <Link
                to={routes.TestRoute.build()}
                className="inline-flex px-8 py-4 bg-foreground text-background text-lg font-bold rounded-full hover:opacity-90 transition-opacity items-center gap-3"
              >
                Run Diagnostic <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 4: THE REPORT (PRODUCT) --- */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50 border-y border-border/50">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Owner's Manual</h2>
          <p className="text-lg text-muted-foreground">
            Stop guessing. Get the 15-page clinical report that explains your partner to you.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-background p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-2">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold">The Conflict Map</h3>
            <p className="text-muted-foreground">A step-by-step diagram of your specific fight loop. See exactly where the signal breaks down and where to intervene.</p>
          </div>

          <div className="bg-background p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-2">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-xl font-bold">The Translation Dictionary</h3>
            <p className="text-muted-foreground">We translate your partner's "confusing" behaviors into their actual emotional needs. Understand what they are really saying.</p>
          </div>

          <div className="bg-background p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-2">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold">Execution Scripts</h3>
            <p className="text-muted-foreground">3 specific sentences designed to bypass your partner's defense mechanisms and de-escalate a fight in 60 seconds.</p>
          </div>

          <div className="bg-background p-8 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-2">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">The Prognosis</h3>
            <p className="text-muted-foreground">An AI-generated forecast of where your relationship will be in 5 years if you don't change your patterns today.</p>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: SOCIAL PROOF --- */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-1 px-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-8">
            Verified Outcome
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-tight">
            "Saved us $2,000 in therapy bills."
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            <div className="p-6 bg-card border border-border rounded-xl">
              <p className="text-sm font-bold text-muted-foreground mb-2 text-red-500 uppercase">Before</p>
              <p className="italic text-foreground/80">"We fought every night about the dishes. I thought he was lazy. He thought I was controlling. We were exhausted."</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <p className="text-sm font-bold text-muted-foreground mb-2 text-green-500 uppercase">After The MRI</p>
              <p className="font-medium text-foreground">"We realized it wasn't about the dishes. It was a 'Recognition Hunger' loop. The report gave us the exact script to fix it. We haven't had that fight in 3 months."</p>
            </div>
          </div>

          <p className="mt-8 font-bold text-muted-foreground">— Mark & Lisa, Married 7 years</p>
        </div>
      </section>

      {/* --- SECTION 6: FAQ / FINAL CTA --- */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10 mix-blend-overlay" />

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Stop the silence. <br />Start the healing.</h2>
          <p className="text-xl text-slate-300 mb-12">
            You are 10 minutes away from knowing exactly what to do next.
          </p>

          <Link
            to={routes.TestRoute.build()}
            className="w-full max-w-md bg-white text-slate-900 text-xl font-bold py-5 px-10 rounded-full shadow-2xl hover:scale-105 transition-transform inline-flex items-center justify-center gap-3"
          >
            Start Diagnostic Scan <ArrowRight size={24} />
          </Link>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-2"><Lock size={14} /> 100% Private Data</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Clinical Accuracy</span>
            <span className="flex items-center gap-2"><Zap size={14} /> Instant Results</span>
          </div>
        </div>
      </section>

    </div>
  );
}

// --- SUBCOMPONENTS ---

function PathologyCard({ title, subtitle, description, icon }: { title: string, subtitle: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="bg-background p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-secondary/50 rounded-2xl">
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{subtitle}</span>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function DimensionBar({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div className="bg-card border border-border p-3 rounded-lg flex items-center gap-4 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 ${color} opacity-20`} style={{ width: `${score}%` }} />
      <div className="z-10 flex-1 flex justify-between items-center px-2">
        <span className="font-bold text-sm">{label}</span>
        <span className="font-mono text-xs font-bold opacity-70">{score}/100</span>
      </div>
    </div>
  )
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="mt-1 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full p-1 shrink-0 w-6 h-6 flex items-center justify-center">
        <CheckCircle2 size={14} />
      </div>
      <p className="text-foreground font-medium">{text}</p>
    </div>
  )
}
