# End-to-End Value Maximization Strategy (V2)

To justify the $39 price point, we are moving from a "Report" to a **"Personalized Relationship Operating System"**.

## 1. The Core Engine: Refined Scoring (Implemented)
We use the **Quadrant Model** (Distress, Self-Regulation, Cynicism, Flow) to ensure accurate, empathetic diagnosis.

## 2. The Report Page: "The User Manual" (Major Upgrade)
The report page must feel rich, data-dense, and interactive. It's not just text; it's a dashboard.

### A. Visual Analytics (New)
*   **The "Distortion Graph":** A bar graph for each dimension comparing "Internal Sensation" (SL) vs "Actual Threat" (PM).
    *   *Visual:* Two bars side-by-side.
    *   *Insight:* "You feel this area is at 90% intensity, but your partner's negative intent is only at 20%. This 70% gap is 'The Distortion'."
*   **The "Lens Radar":** A 5-point radar chart showing their profile shape (e.g., "Highly Sensitive to Silence" but "Secure in Conflict").

### B. Deep Insights & Suggestions
*   **Expanded Analysis:** Instead of just the Dominant Lens, we provide a collapsible "Deep Dive" for *every* dimension.
    *   *Structure:* State Name -> The Trigger -> The Hidden Fear -> The Fix.
*   **"The Why":** A section explaining *physiologically* why they react this way (polyvagal theory hints, "nervous system protection").

### C. Integrated "Digital Care Package" (PDFs)
Directly within the Report UI (not a separate email), offer high-value downloads:
1.  **"The Fridge Sheet" (PDF):** A single-page, high-contrast visual for de-escalation specific to their triggers.
2.  **"The 4-Week Alignment Workbook" (PDF):** A structured journal to track progress.
    *   *Placement:* A dedicated "Downloads" card in the UI with premium iconography.

## 3. The Emergency Protocol (App Feature)
A special, distinct button in the UI: **"I'm Triggered Right Now"**.
*   **Experience:**
    1.  User clicks button.
    2.  Screen goes dark/calm.
    3.  **Step 1 (Regulate):** A 3-second breathing animation.
    4.  **Step 2 (Reality Check):** "Remember: Your Partner is [Silent] because they are [Overwhelmed], not because they [Don't Love You]." (Dynamic based on their report).
    5.  **Step 3 (Script):** "Read this sentence to them right now."
*   **Value:** Instant relief during a crisis is priceless.

## 4. The Teaser (Pre-Purchase Hook)
*   **The Visualization:** Show the *shape* of their graph but blur the *analysis*.
*   **The Insight:** "You have a 'Protection Limit' in Conflict."
*   **The Promise:** "Unlock the 'Emergency Button' and 'Scripts' to fix this dynamic."

## Summary of Changes
1.  **Visuals:** Add Graphs to `FullReportPage` and `TeaserPage`.
2.  **Downloads:** Add "Care Package" section to `FullReportPage`.
3.  **Emergency:** Implement the standard flow.
4.  **Partner Invite:** **REMOVED** (Scope reduction).
