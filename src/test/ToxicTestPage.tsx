
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useAction } from "wasp/client/operations";
import {
    startTest,
    submitAnswer,
    submitToxicTest, // We need to import this now
    updateWizardProgress
} from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { Loader2, ChevronLeft, CheckCircle } from "lucide-react";
import { cn } from "../client/utils";
import { TOXIC_TEST_CONFIG } from "./toxicTestConfig";

const QUESTIONS = TOXIC_TEST_CONFIG.questions;
const ANSWERS = TOXIC_TEST_CONFIG.answerOptions;

export default function ToxicTestPage() {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    // Guard against double-advancement
    const isAdvancing = React.useRef(false);

    // Initialize Session
    useEffect(() => {
        const initSession = async () => {
            // Check local storage
            const savedSessionId = localStorage.getItem("uyp-toxic-session-id");

            if (savedSessionId) {
                setSessionId(savedSessionId);
                setIsInitializing(false);
                return;
            }

            try {
                // Determine source/UTMs
                const { getFbclid, getUtmParams } = await import("../analytics/utils");
                const fbclid = getFbclid();
                const utms = getUtmParams();
                const { getDeviceInfo } = await import("../client/utils/deviceDetection");
                const deviceInfo = getDeviceInfo();

                // Start test with toxic-men type
                const newSession = await startTest({
                    fbclid: fbclid || undefined,
                    ...utms,
                    ...deviceInfo,
                    testType: 'toxic-men'
                } as any);

                setSessionId(newSession.id);
                localStorage.setItem("uyp-toxic-session-id", newSession.id);
            } catch (e) {
                console.error("Failed to init toxic test session", e);
                alert("Could not start test. Please refresh.");
            } finally {
                setIsInitializing(false);
            }
        };

        if (isInitializing && !sessionId) {
            initSession();
        }
    }, [isInitializing, sessionId]);

    const currentQuestion = QUESTIONS[currentQIndex];
    const progressPercentage = ((currentQIndex) / QUESTIONS.length) * 100;

    const handleOptionClick = (answerId: number) => {
        if (isSubmitting || isAdvancing.current) return;

        setSelectedAnswer(answerId);
        isAdvancing.current = true;

        setTimeout(() => {
            handleNext(answerId);
        }, 200);
    };

    const handleNext = async (answerIdOverride?: number) => {
        const answerId = answerIdOverride ?? selectedAnswer;
        if (!sessionId || answerId === null || !currentQuestion) {
            isAdvancing.current = false;
            return;
        }

        setIsSubmitting(true);
        try {
            const answerObj = ANSWERS.find(a => a.id === answerId);

            // Re-using generic submitAnswer (it works for any TestSession)
            await submitAnswer({
                sessionId,
                questionId: currentQuestion.id,
                answerId: answerId,
                score: answerObj?.score || 0,
                dimension: currentQuestion.dimension,
                type: currentQuestion.type,
            });

            if (currentQIndex < QUESTIONS.length - 1) {
                setCurrentQIndex(prev => prev + 1);
                setSelectedAnswer(null);
            } else {
                // Test Complete!
                // 1. Submit for Scoring
                await submitToxicTest({ sessionId });

                // 2. Clear Local Storage (optional, or keep for history)
                localStorage.removeItem("uyp-toxic-session-id");

                // 3. Navigate to Email Gate
                navigate(`/toxic-analysis?sessionId=${sessionId}`);
            }
        } catch (e) {
            console.error("Submission failed", e);
            alert("Error saving answer. Please try again.");
        } finally {
            setIsSubmitting(false);
            isAdvancing.current = false;
        }
    };

    const handleBack = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex(prev => prev - 1);
            setSelectedAnswer(null);
        }
    };

    if (isInitializing) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <Loader2 className="animate-spin text-red-500" size={48} />
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500/30">
            {/* Header / Progress */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {currentQIndex > 0 ? (
                            <button onClick={handleBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                        ) : (
                            <div className="w-10" />
                        )}
                        <span className="font-bold text-lg tracking-tight text-white/90">Assessment</span>
                    </div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                        {Math.round(progressPercentage)}% Complete
                    </div>
                </div>
                <div className="h-1 w-full bg-slate-900">
                    <div
                        className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-300 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </header>

            {/* Main Question Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
                <div key={currentQIndex} className="w-full flex flex-col animate-in slide-in-from-right-4 fade-in duration-300">

                    {/* Dimension Tag (Optional context) */}
                    <div className="mb-4 text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {currentQuestion.dimension}
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12 leading-tight">
                        {currentQuestion.text}
                    </h2>

                    <div className="space-y-3">
                        {ANSWERS.filter(a => {
                            // Filter answers relevant to this question based on ID range
                            const qId = currentQuestion.id;
                            const start = qId * 100;
                            const end = start + 99;
                            return a.id > start && a.id < end;
                        }).map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleOptionClick(option.id)}
                                className={cn(
                                    "w-full p-4 md:p-5 text-left rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition-all duration-200 group relative overflow-hidden",
                                    selectedAnswer === option.id && "border-red-500/50 bg-red-500/10 ring-1 ring-red-500/50"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-base md:text-lg font-medium text-slate-200 group-hover:text-white transition-colors">
                                        {option.text}
                                    </span>
                                    {selectedAnswer === option.id && (
                                        <CheckCircle className="text-red-500 animate-in zoom-in spin-in-12 duration-300" size={20} />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
