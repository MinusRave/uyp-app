# UYP Design System — "Warm Clinical" Selling Experience

> **Purpose**: A reference for building pages that feel like a trusted therapist's office — calm enough to open up, authoritative enough to trust, and warm enough to stay.
> Every pixel should say: "We understand. We can help. Here's the path forward."

---

## 1. DESIGN PRINCIPLES

### The Emotional Contract

The user arriving at our selling page is in one of three emotional states:
1. **Confused** — "Is something actually wrong, or am I overreacting?"
2. **Scared** — "I think I know the answer, and it terrifies me."
3. **Exhausted** — "I'm so tired of trying. Just tell me what to do."

The design must:
- **Never feel aggressive.** No screaming red banners, no fake countdown timers, no "BUY NOW" desperation. These people are already in pain — pressure makes them leave.
- **Always feel competent.** Clinical precision in data presentation. The numbers are real. The framework is real. This isn't a quiz from Cosmo.
- **Create a sense of safety.** They're sharing deeply personal information. The environment must feel private, dignified, and judgment-free.

### The Three Rules

1. **Warmth over coldness.** Cream backgrounds over stark white. Rounded corners over sharp edges. Serif for emotional moments, sans-serif for data.
2. **Clarity over cleverness.** Every section has one job. No visual noise competing with the message. White space is not wasted space — it's breathing room.
3. **Confidence over urgency.** The product is good. The data is real. We don't need to shout. Quiet authority sells harder than pressure.

---

## 2. COLOR SYSTEM

### The Palette Philosophy

| Role | Token | HSL Value | Hex (approx) | Emotional Function |
|------|-------|-----------|---------------|-------------------|
| **Background** | `--background` | `35 30% 98%` | `#faf8f5` | Warm cream. Not clinical white. Feels like a therapist's waiting room — calm, private, intentional. |
| **Foreground** | `--foreground` | `200 50% 15%` | `#13293d` | Deep navy. Grounded, authoritative, readable. Not harsh black. |
| **Primary** | `--primary` | `280 40% 55%` | `#8b5fbf` | Soft purple. Signals insight, depth, transformation. Used for CTAs, links, and moments of action. |
| **Secondary** | `--secondary` | `15 65% 65%` | `#d98b6a` | Warm peach/coral. Human warmth. Used for emotional highlights and the "we care" moments. |
| **Accent** | `--accent` | `10 60% 60%` | `#cc6652` | Terracotta. Earthier, more grounded than secondary. Used sparingly for emphasis. |
| **Muted** | `--muted` | `35 25% 92%` | `#ece7df` | Warm sand. Section backgrounds, card fills, subtle separation. |
| **Border** | `--border` | `35 20% 85%` | `#ddd6cc` | Taupe. Soft separation. Never harsh. |
| **Destructive** | `--destructive` | `0 84% 60%` | `#ef4444` | Reserved for genuine danger signals — toxicity scores, red flags, clinical warnings. Never for marketing urgency. |
| **Success** | `--success` | `141 40% 50%` | `#4dbd72` | Gentle green. Progress indicators, "analysis complete" badges, positive scores. |

### Color Usage Rules

**DO:**
- Use `bg-background` for main page backgrounds (the warm cream)
- Use `bg-card` for elevated content areas (cards, modals, feature blocks)
- Use `bg-muted/30` for subtle section separation (never stark color jumps)
- Use `text-primary` for CTAs, links, and emphasis words in body copy
- Use `text-muted-foreground` for supporting copy (not `text-gray-500` — stay in the warm family)
- Use `border-border` for all structural lines (taupe, not gray)

**DON'T:**
- Never use pure white (`#fff`) for backgrounds — always `bg-background` (warm cream)
- Never use pure black (`#000`) for text — always `text-foreground` (deep navy)
- Never use red for marketing urgency. Red = clinical danger only.
- Never use `bg-slate-900/950` for dark sections on the selling page — it breaks the warmth. Use `bg-foreground` (deep navy) or `bg-primary/90` instead.
- Never use gray-based muted tones. All muted colors should have the warm 35-degree hue undertone.

### Semantic Color Patterns

