import { ArrowRight, Shield, Clock, MessageCircle, Calendar, Brain, TrendingUp, ShieldAlert, Activity, Heart, Compass, FileText, Play, Check } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay, FaGooglePay } from "react-icons/fa";
import { OrderBump } from "../components/OrderBump";
import { TestimonialCard } from "../components/TestimonialCard";
import { FAQAccordion } from "../components/FAQAccordion";
import { DIMENSION_LABELS, type DimensionKey, type NarcissismData, type QuickOverviewData } from "../types";

type Props = {
    session: any;
    quickOverview: QuickOverviewData | null;
    narcissismAnalysis: NarcissismData | null;
    onCheckout: (location: string) => void;
    isCheckoutLoading: boolean;
    addOrderBump: boolean;
    setAddOrderBump: (v: boolean) => void;
};

const FAQ_ITEMS = [
    { question: "Can't I figure this out alone?", answer: "You've been trying. That's why you took the test. You can't see the pattern when you're stuck inside it. This gives you the view from outside — the one thing you can't get on your own." },
    { question: "What if my partner won't read it?", answer: "Almost half the people who buy this never show it to their partner. They change how THEY act. That alone shifts things. You don't need anyone's permission." },
    { question: "What if it tells me something I don't want to hear?", answer: "Then you need to hear it. A hard truth now beats 5 more years of the same fight. You already know something is off. That's why you're here." },
    { question: "Is this like therapy?", answer: "No. A therapist takes weeks to book and costs hundreds per visit. This gives you answers now. Think of it as the homework you'd do before your first session — except most people never need the session after reading this." },
    { question: "What if I'm the problem?", answer: "That's actually good news. Because you can change YOU. Most people find both partners are part of the loop. One triggers the other. That means you can both stop it." },
    { question: "Is my info safe?", answer: "Yes. Your data is never sold. Your answers are never shared. You can delete everything from your account at any time." },
];

