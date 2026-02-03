# System Conception & Flow: From "Stranger" to "Saved"

This document outlines the end-to-end data pipeline of the *UnderstandYourPartner* engine. It details exactly what we capture, how we process it, and how we deliver the diagnosis.

## 1. Data Collection (The Intake)

We gather three layers of data to build a "Holographic" view of the user's relationship.

### Layer 1: Context (The Wizard)
*Objective: Establish the "Stage" and "Players".*
*   **Relationship Status**: (e.g., "Stable but Stuck" vs "Crisis"). Used to adjust urgency.
*   **Duration**: (e.g., "5-10 Years"). Used to determine the *Phase* (e.g., Power Struggle vs Dead Zone).
*   **Family Unit**: Living together? Kids? (Adds weight to the "Cost of Inaction").
*   **Previous History**: Divorce/Trauma context.

### Layer 2: The MRI Scan (32-Question Assessment)
*Objective: Measure the "Nervous System" triggers across 5 Dimensions.*

For each dimension, we measure two distinct variables:
1.  **Sensory Load (SL)**: "How much does this *need* matter to me?" (High SL = High Sensitivity).
2.  **Perceived Meaning (PM)**: "How negatively do I interpret my partner's actions?" (High PM = High Distrust).

**The 5 Dimensions:**
1.  **Communication**: The logic/emotion gap.
2.  **Emotional Safety**: The ability to trust intention.
3.  **Physical Intimacy**: Connection vs Rejection.
4.  **Power & Fairness**: The "Manager" vs "Employee" dynamic.
5.  **Future & Values**: Alignment on the path forward.

### Layer 3: The "Bleeding Neck" (Qualitative Input)
*Objective: Get the raw, unfiltered pain.*
*   **Conflict Autopsy**: User types a description of their last fight.
    *   *System Use:* This text is fed directly to the AI to "decode" the hidden subtext.

---

## 2. The Processing Engine (The Black Box)

### Step A: The Clinical Scoring (`scoring.ts`)
We move beyond simple "Quadrants" to a **5-Profile Clinical Matrix**.

**1. Calculate Coordinates (SL, PM):**
For each dimension, we calculate a score (0-100) for Sensitivity and Negative Interpretation.

**2. The Clinical Diagnosis (The Heuristic):**
We analyze specific question clusters (Intimacy Q13-18, Conflict Q28-37) to assign one of 5 Profiles:
*   **Parentified Lover** (Low Desire + High Manager Score).
*   **Safety-Starved** (Low Desire + High Fear).
*   **Anxious Pursuer** (High Desire + Panic).
*   **Burnt-Out Pursuer** (High Historical Desire + Current Apathy).
*   **Complacent Roommates** (Low Conflict + Low Resentment).

**3. Compatibility Calculation:**
We combine the user's *State* with their self-reported *Partner Conflict Style* to predict a "Compatibility Score" (0-100).

### Step B: The AI Analysis (`ai.ts`)
We inject the data into a new "Anti-Slop" prompt.

**The Prompt Structure:**
*   **Input:** Clinical Profile, Conflict Autopsy, and Phase.
*   **Persona:** "Genius Best Friend" / "Brutal Surgeon". BANNED: "Therapist Speak".
*   **Task:** Generate two distinct blocks:
    1.  **The Cold Truth (Public/Free):** A visceral description of *why* they are stuck. (e.g., "You aren't refusing sex. You are refusing *him*.")
    2.  **The Protocol (Premium/Locked):** The specific, counter-intuitive actions to break the loop.

---

## 3. The Output (The Reveal)

### The Teaser Page ("Insight First")
*Objective: Validation before Sale.*
*   **The Diagnosis:** "You are the **[Parentified Lover]**."
*   **The Free Insight:** The "Cold Truth" text from the AI. It proves we know them.
*   **The Lock:** "We know how to turn off the 'Manager Mode' that is killing your libido. Unlock the Protocol to see how."

### The Full Report ("The Manual")
*Objective: Radical clarity and immediate relief.*
*   **The Deep Dive:** 400-word Clinical Dossier.
*   **The "Stop-Doing" List:** Immediate negative actions to cease.
*   **The Protocol:** Scripts and behavioral shifts.
*   **Deep Dives:** Specific warnings for each of the 5 dimensions.
*   **Voice:** Raw, expensive, "Anti-AI".

---

## Summary of the User Journey
1.  **User admits pain** (Inputs Conflict Details).
2.  **System measures pain** (Calculates Coordinates).
3.  **AI articulates pain** (Generates "Mirror Sentence").
4.  **Report resolves pain** (Provides Scripts & Roadmap).
