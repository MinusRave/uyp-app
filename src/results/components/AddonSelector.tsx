import { Check } from "lucide-react";
import {
  ADDONS,
  BUNDLE_PRICE,
  computeAddonsTotal,
  computeBundleSavings,
  isBundle,
} from "../../payment/addons";

type Props = {
  selected: string[];
  onChange: (ids: string[]) => void;
  bundleAvailable?: boolean;
};

export function AddonSelector({ selected, onChange, bundleAvailable = true }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectAll = () => onChange(ADDONS.map((a) => a.id));
  const clearAll = () => onChange([]);

  const bundle = isBundle(selected);
  // If the bundle window has closed, charge individually (ignore bundle discount).
  const addonsTotal = bundleAvailable
    ? computeAddonsTotal(selected)
    : selected.length * ADDONS[0].price;
  const savings = bundleAvailable ? computeBundleSavings(selected) : 0;
  const showBundleNudge = bundleAvailable && selected.length >= 4 && !bundle;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Add Extra Guides (Optional)</p>
        {bundle ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        ) : bundleAvailable ? (
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-primary font-bold hover:underline"
          >
            Add all 6 for $9.99 — save ${(ADDONS.length * ADDONS[0].price - BUNDLE_PRICE).toFixed(2)}
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        {ADDONS.map((addon) => {
          const isChecked = selected.includes(addon.id);
          return (
            <button
              type="button"
              key={addon.id}
              onClick={() => toggle(addon.id)}
              className={`w-full text-left rounded-xl border-2 p-3 transition-all flex items-start gap-3 ${
                isChecked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <div
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isChecked ? "bg-primary border-primary" : "border-muted-foreground/40"
                }`}
              >
                {isChecked && <Check size={12} className="text-primary-foreground" strokeWidth={3} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-sm text-foreground truncate">{addon.name}</p>
                  <span className="text-xs font-bold text-primary shrink-0">+${addon.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                  {addon.benefit}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {showBundleNudge && (
        <div className="rounded-lg bg-primary/10 border border-primary/30 p-3 text-center">
          <p className="text-xs text-foreground">
            Get all 6 for just <span className="font-bold">${BUNDLE_PRICE.toFixed(2)}</span> and save
            <span className="font-bold"> ${(ADDONS.length * ADDONS[0].price - BUNDLE_PRICE).toFixed(2)}</span>.
          </p>
          <button
            type="button"
            onClick={selectAll}
            className="mt-2 text-xs font-bold text-primary underline"
          >
            Add the missing ones
          </button>
        </div>
      )}

      {!bundleAvailable && (
        <div className="rounded-lg bg-muted/40 border border-border p-3 text-center text-xs text-muted-foreground">
          The $9.99 bundle has ended. Guides are $2.99 each.
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            {bundle ? "All 6 guides bundle" : `${selected.length} guide${selected.length === 1 ? "" : "s"} added`}
          </span>
          <span className="font-bold text-foreground">
            +${addonsTotal.toFixed(2)}
            {bundle && savings > 0 && (
              <span className="ml-2 text-xs text-emerald-600">saved ${savings.toFixed(2)}</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
