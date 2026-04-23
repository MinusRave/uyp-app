export interface Addon {
  id: string;
  name: string;
  benefit: string;
  price: number;
  stripeDescription: string;
}

export const ADDON_PRICE = 2.99;
export const BUNDLE_PRICE = 9.99;
export const BUNDLE_ID = "all-six-bundle";
export const BUNDLE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes from offerStartedAt

export function isBundleAvailable(offerStartedAt: Date | string | null | undefined): boolean {
  if (!offerStartedAt) return true; // Never-viewed: offer hasn't started; treat as available until started
  const started = typeof offerStartedAt === "string" ? new Date(offerStartedAt) : offerStartedAt;
  return Date.now() - started.getTime() < BUNDLE_WINDOW_MS;
}

export function bundleExpiresAtMs(offerStartedAt: Date | string | null | undefined): number | null {
  if (!offerStartedAt) return null;
  const started = typeof offerStartedAt === "string" ? new Date(offerStartedAt) : offerStartedAt;
  return started.getTime() + BUNDLE_WINDOW_MS;
}

export const ADDONS: Addon[] = [
  {
    id: "mental-load",
    name: "Who Does What (Fairly)",
    benefit: "Stop being the one who does everything at home.",
    price: ADDON_PRICE,
    stripeDescription: "Worksheet and scripts to split tasks without fighting.",
  },
  {
    id: "dead-bedroom",
    name: "Bring Back the Spark",
    benefit: "Want each other again — without pressure.",
    price: ADDON_PRICE,
    stripeDescription: "An 8-week plan to rebuild desire step by step.",
  },
  {
    id: "narcissist-detection",
    name: "Is This Person Safe?",
    benefit: "Know if it's hard — or dangerous.",
    price: ADDON_PRICE,
    stripeDescription: "21 red flags and what to do if you see them.",
  },
  {
    id: "emotional-affair",
    name: "Are They Cheating?",
    benefit: "See the 19 early signs before it gets worse.",
    price: ADDON_PRICE,
    stripeDescription: "Clinical checklist with steps at each stage.",
  },
  {
    id: "stay-or-go",
    name: "Should You Stay or Go?",
    benefit: "The hardest question. Answered clearly.",
    price: ADDON_PRICE,
    stripeDescription: "A 12-point checklist so you don't regret your choice.",
  },
  {
    id: "workbook",
    name: "30-Day Reconnection Workbook",
    benefit: "Daily steps to rebuild your bond, week by week.",
    price: ADDON_PRICE,
    stripeDescription: "Guided exercises for 30 days, one per day.",
  },
];

export const ADDON_IDS = ADDONS.map((a) => a.id);

export function getAddonById(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}

export function isBundle(selectedIds: string[]): boolean {
  return selectedIds.length === ADDONS.length;
}

export function computeAddonsTotal(selectedIds: string[]): number {
  if (isBundle(selectedIds)) return BUNDLE_PRICE;
  return selectedIds.reduce((sum, id) => {
    const addon = getAddonById(id);
    return sum + (addon?.price ?? 0);
  }, 0);
}

export function computeBundleSavings(selectedIds: string[]): number {
  const individual = selectedIds.length * ADDON_PRICE;
  return Math.max(0, individual - BUNDLE_PRICE);
}
