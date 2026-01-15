// Compatibility Score Calculator
// Analyzes user's pattern + partner behavior to generate compatibility insights

interface CompatibilityInput {
    userDominantLens: string;
    userState: string;
    partnerConflictStyle?: string;
    fightFrequency?: string;
    repairFrequency?: string;
}

interface CompatibilityResult {
    overallScore: number; // 0-100
    breakdown: {
        dimension: string;
        score: number;
        status: 'aligned' | 'mismatched' | 'opposite';
        insight: string;
    }[];
    riskLevel: 'low' | 'medium' | 'high';
    topRecommendation: string;
}

export function calculateCompatibility(input: CompatibilityInput): CompatibilityResult {
    let baseScore = 50; // Start neutral
    const breakdown: CompatibilityResult['breakdown'] = [];

    // Factor 1: Conflict Style Compatibility
    if (input.partnerConflictStyle) {
        const userIsWithdrawer = input.userDominantLens === 'silence';
        const partnerIsWithdrawer = input.partnerConflictStyle === 'withdraws';

        if (userIsWithdrawer && partnerIsWithdrawer) {
            // Both withdraw = low conflict but low connection
            baseScore += 10;
            breakdown.push({
                dimension: 'Conflict Style',
                score: 60,
                status: 'aligned',
                insight: 'You both avoid conflict, which reduces tension but may leave issues unresolved.'
            });
        } else if (!userIsWithdrawer && !partnerIsWithdrawer) {
            // Both engage = high conflict but high resolution potential
            baseScore += 5;
            breakdown.push({
                dimension: 'Conflict Style',
                score: 55,
                status: 'aligned',
                insight: 'You both engage in conflict, which can be intense but leads to resolution.'
            });
        } else {
            // Pursuer-Withdrawer dynamic = classic mismatch
            baseScore -= 15;
            breakdown.push({
                dimension: 'Conflict Style',
                score: 35,
                status: 'opposite',
                insight: 'Classic pursuer-withdrawer dynamic. One seeks connection, the other needs space.'
            });
        }
    }

    // Factor 2: Fight Frequency
    if (input.fightFrequency) {
        const freq = input.fightFrequency;
        if (freq === 'daily') {
            baseScore -= 20;
            breakdown.push({
                dimension: 'Conflict Frequency',
                score: 30,
                status: 'mismatched',
                insight: 'Daily conflicts indicate high stress. Your nervous systems are in constant activation.'
            });
        } else if (freq === 'weekly') {
            baseScore -= 10;
            breakdown.push({
                dimension: 'Conflict Frequency',
                score: 40,
                status: 'mismatched',
                insight: 'Weekly conflicts are manageable but suggest ongoing tension.'
            });
        } else if (freq === 'monthly') {
            baseScore += 10;
            breakdown.push({
                dimension: 'Conflict Frequency',
                score: 70,
                status: 'aligned',
                insight: 'Monthly conflicts are normal. You handle stress well together.'
            });
        } else {
            baseScore += 15;
            breakdown.push({
                dimension: 'Conflict Frequency',
                score: 85,
                status: 'aligned',
                insight: 'Rare conflicts suggest strong compatibility or effective communication.'
            });
        }
    }

    // Factor 3: Repair Ability (MOST IMPORTANT)
    if (input.repairFrequency) {
        const repair = input.repairFrequency;
        if (repair === 'always') {
            baseScore += 25;
            breakdown.push({
                dimension: 'Repair Ability',
                score: 95,
                status: 'aligned',
                insight: 'Strong repair ability is the #1 predictor of relationship success. You have this.'
            });
        } else if (repair === 'sometimes') {
            baseScore += 5;
            breakdown.push({
                dimension: 'Repair Ability',
                score: 55,
                status: 'aligned',
                insight: 'Inconsistent repair. When you do reconnect, it works. The challenge is consistency.'
            });
        } else if (repair === 'rarely') {
            baseScore -= 15;
            breakdown.push({
                dimension: 'Repair Ability',
                score: 35,
                status: 'mismatched',
                insight: 'Rare repair is a red flag. Unresolved conflicts erode connection over time.'
            });
        } else {
            baseScore -= 30;
            breakdown.push({
                dimension: 'Repair Ability',
                score: 20,
                status: 'opposite',
                insight: 'No repair is critical. Issues are piling up, creating resentment and distance.'
            });
        }
    }

    // Factor 4: User's State
    if (input.userState === 'Amplified Distress') {
        baseScore -= 10;
        breakdown.push({
            dimension: 'Your Nervous System',
            score: 40,
            status: 'mismatched',
            insight: 'Your heightened sensitivity makes conflicts feel more intense than they are.'
        });
    } else if (input.userState === 'Secure Flow') {
        baseScore += 10;
        breakdown.push({
            dimension: 'Your Nervous System',
            score: 80,
            status: 'aligned',
            insight: 'Your regulated nervous system helps you navigate conflicts calmly.'
        });
    }

    // Normalize score to 0-100
    const finalScore = Math.max(0, Math.min(100, baseScore));

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (finalScore >= 70) riskLevel = 'low';
    else if (finalScore >= 40) riskLevel = 'medium';
    else riskLevel = 'high';

    // Generate top recommendation
    let topRecommendation: string;
    if (input.repairFrequency === 'never' || input.repairFrequency === 'rarely') {
        topRecommendation = 'Learn repair skills. This is your #1 priority. Use the scripts in your report.';
    } else if (input.fightFrequency === 'daily') {
        topRecommendation = 'Reduce conflict frequency by addressing triggers before they escalate.';
    } else if (input.partnerConflictStyle === 'withdraws' && input.userDominantLens !== 'silence') {
        topRecommendation = 'Break the pursuer-withdrawer cycle. Give your partner space, then reconnect.';
    } else {
        topRecommendation = 'Focus on maintaining your repair rituals. This is your strength.';
    }

    return {
        overallScore: Math.round(finalScore),
        breakdown,
        riskLevel,
        topRecommendation
    };
}
