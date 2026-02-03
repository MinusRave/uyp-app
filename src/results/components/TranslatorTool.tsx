import React, { useState } from 'react';
import { Loader2, Sparkles, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { translateMessage } from 'wasp/client/operations';

interface TranslatorToolProps {
    myLens: string;
    partnerLens: string;
    sessionId?: string;
}

export function TranslatorTool({ myLens, partnerLens, sessionId }: TranslatorToolProps) {
    const [message, setMessage] = useState("");
    const [result, setResult] = useState<{ translatedMessage: string; analysis: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTranslate = async () => {
        if (!message) return;
        setLoading(true);
        try {
            const res = await translateMessage({
                message,
                userLens: myLens,
                partnerLens: partnerLens,
                sessionId: sessionId
            });

            // Parse the response - handle both direct JSON and markdown-wrapped JSON
            let parsed = res;

            // If translatedMessage is a string that looks like JSON, try to parse it
            if (typeof res.translatedMessage === 'string' && res.translatedMessage.includes('```json')) {
                try {
                    // Remove markdown code blocks
                    const cleanJson = res.translatedMessage
                        .replace(/```json\s*/g, '')
                        .replace(/```\s*/g, '')
                        .trim();

                    const jsonData = JSON.parse(cleanJson);
                    parsed = {
                        translatedMessage: jsonData.translatedMessage || jsonData.message || res.translatedMessage,
                        analysis: jsonData.analysis || jsonData.explanation || res.analysis
                    };
                } catch (parseError) {
                    console.error('Failed to parse JSON from response:', parseError);
                    // Keep original response if parsing fails
                }
            }

            setResult(parsed);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-8 md:p-10">
                <h3 className="text-3xl font-bold mb-4">AI-Powered Message Rewriter</h3>
                <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
                    Your intensity overwhelms your partner's nervous system.
                    This tool rewrites your message so they can actually
                    hear it (bypassing their "{partnerLens}" defense).
                </p>

                {/* EXAMPLE SECTION */}
                <div className="mb-16 bg-secondary/10 rounded-2xl p-6 md:p-8 border border-border/50">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                        <Sparkles size={16} /> How it works - Example
                    </h4>

                    <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                        {/* Bad Example */}
                        <div className="bg-white dark:bg-black/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm relative">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full border border-red-200 uppercase">
                                Triggering
                            </div>
                            <p className="italic text-foreground/80">"You NEVER listen to me! Every time I try to talk about us, you shut down. I'm sick of feeling ignored!"</p>
                        </div>

                        <div className="flex justify-center text-muted-foreground">
                            <ArrowRight className="hidden md:block" />
                            <div className="md:hidden">↓</div>
                        </div>

                        {/* Good Example */}
                        <div className="bg-white dark:bg-black/20 p-6 rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm relative">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-full border border-green-200 uppercase">
                                Partner-Safe
                            </div>
                            <p className="font-medium text-foreground">"I'm feeling disconnected and I'd like to talk about us. I notice when I bring things up, you seem to pull away. That makes me feel unheard. I'm not trying to fight."</p>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-4">
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-green-500" /> Removes "You never"</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-green-500" /> Owns feelings</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-green-500" /> Invites safety</span>
                        </span>
                    </div>
                </div>

                <div className="h-px bg-border my-12" />

                <h4 className="text-center font-bold text-xl mb-8">Now Try It With Your Own Message</h4>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wide text-muted-foreground">My Draft</label>
                            <div className="text-xs text-red-500 font-medium">Likely to trigger defense</div>
                        </div>
                        <textarea
                            className="w-full p-6 rounded-2xl border border-input bg-background min-h-[240px] resize-none focus:ring-2 ring-primary/20 outline-none text-lg shadow-inner"
                            placeholder="Type what you normally say when you're angry or hurt..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            onClick={handleTranslate}
                            disabled={loading || !message}
                            className="w-full py-5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                            Translate My Message
                        </button>
                    </div>

                    {/* Output */}
                    <div className="bg-muted/30 rounded-3xl p-6 border border-border relative flex flex-col">
                        <label className="text-sm font-bold uppercase tracking-wide text-green-600 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={16} /> Partner-Safe Version
                        </label>

                        {result ? (
                            <div className="animate-fade-in space-y-6 flex-1 flex flex-col">
                                <div className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-border shadow-sm text-xl font-medium leading-relaxed font-serif text-foreground/90 flex-1">
                                    "{result.translatedMessage}"
                                </div>
                                <div className="text-sm text-foreground/70 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <strong>Why this works:</strong> <span className="opacity-90">{result.analysis}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4 min-h-[240px]">
                                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center border border-border shadow-sm">
                                    <MessageCircle size={32} />
                                </div>
                                <p>Translation will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