```
SCORES & DATA
  Score < 40:    text-destructive (red — danger)
  Score 40-69:   text-orange-500 (caution)
  Score 70+:     text-success (healthy)

RISK LEVELS
  Severe:        bg-red-50 border-red-200 text-red-700
  High:          bg-orange-50 border-orange-200 text-orange-700
  Moderate:      bg-yellow-50 border-yellow-200 text-yellow-700
  Low:           bg-emerald-50 border-emerald-200 text-emerald-700

SECTION BACKGROUNDS (alternating rhythm)
  Primary:       bg-background (warm cream)
  Alternate:     bg-muted/30 (sandy overlay)
  Elevated:      bg-card (slightly warmer cream)
  Emphasis:      bg-primary/5 (purple whisper)
  Danger:        bg-red-50 / bg-orange-50 (reserved for clinical warnings)
```

---

## 3. TYPOGRAPHY

### Font: Atkinson Hyperlegible

Designed for maximum legibility. Every character is distinct — no confusion between `I`, `l`, `1` or `O`, `0`. This matters because our users are often reading at 2am on their phones through tears. Legibility is not optional.

### Type Scale

| Role | Class | Size | Weight | Usage |
|------|-------|------|--------|-------|
| **Page Hero** | `text-4xl md:text-6xl font-black` | 36/60px | 900 | One per page. The first thing they read. |
| **Section Headline** | `text-3xl md:text-5xl font-black` | 30/48px | 900 | Section headers. Short, punchy, emotional. |
| **Subsection** | `text-2xl font-bold` | 24px | 700 | Card titles, feature headers. |
| **Body Lead** | `text-xl text-muted-foreground leading-relaxed` | 20px | 400 | First paragraph under a headline. Slightly larger for readability. |
| **Body** | `text-base text-muted-foreground leading-relaxed` | 16px | 400 | Default reading copy. |
| **Body Small** | `text-sm text-muted-foreground leading-relaxed` | 14px | 400 | Supporting details, card descriptions. |
| **Caption/Label** | `text-xs font-bold uppercase tracking-widest text-muted-foreground` | 12px | 700 | Section labels, badges, metadata. Always uppercase. |
| **Emotional Quote** | `text-xl italic font-serif` | 20px | 400 | Testimonials, pull quotes. Use a serif font-stack for warmth. |

### Typography Rules

**Headlines:**
- Always `font-black` (900 weight). Never medium or semibold for headlines — it looks unsure.
- One `text-primary` keyword per headline max. Example: "The Diagnosis Was Free. The **Cure** Is Inside."
- Max 12 words. If it's longer, it's not a headline — it's a paragraph pretending.

**Body copy:**
- Always `leading-relaxed` (1.625 line height). Tight line height feels claustrophobic. These people need space to breathe.
- Always `text-muted-foreground` for body, never `text-foreground` — the navy is for headlines and emphasis only.
- Max line width: `max-w-2xl` (672px) for reading copy. Wider = harder to read = they leave.

**Emphasis in body:**
- Bold a key phrase, not a whole sentence: `<strong className="text-foreground">exact words</strong>`
- The bolded phrase should be the answer to "if they only read 5 words, what should those words be?"

---

## 4. SPACING & RHYTHM

### Vertical Section Spacing

```
Between major sections:     py-24 (96px) — breathing room
Between subsections:        py-16 (64px) — moderate pause
Between elements in section: space-y-8 (32px) — comfortable
Between items in list:       space-y-4 (16px) — tight but readable
```

### The Breathing Pattern

Selling pages need rhythm. The user should feel a pulse: tension → release → tension → release.

```
SECTION TYPE          PADDING    BACKGROUND         EMOTION
HVCO Hero             pt-8 pb-16  bg-background      Neutral/Clinical
Mirror                py-24      bg-muted/30         Warm/Identification
Bridge                py-20      bg-muted/20         Grateful/Reflective
Vision                py-24      bg-background       Hopeful/Desiring
Warning               py-16      bg-orange-50        Tense/Urgent
Trajectories          py-24      bg-card             Heavy/Fearful
Solution              py-24      bg-background       Relieved/Excited
Guides                py-24      bg-muted/30         Impressed/Valued
Testimonials          py-24      bg-background       Trusting
Offer                 py-24      bg-muted/20         Decisive
```

