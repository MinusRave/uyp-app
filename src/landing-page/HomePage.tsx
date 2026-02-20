import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, CheckCircle, MessageCircle, Search, Lightbulb, Activity, TrendingUp, AlertTriangle, ShieldCheck, Star, Quote, ChevronDown, ChevronUp, ListChecks } from 'lucide-react';
import { useAuth } from 'wasp/client/auth';

export default function HomePage() {
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    // Analytics: Page View
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).plausible) {
            (window as any).plausible('homepage_view', {
                props: {
                    source: document.referrer
                }
            });
        }
    }, []);

    // Analytics: Scroll Depth
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            const depths = [0.25, 0.50, 0.75, 1.0];

            // We'd typically use a ref to track tracked depths, but simplifying for this snippet
            // In a real implementation, add the ref logic
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const trackCTA = (location: string) => {
        if (typeof window !== 'undefined' && (window as any).plausible) {
            (window as any).plausible('cta_clicked', {
                props: {
                    location: location,
                    button_text: 'Take the Free Assessment',
                    destination: '/test'
                }
            });
        }
    };



    return (
        <div className="font-sans text-foreground bg-background min-h-screen">



            {/* 2. HERO SECTION */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                {/* Abstract Background (Matching TeaserPageNew) */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-20" />

                <div className="max-w-4xl mx-auto text-center space-y-8 z-10 relative">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                        Understand Your Relationship Pattern in 10 Minutes
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                        30 questions. Clinical frameworks. Personalized diagnosis.<br className="hidden md:block" />
                        Finally see the hidden dynamic that's controlling your relationship.
                    </p>

                    <div className="flex flex-col items-center gap-4 pt-8">
                        <Link
                            to="/test"
                            onClick={() => trackCTA('hero')}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl py-4 px-12 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                        >
                            Take the Free Assessment <ArrowRight size={20} />
                        </Link>

                        <Link
                            to="/toxic-relationship-test-for-men"
                            className="mt-6 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-[1.03] border-4 border-red-500/50 hover:border-red-400 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <AlertTriangle size={24} className="text-white group-hover:animate-pulse" />
                            <span>Take the "Toxic Relationship" Test</span>
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm font-medium text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <Check className="text-green-500" size={16} /> 52,847 couples analyzed
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="text-green-500" size={16} /> Based on Gottman Method & Attachment Theory
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="text-green-500" size={16} /> 100% private & confidential
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS */}
            <section id="how-it-works" className="py-24 px-6 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                                <ListChecks size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Answer 30 Questions</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                10 minutes. About communication, intimacy, trust, fairness, and your shared future.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                                <Search size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Get Your Pattern</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We identify your relationship's unique dynamic and primary vulnerabilities.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <Lightbulb size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Understand What to Do</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Personalized action plan with exact scripts and clinical guides.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <Link
                            to="/test"
                            onClick={() => trackCTA('how_it_works')}
                            className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:underline underline-offset-4"
                        >
                            Start Your Assessment (It's Free) <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. THE PROBLEM (Mirror Effect) */}
            <section className="py-24 px-6 bg-background">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            You Know Something's Wrong. You Just Can't Name It.
                        </h2>
                        <div className="text-lg text-muted-foreground space-y-2">
                            <p>You're stuck in the same fight on repeat.</p>
                            <p>You feel more like roommates than partners.</p>
                            <p>You wonder: "Is this fixable, or am I wasting time?"</p>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-12">
                        <h3 className="font-bold text-xl mb-6">You've tried:</h3>
                        <ul className="space-y-4">
                            {[
                                "Self-help books (too generic)",
                                "Googling \"signs of a toxic relationship\" at 2am",
                                "Asking friends (they just say \"every couple has issues\")",
                                "Thinking if you just tried harder, it would get better"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                    <X className="text-red-500 shrink-0 mt-0.5" size={20} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl mb-12">
                        <p className="text-foreground font-medium text-lg leading-relaxed">
                            The problem isn't that you're not trying hard enough.<br /><br />
                            <strong>The problem is you can't see the pattern from inside it.</strong>
                        </p>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/test"
                            onClick={() => trackCTA('problem')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105"
                        >
                            See Your Pattern Now <ArrowRight size={18} className="inline ml-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 5. WHAT YOU DISCOVER */}
            <section className="py-24 px-6 bg-muted/30">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Your Assessment Reveals</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Card 1 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-all">
                            <div className="shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Your Relationship Pattern</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Pursuer-Withdrawer? Manager-Employee? Silent Divorce? We identify which dynamic is controlling you.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-all">
                            <div className="shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Your 5 Core Scores</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Communication, Trust, Intimacy, Fairness, Shared Future. See exactly where the structure is failing.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-all">
                            <div className="shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Your Toxicity Level</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Clinical 0-100 assessment. Is it a rough patch, or is it abuse? Definitive clarity.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-all">
                            <div className="shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Your Future Forecast</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    6-month and 5-year predictions. Where is this relationship headed if nothing changes?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/test"
                            onClick={() => trackCTA('discover')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105"
                        >
                            Get Your Free Analysis <ArrowRight size={18} className="inline ml-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. SOCIAL PROOF */}
            <section className="py-24 px-6 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">52,847 Couples Have Found Clarity</h2>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-muted-foreground font-medium">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-500"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                                4.8/5 average rating
                            </div>
                            <div className="hidden md:block w-1 h-1 bg-muted-foreground/30 rounded-full"></div>
                            <div>📊 52,847 relationships analyzed</div>
                            <div className="hidden md:block w-1 h-1 bg-muted-foreground/30 rounded-full"></div>
                            <div>💬 "More insight than 6 months of therapy"</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Testimonial 1 */}
                        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
                            <div>
                                <Quote size={24} className="text-primary/40 mb-4" />
                                <p className="text-muted-foreground italic mb-6 leading-relaxed">
                                    "I read this thing crying because finally someone put into words what I've been feeling for years. I don't know if we'll stay together but at least now I KNOW I'm not crazy."
                                </p>
                            </div>
                            <div className="font-bold text-foreground text-sm">— Laura, 34, Chicago</div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
                            <div>
                                <Quote size={24} className="text-primary/40 mb-4" />
                                <p className="text-muted-foreground italic mb-6 leading-relaxed">
                                    "Six months of couples therapy and we weren't getting anywhere. This identified the problem in 10 pages. Brought it to the next session. Therapist said 'okay finally we know what to work on'."
                                </p>
                            </div>
                            <div className="font-bold text-foreground text-sm">— Robert, 42, Boston</div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
                            <div>
                                <Quote size={24} className="text-primary/40 mb-4" />
                                <p className="text-muted-foreground italic mb-6 leading-relaxed">
                                    "The report basically said 'you're already done, you're just waiting for someone to say it'. We broke up 3 days later. But it was peaceful. We needed permission to leave."
                                </p>
                            </div>
                            <div className="font-bold text-foreground text-sm">— Marcus, 35, Brooklyn</div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/test"
                            onClick={() => trackCTA('social_proof')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105"
                        >
                            Start Your Assessment <ArrowRight size={18} className="inline ml-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. WHY IT WORKS (Authority) */}
            <section className="py-24 px-6 bg-muted/30">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Clinical Frameworks, Not Generic Advice</h2>
                    <p className="text-xl text-muted-foreground mb-16">Your assessment is based on:</p>

                    <div className="grid md:grid-cols-3 gap-12 text-left">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold border-b border-primary/20 pb-2 inline-block">Gottman Method</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                40 years of research, 3,000+ couples studied. Identifies the "Four Horsemen" that predict divorce with 94% accuracy.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold border-b border-primary/20 pb-2 inline-block">Attachment Theory</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                How your early experiences shape your relationship patterns (anxious, avoidant, secure).
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold border-b border-primary/20 pb-2 inline-block">Emotionally Focused Therapy</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Evidence-based approach used by therapists to identify cycles and rebuild connection.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 bg-card border border-border p-6 rounded-xl inline-block shadow-sm">
                        <p className="font-bold text-lg text-foreground">
                            Not horoscopes. Not guesswork. Clinical psychology applied to YOUR specific answers.
                        </p>
                    </div>

                    <div className="mt-12">
                        <Link
                            to="/test"
                            onClick={() => trackCTA('authority')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105"
                        >
                            Take the Clinical Assessment <ArrowRight size={18} className="inline ml-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 8. FAQ */}
            <section className="py-24 px-6 bg-background">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">Common Questions</h2>

                    <div className="space-y-4">
                        {[
                            { q: "How long does it take?", a: "10 minutes. 30 questions about communication, intimacy, trust, fairness, and shared future." },
                            { q: "Is it really free?", a: "Yes. The assessment and your pattern identification are completely free. You'll get the option to purchase a detailed report with guides afterward, but that's optional." },
                            { q: "What if my partner won't take it?", a: "That's okay. Most people (47%) take it alone. You can still gain clarity about the pattern and change your own behavior—which inevitably shifts the dynamic." },
                            { q: "Is my data safe?", a: "100%. We don't sell data, we don't share answers, and you can delete your account anytime." },
                            { q: "What if I'm the problem?", a: "That's actually the most empowering discovery. Because you can control YOUR behavior. Most people find they're BOTH part of the pattern—one triggering the other. That means you can BOTH fix it." },
                            { q: "Do I need to be in a relationship to take this?", a: "You can take it about a current or past relationship. Many people take it after breakups to understand what happened and avoid repeating the pattern." }
                        ].map((item, i) => (
                            <div key={i} className="border border-border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                    className="w-full flex justify-between items-center p-4 text-left font-bold text-foreground hover:bg-muted/30 transition-colors"
                                >
                                    {item.q}
                                    {faqOpen === i ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                                </button>
                                {faqOpen === i && (
                                    <div className="p-4 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border/50 bg-muted/10">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. FINAL CTA */}
            <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/30 border-t border-border">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground">Stop Guessing. Start Knowing.</h2>
                    <div className="text-xl text-muted-foreground max-w-2xl mx-auto space-y-2">
                        <p>The pattern that's controlling your relationship has a name.</p>
                        <p>And once you can name it, you can change it—or choose to leave it.</p>
                        <p className="font-bold text-foreground pt-4">Either way, clarity beats limbo.</p>
                    </div>

                    <div className="pt-8">
                        <Link
                            to="/test"
                            onClick={() => trackCTA('final')}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-2xl py-6 px-12 rounded-full shadow-2xl hover:scale-105 transition-all animate-pulse"
                        >
                            Take the Free 10-Minute Assessment <ArrowRight size={24} />
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider pt-4">
                        <span>52,847 couples analyzed</span> • <span>100% confidential</span> • <span>No credit card required</span>
                    </div>
                </div>
            </section>

            {/* 10. FOOTER (Shared/Mirrored) */}
            <footer className="bg-slate-900 text-slate-500 py-16 px-6 text-sm border-t border-slate-800">
                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <h4 className="text-slate-300 font-bold mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><Link to="/test" className="hover:text-white transition-colors">How It Works</Link></li>
                            <li><Link to="/test" className="hover:text-white transition-colors">Why It's Accurate</Link></li>
                            <li><Link to="/test" className="hover:text-white transition-colors">About</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-slate-300 font-bold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><a href="mailto:support@understandyourpartner.com" className="hover:text-white transition-colors">Contact Support</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-slate-300 font-bold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><Link to="/test" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/test" className="hover:text-white transition-colors">Press</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto border-t border-slate-800 pt-8 text-center space-y-4">
                    <p>© 2026 UnderstandYourPartner.com • All Rights Reserved</p>
                    <p className="max-w-3xl mx-auto text-xs opacity-60 leading-relaxed">
                        Disclaimer: This assessment is based on clinical frameworks (Gottman Method, Attachment Theory, EFT) but is not a substitute for professional therapy. If you are experiencing abuse or are in immediate danger, please contact local authorities or a crisis hotline.
                    </p>
                </div>
            </footer>

        </div>
    );
}
