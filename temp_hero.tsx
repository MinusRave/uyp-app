// 1. HERO SECTION COMPONENT (Refactored "Value First")
const HeroSection = ({
    badge,
    onUnlock,
    quickOverview,
    narcissismAnalysis,
    advancedMetrics
}: {
    badge: string,
    onUnlock: (location: string) => void,
    quickOverview?: QuickOverviewData | null,
    narcissismAnalysis?: any,
    advancedMetrics?: any
}) => {
    // Determine Risk Level & Sustainability
    const isHighRisk = narcissismAnalysis?.risk_level === "High" || narcissismAnalysis?.risk_level === "Severe";
    const isSevere = narcissismAnalysis?.risk_level === "Severe";

    // Risk Labeling
    const riskLabel = isSevere ? "CRITICAL TOXICITY DETECTED" : isHighRisk ? "High Risk Pattern" : "Analysis Complete";
    const riskColor = isSevere ? "text-red-600 bg-red-50 border-red-200 animate-pulse" : isHighRisk ? "text-orange-600 bg-orange-50 border-orange-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";

    // Dynamic Background
    const bgGradient = isHighRisk
        ? "from-orange-500/10 via-background to-background"
        : "from-primary/5 via-background to-background";

    // CORE DATA (UNLOCKED)
    const diagnosis = quickOverview?.pulse?.primary_diagnosis || "The Pursuer-Withdrawer Cycle";
    const patternDescription = "One partner pushes for connection (often feeling anxious) while the other pulls away to protect themselves (often feeling overwhelmed). This creates a spiral of increasing conflict and distance.";

    // FORECAST DATA (BLURRED/LOCKED)
    const sustainabilityScore = advancedMetrics?.sustainability_score || 45;
    const sustainabilityLabel = sustainabilityScore < 50 ? "Critical" : sustainabilityScore < 75 ? "At Risk" : "Stable";
    const sustainabilityColor = sustainabilityScore < 50 ? "text-red-500" : sustainabilityScore < 75 ? "text-orange-500" : "text-green-500";
    const sustainabilityWidth = `${sustainabilityScore}%`;

    // Dynamic Forecast Text
    let forecastText = quickOverview?.forecast?.short_term || "High probability of emotional detachment if intervention does not occur within 6 months...";
    let forecastLabel = "6-Month Forecast";

    // Override if High Toxicity Detected (Value-First: Truth bomb)
    if (isHighRisk) {
        forecastLabel = "Projected Trajectory: The Cycle Escalates";
        forecastText = `With a toxicity score of ${narcissismAnalysis?.relationship_health?.toxicity_score}/100, the current pattern of '${diagnosis}' typically evolves into emotional burnout or volatile separation within 3-6 months without a pattern-break.`;
    }

    return (
        <header className="bg-background text-foreground pt-8 pb-16 px-6 relative overflow-hidden border-b border-border/40">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} -z-10`} />

            <div className="max-w-4xl mx-auto text-center space-y-6">

                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${riskColor} mb-4`}>
                    {isSevere ? <ShieldAlert size={14} /> : <CheckCircle size={14} />}
                    {riskLabel}
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4">
                    {isHighRisk ? (
                        <>
                            We found a specific <span className="text-primary underline decoration-wavy">toxicity pattern</span>.
                        </>
                    ) : (
                        <>
                            We have identified your relationship's <span className="text-primary">Hidden Core Pattern</span>.
                        </>
                    )}
                </h1>

                {/* Diagnosis Card (UNLOCKED) */}
                <div className="bg-card border-2 border-primary/20 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mb-8 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Core Diagnosis</p>
                    <h2 className="text-3xl font-black text-primary mb-4">"{diagnosis}"</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {patternDescription}
                    </p>
                </div>

                {/* Locked Forecast Section */}
                <div className="max-w-xl mx-auto relative group">
                    {/* Blurred Content */}
                    <div className="filter blur-sm select-none opacity-50 transition-all duration-500">
                        <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-4 text-left">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm">Sustainability Score</span>
                                <span className={`font-bold ${sustainabilityColor}`}>{sustainabilityLabel}</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: sustainabilityWidth }}></div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">{forecastLabel}</p>
                                <p className="text-sm text-foreground">{forecastText}</p>
                                <p className="text-sm text-foreground my-2">Without intervention, the pattern will evolve into...</p>
                            </div>
                            <div className="p-3 bg-indigo-50 text-indigo-900 rounded-lg">
                                <p className="font-bold text-sm">Recommended Action Plan available.</p>
                            </div>
                        </div>
                    </div>

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[1px]">
                        <div className="bg-background/95 border border-border/50 shadow-2xl p-6 rounded-2xl text-center max-w-sm mx-4 transform hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => onUnlock('hero_lock')}>
                            <Lock className="mx-auto text-primary mb-3 h-8 w-8" />
                            <h3 className="font-bold text-lg text-foreground mb-1">Unlock Your Forecast</h3>
                            <p className="text-xs text-muted-foreground mb-4">
                                See your 6-month trajectory and get the cure.
                            </p>
                            <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-2 px-6 rounded-full w-full">
                                Reveal Strategy &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-text below card */}
                <p className="text-sm text-muted-foreground max-w-lg mx-auto pt-4">
                    <span className="text-foreground font-bold">Analysis Complete.</span> We have identified the root cause. The forecast and action plan are ready for your review.
                </p>

            </div>
        </header>
    );
};