Never use two `bg-background` sections in a row. Alternate with `bg-muted/30`, `bg-card`, or `bg-primary/5` to create visual paragraphs.

---

## 5. COMPONENT PATTERNS

### 5.1 The CTA Button

The primary action button. One per viewport. Never more than one competing CTA visible at the same time.

```tsx
// PRIMARY CTA (the one that makes money)
<button className="
  bg-primary hover:bg-primary/90
  text-primary-foreground
  font-bold text-xl
  py-5 px-12
  rounded-full
  shadow-2xl hover:shadow-3xl
  hover:scale-105
  transition-all
  flex items-center justify-center gap-3
">
  Unlock My Full Analysis — $29 <ArrowRight size={24} />
</button>

// NEVER: animate-pulse, animate-bounce, or any jittery animation.
// The button is confident. It doesn't beg.
```

**CTA Copy Rules:**
- Lead with the verb: "Unlock", "Reveal", "Get", "See"
- Include what they get: "My Full Analysis"
- Include the price: "$29"
- Use an em dash, not a hyphen: " — "

### 5.2 The Score Card

Used in the HVCO hero to show dimension scores.

```tsx
<div className="bg-card border border-border/50 p-4 rounded-xl text-center shadow-sm">
  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
    Communication
  </h4>
  <div className={`text-3xl font-black mb-2 ${
    score < 40 ? 'text-destructive' :
    score < 70 ? 'text-orange-500' : 'text-success'
  }`}>
    {score}<span className="text-sm opacity-50">/100</span>
  </div>
  <p className="text-[11px] text-muted-foreground leading-snug">
    {dimensionInsight}
  </p>
</div>
```

**Rules:**
- Score number is the visual anchor — always `text-3xl font-black`
- Color communicates severity before the user reads anything
- Insight text below provides meaning — never "Locked"

### 5.3 The Feature/Benefit Block

Used in report breakdown and guide descriptions.

```tsx
<div className="flex gap-5">
  <div className="shrink-0 h-10 w-10 bg-primary/10 text-primary rounded-lg
                  flex items-center justify-center">
    <Icon size={20} />
  </div>
  <div>
    <h4 className="text-xl font-bold mb-2">{benefitHeadline}</h4>
    <p className="text-muted-foreground text-sm leading-relaxed">
      {benefitDescription}
    </p>
  </div>
</div>
```

**Rules:**
- Headline is a BENEFIT, not a feature. "Know What to Say Tonight" not "Custom Scripts Feature"
- Icon uses `bg-primary/10 text-primary` — subtle, not shouting
- Description is `text-sm` — supporting, not competing with headline

### 5.4 The Testimonial Card

Social proof. The most important visual element after the CTA.

```tsx
// FEATURED (one large, centered)
<div className="bg-secondary/5 border border-border rounded-2xl p-8 md:p-12
                max-w-3xl mx-auto text-center">
  <p className="text-xl md:text-2xl italic font-serif text-muted-foreground
                mb-6 leading-relaxed">
    "{quote}"
  </p>
  <div className="font-bold text-foreground">— {name}, {age}, {city}</div>
</div>

// GRID (multiple smaller cards)
<div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
  <div className="flex gap-1 text-yellow-500 mb-3">
    {stars}
  </div>
  <p className="text-muted-foreground mb-4 italic text-sm leading-relaxed">
    "{quote}"
  </p>
  <div className="font-bold text-foreground text-sm">— {name}, {age}, {city}</div>
</div>
```

**Rules:**
- Featured testimonials use `font-serif italic` — emotional, literary, human
- Grid testimonials use default font — readable, compact
- Always include age and city — specificity = credibility
- Yellow stars (`text-yellow-500 fill-currentColor`) — universal trust signal
- Quote should contain a "money quote" — the one sentence that makes a prospect think "that's me"

### 5.5 The Value Stack Item

Used in the offer section to list what's included with prices.

```tsx
<li className="flex items-start gap-4">
  <CheckCircle className="text-primary shrink-0 mt-1" size={24} />
  <div className="flex-1">
    <div className="flex justify-between items-start">
      <span className="font-bold text-lg leading-tight">{itemName}</span>
      <div className="text-right">
        <span className="text-sm line-through text-destructive opacity-80 mr-2">
          ${anchorPrice}
        </span>
        <span className="font-bold text-success">Included</span>
      </div>
    </div>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
  </div>
</li>
```

