import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { bundleExpiresAtMs } from "../../payment/addons";

type Props = {
  offerStartedAt: Date | string | null | undefined;
  onExpire?: () => void;
  variant?: "pill" | "banner";
};

function formatCountdown(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function CountdownBadge({ offerStartedAt, onExpire, variant = "pill" }: Props) {
  const expiresAtMs = bundleExpiresAtMs(offerStartedAt);
  const [msLeft, setMsLeft] = useState<number | null>(
    expiresAtMs !== null ? expiresAtMs - Date.now() : null,
  );
  const [hasFiredExpire, setHasFiredExpire] = useState(false);

  useEffect(() => {
    if (expiresAtMs === null) {
      setMsLeft(null);
      return;
    }
    const tick = () => {
      const remaining = expiresAtMs - Date.now();
      setMsLeft(remaining);
      if (remaining <= 0 && !hasFiredExpire) {
        setHasFiredExpire(true);
        onExpire?.();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAtMs, onExpire, hasFiredExpire]);

  if (msLeft === null) return null;
  const expired = msLeft <= 0;

  if (variant === "banner") {
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
          expired
            ? "bg-muted text-muted-foreground"
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
        }`}
      >
        <Clock size={16} className="shrink-0" />
        {expired ? (
          <span>Bundle offer ended</span>
        ) : (
          <span>
            Bundle: all 6 guides for $9.99 — <span className="tabular-nums">{formatCountdown(msLeft)}</span> left
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        expired
          ? "bg-muted text-muted-foreground"
          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
      }`}
    >
      <Clock size={12} className="shrink-0" />
      {expired ? "Ended" : <span className="tabular-nums">{formatCountdown(msLeft)}</span>}
    </span>
  );
}
