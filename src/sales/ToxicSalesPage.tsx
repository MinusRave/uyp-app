
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "wasp/client/operations";
import { getTestSession } from "wasp/client/operations";
import { createCheckoutSession } from "wasp/client/operations";
import {
    ArrowRight,
    CheckCircle,
    Shield,
    AlertTriangle,
    Lock,
    FileText,
    ChevronDown,
    ChevronUp,
    Clock,
    Star,
    HelpCircle,
    X
} from "lucide-react";
import { cn } from "../client/utils";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay, FaGooglePay } from "react-icons/fa";

export default function ToxicSalesPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("sessionId");

    // Fetch Session Data
    const { data: session, isLoading, error } = useQuery(getTestSession, { sessionId: sessionId || "" }, { enabled: !!sessionId });

    const [addOrderBump, setAddOrderBump] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // FAQ State
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    if (isLoading) return <div className="p-12 text-center text-slate-500">Loading your analysis...</div>;
    if (error || !session) return <div className="p-12 text-center text-red-500">Error loading session.</div>;

    const scores = (session.scores as any) || {};
    const finalScore = scores.total || 0;
    const diagnosis = scores.diagnosis || "Toxic Dynamic";
    const riskLevel = scores.riskLevel || "Medium";

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const result = await createCheckoutSession({
                sessionId: sessionId!,
                addWorkbook: addOrderBump
            });
            if (result.sessionUrl) {
                window.location.href = result.sessionUrl;
            }
        } catch (err) {
            console.error("Checkout failed", err);
            alert("Something went wrong initiating checkout. Please try again.");
            setIsCheckingOut(false);
        }
    };

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="font-sans text-slate-900 bg-white">

            {/* SECTION 1: HERO (Personalized Results) */}
            <section className="bg-slate-950 text-white py-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>

                <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                        YOUR PERSONALIZED <span className="text-red-500">ANALYSIS</span>
                    </h1>

                    <p className="text-xl text-slate-300">
                        Based on <strong>YOUR</strong> 30 specific answers:
                    </p>

                    {/* Result Card */}
                    <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm rounded-3xl p-8 max-w-lg mx-auto shadow-2xl">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                                <span className="text-slate-400 font-medium">Toxicity Score</span>
                                <span className={cn("text-4xl font-black", finalScore >= 60 ? "text-red-500" : "text-orange-500")}>
                                    {finalScore}/100
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                                <span className="text-slate-400 font-medium">Narcissism Type</span>
                                <span className="text-xl font-bold text-white">{diagnosis}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-medium">Danger Level</span>
                                <span className={cn("text-xl font-bold uppercase",
                                    riskLevel === "Severe" ? "text-red-600" :
                                        riskLevel === "High" ? "text-orange-500" : "text-yellow-500"
                                )}>
                                    {riskLevel}
                                </span>
                            </div>
                        </div>

                        {/* Blurred Preview */}
                        <div className="mt-8 relative overflow-hidden bg-slate-800/50 rounded-xl p-4 text-left space-y-2 border border-slate-700/50">
                            <div className="absolute inset-0 backdrop-blur-[6px] flex items-center justify-center bg-slate-900/10 z-10">
                                <Lock className="text-slate-400 opacity-50 w-12 h-12" />
                            </div>
                            <p className="text-slate-300 text-sm font-mono opacity-40">"Based on your answers about the financial control..."</p>
                            <p className="text-slate-300 text-sm font-mono opacity-40">"When you said she isolates you from friends..."</p>
                            <p className="text-slate-300 text-sm font-mono opacity-40">"Your situation with the kids requires immediate..."</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-lg text-slate-400">
                            This isn't a generic report.<br />
                            This is <strong>YOUR</strong> relationship. Analyzed.
                        </p>
                        <button
                            onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg hover:shadow-red-900/40 transition-all hover:scale-105"
                        >
                            Get My Complete Analysis - $47
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 2: EMOTIONAL MIRROR */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-2xl mx-auto space-y-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center">
                        You Can't Talk About This. We Know.
                    </h2>

                    <div className="space-y-4">
                        <CheckboxItem text="If you tell your friends, they say 'just leave her bro'" subtext="(They don't get it. It's not that simple.)" />
                        <CheckboxItem text="If you tell family, they think you're exaggerating" subtext="(Or worse - they take her side.)" />
                        <CheckboxItem text="You can't tell her you think she's a narcissist" subtext="(That conversation ends in disaster.)" />
                        <CheckboxItem text="So you're here. Alone. Googling at 2am." subtext="(Wondering if you're the crazy one.)" />
                    </div>

                    <div className="text-center space-y-4 pt-6">
                        <p className="text-xl font-bold text-slate-900">
                            You're not crazy. You need clarity.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            This analysis gives you what you can't get anywhere else:<br />
                            An objective breakdown of what's really happening.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 3: WHAT MAKES THIS PERSONALIZED */}
            <section className="py-20 px-4 bg-white border-b border-slate-100">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900">Why This Isn't Generic</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4 opacity-50 grayscale">
                            <div className="font-bold text-slate-400 text-lg">Most relationship advice:</div>
                            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200">
                                <p className="text-slate-500">"Narcissists do X, Y, Z"</p>
                                <div className="flex justify-end mt-2"><X className="text-red-400" /></div>
                            </div>
                        </div>

                        <div className="space-y-4 relative">
                            <div className="absolute -left-6 top-1/2 -translate-y-1/2 hidden md:block">
                                <ArrowRight className="text-slate-300" />
                            </div>
                            <div className="font-bold text-red-600 text-lg">Your analysis:</div>
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
                                <p className="text-slate-800 font-medium">
                                    "Based on your answer to Q12, when you said she [exact thing], that's textbook [tactic].
                                    Here's why it works on you specifically..."
                                </p>
                                <div className="flex justify-end mt-2"><CheckCircle className="text-green-500" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-slate-50 rounded-2xl p-8 text-center">
                        <p className="font-bold text-slate-900 mb-4">Every section references YOUR answers:</p>
                        <ul className="text-slate-600 space-y-2 inline-block text-left">
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Her specific tactics (from your examples)</li>
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Why they work on YOU (your vulnerabilities)</li>
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> Your exact situation (kids, finances, timeline)</li>
                            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-red-500" /> What to do THIS WEEK (not generic steps)</li>
                        </ul>
                        <p className="mt-6 text-slate-500 italic">52 people can take this test. 52 completely different reports.</p>
                    </div>
                </div>
            </section>

            {/* SECTION 4: REPORT CONTENTS (Detailed) */}
            <section className="py-20 px-4 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">
                            YOUR COMPLETE ANALYSIS + 5 GUIDES
                        </h2>
                    </div>

                    <div className="grid gap-6">
                        <ReportSection
                            emoji="📊"
                            title="SECTION 1: YOUR TOXICITY BREAKDOWN"
                            items={[
                                "Score explanation (why 74, not 60 or 85)",
                                "Her narcissism type (covert vs overt vs borderline)",
                                "Danger assessment (should you leave now or document first?)"
                            ]}
                        />
                        <ReportSection
                            emoji="🎯"
                            title="SECTION 2: HER TACTICAL PROFILE"
                            items={[
                                "Her top 3 manipulation tactics (from YOUR answers)",
                                "How each one works on you specifically",
                                "Real examples (your words from the quiz)",
                                "What to watch for next"
                            ]}
                        />
                        <ReportSection
                            emoji="🛡️"
                            title="SECTION 3: YOUR VULNERABILITY MAP"
                            items={[
                                "Why her tactics work on you",
                                "What she exploits (your empathy? conflict avoidance? hope?)",
                                "Specific moments from your answers showing this",
                                "How to protect these weak points"
                            ]}
                        />
                        <ReportSection
                            emoji="⚖️"
                            title="SECTION 4: YOUR SITUATION ANALYSIS"
                            items={[
                                "Financial exposure (based on your Q27-28 answers)",
                                "Custody risks (if you have kids)",
                                "Support system status",
                                "Exit barriers (what's keeping you trapped)"
                            ]}
                        />
                        <ReportSection
                            emoji="📋"
                            title="SECTION 5: YOUR STRATEGIC OPTIONS"
                            items={[
                                "Stay strategy (if score allows + boundaries)",
                                "Document protocol (what to track, how)",
                                "Exit timeline (3/6/12 months based on YOUR complexity)",
                                "Emergency plan (if danger escalates)"
                            ]}
                        />
                        <ReportSection
                            emoji="📅"
                            title="SECTION 6: YOUR NEXT 30 DAYS"
                            items={[
                                "Week 1: [Specific actions for YOUR situation]",
                                "Week 2: [Based on YOUR barriers]",
                                "Week 3: [Prioritized for YOUR danger level]",
                                "Week 4: [Decision point for YOUR readiness]"
                            ]}
                        />
                    </div>

                    {/* Bonus Guides */}
                    <div className="mt-16 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-6">
                                <h3 className="text-2xl font-bold border-b border-red-400 pb-4">PLUS 5 TACTICAL GUIDES:</h3>
                                <ul className="space-y-3 font-medium">
                                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-white fill-white/20" /> Guide 1: Manipulation Decoder (21 tactics + counters)</li>
                                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-white fill-white/20" /> Guide 2: Evidence Vault System (court-ready docs)</li>
                                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-white fill-white/20" /> Guide 3: Conversation Scripts (15 scenarios)</li>
                                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-white fill-white/20" /> Guide 4: Custody Defense Manual</li>
                                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-white fill-white/20" /> Guide 5: Financial Firewall</li>
                                </ul>
                            </div>
                            <div className="text-center bg-black/20 p-6 rounded-2xl backdrop-blur-sm min-w-[200px]">
                                <div className="text-red-200 line-through text-lg mb-1">VALUE: $194</div>
                                <div className="text-5xl font-black text-white mb-2">TODAY: $47</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: EMOTIONAL TRUTH */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-2xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-slate-900">The Real Reason You're Here</h2>
                        <p className="text-lg text-slate-600">It's not the tactics. You could Google those.</p>
                    </div>

                    <div className="grid gap-8 text-left">
                        <EmotionalTruthItem title="CONFUSED" quote="Is it her or is it me? I don't trust my own judgment anymore." />
                        <EmotionalTruthItem title="ALONE" quote="I can't talk to anyone. They don't get it. Or they'll judge." />
                        <EmotionalTruthItem title="TRAPPED" quote="Kids. Money. Lease. Family. How the fuck do I leave even if I wanted to?" />
                        <EmotionalTruthItem title="EXHAUSTED" quote="I'm walking on eggshells. Managing her emotions 24/7. I'm done." />
                        <EmotionalTruthItem title="GUILTY" quote="Maybe if I just tried harder. Spent more. Was more patient." />
                    </div>

                    <div className="space-y-6 pt-8 border-t border-slate-100">
                        <p className="text-xl font-medium text-slate-900">
                            This analysis doesn't judge you.<br />
                            It doesn't tell you what you SHOULD do.
                        </p>
                        <p className="text-lg text-slate-600">
                            It shows you what IS happening.<br />
                            Then gives you options.
                        </p>
                        <p className="font-bold text-slate-900">
                            What you do with that clarity? Your choice.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 6: TESTIMONIALS */}
            <section className="py-20 px-4 bg-slate-50 border-t border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-center text-sm font-bold tracking-widest text-slate-400 uppercase mb-12">Recent Results from Men Like You</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="I read the section about 'financial control' and my stomach dropped. I've been giving her money thinking it would make her happy. It never does. Now I know why."
                            author="David, 37, Seattle"
                        />
                        <TestimonialCard
                            quote="The part where it said 'you can't fix her emotional instability by being more stable yourself' - fuck. That's been my whole strategy for 3 years."
                            author="Marcus, 41, Austin"
                        />
                        <TestimonialCard
                            quote="I showed my lawyer the custody section. He said it was more thorough than what his firm gives clients. Saved me $500 in consultation."
                            author="James, 35, Phoenix"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 7: URGENCY */}
            <section className="py-20 px-4 bg-slate-900 text-white text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-1.5 rounded-full text-sm font-medium border border-red-500/20">
                        <Clock size={16} /> Status: Report Generated
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold">Your Analysis Is Sitting On Our Server Right Now</h2>

                    <div className="bg-slate-800/50 p-6 rounded-2xl text-left inline-block w-full max-w-md space-y-3 border border-slate-700">
                        <CheckItem text="Your toxicity score (calculated)" />
                        <CheckItem text="Her manipulation patterns (identified)" />
                        <CheckItem text="Your vulnerabilities (mapped)" />
                        <CheckItem text="Your timeline (ready)" />
                        <CheckItem text="Your action plan (next 30 days)" />
                    </div>

                    <div className="space-y-4">
                        <p className="text-xl font-bold">Question: Do you want to see it?</p>
                        <p className="text-slate-400">
                            Or do you want to keep Googling at 2am,<br />
                            hoping someone on Reddit has your exact situation?
                        </p>
                        <p className="text-sm text-slate-500 italic">(They don't. Because no one has YOUR exact situation.)</p>
                    </div>

                    <button
                        onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 px-12 rounded-full shadow-lg transition-transform hover:scale-105"
                    >
                        Get My Analysis - $47
                    </button>
                </div>
            </section>

            {/* SECTION 8: GUARANTEE */}
            <section className="py-16 px-4 bg-white border-b border-slate-100">
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                        <Shield className="text-yellow-600 w-12 h-12" />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-slate-900">"Actually Helped" Guarantee</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Read it. If you don't have at least one moment where you think
                            "holy shit, that's EXACTLY what's happening" — full refund.
                        </p>
                        <p className="text-slate-600">
                            We've analyzed 52,847 relationships. We know what we're looking for.
                            If your report doesn't nail your situation, we fucked up.
                            Email us. Get your money back.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 9: FAQ */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FaqItem
                            question="What if she finds this?"
                            answer="Don't show her. This is for YOU. Not a conversation starter. If she's a narcissist, confronting her = disaster."
                            isOpen={openFaq === 0} toggle={() => toggleFaq(0)}
                        />
                        <FaqItem
                            question="What if I'm wrong?"
                            answer="Then the score will be low. You'll know it's not NPD. Better to check than wonder."
                            isOpen={openFaq === 1} toggle={() => toggleFaq(1)}
                        />
                        <FaqItem
                            question="Is it really personalized?"
                            answer="Every section references your specific answers. Your examples. Your situation. Not generic."
                            isOpen={openFaq === 2} toggle={() => toggleFaq(2)}
                        />
                        <FaqItem
                            question="Can I talk to someone after?"
                            answer="Email us. Real person responds within 24h."
                            isOpen={openFaq === 3} toggle={() => toggleFaq(3)}
                        />
                        <FaqItem
                            question="$47 for a PDF?"
                            answer="One therapy session: $150+ and they spend 30 minutes just understanding your situation. This already knows your situation from your 30 answers."
                            isOpen={openFaq === 4} toggle={() => toggleFaq(4)}
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 10: CHECKOUT & ORDER BUMP */}
            <section id="checkout" className="py-20 px-4 bg-slate-900">
                <div className="max-w-lg mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 pb-6 border-b border-slate-100">
                        <h3 className="text-2xl font-black text-center text-slate-900 mb-2">Get My Personalized Analysis</h3>
                        <div className="flex justify-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-wide">
                            <span className="flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> Instant Access</span>
                            <span className="flex items-center gap-1"><Shield size={12} className="text-green-500" /> 30-Day Guarantee</span>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-slate-900 font-bold">
                                <span>Relationship Analysis (PDF)</span>
                                <span>$47.00</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600 text-sm">
                                <span>5 Bonus Guides</span>
                                <span className="text-green-600 font-bold">FREE</span>
                            </div>
                        </div>

                        {/* ORDER BUMP */}
                        <div
                            className={cn(
                                "border-2 rounded-xl p-4 cursor-pointer transition-all",
                                addOrderBump ? "bg-red-50 border-red-500" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                            )}
                            onClick={() => setAddOrderBump(!addOrderBump)}
                        >
                            <div className="flex gap-4">
                                <div className={cn(
                                    "w-6 h-6 rounded border flex items-center justify-center shrink-0 mt-1 transition-colors",
                                    addOrderBump ? "bg-red-600 border-red-600" : "bg-white border-slate-300"
                                )}>
                                    {addOrderBump && <CheckCircle size={16} className="text-white" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-600 font-black text-sm uppercase tracking-wider">One-Time Offer</span>
                                        <span className="text-slate-900 font-bold text-lg">+$9</span>
                                    </div>
                                    <div className="font-bold text-slate-900">Add Emergency Scripts Pack</div>
                                    <p className="text-sm text-slate-600 leading-snug">
                                        When she says: "You're too sensitive" → You say: [exact response]<br />
                                        When she threatens: "I'll take the kids" → You say: [exact response]<br />
                                        <strong>20 scenarios. Exact words. Print it. Use tonight.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="text-lg font-bold text-slate-700">Total</span>
                            <span className="text-3xl font-black text-slate-900">${addOrderBump ? "56.00" : "47.00"}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isCheckingOut ? "Processing..." : "Get My Analysis & Guides"}
                            <ArrowRight size={24} />
                        </button>

                        <div className="flex items-center justify-center gap-4 mt-4 mb-2 text-slate-400">
                            <FaCcVisa className="h-6 w-auto opacity-60 grayscale hover:grayscale-0 transition-all" />
                            <FaCcMastercard className="h-6 w-auto opacity-60 grayscale hover:grayscale-0 transition-all" />
                            <FaCcPaypal className="h-6 w-auto opacity-60 grayscale hover:grayscale-0 transition-all" />
                            <FaApplePay className="h-6 w-auto opacity-60 grayscale hover:grayscale-0 transition-all" />
                            <FaGooglePay className="h-6 w-auto opacity-60 grayscale hover:grayscale-0 transition-all" />
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                Secure SSL Payment • 100% Confidential
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