export function GodfatherOffer({ session, quickOverview, narcissismAnalysis, onCheckout, isCheckoutLoading, addOrderBump, setAddOrderBump }: Props) {
    const scores = session?.scores as any;
    const metrics = session?.advancedMetrics as any;
    const price = addOrderBump ? 41 : 29;

    // Pull user data for deep personalization
    const dominantLens = scores?.dominantLens as DimensionKey | undefined;
    const lensLabel = dominantLens ? (DIMENSION_LABELS[dominantLens] || dominantLens.replace(/_/g, " ")) : "your biggest issue";
    const diagnosis = quickOverview?.pulse?.primary_diagnosis || lensLabel;
    const repairScore = metrics?.repair_efficiency ?? 50;
    const sustainScore = metrics?.sustainability_forecast ?? 50;
    const burnout = metrics?.nervous_system_load ?? 50;
    const silentDivorce = metrics?.silent_divorce_risk ?? 50;
    const betrayalVuln = metrics?.betrayal_vulnerability ?? 50;
    const eroticSpiral = metrics?.erotic_death_spiral ?? 50;
    const ceoIntern = metrics?.ceo_vs_intern ?? 50;
    const malice = metrics?.internalized_malice ?? 50;
    const eroticPotential = metrics?.erotic_potential ?? 50;
    const resilience = metrics?.resilience_battery ?? 50;
    const compatibility = metrics?.compatibility_quotient ?? 50;
    const toxicity = (narcissismAnalysis?.relationship_health?.toxicity_score) ?? null;
    const biggestFear = session?.biggestFear;
    const fightFreq = session?.fightFrequency;
    const partnerStyle = session?.partnerConflictStyle;
    const repairFreq = session?.repairFrequency;
    const duration = session?.relationshipDuration;
    const attachmentStyle = scores?.attachmentStyle;
    const phase = scores?.phase;

    const partnerDesc = partnerStyle === "withdraws" ? "goes quiet" : partnerStyle === "escalates" ? "gets loud" : "reacts";

    // Find the most alarming metric
    const alarmMetrics = [
        { val: eroticSpiral, label: "intimacy erosion", desc: "the more you manage your partner, the less you want them" },
        { val: betrayalVuln, label: "outside connection risk", desc: "when needs go unmet long enough, the door opens" },
        { val: silentDivorce, label: "quiet disconnection", desc: "you stopped fighting, but you also stopped connecting" },
        { val: malice, label: "resentment buildup", desc: "you're starting to see your partner as the enemy" },
        { val: burnout, label: "emotional exhaustion", desc: "this relationship is draining you" },
    ].filter(m => m.val >= 55).sort((a, b) => b.val - a.val);
    const topAlarm = alarmMetrics[0];

    // Find one positive signal
    const positiveSignals = [
        { val: eroticPotential, desc: "the spark isn't gone — it's buried under stress" },
        { val: resilience, desc: "you have deep shared history that can survive a crisis" },
        { val: compatibility, desc: "your core values still line up" },
    ].filter(s => s.val >= 55).sort((a, b) => b.val - a.val);
    const topPositive = positiveSignals[0];

    // Session expiry
    const expiryInfo = (() => {
        if (!session?.createdAt) return null;
        const expiresAt = new Date(session.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
        const msRemaining = expiresAt - Date.now();
        const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
        const hoursRemaining = Math.floor((msRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        if (msRemaining <= 0) return { expired: true, text: "Your data is about to be deleted. Unlock now." };
        return { expired: false, text: `Your data is deleted in ${daysRemaining}d ${hoursRemaining}h` };
    })();

    return (
        <section className="py-16 px-5 md:py-24 md:px-6 bg-muted/30 border-t border-border/50">
            <div className="max-w-3xl mx-auto space-y-12">

                {/* ═══ THE INEVITABILITY BRIDGE ═══ */}
                <div className="text-center space-y-6">
                    <h2 className="text-2xl md:text-4xl font-black text-foreground">
                        You Already Know Something Is Wrong
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
                        The question isn't whether you have a problem. <strong className="text-foreground">You already know you do.</strong> The question is: do you understand it well enough to fix it?
                    </p>
                </div>

                {/* ═══ THE MIND-READ BLOCK ═══ */}
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You've been together <strong className="text-foreground">{duration || "a while"}</strong>
                        {attachmentStyle ? <> and you love in a <strong className="text-foreground">{attachmentStyle}</strong> way</> : null}
                        {phase ? <> — right now you're in <strong className="text-foreground">{phase}</strong></> : null}.
                        {partnerStyle ? <> When things go wrong, your partner {partnerDesc}.</> : null}
                        {repairFreq ? <> After a fight, you {repairFreq === "always" ? "bounce back fast" : repairFreq === "sometimes" ? "sometimes make up" : repairFreq === "rarely" ? "rarely make up" : "almost never make up"}.</> : null}
                    </p>

                    {topAlarm && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your biggest red flag right now: <strong className="text-red-600 dark:text-red-400">{topAlarm.label} at {topAlarm.val}%</strong> — {topAlarm.desc}.
                        </p>
                    )}

                    {topPositive && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            But here's what matters: <strong className="text-emerald-600 dark:text-emerald-400">{topPositive.val}%</strong> — {topPositive.desc}. <strong className="text-foreground">There's still something worth fighting for.</strong>
                        </p>
                    )}

                    {biggestFear && (
                        <p className="text-sm text-foreground font-medium leading-relaxed border-t border-border/50 pt-3">
                            You said your biggest fear is: <em>"{biggestFear}"</em>. Your full report shows you exactly why that fear exists — and what to do about it. Not with kind words. With data.
                        </p>
                    )}
                </div>

                {/* ═══ WHAT YOUR REPORT UNLOCKS — value-anchored ═══ */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-center text-foreground">What Your Full Report Gives You</h3>

                    {/* Benefit 1 */}
                    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                        <div className="flex items-start gap-4 pl-2">
                            <div className="shrink-0 p-2 bg-primary/10 text-primary rounded-lg mt-0.5"><Activity size={18} /></div>
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <p className="font-bold text-foreground">Why "{diagnosis}" keeps repeating — and how to stop it</p>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-3 hidden md:block">$99 value</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    You've tried talking. You've tried space. Nothing sticks because you're treating the symptom, not the loop.
                                    Your bounce-back speed is {repairScore}% — {repairScore < 40 ? "your fights never really end, they just go quiet" : repairScore < 65 ? "you recover, but the same fight comes back" : "you recover fast, but the pattern still pulls you in"}.
                                    Your report maps the full loop and shows you where to break it.
                                </p>
                                <p className="text-[11px] text-muted-foreground/60 mt-2 italic">A therapist charges $150/hour and takes 4-6 sessions to reach this point.</p>
                            </div>
                        </div>
                    </div>

                    {/* Benefit 2 */}
                    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
                        <div className="flex items-start gap-4 pl-2">
                            <div className="shrink-0 p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg mt-0.5"><MessageCircle size={18} /></div>
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <p className="font-bold text-foreground">5 things to say — word for word — to a partner who {partnerDesc}</p>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-3 hidden md:block">$49 value</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    You got 1 free script above. Your report has 4 more.
                                    {partnerStyle === "withdraws"
                                        ? " When your partner shuts down, chasing them makes it worse. These scripts remove the threat so they come back on their own."
                                        : partnerStyle === "escalates"
                                        ? " When your partner gets loud, matching their energy pours gas on the fire. These scripts calm things down without giving in."
                                        : " Each script is matched to how your partner handles hard moments. Exact phrases. The right tone. What to do if it doesn't land."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefit 3 */}
                    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                        <div className="flex items-start gap-4 pl-2">
                            <div className="shrink-0 p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg mt-0.5"><TrendingUp size={18} /></div>
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <p className="font-bold text-foreground">Your 5-year forecast — and whether you still have time</p>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-3 hidden md:block">$49 value</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Your long-term outlook is {sustainScore}%{sustainScore < 40 ? " — in the danger zone" : sustainScore < 60 ? " — and dropping" : ""}.
                                    {silentDivorce > 60
                                        ? ` Your "drifting apart" score is ${silentDivorce}%. You're not fighting — but you're not connecting either. That quiet fade is harder to fix than any argument.`
                                        : betrayalVuln > 60
                                        ? ` Your risk of looking outside the relationship is ${betrayalVuln}%. When someone's needs go unmet long enough, the door opens — not because anyone is bad, but because the pain needs somewhere to go.`
                                        : " Your report shows what happens at 6 months, 3 years, and 5 years if nothing changes. And where you still have time to turn things around."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefit 4 */}
                    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                        <div className="flex items-start gap-4 pl-2">
                            <div className="shrink-0 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg mt-0.5"><Calendar size={18} /></div>
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <p className="font-bold text-foreground">A 30-day plan you can start tomorrow</p>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-3 hidden md:block">$79 value</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Week by week. Daily actions that take less than 10 minutes. A way to track whether it's working.
                                    {ceoIntern > 60
                                        ? ` One of you is doing way more than the other (${ceoIntern}%). Week 1 starts by fixing that — nothing else gets better until this does.`
                                        : eroticSpiral > 60
                                        ? ` Your closeness is fading (${eroticSpiral}%). The plan brings back wanting each other — before the roommate feeling sticks.`
                                        : fightFreq === "daily" ? " Built for couples who fight every day."
                                        : fightFreq === "weekly" ? " Built for couples who fight every week."
                                        : ""
                                    }
                                    {eroticPotential > 60 ? ` Good news: the spark isn't dead (${eroticPotential}%). It's just buried under stress. The plan helps you find it again.` : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ "THIS IS ABOUT YOU" HAMMER ═══ */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-3">
                    <p className="text-base md:text-lg font-black text-foreground">
                        This report is not a template. It's not general advice.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                        Every page is written about <strong className="text-foreground">your relationship</strong>, using <strong className="text-foreground">your answers</strong>, for <strong className="text-foreground">your partner's behavior</strong>.
                        Nobody else will ever get the same report you get.
                    </p>
                    <p className="text-xs text-muted-foreground/70 max-w-md mx-auto">
                        Built on 40+ years of relationship science — Gottman Method, attachment theory, and behavioral psychology.
                    </p>
                </div>

                {/* ═══ SOCIAL PROOF — early testimonial ═══ */}
                <TestimonialCard
                    text="I bought this at 1am after another fight about nothing. I didn't even want to read it. But the first page described our exact fight. Like someone had been standing in our kitchen. I cried for 20 minutes. Then I read the whole thing. We're not fixed. But last week we talked — really talked — for the first time in months."
                    author="Sarah M."
                />

                {/* ═══ RATIONALE — why launch price ═══ */}
                <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-2">
                    <p className="text-sm font-bold text-foreground">Why is this only ${import.meta.env.REACT_APP_REPORT_PRICE || "29"}?</p>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                        We just launched. We want thousands of people to try this and tell their friends. So we made the price as low as we could. The regular price will be $49. Right now you get it for less while we grow.
                    </p>
                </div>

                {/* ═══ PREMIUM SUMMARY — above first CTA ═══ */}
                <p className="text-center text-sm font-bold text-foreground">
                    Includes 5 bonus guides (<span className="text-red-500 line-through">$194</span> <span className="text-emerald-600">free</span>) — yours the moment you unlock.
                </p>

                {/* ═══ PRIMARY OFFER CARD (early placement for ready buyers) ═══ */}
                <div id="offer" className="bg-card border-2 border-primary/30 rounded-3xl p-6 md:p-10 space-y-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary to-purple-500" />

                    {/* Ready callout */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 p-3 text-center rounded-xl text-sm font-medium text-emerald-800 dark:text-emerald-300">
                        <strong>Your report is ready.</strong> Built from your {Object.keys(session?.answers || {}).length || 30} answers. Waiting for you.
                    </div>

                    {/* Session expiry */}
                    {expiryInfo && (
                        <div className={`text-center text-xs font-bold px-3 py-2 rounded-lg ${expiryInfo.expired ? "text-red-600 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" : "text-orange-700 bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400"}`}>
                            <Clock size={12} className="inline mr-1 -mt-0.5" />
                            {expiryInfo.text}
                        </div>
                    )}

                    {/* Price */}
                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">One payment. Nothing else.</p>
                        <p className="text-lg text-red-500 line-through font-bold">$49</p>
                        <p className="text-6xl font-black text-primary">${import.meta.env.REACT_APP_REPORT_PRICE || "29"}</p>
                        <span className="inline-block mt-1 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">Launch Price</span>
                    </div>

                    {/* Guarantee */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 flex items-start gap-4">
                        <div className="shrink-0 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <Shield className="text-yellow-600 dark:text-yellow-400 w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground mb-1">The "Finally Someone Gets It" Guarantee</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Read the first 5 pages. If you don't catch yourself thinking <strong className="text-foreground">"that's EXACTLY what happens"</strong> at least 3 times — you get every penny back. No forms. No questions. 90 days.
                            </p>
                        </div>
                    </div>

                    {/* Order bump */}
                    <OrderBump checked={addOrderBump} onChange={setAddOrderBump} />

                    {/* CTA */}
                    <div className="flex flex-col items-center">
                        <button
                            onClick={() => onCheckout("offer_cta")}
                            disabled={isCheckoutLoading}
                            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg md:text-xl font-bold py-5 px-10 md:px-12 rounded-full shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {isCheckoutLoading ? "Processing..." : `Get My Full Report — $${price}`}
                            {!isCheckoutLoading && <ArrowRight size={22} />}
                        </button>

                        <div className="flex items-center justify-center gap-4 mt-6 text-muted-foreground">
                            <FaCcVisa className="h-7 w-auto opacity-70" />
                            <FaCcMastercard className="h-7 w-auto opacity-70" />
                            <FaCcPaypal className="h-7 w-auto opacity-70" />
                            <FaApplePay className="h-7 w-auto opacity-70" />
                            <FaGooglePay className="h-7 w-auto opacity-70" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">Secure one-time payment &bull; Instant access</p>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                    SUPPORTING EVIDENCE (for users who need more convincing)
                    ═══════════════════════════════════════════════════════ */}

                <p className="text-center text-sm text-muted-foreground">Still not sure? Keep scrolling. Here's more about what you get.</p>

                {/* ═══ VIDEO SHOWCASE ═══ */}
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <Play size={14} className="text-primary" /> 60-Second Look Inside
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-foreground">See What Your Report Looks Like</h3>
                        <p className="text-sm text-muted-foreground">This is a sample. Yours is built from your {Object.keys(session?.answers || {}).length || 30} answers.</p>
                    </div>
                    <div className="relative max-w-sm mx-auto w-full">
                        <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-border bg-foreground">
                            <video
                                src="/demo/screen-capture.webm"
                                className="w-full"
                                controls
                                playsInline
                                muted
                                preload="metadata"
                            />
                        </div>
                    </div>
                </div>

                {/* ═══ BONUS GUIDES — full detail with bullets ═══ */}
                <div className="space-y-6">
                    <div className="text-center space-y-1">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Included free — $194 value</span>
                        <h3 className="text-xl font-black text-foreground">Your Emergency Toolkit (5 Guides)</h3>
                        <p className="text-sm text-muted-foreground">PDF guides you download right away. Keep them forever.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                icon: <FileText size={18} />, title: "Who Does What (Fairly)", color: "bg-primary",
                                benefit: "Stop being the one who does everything",
                                items: ["A simple worksheet to split tasks", "What to say so it doesn't start a fight", "How to stop doing your partner's job"],
                                value: "$47", metric: ceoIntern, threshold: 55,
                            },
                            {
                                icon: <Heart size={18} />, title: "Bring Back the Spark", color: "bg-pink-500",
                                benefit: "Want each other again — without pressure",
                                items: ["An 8-week step-by-step plan", "Ways to touch that don't feel awkward", "7 things killing your desire (stop them)"],
                                value: "$39", metric: eroticSpiral, threshold: 50,
                            },
                            {
                                icon: <ShieldAlert size={18} />, title: "Is This Person Safe?", color: "bg-orange-500",
                                benefit: "Know if it's hard — or dangerous",
                                items: ["21 red flags to check", "What to say when they twist your words", "How to leave safely if you need to"],
                                value: "$47", metric: toxicity ?? 0, threshold: 45,
                            },
                            {
                                icon: <MessageCircle size={18} />, title: "Are They Cheating?", color: "bg-blue-500",
                                benefit: "19 signs — early, middle, and late",
                                items: ["What to look for at each stage", "How to protect your relationship", "How to bring it up without accusing"],
                                value: "$47", metric: betrayalVuln, threshold: 50,
                            },
                            {
                                icon: <Compass size={18} />, title: "Should You Stay or Go?", color: "bg-muted-foreground",
                                benefit: "The hardest question. Answered clearly.",
                                items: ["A 12-point checklist (no regrets)", "Score your answer to see where you land", "What to say once you've decided"],
                                value: "$14", metric: sustainScore < 40 ? 100 : 0, threshold: 50,
                            },
                        ].map((g, i) => {
                            const isCritical = g.metric >= g.threshold;
                            return (
                                <div key={i} className={`bg-card border rounded-2xl overflow-hidden flex flex-col ${isCritical ? "border-primary/40 ring-1 ring-primary/10" : "border-border"}`}>
                                    <div className={`h-1 ${g.color}`} />
                                    <div className="p-5 flex items-start gap-3">
                                        <div className="bg-primary/10 text-primary p-2 rounded-xl shrink-0">{g.icon}</div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm leading-tight">{g.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{g.benefit}</p>
                                        </div>
                                    </div>
                                    <div className="px-5 pb-3 flex-1">
                                        <ul className="space-y-1">
                                            {g.items.map((item, j) => (
                                                <li key={j} className="flex gap-2 text-xs text-muted-foreground">
                                                    <Check size={12} className="text-primary shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t border-border/50 mt-auto">
                                        {isCritical ? (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">You need this</span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Included</span>
                                        )}
                                        <div className="text-right">
                                            <span className="text-xs text-red-500 line-through mr-1.5">{g.value}</span>
                                            <span className="text-xs font-bold text-emerald-600">Free</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total value bar */}
                    <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                        <p className="text-sm font-bold text-foreground">All 5 guides — yours free with the report</p>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-lg text-red-500 line-through font-bold">$194</span>
                            <span className="text-lg font-black text-emerald-600">$0</span>
                        </div>
                    </div>
                </div>

                {/* ═══ COMPARISON TABLE — why $29 is absurd ═══ */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-center text-foreground">What You'd Pay Anywhere Else</h3>
                    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                                    <th className="p-3 font-bold">Option</th>
                                    <th className="p-3 font-bold">Cost</th>
                                    <th className="p-3 font-bold">Wait Time</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-border">
                                <tr><td className="p-3 text-foreground">Couples therapy</td><td className="p-3 text-muted-foreground font-bold">$900–$1,500</td><td className="p-3 text-muted-foreground">6–12 weeks</td></tr>
                                <tr><td className="p-3 text-foreground">Self-help books</td><td className="p-3 text-muted-foreground font-bold">$100–$160</td><td className="p-3 text-muted-foreground">20–40 hours reading</td></tr>
                                <tr><td className="p-3 text-foreground">Online course</td><td className="p-3 text-muted-foreground font-bold">$97–$297</td><td className="p-3 text-muted-foreground">8–12 hours of video</td></tr>
                                <tr className="bg-primary/5 border-l-4 border-l-primary">
                                    <td className="p-3 font-black text-primary">Your report</td>
                                    <td className="p-3 font-black text-primary text-xl">$29</td>
                                    <td className="p-3 font-bold text-foreground">Right now</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ═══ SOCIAL PROOF ═══ */}
                <div className="space-y-4">
                    <TestimonialCard
                        text="My buddy sent me this as a joke. I took the quiz thinking it was gonna be one of those 'learn to talk nicer' things. It told me something about myself I never saw before. I don't want to say what because it's personal. But my wife noticed the change in one week."
                        author="Mike R."
                    />
                    <TestimonialCard
                        text="I was two weeks from calling a lawyer. Not joking. $29 felt like nothing to lose. The report said things our therapist hasn't figured out in 8 months. We brought it to our next session and she asked where we got it."
                        author="Ana, 36"
                    />
                </div>

                {/* ═══ SECOND CTA (for users who scrolled through all evidence) ═══ */}
                <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 text-center space-y-5 shadow-lg">
                    <p className="text-lg font-black text-foreground">Ready?</p>
                    <p className="text-sm text-red-500 line-through font-bold">$49</p>
                    <p className="text-3xl font-black text-primary">${import.meta.env.REACT_APP_REPORT_PRICE || "29"}</p>
                    <button
                        onClick={() => onCheckout("bottom_cta")}
                        disabled={isCheckoutLoading}
                        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold py-5 px-10 rounded-full shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-70"
                    >
                        {isCheckoutLoading ? "Processing..." : `Get My Full Report — $${price}`}
                        {!isCheckoutLoading && <ArrowRight size={22} />}
                    </button>
                    <p className="text-xs text-muted-foreground">
                        Launch price — it won't stay ${import.meta.env.REACT_APP_REPORT_PRICE || "29"} for long.
                    </p>
                </div>

                {/* FAQ */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-center text-foreground">Common Questions</h3>
                    <FAQAccordion items={FAQ_ITEMS} />
                </div>

                {/* Footer */}
                <footer className="text-center text-xs text-muted-foreground/60 space-y-3 pt-8 border-t border-border/50">
                    <p>&copy; 2026 UnderstandYourPartner.com &bull; All Rights Reserved</p>
                    <div className="flex justify-center gap-4">
                        <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                        <span>&bull;</span>
                        <a href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</a>
                    </div>
                    <p className="max-w-xl mx-auto text-muted-foreground/40 mt-4">
                        This is not therapy. It's a tool to help you understand your relationship better. If you are in danger, please call your local emergency number.
                    </p>
                </footer>
            </div>
        </section>
    );
}
