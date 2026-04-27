import { Link } from "react-router";
import { ArrowRight, Heart, Compass } from "lucide-react";

// Homepage that promotes both active tests:
// - Stay or Leave Test (primary, hero card)
// - Understand Your Partner (secondary, smaller card)
//
// Cold Meta traffic does NOT land here — Meta ads point straight to /stay-or-leave.
// This page exists for organic / direct / link-share traffic.

export default function DualTestHomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-24 space-y-14">

        {/* Hero */}
        <header className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            UnderstandYourPartner.com
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
            Two simple tests.
            <br />
            One real answer.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Pick the one that fits where you are right now.
          </p>
        </header>

        {/* Primary card — Stay or Leave Test */}
        <Link
          to="/stay-or-leave"
          className="block rounded-3xl border-2 border-primary bg-card hover:bg-primary/5 transition-all p-8 md:p-12 shadow-xl group"
        >
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-2xl shrink-0">
              <Compass size={28} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                  For people thinking of leaving
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                  Stay or Leave Test
                </h2>
              </div>
              <p className="text-base text-foreground/80 leading-relaxed">
                A simple but serious test that helps you decide if your relationship is worth saving — or if it is time to leave.
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>30 questions. 10 minutes. Free to take.</li>
                <li>6 honest scores. One clear verdict.</li>
                <li>Worth Saving. High Risk. Time to Leave.</li>
              </ul>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-primary pt-2 group-hover:gap-3 transition-all">
                Take the test
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-muted-foreground/60">
            or
          </span>
        </div>

        {/* Secondary card — Understand Your Partner */}
        <Link
          to="/test"
          className="block rounded-2xl border border-border bg-card hover:bg-muted/40 transition-all p-6 md:p-8 group"
        >
          <div className="flex items-start gap-4">
            <div className="bg-muted text-muted-foreground p-2.5 rounded-xl shrink-0">
              <Heart size={22} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  For people who want to understand
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                  Understand Your Partner
                </h2>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                A deeper test that names your relationship pattern and gives you scripts for the fights you actually have.
              </p>
              <p className="text-xs text-muted-foreground">
                30 questions. 10 minutes. For couples who want to fix things, not leave.
              </p>
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground pt-1 group-hover:gap-2.5 transition-all">
                Take this test instead
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </Link>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground/60 pt-8 border-t border-border/50 space-y-2">
          <p>&copy; UnderstandYourPartner.com</p>
          <div className="flex justify-center gap-4">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p className="max-w-md mx-auto pt-2">
            Neither test is therapy or legal advice. They are tools to help you think clearly. The choice is always yours.
          </p>
        </footer>
      </div>
    </div>
  );
}