// --- Helper Components ---

function CheckboxItem({ text, subtext }: { text: string, subtext: string }) {
    return (
        <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm items-start">
            <div className="w-6 h-6 rounded border-2 border-slate-300 flex items-center justify-center shrink-0 mt-0.5" />
            <div>
                <p className="text-slate-900 font-medium text-lg leading-tight">{text}</p>
                <p className="text-slate-500 text-sm mt-1">{subtext}</p>
            </div>
        </div>
    )
}

function ReportSection({ emoji, title, items }: { emoji: string, title: string, items: string[] }) {
    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-3">
                <span className="text-2xl">{emoji}</span> {title}
            </h3>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function EmotionalTruthItem({ title, quote }: { title: string, quote: string }) {
    return (
        <div className="border-l-4 border-red-100 pl-6 py-2">
            <h4 className="font-black text-slate-900 text-sm tracking-widest mb-1">{title}</h4>
            <p className="text-slate-600 italic font-serif text-lg">"{quote}"</p>
        </div>
    )
}

function TestimonialCard({ quote, author }: { quote: string, author: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
            <div className="text-6xl absolute top-4 left-4 text-red-100 font-serif leading-none select-none">"</div>
            <p className="relative z-10 text-slate-700 font-medium mb-6 pt-6 italic">
                {quote}
            </p>
            <div className="font-bold text-slate-900 text-sm">— {author}</div>
            <div className="flex gap-1 mt-2 text-yellow-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
            </div>
        </div>
    )
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500 shrink-0" />
            <span className="font-medium text-slate-200">{text}</span>
        </div>
    )
}

function FaqItem({ question, answer, isOpen, toggle }: { question: string, answer: string, isOpen: boolean, toggle: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button onClick={toggle} className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors">
                <span className="font-bold text-slate-900">{question}</span>
                {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {answer}
                </div>
            )}
        </div>
    )
}
