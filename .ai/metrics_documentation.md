# Metrics Documentation

This document outlines the 12 "Advanced Vital Signs" calculated after the test usage. These metrics provide a dimensional health check of the relationship.

## Overview
All metrics are scored on a scale, typically 0-100.
- **Normalization**: All inputs are normalized to a "Distress Score" where 1 = Healthy/Low Distress and 5 = Critical/High Distress.
- **Formula Logic**: Most formulas calculate a risk or state.
- **Interpretation**: For some metrics, High Score = Good (Health), for others High Score = Bad (Risk). (See individual metrics).

---

## 1. The Crystal Ball (Sustainability Forecast)
*Predicts if your current path leads to long-term growth or a dead end.*
*   **Formula**: `((Health_D2.5 + Health_D5.4 + Health_D1.6) / 15) * 100`
*   **Adjustment**: Score is multiplied by 1.5 if Repair is "Always" (Strong immune system), and halved if Repair is "Never".
*   **Inputs**:
    *   D2.5: Belief in partner's best interests.
    *   D5.4: Aligned life goals.
    *   D1.6: Ability to handle tension.
*   **Clinical Relevance**: High Score = High Sustainability (Good).

## 2. The Parent-Trap (Erotic Death Spiral)
*Measures how much "managing" your partner is killing your sex life.*
*   **Formula**: `(MentalLoad + ParentManager + Roommates + MismatchedDesire) / 20 * 100`
*   **Inputs**: D4.1, D4.2, D3.1, D3.4.
*   **Clinical Relevance**: High Score = High Risk of "Parent/Child" dynamic killing intimacy (Bad).

## 3. The Open Door (Betrayal Vulnerability)
*How likely an outside emotional or physical connection could disrupt the bond.*
*   **Formula**: `(BarelyHeard + NeedReassurance + FearScore) / 15 * 100`
*   **Inputs**: D2.1, D2.3, BiggestFear.
*   **Clinical Relevance**: High Score = High Vulnerability to Affairs (Bad).

## 4. The Bounce Back (Repair Efficiency)
*Your relationship's "immune system"—how quickly you recover after a fight.*
*   **Formula**: `(RepairFrequency + Health_D2.6 + Health_D1.4) / 14 * 100`
*   **Inputs**: Wizard Repair Stat, D2.6 (Reconnect Speed), D1.4 (Recurring Arguments).
*   **Clinical Relevance**: High Score = Fast/Efficient Repair (Good).

## 5. The Tactical Truce (Duty Sex Index)
*Are you having sex because you want to, or just to keep the peace?*
*   **Formula**: `(PeaceKeepingSex + Avoidance + AffectionLevel) / 15 * 100`
*   **Inputs**: D3.5, D1.5, D3.6.
*   **Note**: High Affection combined with Peace-Keeping Sex indicates a "Friend/Roommate" truce where sex is a chore.
*   **Clinical Relevance**: High Score = High Duty/Transactional Sex (Bad).

## 6. The Office Manager (CEO vs. Intern Gap)
*Measures the imbalance of "worrying and planning" vs. just "showing up".*
*   **Formula**: `(MentalLoad + Unappreciated + EngagementGap) / 15 * 100`
*   **Inputs**: D4.1, D4.4, PartnerConflictStyle (Withdraw/Scalate = Bad).
*   **Clinical Relevance**: High Score = High Imbalance (Bad).

## 7. The Quiet Quit (Silent Divorce Risk)
*High risk for couples who "never fight" but have emotionally checked out.*
*   **Formula**: `(LowConflictFreq + NoFutureFun + LossOfLoveFear) / 15 * 100`
*   **Inputs**: Wizard Conflict Freq (Rarely), D5.3, Fear.
*   **Clinical Relevance**: High Score = High Risk of Disconnection (Bad).

## 8. The Soulmate Sync (Compatibility Quotient)
*Measures if your core life values and "future dreams" actually match.*
*   **Formula**: `(AlignedGoals + SharedDecisions + GrowingTogether) / 15 * 100`
*   **Inputs**: D5.4, D4.6, D5.1.
*   **Clinical Relevance**: High Score = High Compatibility (Good).

## 9. The Enemy Within (Internalized Malice)
*Are you starting to see your partner as a "bad person" rather than a teammate?*
*   **Formula**: `(HurtOnPurpose + BarelyHeard + NoRepair) / 15 * 100`
*   **Inputs**: D2.2, D2.1, Wizard Repair (Never).
*   **Clinical Relevance**: High Score = High Malice/Contempt (Critical).

## 10. The Burnout Rate (Nervous System Load)
*The physical and mental toll this relationship is taking on your body.*
*   **Formula**: `(PanicSilence + ReplayConversations + MoneySafety) / 15 * 100`
*   **Inputs**: D1.1, D2.4, D4.3.
*   **Clinical Relevance**: High Score = High Physical Stress (Bad).

## 11. The Hidden Spark (Erotic Potential)
*Tells you if the "fire" is still there but just covered by domestic stress.*
*   **Formula**: `(AffectionLevel - RoommateFeeling + 5) / 10 * 100`
*   **Inputs**: D3.6 (Positive Touch), D3.1 (Roommate Vibe).
*   **Logic**: High Touch + High Roommate Feeling = High Potential (The chemistry exists but is blocked).
*   **Clinical Relevance**: High Score = High Potential (Good).

## 12. The Anchor Score (Resilience Battery)
*How much "shared history" and core trust you have to survive a crisis.*
*   **Formula**: `(DurationScore + Health_D2.5 + Health_D1.6) / 15 * 100`
*   **Inputs**: Years Together, D2.5 (Best Interests), D1.6 (Tension Handling).
*   **Clinical Relevance**: High Score = High Resilience (Good).
