# Meta Ads — Stay or Leave Test (v1)

> Cold Meta traffic acquisition for Stay or Leave Test.
> 3 angles, one per buyer mental state, all landing direct on `/` (the quiz).
> Format: 1:1 square feed, text-on-solid-background, 4th grade English.

**Created:** 2026-04-25
**Funnel:** Meta ad → `/stay-or-leave` (quiz, direct) → Q1-15 → email gate → Q16-30 → `/sol-results` (verdict + sales) → Stripe → `/assessment`

---

## Shared deployment settings

| Setting | Value |
|---|---|
| Campaign objective | Sales / Conversions |
| Conversion event | `Purchase` (Pixel + CAPI dedup via `eventID`) |
| Audience | Broad. Age 25-45. All genders. US, UK, CA, AU. |
| Placements | Automatic (1:1 crops to Stories/Reels cleanly) |
| Landing URL | `https://understandyourpartner.com/stay-or-leave?utm_source=meta&utm_campaign=sol_v1&utm_content={{ad.id}}` |
| Budget split | Equal across all 3 ads — testing the angle, not the creative |
| Min run time | 5-7 days before killing any. First 48h is noise. |

**Tracking already wired:**
- Pixel: `src/analytics/pixel.ts` + `src/client/App.tsx`
- CAPI: `src/server/analytics/metaCapi.ts`
- Dedup eventID: `src/analytics/eventId.ts`
- Env vars needed: `META_PIXEL_ID`, `META_ACCESS_TOKEN`

---

## Ad 1 — "Want to stay but doubts"

**Buyer state:** wants to keep the relationship, has nagging doubts.

### Primary text (caption)

```
Do you want to stay with your partner but still have doubts?

Take the 10-minute Stay or Leave test.

30 questions. 6 honest scores. One clear answer.

Worth Saving. High Risk. Time to Leave.

Your verdict in 10 minutes. Free to take.
```

### Headline

> Do you want to stay but still have doubts?

### Description (small text)

> 10-minute test. Free. Get your verdict.

### CTA button

`Take Quiz`

### Image spec (1080×1080)

- **Background:** solid off-white `#F8F6F3`
- **Top center, small uppercase tracking-wide:** `STAY OR LEAVE TEST`
- **Centered, large bold black, 5 lines:**
  ```
  Do you want
  to stay
  with your partner
  — but still
  have doubts?
  ```
- **Bottom, small text:** `Take the 10-minute test → understandyourpartner.com`
- **No images. No people. No logos other than the small wordmark.**

---

## Ad 2 — "Stuck in the middle"

**Buyer state:** undecided, paralyzed between leaving and staying.

### Primary text

```
Not sure if you should stay or leave your partner?

Most people sit with this for months. Years.

The Stay or Leave test gives you one of three answers in 10 minutes.

Worth Saving. High Risk. Time to Leave.

30 questions. 6 scores. Free to take.
```

### Headline

> Stay or leave? Take the test.

### Description

> 30 questions. 10 minutes. Free.

### CTA button

`Take Quiz`

### Image spec (1080×1080)

- **Background:** solid charcoal `#1A1A1A`
- **Centered, large bold white, 2 lines:**
  ```
  Stay or leave
  your partner?
  ```
- **Slight emphasis on "or" in primary purple `#8B55A5`**
- **Bottom:** `Take the 10-minute test`
- **Sparse, almost like a courtroom poster.**

---

## Ad 3 — "Want to leave but confused"

**Buyer state:** leaning toward leaving, but doubts the decision.

### Primary text

```
Do you want to leave your partner but feel confused?

Your friends say one thing. Your family says another.

The Stay or Leave test does not pick a side. It gives you a structured answer based on what you say.

30 questions. 6 honest scores. Your verdict in 10 minutes. Free to take.
```

### Headline

> You want to leave. Are you sure?

### Description

> The test that does not pick a side.

### CTA button

`Take Quiz`

### Image spec (1080×1080)

- **Background:** solid muted red `#A33A3A` — quiet, not loud
- **Centered, large bold off-white, 4 lines (with one blank line):**
  ```
  You want
  to leave
  your partner.

  Are you sure?
  ```
- **Bottom:** `Take the 10-minute test → understandyourpartner.com`
- **Slight whitespace breathing room around the text.**

---

## Why these 3 angles

Pulled from the customer-avatar doc + Sabri Suby's "test angles, not words" rule:

1. **Want to stay but doubts** → Primary avatar (woman 28-38 in active relationship), highest volume, lowest urgency.
2. **Stuck in the middle** → Catches everyone who can't self-identify. Should win on broad reach.
3. **Want to leave but confused** → Hottest emotional state, smallest segment but highest intent. Likely highest CPC, possibly highest conversion rate.

Run all 3, kill the bottom 1 after 5-7 days. Don't optimize copy until one angle clearly wins — that's optimizing how to say something before you've found what to say.

---

## Meta policy notes

All three ads are **product-side** — they describe the test, not the viewer's situation. Safe under Meta's "personal attributes" policy. Specifically:

- Ad 1: "Do you want to stay" → asks about *their wish*, not asserts an attribute.
- Ad 2: "Not sure if you should stay or leave" → asks about *their uncertainty*.
- Ad 3: "Do you want to leave but feel confused" → asks about *their state of mind*.

**None claim anything about the partner.** Avoid: "Is your partner toxic?" / "Your partner is cheating" / "He's a narcissist" — Meta will reject those instantly.

---

## Test results — fill in as data comes back

| Date | Ad | Spend | Impressions | CTR | CPC | Quiz starts | Conversions | CPA | Notes |
|---|---|---|---|---|---|---|---|---|---|
| | Ad 1 | | | | | | | | |
| | Ad 2 | | | | | | | | |
| | Ad 3 | | | | | | | | |

**Tracking events fired by funnel step:**
- Ad click → `PageView` (Pixel)
- Quiz Q1 → no event (free, internal)
- Email gate submit → no Meta event (lead capture is internal)
- Sales page load → `ViewContent` (Pixel)
- Unlock CTA click → `InitiateCheckout` (Pixel + CAPI)
- Stripe success → `Purchase` (Pixel from `CheckoutResultPage.tsx` + CAPI from `reportWebhook.ts`)

---

## When to spin up v2

- Ad 1/2/3 has clear winner after 5-7 days → write 3 new variations of the winning angle (test how to say it).
- All 3 underperform → angle is wrong. Pull a different pain point from `customer-avatar-merged.md` and try again.
- Meta flags an ad → swap to a softer phrasing (the doc has 3 phrasings per angle prepared in advance).

When you spin up v2, copy this file to `meta-ads-sol-v2.md` so v1's results stay frozen.
