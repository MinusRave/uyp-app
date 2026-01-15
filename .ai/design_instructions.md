# UnderstandYourPartner Design Specifications

**Purpose**: This document instructs an AI agent (or developer) on how to style the application to match the "UnderstandYourPartner" identity.

**Project Context**: This is a psychology-inspired relationship tool, NOT a tech startup or clinical app. It must feel safe, warm, clear, and non-judgmental.

## 1. Technical Stack Constraints
The target project uses:
-   **Framework**: Wasp (React-based fullstack)
-   **Styling**: Tailwind CSS v3
-   **UI Library**: shadcn/ui (New York style)
-   **Icons**: Lucide Icons

## 2. Visual Identity & "Vibe"
-   **Goal**: Emphasize **clarity over certainty** and **understanding over judgment**.
-   **Aesthetic**:
    -   **Warm & Safe**: Use organic, warm tones (cream, peach, soft purple) instead of sterile whites or cold blues.
    -   **Clean & Readable**: High contrast text, legible fonts, plenty of whitespace.
    -   **Friendly**: Rounded corners, soft shadows, no sharp edges.

## 3. Design Tokens

### Colors (HSL)
Use these exact specific HSL values in your `global.css` (or tailwind config equivalents).

**Base Palette (Light Mode)**
-   **Background**: `35 30% 98%` (Warm Cream) -> *Not pure white.*
-   **Foreground**: `200 50% 15%` (Deep Navy) -> *Softer than black.*
-   **Card**: `35 30% 99%` (Slightly lighter cream)
-   **Card Foreground**: `200 50% 15%`
-   **Muted**: `35 25% 92%` (Warm Sand)
-   **Muted Foreground**: `200 20% 40%`
-   **Border**: `35 20% 85%` (Taupe)

**Brand Colors**
-   **Primary**: `280 40% 55%` (Soft Purple) -> *Psychology, introspection.*
-   **Primary Foreground**: `0 0% 98%`
-   **Secondary**: `15 65% 65%` (Warm Peach/Coral) -> *Warmth, compassion.*
-   **Secondary Foreground**: `30 15% 15%`
-   **Accent**: `10 60% 60%` (Terracotta)
-   **Accent Foreground**: `0 0% 98%`

**Dark Mode Palette**
-   **Background**: `260 15% 10%` (Deep Purple-Tinted Dark)
-   **Foreground**: `0 0% 98%`
-   **Primary**: `280 50% 65%` (Lighter Purple)
-   **Secondary**: `15 70% 68%` (Brighter Peach)

### Typography
-   **Font Family**: **Atkinson Hyperlegible** (or similar highly readable sans-serif like Inter or Geist if Atkinson is unavailable, but Atkinson is preferred for the friendly/accessible feel).
-   **Headings**: Bold, clear hierarchy.
-   **Body**: Readable line-heights (relaxed).

### Dimensions & Shape
-   **Radius**: `1rem` (Rounded). Defined as `--radius: 1rem;`
-   **Spacing**: Generous. Avoid cramped layouts.

## 4. Component Usage (shadcn/ui)
-   **Buttons**: Rounded (`rounded-2xl` generic or use radius variable).
    -   *Primary*: Purple background, white text.
    -   *Secondary*: Peach background, dark text (friendly alternative actions).
    -   *Ghost*: For low priority nav items.
-   **Cards**: Soft shadows, warm white background (in light mode), rounded corners.
-   **Inputs**: Warm border color, purple focus ring.
    -   *Focus Ring*: `--ring: 280 40% 55%`

## 5. Layout Patterns
-   **Header**: Simple, sticky or distinct, carrying the logo and main nav.
-   **Hero**: Text-heavy but clearly typographed. Centered or split. Warm background.
-   **Content**: Single column for reading (reports/articles), max-width constrained for readability (e.g., `prose` or `max-w-3xl`).
-   **Gradients**: Use valid gradients like `bg-gradient-to-r from-[hsl(var(--secondary-muted))] to-[hsl(var(--secondary))]` for accent text ("Nomad" gradient).

## 6. Do's and Don'ts
-   **DO**: Use the "Soft Purple" for primary calls to action (Sign up, Start Test).
-   **DO**: Use the "Warm Peach" for highlights, secondary buttons, or friendly accents.
-   **DON'T**: Use standard "Tech Blue" or "Success Green".
-   **DON'T**: Use sharp/square corners (unless specific UI element requires it).
-   **DON'T**: Make it look like a SaaS dashboard. It should look like a helpful personal guide.

## 7. Implementation Snippets
**Tailwind Theme Extension (Example)**
```js
{
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... include mute, accent, card, popover, border
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```