**Rules:**
- Anchor price is always struck through in `text-destructive` — red = money you're saving
- "Included" or "Free" in `text-success` — green = value gained
- CheckCircle icon in `text-primary` — consistent with brand

### 5.6 The Guarantee Block

The risk-reversal section. Must feel substantial, not hidden.

```tsx
<div className="bg-secondary/10 p-8 md:p-10 flex flex-col md:flex-row
                items-center gap-8 rounded-3xl border border-border">
  <div className="shrink-0">
    <div className="w-20 h-20 bg-yellow-100 rounded-full
                    flex items-center justify-center">
      <Shield className="text-yellow-600 w-10 h-10" />
    </div>
  </div>
  <div className="text-center md:text-left">
    <h3 className="text-2xl font-bold text-foreground mb-3">
      The "Lightbulb Moment" Guarantee
    </h3>
    <p className="text-muted-foreground leading-relaxed">
      {guaranteeCopy}
    </p>
  </div>
</div>
```

**Rules:**
- Yellow shield icon — universal "protection" signal
- Guarantee has a NAME — not generic "money back guarantee"
- Large, prominent, not buried — if you're confident in the product, show it
- `bg-secondary/10` — warm tint, not cold gray

### 5.7 The Bridge Section

The most important section on the page — where free transitions to paid.

```tsx
<section className="py-20 px-6 bg-muted/20 border-y border-border">
  <div className="max-w-3xl mx-auto">
    <h2 className="text-3xl font-black text-foreground text-center mb-10">
      What You Just Got — For Free
    </h2>
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-10">
      <ul className="space-y-4 text-foreground font-medium">
        {freeItems.map(item => (
          <li className="flex items-start gap-3">
            <CheckCircle size={20} className="text-success shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
    {/* Anchor + Gap + Transition */}
    <div className="text-center space-y-6">
      <p className="text-lg text-muted-foreground">
        A therapist charges <strong className="text-foreground">$150/session</strong>...
      </p>
      <div className="h-px w-16 bg-primary/30 mx-auto" />
      <p className="text-xl font-bold text-foreground">But here's the truth.</p>
      <p className="text-lg text-muted-foreground">
        Knowing the pattern is <strong className="text-foreground">step 1</strong>.
        The treatment plan is the other 80%.
      </p>
    </div>
  </div>
</section>
```

**Rules:**
- Background: `bg-muted/20` — slightly distinct from surrounding sections
- Border top and bottom: `border-y border-border` — it's a DIVIDER between free and paid
- The thin horizontal line (`h-px w-16 bg-primary/30`) is a visual pause — the "beat" before the key message
- Green checkmarks for free items (they HAVE these) — celebration, not sales

### 5.8 The Trajectory Timeline

The "cost of inaction" section. Uses a timeline with year circles and progressive accent colors to communicate deterioration over time — all within the warm palette.

