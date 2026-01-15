# Implementation Plan: Remaining Value Maximization Features

We have completed the **Core Logic (Quadrants)** and the **Full Report Viewer (User Manual)**.
Here is what remains to fully execute the strategy:

## 1. The Emergency Protocol (High Impact)
**Goal:** Turn the "I'm Triggered" button into a functional panic-relief tool.
*   **[ ] Create `EmergencyPage.tsx`:** A dark-mode, minimal interface.
*   **[ ] Implement 3-Step Flow:**
    1.  **Breathe:** Simple CSS animation (expand/contract).
    2.  **Reality Check:** Dynamic text based on their specific Report Quadrant (from `reportContent.ts`).
    3.  **Script:** The "In The Moment" script for their specific dimension.
*   **[ ] Link Button:** Connect the float button in `FullReportPage` to this new view.

## 2. Teaser "The Mirror" Upgrade (Conversion)
**Goal:** Prove insight before payment in `TeaserPage.tsx`.
*   **[ ] Add Visualization:** Simple Bar/Radar chart showing their "Sensitivity Spike".
*   **[ ] Add "Protection Limit" Insight:** New copy that explains *why* they react this way (using the new Quadrant logic).

## 3. Partner Viral Loop
**Goal:** Get the partner on board.
*   **[ ] Add "Invite Partner" Section:** In `FullReportPage`.
*   **[ ] Generate Share Link:** `?linkedSessionId=...` logic.
*   **[ ] Update `operations.ts`:** Handle "Linked Test Session" creation.

## 4. PDF Artifacts (Downloads)
**Goal:** Tangible value.
*   **[ ] Create React-PDF templates:** `CheatSheet.tsx` and `Workbook.tsx`.
*   **[ ] Add Download Buttons:** In the Report UI.

## Verification Plan
*   **Manual Test:** Click "I'm Triggered", verify the flow matches the user's specific Quadrant (e.g. "Abandonment Panic").
*   **Manual Test:** Verify the Teaser shows the new "Mirror" chart.
