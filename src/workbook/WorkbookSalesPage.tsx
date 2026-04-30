import { useState } from "react";
import { ArrowRight, Check, Shield, ChevronDown, X, Image as ImageIcon } from "lucide-react";
import { createWorkbookCheckoutSession } from "wasp/client/operations";

const FAQ_ITEMS = [
  { q: "How is this different from a free relationship quiz?", a: "A quiz gives you an answer in 3 minutes. This workbook does the opposite — it makes you sit with the question for an hour, on paper, with a pen. The decision you write at the end is yours, not the workbook's. That's what makes it last." },
  { q: "What if I read it and I'm still not sure?", a: "Read sections 4 and 5 again in 48 hours. If you still feel the same — you have your answer. If not — you needed more time. Most people who do the workbook honestly know what they want by the last page." },
  { q: "What if my partner finds it?", a: "The PDF you receive has a neutral file name — nothing in the filename or in the email subject reveals what's inside. You can keep it on your phone in a private folder. You can print just the pages you've filled in and keep them somewhere safe." },
  { q: "Will the workbook tell me what to do?", a: "No. It will not give you a verdict. You write your own decision on the last page. That's the point. Decisions written by a tool produce regret. Decisions written by you don't." },
  { q: "How long does it take?", a: "Plan for 60 to 90 minutes in one sitting. Some people take longer. Don't take less. The workbook is designed to be done in one evening — that's the point." },
  { q: "What is \"What If I Regret It?\" exactly?", a: "It's a short manual you receive together with the workbook. You read it after you've made your decision. It helps you tell real regret from the pain that comes with any hard choice — so the decision you wrote in the workbook holds up three months from now, when the doubt comes back. (And it does come back. For everyone.)" },
  { q: "Can I really get a refund?", a: "Yes. 30 days. No forms. No questions. You email us, we refund you. The workbook is designed to help you. If it doesn't, we don't want your money." },
];