```tsx
<section className="py-24 px-6 bg-muted/30 border-y border-border/50">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl md:text-5xl font-black text-foreground">
      Where This Leads in <span className="text-primary">5 Years</span>
    </h2>

    <div className="grid md:grid-cols-3 gap-8">
      {paths.map((path, idx) => (
        <div className="flex flex-col items-center">
          {/* Year circle — bg-card with colored border */}
          <div className={`h-[72px] w-[72px] rounded-full bg-card shadow-sm border-2
                          flex items-center justify-center
                          ${idx === 0 ? "border-primary/40 text-primary" :
                            idx === 1 ? "border-secondary/40 text-secondary" :
                            "border-border text-muted-foreground"}`}>
            <span className="text-2xl font-black">{yearNumber}</span>
          </div>

          {/* Card — bg-card with accent border */}
          <div className={`bg-card rounded-2xl border overflow-hidden
                          ${idx === 0 ? "border-primary/20" :
                            idx === 1 ? "border-secondary/20" :
                            "border-border/60"}`}>
            <div className={`h-1 ${
              idx === 0 ? "bg-primary" :
              idx === 1 ? "bg-secondary" :
              "bg-muted-foreground/30"
            }`} />
            <div className="p-6 md:p-8">
              <h3 className="font-black text-xl text-foreground">{path.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{path.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Rules:**
- Background: `bg-muted/30` — warm sand, consistent with the page rhythm. Never dark backgrounds.
- Cards: `bg-card` with colored borders — `border-primary/20`, `border-secondary/20`, `border-border/60`.
- Year circles: `bg-card shadow-sm` with `border-2` in accent color. Large `text-2xl font-black` numbers.
- Accent color progression: primary (purple) → secondary (warm peach) → muted-foreground (neutral). Warm throughout.
- Top accent bar: `h-1` matching the card's accent — primary → secondary → muted-foreground/30.
- Icon boxes: `bg-primary/10 text-primary` → `bg-secondary/10 text-secondary` → `bg-muted text-muted-foreground`.
- Text: standard `text-foreground` for titles, `text-muted-foreground` for body. No special opacity modifiers.
- Horizontal connecting line on desktop: `from-primary/30 via-secondary/20 to-border`.
- Vertical segments on mobile: `w-px h-6 bg-gradient-to-b from-border to-transparent`.

### 5.9 The Clinical Snapshot Grid

A compact grid of 6 key metrics displayed as small score cards. Used in the HVCO Hero to demonstrate data depth at a glance.

```tsx
<div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
  {metrics.map((m) => (
    <div className="bg-card border border-border/50 p-3 rounded-xl text-center">
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
        {m.label}
      </p>
      <p className={`text-xl font-black ${
        isBad ? 'text-red-500' : isGood ? 'text-emerald-500' : 'text-orange-500'
      }`}>
        {m.val}<span className="text-[10px] opacity-50">%</span>
      </p>
    </div>
  ))}
