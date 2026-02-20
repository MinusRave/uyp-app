
export const TOXIC_TEST_CONFIG = {
    questions: [
        // BLOCK A: CORE NPD BEHAVIORS
        {
            id: 1,
            text: "Does she deny saying things you clearly remember?",
            dimension: "Gaslighting",
            type: "Toxic",
        },
        {
            id: 2,
            text: "When there's a problem in the relationship, whose fault is it?",
            dimension: "Blame",
            type: "Toxic",
        },
        {
            id: 3,
            text: "Does she punish you with silence or withdrawal?",
            dimension: "SilentTreatment",
            type: "Toxic",
        },
        {
            id: 4,
            text: "When you bring up an issue, does she make herself the victim?",
            dimension: "VictimPlaying",
            type: "Toxic",
        },
        {
            id: 5,
            text: "When she hurts you, how does she apologize?",
            dimension: "Accountability",
            type: "Toxic",
        },
        {
            id: 6,
            text: "Does she use guilt, threats, or manipulation to control your behavior?",
            dimension: "Control",
            type: "Toxic",
        },
        {
            id: 7,
            text: "How often do you question your own memory or perception around her?",
            dimension: "SelfDoubt",
            type: "Toxic",
        },
        {
            id: 8,
            text: "Does she involve others (family, friends) to take her side against you?",
            dimension: "Triangulation",
            type: "Toxic",
        },
        {
            id: 9,
            text: "Does she accuse you of things she actually does?",
            dimension: "Projection",
            type: "Toxic",
        },
        {
            id: 10,
            text: "When you share feelings or problems, does she:",
            dimension: "Empathy",
            type: "Toxic",
        },

        // BLOCK B: FREQUENCY & ESCALATION
        {
            id: 11,
            text: "How often do these negative behaviors occur?",
            dimension: "Frequency",
            type: "Meta",
        },
        {
            id: 12,
            text: "How long has this been happening?",
            dimension: "Duration",
            type: "Meta",
        },
        {
            id: 13,
            text: "Over the past 6-12 months, are things:",
            dimension: "Trajectory",
            type: "Meta",
        },
        {
            id: 14,
            text: "Has she ever:",
            dimension: "Violence",
            type: "Risk",
        },

        // BLOCK C: YOUR VULNERABILITIES
        {
            id: 15,
            text: "Do you feel responsible for her emotions and happiness?",
            dimension: "EmpathyTrait",
            type: "Vulnerability",
        },
        {
            id: 16,
            text: "When she starts a conflict, you typically:",
            dimension: "ConflictStyle",
            type: "Vulnerability",
        },
        {
            id: 17,
            text: "How often do you think 'Maybe I AM the problem'?",
            dimension: "SelfPerception",
            type: "Vulnerability",
        },
        {
            id: 18,
            text: "Do you believe she can/will change if you just try harder?",
            dimension: "ChangeBelief",
            type: "Vulnerability",
        },

        // BLOCK D: CONTROL & ISOLATION
        {
            id: 19,
            text: "Who controls the money in your relationship?",
            dimension: "FinancialControl",
            type: "Control",
        },
        {
            id: 20,
            text: "Compared to when you met, your friendships and family connections are:",
            dimension: "Isolation",
            type: "Control",
        },
        {
            id: 21,
            text: "Can you make normal decisions (go out, see friends, hobbies) without her approval?",
            dimension: "Autonomy",
            type: "Control",
        },
        {
            id: 22,
            text: "Does she check your phone, emails, location, or accounts?",
            dimension: "Monitoring",
            type: "Control",
        },

        // BLOCK E: LEGAL & REPUTATION RISKS
        {
            id: 23,
            text: "Do you have children together?",
            dimension: "Children",
            type: "Risk",
        },
        {
            id: 24,
            text: "Has she ever threatened or made false claims about you?",
            dimension: "FalseAccusations",
            type: "Risk",
        },
        {
            id: 25,
            text: "Has she told others lies or twisted stories about you?",
            dimension: "Reputation",
            type: "Risk",
        },
        {
            id: 26,
            text: "Has she threatened any of the following:",
            dimension: "LegalThreats",
            type: "Risk",
        },

        // BLOCK F: EXIT ASSESSMENT
        {
            id: 27,
            text: "Your current living arrangement:",
            dimension: "LivingSituation",
            type: "Exit",
        },
        {
            id: 28,
            text: "Financial connections:",
            dimension: "FinancialTies",
            type: "Exit",
        },
        {
            id: 29,
            text: "Where are you in your thinking?",
            dimension: "Readiness",
            type: "Exit",
        },
        {
            id: 30,
            text: "If you left today, do you have:",
            dimension: "SupportSystem",
            type: "Exit",
        },
    ],

    answerOptions: [
        // Q1 Memory
        { id: 101, text: "Never", score: 0 },
        { id: 102, text: "Rarely", score: 2 },
        { id: 103, text: "Sometimes", score: 5 },
        { id: 104, text: "Often", score: 8 },
        { id: 105, text: "Constantly", score: 8 },

        // Q2 Blame
        { id: 201, text: "Usually mine", score: 0 },
        { id: 202, text: "Always mine", score: 8 },
        { id: 203, text: "We both take responsibility", score: 0 },
        { id: 204, text: "She never admits fault", score: 8 },
        { id: 205, text: "She blames me for her behavior", score: 5 }, // Contextual logic: Often implied as main issue

        // Q3 Silent Treatment
        { id: 301, text: "Never", score: 0 },
        { id: 302, text: "Rarely (once or twice)", score: 2 },
        { id: 303, text: "Sometimes (monthly)", score: 5 },
        { id: 304, text: "Often (weekly)", score: 8 },
        { id: 305, text: "Frequently (multiple times per week)", score: 8 },

        // Q4 Victim Playing
        { id: 401, text: "Never", score: 0 },
        { id: 402, text: "Rarely", score: 2 },
        { id: 403, text: "Sometimes", score: 5 },
        { id: 404, text: "Usually", score: 8 },
        { id: 405, text: "Always - I end up comforting her", score: 8 },

        // Q5 Apologies
        { id: 501, text: "Genuinely takes responsibility", score: 0 },
        { id: 502, text: "Says sorry but adds 'but you...'", score: 5 },
        { id: 503, text: "Apologizes then does it again", score: 5 },
        { id: 504, text: "Never apologizes", score: 8 },
        { id: 505, text: "Makes me apologize to her", score: 8 },

        // Q6 Control
        { id: 601, text: "Never", score: 0 },
        { id: 602, text: "Rarely", score: 2 },
        { id: 603, text: "Sometimes", score: 5 },
        { id: 604, text: "Often", score: 8 },
        { id: 605, text: "This is how she operates", score: 8 },

        // Q7 Your Reality
        { id: 701, text: "Never", score: 0 },
        { id: 702, text: "Rarely", score: 2 },
        { id: 703, text: "Sometimes", score: 5 },
        { id: 704, text: "Often", score: 8 },
        { id: 705, text: "Constantly - I don't trust myself anymore", score: 8 },

        // Q8 Triangulation
        { id: 801, text: "Never", score: 0 },
        { id: 802, text: "Rarely", score: 2 },
        { id: 803, text: "Sometimes", score: 5 },
        { id: 804, text: "Often", score: 8 },
        { id: 805, text: "She's built a narrative where I'm the villain", score: 8 },

        // Q9 Projection
        { id: 901, text: "Never noticed this", score: 0 },
        { id: 902, text: "Maybe once or twice", score: 2 },
        { id: 903, text: "Sometimes", score: 5 },
        { id: 904, text: "Often", score: 8 },
        { id: 905, text: "It's a pattern", score: 8 },

        // Q10 Empathy
        { id: 1001, text: "Listen and care", score: 0 },
        { id: 1002, text: "Seem interested but doesn't follow through", score: 2 },
        { id: 1003, text: "Change subject to herself", score: 5 },
        { id: 1004, text: "Dismiss or minimize your feelings", score: 5 },
        { id: 1005, text: "Mock or criticize you for having feelings", score: 8 },

        // Q11 Frequency
        { id: 1101, text: "Once a month or less", score: 0 },
        { id: 1102, text: "A few times a month", score: 2 },
        { id: 1103, text: "Weekly", score: 5 },
        { id: 1104, text: "Multiple times per week", score: 7 },
        { id: 1105, text: "Daily or almost daily", score: 10 },

        // Q12 Duration
        { id: 1201, text: "Less than 6 months", score: 0 },
        { id: 1202, text: "6 months to 1 year", score: 0 },
        { id: 1203, text: "1-2 years", score: 0 },
        { id: 1204, text: "3-5 years", score: 0 },
        { id: 1205, text: "More than 5 years", score: 0 },

        // Q13 Trajectory
        { id: 1301, text: "Getting better", score: 0 },
        { id: 1302, text: "Staying the same", score: 0 },
        { id: 1303, text: "Getting slightly worse", score: 2 },
        { id: 1304, text: "Getting significantly worse", score: 10 },
        { id: 1305, text: "Rapidly deteriorating", score: 10 },

        // Q14 Violence
        { id: 1401, text: "Never been physically aggressive", score: 0 },
        { id: 1402, text: "Pushed, grabbed, or blocked you", score: 15 },
        { id: 1403, text: "Thrown objects at you", score: 15 },
        { id: 1404, text: "Hit, slapped, or kicked you", score: 15 },
        { id: 1405, text: "Caused injury or threatened with weapon", score: 15 },

        // Q15 Empathy Trait
        { id: 1501, text: "No, she's responsible for herself", score: 0 },
        { id: 1502, text: "Sometimes", score: 0 },
        { id: 1503, text: "Often", score: 5 },
        { id: 1504, text: "I feel I have to fix her feelings", score: 5 },
        { id: 1505, text: "Her mood controls my day", score: 5 },

        // Q16 Conflict Style
        { id: 1601, text: "Stand your ground calmly", score: 0 },
        { id: 1602, text: "Try to discuss rationally", score: 0 },
        { id: 1603, text: "Avoid it / give in to keep peace", score: 0 },
        { id: 1604, text: "Get defensive or fight back", score: 0 },
        { id: 1605, text: "Shut down / withdraw", score: 0 },

        // Q17 Self Perception
        { id: 1701, text: "Never", score: 0 },
        { id: 1702, text: "Rarely", score: 0 },
        { id: 1703, text: "Sometimes", score: 0 },
        { id: 1704, text: "Often", score: 5 },
        { id: 1705, text: "Constantly", score: 5 },

        // Q18 Change Belief
        { id: 1801, text: "No, I don't believe that anymore", score: 0 },
        { id: 1802, text: "I'm not sure", score: 0 },
        { id: 1803, text: "Yes, with the right approach", score: 5 },
        { id: 1804, text: "Yes, I just need to be better", score: 5 },
        { id: 1805, text: "Yes, she promises and I believe her", score: 5 },

        // Q19 Financial Control
        { id: 1901, text: "I control my money, she controls hers", score: 0 },
        { id: 1902, text: "We have joint control", score: 0 },
        { id: 1903, text: "She manages most finances", score: 5 },
        { id: 1904, text: "She controls all money including mine", score: 10 },
        { id: 1905, text: "I have no access to accounts", score: 10 },

        // Q20 Isolation
        { id: 2001, text: "The same or better", score: 0 },
        { id: 2002, text: "Slightly less frequent", score: 0 },
        { id: 2003, text: "Significantly reduced", score: 10 },
        { id: 2004, text: "I've lost most connections", score: 10 },
        { id: 2005, text: "I'm completely isolated", score: 10 },

        // Q21 Autonomy
        { id: 2101, text: "Yes, completely independent", score: 0 },
        { id: 2102, text: "Mostly, but check with her", score: 0 },
        { id: 2103, text: "Need to justify or explain", score: 0 },
        { id: 2104, text: "Need permission", score: 8 },
        { id: 2105, text: "Any independence causes huge conflict", score: 8 },

        // Q22 Monitoring
        { id: 2201, text: "Never", score: 0 },
        { id: 2202, text: "Occasionally", score: 0 },
        { id: 2203, text: "Regularly", score: 5 },
        { id: 2204, text: "Constantly", score: 8 },
        { id: 2205, text: "I have no privacy - she has all passwords", score: 8 },

        // Q23 Children
        { id: 2301, text: "No children", score: 0 },
        { id: 2302, text: "Pregnant/expecting", score: 0 },
        { id: 2303, text: "Yes, child(ren) together", score: 0 },
        { id: 2304, text: "Yes, and she uses them against me", score: 10 },
        { id: 2305, text: "Yes, and she threatens custody", score: 10 },

        // Q24 False Accusations
        { id: 2401, text: "Never", score: 0 },
        { id: 2402, text: "Threatened once during argument", score: 5 },
        { id: 2403, text: "Made false claims to family/friends", score: 10 },
        { id: 2404, text: "Threatened police/legal action", score: 15 },
        { id: 2405, text: "Already made false police report", score: 15 },

        // Q25 Reputation
        { id: 2501, text: "Not that I know of", score: 0 },
        { id: 2502, text: "Possibly to close friends", score: 0 },
        { id: 2503, text: "Yes, to family and friends", score: 5 },
        { id: 2504, text: "Yes, including work/professional contacts", score: 10 },
        { id: 2505, text: "Active smear campaign", score: 10 },

        // Q26 Legal Threats
        { id: 2601, text: "None of these", score: 0 },
        { id: 2602, text: "\"I'll take the kids\"", score: 8 },
        { id: 2603, text: "\"I'll call the police on you\"", score: 8 },
        { id: 2604, text: "\"I'll ruin you financially\"", score: 8 },
        { id: 2605, text: "Multiple threats or restraining order", score: 12 },

        // Q27 Living Situation
        { id: 2701, text: "We don't live together", score: 0 },
        { id: 2702, text: "Living together, easy to separate", score: 0 },
        { id: 2703, text: "Shared lease", score: 0 },
        { id: 2704, text: "Shared mortgage/property", score: 0 },
        { id: 2705, text: "Shared property + financially entangled", score: 0 },

        // Q28 Financial Ties
        { id: 2801, text: "None - completely separate", score: 0 },
        { id: 2802, text: "Joint account(s) only", score: 0 },
        { id: 2803, text: "Joint loans or credit", score: 0 },
        { id: 2804, text: "Shared mortgage + multiple accounts", score: 0 },
        { id: 2805, text: "Fully entangled finances + I support her", score: 0 },

        // Q29 Readiness
        { id: 2901, text: "Just trying to understand what's happening", score: 0 },
        { id: 2902, text: "Considering if I should leave", score: 0 },
        { id: 2903, text: "Seriously planning to leave", score: 0 },
        { id: 2904, text: "Decided to leave, planning how", score: 0 },
        { id: 2905, text: "Ready to leave now / already left", score: 0 },

        // Q30 Support System
        { id: 3001, text: "No one / completely isolated", score: 0 },
        { id: 3002, text: "Maybe 1-2 people", score: 0 },
        { id: 3003, text: "A few trusted friends/family", score: 0 },
        { id: 3004, text: "Strong support network", score: 0 },
        { id: 3005, text: "Support + resources (money, place to stay)", score: 0 },
    ]
};
