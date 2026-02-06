export interface MetricDefinition {
    id: string;
    title: string;
    description: string;
    clinicalImportance: number; // 1-10
    userInterest: number; // 1-10
}

export const METRICS_CONFIG: MetricDefinition[] = [
    {
        id: "sustainability_forecast",
        title: "The Crystal Ball",
        description: "Predicts if your current path leads to long-term growth or a dead end.",
        clinicalImportance: 10,
        userInterest: 10
    },
    {
        id: "erotic_death_spiral",
        title: "The Parent-Trap",
        description: "Measures how much 'managing' your partner is killing your sex life.",
        clinicalImportance: 8,
        userInterest: 10
    },
    {
        id: "betrayal_vulnerability",
        title: "The Open Door",
        description: "How likely an outside emotional or physical connection could disrupt the bond.",
        clinicalImportance: 8,
        userInterest: 10
    },
    {
        id: "repair_efficiency",
        title: "The Bounce Back",
        description: "Your relationship's 'immune system'—how quickly you recover after a fight.",
        clinicalImportance: 10,
        userInterest: 7
    },
    {
        id: "duty_sex_index",
        title: "The Tactical Truce",
        description: "Are you having sex because you want to, or just to keep the peace?",
        clinicalImportance: 9,
        userInterest: 9
    },
    {
        id: "ceo_vs_intern",
        title: "The Office Manager",
        description: "Measures the imbalance of 'worrying and planning' vs. just 'showing up'.",
        clinicalImportance: 7,
        userInterest: 9
    },
    {
        id: "silent_divorce_risk",
        title: "The Quiet Quit",
        description: "High risk for couples who 'never fight' but have emotionally checked out.",
        clinicalImportance: 10,
        userInterest: 8
    },
    {
        id: "compatibility_quotient",
        title: "The Soulmate Sync",
        description: "Measures if your core life values and 'future dreams' actually match.",
        clinicalImportance: 7,
        userInterest: 9
    },
    {
        id: "internalized_malice",
        title: "The Enemy Within",
        description: "Are you starting to see your partner as a 'bad person' rather than a teammate?",
        clinicalImportance: 10,
        userInterest: 6
    },
    {
        id: "nervous_system_load",
        title: "The Burnout Rate",
        description: "The physical and mental toll this relationship is taking on your body.",
        clinicalImportance: 9,
        userInterest: 8
    },
    {
        id: "erotic_potential",
        title: "The Hidden Spark",
        description: "Tells you if the 'fire' is still there but just covered by domestic stress.",
        clinicalImportance: 6,
        userInterest: 9
    },
    {
        id: "resilience_battery",
        title: "The Anchor Score",
        description: "How much 'shared history' and core trust you have to survive a crisis.",
        clinicalImportance: 9,
        userInterest: 7
    }
];

// Helper to confirm mapping
export const QUESTION_ID_MAP = {
    "D1.1": 1, "D1.2": 2, "D1.3": 3, "D1.4": 4, "D1.5": 5, "D1.6": 6,
    "D2.1": 7, "D2.2": 8, "D2.3": 9, "D2.4": 10, "D2.5": 11, "D2.6": 12,
    "D3.1": 13, "D3.2": 14, "D3.3": 15, "D3.4": 16, "D3.5": 17, "D3.6": 18,
    "D4.1": 19, "D4.2": 20, "D4.3": 21, "D4.4": 22, "D4.5": 23, "D4.6": 24,
    "D5.1": 25, "D5.2": 26, "D5.3": 27, "D5.4": 28
};