</div>
```

**Rules:**
- 3 columns on mobile, 6 on desktop — compact, scannable
- `text-[9px]` labels — smallest readable size, uppercase + tracking-wider for legibility
- `text-xl font-black` values — the number IS the card
- Color encodes meaning instantly — red/orange/green, no legend needed
- For "inverted" metrics (Burnout, Resentment — where high = bad), flip the color logic
- No descriptions or teasers — this is a dashboard, not a reading section

---

## 6. PAGE RHYTHM TEMPLATE

The complete emotional arc for a selling page, with design tokens:

```
┌─────────────────────────────────────────────────┐
│  HERO (HVCO)                                     │
│  bg-background, pt-8 pb-16                       │
│  Emotion: Clinical trust. "They know my data."   │
│  Key element: Score cards, diagnosis unlock       │
├─────────────────────────────────────────────────┤
│  MIRROR (Identification)                         │
│  bg-muted/30, py-24                              │
│  Emotion: "Someone sees me."                     │
│  Key element: Symptom cards with left border     │
├─────────────────────────────────────────────────┤
│  BRIDGE (Free → Paid transition)                 │
│  bg-muted/20, py-20, border-y                    │
│  Emotion: Gratitude → Desire                     │
│  Key element: Free value recap + gap statement   │
├─────────────────────────────────────────────────┤
│  VISION (Paid outcomes)                          │
│  bg-background, py-24                            │
│  Emotion: "I want that."                         │
│  Key element: Visceral "imagine..." paragraphs   │
├─────────────────────────────────────────────────┤
│  WARNING (Urgency)                               │
│  bg-orange-50 or bg-red-50, py-16               │
│  Emotion: "I can't wait."                        │
│  Key element: Clinical data, not marketing hype  │
├─────────────────────────────────────────────────┤
│  TRAJECTORIES (Cost of inaction)                 │
│  bg-muted/30, py-24, border-y border-border/50  │
│  Emotion: Fear of loss, inevitability            │
│  Key element: Timeline with year circles +       │
│    warm cards with accent color progression      │
├─────────────────────────────────────────────────┤
│  SOLUTION (Report breakdown)                     │
│  bg-background, py-24                            │
│  Emotion: "This is the answer."                  │
│  Key element: Benefit blocks with icons          │
├─────────────────────────────────────────────────┤
│  PREMIUMS (Bonus guides)                         │
│  bg-muted/30, py-24                              │
│  Emotion: "This is insane value."                │
│  Key element: Guide cards with dollar values     │
├─────────────────────────────────────────────────┤
│  SOCIAL PROOF (Testimonials)                     │
│  bg-background, py-24                            │
│  Emotion: "Others like me got results."          │
│  Key element: Featured + grid layout             │
├─────────────────────────────────────────────────┤
│  OFFER (CTA + Value stack)                       │
│  bg-muted/20, py-24                              │
│  Emotion: "This is a no-brainer."                │
│  Key element: Price card, CTA, order bump        │
├─────────────────────────────────────────────────┤
│  GUARANTEE                                       │
│  Within offer section                            │
│  Emotion: "I have nothing to lose."              │
│  Key element: Named guarantee with shield icon   │
├─────────────────────────────────────────────────┤
│  COMPARISON + FAQ                                │
│  bg-background, py-12                            │
│  Emotion: "No remaining objections."             │
│  Key element: Table + accordion                  │
└─────────────────────────────────────────────────┘
```

---

## 7. ANTI-PATTERNS (Never Do This)

| Anti-Pattern | Why It Fails | Do This Instead |
|---|---|---|
| `animate-pulse` on CTA buttons | Signals desperation. Cheapens the brand. | `hover:scale-105 transition-all` — confident, not needy |
| Pure white backgrounds (`#fff`, `bg-white`) | Feels cold and clinical like a hospital | `bg-background` (warm cream) or `bg-card` |
| `bg-slate-900` for dark sections | Breaks the warm palette, feels like a different site | `bg-foreground` (deep navy) for rare dark sections |
| Red for marketing urgency | Users associate red with danger. Using it for "limited time!" erodes trust in your real clinical warnings | Red = clinical data only. Urgency = time-based copy, not color |
| Smart/curly quotes in JSX | Causes Vite/Babel compilation errors (U+201C/201D) | Always use straight quotes in code. Regular `"` and `'` only |
| "AI-generated" labels | Users perceive AI content as cheap/generic | Never mention AI in user-facing copy. Position as "clinical analysis" |
| Multiple competing CTAs in one viewport | Choice paralysis. They click nothing | One primary CTA per scroll-stop. Use text links for secondary actions |
| Gray-toned muted colors | Feels depressing for a relationship product | All muted colors inherit the warm 35-degree hue base |
| `text-foreground` for body paragraphs | Too heavy. Reading fatigue on long pages | `text-muted-foreground` for body. `text-foreground` for headlines + emphasis only |
| Emojis in section headers | Cheapens clinical authority | Use Lucide icons (`size={20}`) in muted icon boxes instead |

---

## 8. QUICK REFERENCE: TAILWIND CLASS CHEATSHEET

```
BACKGROUNDS
  Page base:        bg-background
  Alternate:        bg-muted/30
  Cards:            bg-card
  Subtle elevation: bg-primary/5
  Danger section:   bg-red-50 dark:bg-red-950/20
  Warning section:  bg-orange-50 dark:bg-orange-950/20
  Success element:  bg-emerald-50 dark:bg-emerald-900/10

TEXT
  Headlines:        text-foreground font-black
  Body:             text-muted-foreground leading-relaxed
  Emphasis:         text-foreground font-bold (within muted body)
  Primary action:   text-primary font-bold
  Scores (bad):     text-destructive
  Scores (mid):     text-orange-500
  Scores (good):    text-success
  Captions:         text-xs font-bold uppercase tracking-widest text-muted-foreground

BORDERS
  Standard:         border border-border
  Subtle:           border border-border/50
  Primary accent:   border-2 border-primary
  Danger:           border-2 border-red-200

CONTAINERS
  Reading width:    max-w-2xl (672px)
  Content width:    max-w-3xl (768px)
  Full sections:    max-w-4xl or max-w-5xl
  Page max:         max-w-6xl

BORDER RADIUS
  Cards/sections:   rounded-2xl (1rem)
  Large sections:   rounded-3xl (1.5rem)
  Buttons:          rounded-full
  Small elements:   rounded-xl

SHADOWS
  Cards:            shadow-sm
  Elevated cards:   shadow-lg
  CTAs:             shadow-2xl hover:shadow-3xl
  Overlays:         shadow-2xl
```
