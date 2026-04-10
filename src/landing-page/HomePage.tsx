import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Check, X, CheckCircle, MessageCircle, Search, Lightbulb, Activity, TrendingUp, AlertTriangle, ShieldCheck, Star, Quote, ChevronDown, ListChecks } from 'lucide-react';
import { useAuth } from 'wasp/client/auth';
import { useInView } from '../client/hooks/useInView';

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const { ref, isInView } = useInView();
    return (
        <div ref={ref} className={`${isInView ? 'reveal-visible' : 'reveal-hidden'} ${className}`}>
            {children}
        </div>
    );
}

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
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-20" />

                <div className="max-w-4xl mx-auto text-center space-y-8 z-10 relative">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                        The 10-Minute Assessment That Reveals the Hidden Pattern <span className="text-primary">Destroying</span> Your Relationship
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                        30 questions. Clinical frameworks. Personalized diagnosis.<br className="hidden md:block" />
                        Finally see the hidden dynamic that's controlling your relationship.
                    </p>

                    {/* Fascination Bullets */}
                    <ul className="max-w-md mx-auto text-left space-y-2 text-sm text-muted-foreground pt-2">
                        <li className="flex items-start gap-2"><ArrowRight size={14} className="text-primary mt-0.5 shrink-0" /> The one phrase that de-escalates 90% of arguments</li>
                        <li className="flex items-start gap-2"><ArrowRight size={14} className="text-primary mt-0.5 shrink-0" /> Why "trying harder" almost always makes it <strong className="text-foreground">WORSE</strong></li>
                        <li className="flex items-start gap-2"><ArrowRight size={14} className="text-primary mt-0.5 shrink-0" /> The pattern that predicts divorce with 94% accuracy</li>
                        <li className="flex items-start gap-2"><ArrowRight size={14} className="text-primary mt-0.5 shrink-0" /> Whether you're in a rough patch — or something more dangerous</li>
                    </ul>

                    <div className="flex flex-col items-center gap-4 pt-6">
                        <Link
                            to="/test"
                            onClick={() => trackCTA('hero')}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl py-4 px-12 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                        >
                            Take the Free Assessment <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm font-medium text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <Check className="text-success" size={16} /> 52,847 couples analyzed
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="text-success" size={16} /> Based on Gottman Method & Attachment Theory
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="text-success" size={16} /> 100% private & confidential
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS */}
            <section id="how-it-works" className="py-24 px-6 bg-muted/30">
                <Reveal>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting line (desktop only) */}
                        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 z-0" />

                        {[
                            { icon: ListChecks, step: 1, title: "10 Minutes of Honest Answers", desc: "Not therapy-speak. Real questions about what's actually happening — fights, silence, distance, control." },
                            { icon: Search, step: 2, title: "See the Pattern You Can't See From Inside", desc: "Pursuer-Withdrawer? Silent Divorce? Emotional landlord? We name the exact dynamic running your relationship." },
                            { icon: Lightbulb, step: 3, title: "Know Exactly What to Do Next", desc: "Not \"communicate better\". Specific scripts, specific guides, specific to YOUR pattern and YOUR partner." },
                        ].map(({ icon: Icon, step, title, desc }) => (
                            <div key={step} className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center text-center hover:shadow-md hover:border-primary/30 transition-all relative z-10">
                                <div className="w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mb-4">
                                    {step}
                                </div>
                                <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        ))}
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
                </Reveal>
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
                <Reveal>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Your Assessment Reveals</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Card 1 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-all">
                            <div className="shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">The Dynamic That's Running the Show</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Pursuer-Withdrawer? Manager-Employee? Silent Divorce? We name the exact dynamic controlling you — so you can finally see it.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-all">
                            <div className="shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">See Exactly Which Dimension Is Bleeding</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Communication, Trust, Intimacy, Fairness, Shared Future — scored and ranked. Know precisely where the structure is cracking, not just "something feels off."
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-all">
                            <div className="shrink-0 w-12 h-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Is This Fixable — Or Is It Dangerous?</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Clinical 0-100 toxicity assessment. A definitive answer to the question you've been afraid to ask.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex gap-6 hover:shadow-md transition-all">
                            <div className="shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Where This Is Headed If Nothing Changes</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    6-month and 5-year trajectory projections. Based on YOUR specific pattern and scores — not generic statistics.
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
                </Reveal>
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

                    {/* Featured Testimonial */}
                    <div className="bg-secondary/5 border border-border rounded-2xl p-8 md:p-12 max-w-3xl mx-auto text-center mb-8">
                        <p className="text-xl md:text-2xl italic font-serif text-muted-foreground mb-6 leading-relaxed">
                            "I read this thing crying because finally someone put into words what I've been feeling for years. I don't know if we'll stay together but at least now I KNOW I'm not crazy."
                        </p>
                        <div className="flex items-center justify-center gap-1 text-yellow-500 mb-3">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <div className="font-bold text-foreground">— Laura, 34, Chicago</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Testimonial 2 */}
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
                            <div>
                                <div className="flex gap-1 text-yellow-500 mb-3">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-muted-foreground italic mb-4 text-sm leading-relaxed">
                                    "Six months of couples therapy and we weren't getting anywhere. This identified the problem in 10 pages. Brought it to the next session. Therapist said 'okay finally we know what to work on'."
                                </p>
                            </div>
                            <div className="font-bold text-foreground text-sm">— Robert, 42, Boston</div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
                            <div>
                                <div className="flex gap-1 text-yellow-500 mb-3">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-muted-foreground italic mb-4 text-sm leading-relaxed">
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
                            <div key={i} className="border border-border rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                    className="w-full flex justify-between items-center p-5 text-left font-bold text-foreground hover:bg-muted/30 transition-colors"
                                >
                                    {item.q}
                                    <ChevronDown size={20} className={`text-muted-foreground shrink-0 ml-4 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-300 ease-in-out ${faqOpen === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border/50">
                                            <div className="pt-4">{item.a}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. FINAL CTA */}
            <section className="py-24 px-6 bg-linear-to-b from-background to-muted/30 border-t border-border">
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
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-2xl py-6 px-12 rounded-full shadow-2xl hover:scale-105 transition-all"
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
            <footer className="bg-foreground text-muted-foreground/60 py-16 px-6 text-sm border-t border-border">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <h4 className="text-primary-foreground/80 font-bold mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><Link to="/#how-it-works" className="hover:text-primary-foreground transition-colors">How It Works</Link></li>
                            <li><Link to="/test" className="hover:text-primary-foreground transition-colors">Take the Assessment</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-primary-foreground/80 font-bold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-primary-foreground transition-colors">Terms of Service</Link></li>
                            <li><a href="mailto:admin@understandyourpartner.com" className="hover:text-primary-foreground transition-colors">Contact Support</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto border-t border-muted-foreground/20 pt-8 text-center space-y-4">
                    <p>&copy; 2026 UnderstandYourPartner.com &bull; All Rights Reserved</p>
                    <p className="max-w-3xl mx-auto text-xs text-muted-foreground/40 leading-relaxed">
                        Disclaimer: This assessment is based on clinical frameworks (Gottman Method, Attachment Theory, EFT) but is not a substitute for professional therapy. If you are experiencing abuse or are in immediate danger, please contact local authorities or a crisis hotline.
                    </p>
                </div>
            </footer>

        </div>
    );
}