export default function WorkbookSalesPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const result = await createWorkbookCheckoutSession({});
      if (result.sessionUrl) window.location.href = result.sessionUrl;
    } catch (e) {
      console.error("[workbook checkout] failed", e);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-5 space-y-0">

        {/* Hero */}
        <section className="py-12 text-center space-y-4">
          <span className="inline-block bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            ⭐ Built on Motivational Interviewing
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            For people who have been thinking about leaving their partner for months — but can't decide.
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
            Should I stay or leave my partner?
          </h1>
          <p className="text-2xl font-bold text-foreground leading-snug">Stop wondering. Decide this week.</p>
          <p className="text-base text-muted-foreground italic">
            A 5-step writing method to help you decide without regrets — in one evening.
          </p>

          {/* Hero mockup — bundle composition */}
          <div className="max-w-md mx-auto pt-2">
            <ImagePlaceholder
              label="Hero bundle mockup"
              src="/images/wrokbook-hero.png"
              alt="Stay or Leave workbook + bonus"
              aspect="4/3"
            />
          </div>

          {/* Early offer strip */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-center gap-3 text-2xl font-black">
              <span className="line-through text-muted-foreground font-normal text-lg">$30</span>
              <span className="text-primary">$11</span>
              <span className="inline-block bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Save 63%
              </span>
            </div>
            <p className="text-sm text-muted-foreground italic">Includes the workbook + 1 free bonus.</p>
            <CTAButton isLoading={isLoading} onClick={handleCheckout} label="Get the workbook + bonus" size="lg" fullWidth />
            <p className="text-xs text-muted-foreground">Instant download · 30-day money-back · One-time payment</p>
          </div>
        </section>

        {/* Mirror / Pain */}
        <section className="py-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-foreground leading-snug">
            You've been asking yourself for months.
          </h2>
          <ImagePlaceholder
            label="Mirror emotion"
            src="/images/workbook-mirroremotion.png"
            alt="Contemplative moment — sitting with the doubt"
            aspect="2/1"
          />
          <div className="bg-muted/40 rounded-2xl p-6 space-y-2 text-base text-foreground/85 leading-relaxed">
            <p>Stay or leave.</p>
            <p>You've thought about it at 2am.</p>
            <p>You've talked to people. They're tired.</p>
            <p>You've read articles online. They said both.</p>
            <p className="font-bold text-foreground">You still don't know.</p>
          </div>
        </section>

        {/* False belief breakdown */}
        <section className="py-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-foreground leading-snug">
            Thinking about it more won't help.
          </h2>
          <p className="text-base text-foreground/85 leading-relaxed">
            You've been telling yourself: <em>"if I just think about it a little longer, I'll figure it out."</em>
          </p>
          <p className="text-base text-foreground/85 leading-relaxed">That's not how this works.</p>
          <div className="border-l-4 border-primary bg-card rounded-r-xl p-6 space-y-2">
            <p className="text-base text-foreground/85 leading-relaxed">Thinking about a relationship doubt at 2am does not produce clarity.</p>
            <p className="text-base text-foreground/85 leading-relaxed">It produces more thinking.</p>
            <p className="text-base text-muted-foreground italic">The mind that built the loop cannot exit it.</p>
          </div>
          <p className="text-base text-foreground/85 leading-relaxed">You don't need more thinking.</p>
          <p className="text-base font-bold text-foreground">You need a different process.</p>
        </section>

        {/* Future state */}
        <section className="py-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-foreground leading-snug">
            Imagine waking up next Monday.
          </h2>
          <ImagePlaceholder
            label="Future state"
            src="/images/workbook-futurestate.png"
            alt="Calm morning after the decision — the loop is over"
            aspect="2/1"
          />
          <div className="bg-muted/40 rounded-2xl p-6 space-y-2 text-base text-foreground/85 leading-relaxed">
            <p className="italic text-foreground">You're not asking yourself again. You decided.</p>
            <p>Maybe you decided to stay. With clear conditions written down. You know what has to change — and by when.</p>
            <p>Maybe you decided to leave. With a real first step. You know what to do this week.</p>
            <p className="font-bold text-foreground">Either way — the loop is over.</p>
          </div>
          <p className="text-muted-foreground">That's what this workbook gives you. Not advice. Not a verdict. The end of the loop.</p>
          <div className="text-center pt-2">
            <CTAButton isLoading={isLoading} onClick={handleCheckout} label="End the loop — get the workbook for $11" size="md" />
          </div>
        </section>

        {/* 5-Step Decision Method */}
        <section className="py-10">
          <div className="rounded-2xl border-2 border-primary bg-card p-6 md:p-10 space-y-5">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">The Mechanism</p>
            <h3 className="text-center text-2xl md:text-3xl font-black text-foreground leading-snug">
              The 5-Step Decision Method
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 bg-muted/40 rounded-xl p-5">
              {["Surface", "Map", "Audit", "Project", "Sign"].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="text-base md:text-lg font-black text-foreground">{step}</span>
                  {i < arr.length - 1 && <span className="text-primary font-black">→</span>}
                </span>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground italic leading-relaxed">
              A 5-step writing method that turns emotional doubt into a clear, signed decision in one evening.
            </p>
            <p className="text-center text-xs text-muted-foreground border-t border-border/50 pt-4 leading-relaxed">
              Built on <strong className="text-foreground">Motivational Interviewing</strong> — the evidence-based technique used by therapists to help people commit to hard life decisions. <em>Adapted into a workbook you can do alone, with a pen, in one evening.</em>
            </p>
          </div>
        </section>

        {/* Curiosity bullets */}
        <section className="py-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-foreground text-center leading-snug">What you'll do.</h2>
          <p className="text-muted-foreground text-center">27 questions. 5 sections. ~25 pages. Done in one evening.</p>
          <ul className="space-y-4 pt-2">
            {[
              "The single sentence on page 4 that, if written honestly, often produces the decision by itself — most people skip it. Don't.",
              "Why telling your friends about your relationship is making your decision harder, not easier (page 11 explains the mechanism).",
              'The “two lists” exercise on page 8 that ends every “it’s complicated” — you’ll see your relationship in two columns, side by side, for the first time.',
              'The “two futures” page that has stopped people from pretending they don’t know. You write both. One feels alive. The other doesn’t.',
              "Why most decision tools skip what's on the last page — and why this is the page that makes the decision yours.",
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-base text-foreground/85 leading-relaxed">
                <span className="text-primary font-black mt-0.5 shrink-0">→</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="text-center pt-2">
            <CTAButton isLoading={isLoading} onClick={handleCheckout} label="Get the workbook now — $11" size="md" />
          </div>
        </section>

        {/* Inside the workbook */}
        <section className="py-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-foreground text-center leading-snug">Inside the workbook.</h2>
          <p className="text-muted-foreground text-center">A preview of three of the most important pages.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <ImagePlaceholder label="Cover" src="/images/wrokbook-cover.png" alt="Stay or Leave workbook cover" aspect="3/4" />
            <ImagePlaceholder label="Two lists page" src="/images/wrokbook-twopages.png" alt="Two lists page — wrong/right columns" aspect="3/4" />
            <ImagePlaceholder label="Decision page" src="/images/wrokbook-decision.png" alt="Decision page — signature, with pen" aspect="3/4" />
          </div>
        </section>

        {/* For you / Not for you */}
        <section className="py-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-foreground text-center leading-snug">Is this for you?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400">This is for you if…</p>
              <ul className="space-y-3">
                {[
                  "You've been wondering for months",
                  "You've talked to friends and they're tired",
                  "You want to decide alone, without telling anyone yet",
                  "You want a method, not more advice",
                  "You're afraid of regret — staying too long, or leaving too soon",
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                    <Check size={14} className="text-green-500 mt-1 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-red-500">This is not for you if…</p>
              <ul className="space-y-3">
                {[
                  "You want someone to tell you what to do",
                  "You want a quick test that gives you an answer in 3 minutes",
                  "You're not willing to spend an evening with a pen",
                  "You're already 100% sure about your decision",
                  "You want endless theory, not a practical method",
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                    <X size={14} className="text-red-400 mt-1 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Objections */}
        <section className="py-10">
          <div className="bg-muted/40 rounded-2xl p-6 md:p-8 space-y-6">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">Before you decide</p>
            <p className="text-center text-lg italic text-foreground">I know what you're thinking.</p>
            {[
              {
                q: '"I\'ve already tried everything. Nothing works."',
                a: "Most things you've tried were thinking-based. Read articles. Ask friends. Run scenarios in your head. This workbook is the opposite — it's writing-based. You sit down with a pen and you write things you've never written before. Different process. Different result.",
              },
              {
                q: '"I don\'t have time for this."',
                a: "You've spent more time thinking about this in the last month than 60 minutes. The question isn't if you have the time. The question is: are you willing to spend it on a method that ends the loop, instead of on more thinking that doesn't?",
              },
              {
                q: '"My situation is real. It\'s not just in my head."',
                a: "It is real. The workbook doesn't pretend otherwise. What it does is help you see your real situation clearly — without your fear, your guilt, or your tiredness distorting it. The situation stays the same. Your view of it changes.",
              },
            ].map((obj, i, arr) => (
              <div key={i} className={`space-y-2 ${i < arr.length - 1 ? "pb-5 border-b border-border/50" : ""}`}>
                <p className="font-bold text-foreground leading-snug">{obj.q}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{obj.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Science block */}
        <section className="py-10">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">The Science Behind</p>
            <h3 className="text-center text-2xl font-black text-foreground leading-snug">This isn't 27 random questions.</h3>
            <p className="text-center text-sm text-muted-foreground italic">We didn't invent how this works. We adapted what already does.</p>
            <div className="space-y-0 divide-y divide-border/50">
              {[
                {
                  claim: "Writing produces clarity that thinking alone cannot.",
                  citation: "Pennebaker (1997, University of Texas). Decades of research on expressive writing show that writing about emotional difficulty produces measurable improvements in decision-making and clarity — even with no feedback or reader involved.",
                },
                {
                  claim: "People commit to decisions they generate themselves — not decisions they're given.",
                  citation: "Miller & Rollnick (1983, Motivational Interviewing). The clinical foundation of how therapists help people make hard life decisions. The principle: change talk that comes from the client predicts behavior change far better than advice from the therapist.",
                },
                {
                  claim: "Couples in difficulty wait, on average, 6 years before seeking help.",
                  citation: "Doherty et al. (2021), Journal of Marital and Family Therapy. By the time most people get professional support for relationship doubt, the cost has already been paid. Self-administered structured tools fill the gap before that point.",
                },
              ].map((ref, i) => (
                <div key={i} className="py-5">
                  <p className="font-bold text-foreground text-base leading-snug mb-2">{ref.claim}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ref.citation}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm italic text-foreground/80 leading-relaxed">
              The 5-Step Decision Method is built on these three findings: write to clarify, generate your own commitment, don't wait six years.
            </p>
          </div>
        </section>

        {/* Bundle / Offer */}
        <section id="offer" className="py-10">
          <div className="rounded-3xl border-2 border-primary/30 bg-card p-6 md:p-10 shadow-xl space-y-6">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">Today's Bundle</p>
            <h3 className="text-center text-2xl font-black text-foreground leading-snug">Everything you get when you buy.</h3>

            {/* Bundle items */}
            <div className="space-y-0 divide-y divide-border/50">
              <div className="py-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Main product</p>
                  <p className="font-black text-foreground text-base">The Stay or Leave Workbook</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">25 pages. 27 questions. The 5-Step Decision Method. Read on phone or print to write by hand. Lifetime access.</p>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <p className="text-sm line-through text-muted-foreground">$19</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400">Included</p>
                </div>
              </div>
              <div className="py-5 flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Free bonus</p>
                  <p className="font-black text-foreground text-base">"What If I Regret It?" — The Decision Companion</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">A short manual to read after the workbook. It helps you tell real regret from the inevitable pain that comes with any hard choice. For the doubt that may come back at 2am, three months from now.</p>
                  <div className="max-w-[180px] pt-2">
                    <ImagePlaceholder label="Bonus cover" src="/images/workbook-bonus-cover.png" alt="What If I Regret It? — bonus cover" aspect="3/2" />
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-0.5">
                  <p className="text-sm line-through text-muted-foreground">$11</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400">Free</p>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="text-center space-y-3 pt-2 border-t-2 border-border">
              <p className="text-sm text-muted-foreground">Total value: <span className="line-through font-bold text-foreground">$30</span></p>
              <p className="text-sm text-muted-foreground">Today you pay only:</p>
              <p className="text-6xl font-black text-primary leading-none">$11</p>
              <span className="inline-block bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Save $19 today
              </span>
              <p className="text-sm text-muted-foreground italic">Less than dinner with the friend who's tired of hearing about it. More useful.</p>
            </div>

            <CTAButton isLoading={isLoading} onClick={handleCheckout} label="Get the bundle — $11" size="lg" fullWidth />
            <p className="text-center text-xs text-muted-foreground">Instant download · One-time payment · No subscription</p>

            {/* Named guarantee */}
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">🛡</span>
                <h4 className="font-black text-foreground text-base leading-snug">The "Decision or Refund" Promise</h4>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Read the workbook. Do the exercises. If you don't end up with a clear decision you feel confident about — write to us within 30 days. We'll refund you in full. We won't ask why.
              </p>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                If it doesn't help you decide, we'd rather you have your $11 back than carry doubt about a tool that should have helped.
              </p>
            </div>

            <div className="flex items-center gap-2 justify-center bg-muted/30 rounded-xl p-3">
              <Shield size={14} className="text-foreground/60 shrink-0" />
              <p className="text-xs text-muted-foreground">Secure one-time payment. Instant access. Discreet file name. We do not share your data.</p>
            </div>
          </div>
        </section>

        {/* Inline CTA before FAQ */}
        <div className="text-center py-4">
          <CTAButton isLoading={isLoading} onClick={handleCheckout} label="Decide tonight — $11" size="md" />
        </div>

        {/* FAQ */}
        <section className="py-10 space-y-3">
          <h2 className="text-xl md:text-2xl font-black text-foreground text-center">Common questions</h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <FAQRow key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-4 py-12">
          <p className="text-lg md:text-xl font-bold text-foreground">Decide tonight. $11.</p>
          <CTAButton isLoading={isLoading} onClick={handleCheckout} label="Get the workbook + bonus" size="lg" />
          <p className="text-xs text-muted-foreground">
            Workbook + "What If I Regret It?" companion · Instant download · 30-day refund
          </p>
        </section>

        <footer className="text-center text-xs text-muted-foreground/60 py-8 border-t border-border/50 space-y-2">
          <p>This is not therapy or legal advice. The choice is yours.</p>
          <p>© UnderstandYourPartner — Should I Stay or Leave My Partner?</p>
        </footer>
      </div>
    </div>
  );
}

function ImagePlaceholder({
  label,
  description,
  aspect = "4/3",
  src,
  alt,
}: {
  label: string;
  description?: string;
  aspect?: "4/3" | "2/1" | "3/4" | "3/2";
  src?: string;
  alt?: string;
}) {
  if (src) {
    return (
      <div className="rounded-2xl overflow-hidden border border-border bg-card">
        <img src={src} alt={alt ?? label} className="w-full h-auto block" />
      </div>
    );
  }
  const aspectClass = {
    "4/3": "aspect-[4/3]",
    "2/1": "aspect-[2/1]",
    "3/4": "aspect-[3/4]",
    "3/2": "aspect-[3/2]",
  }[aspect];
  return (
    <div className={`${aspectClass} w-full rounded-2xl border-2 border-dashed border-border bg-muted/40 flex flex-col items-center justify-center p-6 text-center gap-2`}>
      <ImageIcon size={28} className="text-primary/60" />
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{label}</p>
      {description && <p className="text-xs text-muted-foreground italic max-w-xs">{description}</p>}
    </div>
  );
}

function CTAButton({
  isLoading,
  onClick,
  label,
  size,
  fullWidth,
}: {
  isLoading: boolean;
  onClick: () => void;
  label: string;
  size: "md" | "lg";
  fullWidth?: boolean;
}) {
  const base = "bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 disabled:opacity-70";
  const sizing = size === "lg" ? "text-lg py-5 px-10" : "text-base py-4 px-8";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`${base} ${sizing} ${fullWidth ? "w-full" : ""}`}
    >
      {isLoading ? "Processing..." : label}
      {!isLoading && <ArrowRight size={size === "lg" ? 20 : 18} />}
    </button>
  );
}

function FAQRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-bold text-sm text-foreground">{q}</span>
        <ChevronDown
          size={18}
          className={`text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-sm text-foreground/80 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
