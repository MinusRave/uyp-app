import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery, getWorkbookDownloadUrl } from "wasp/client/operations";
import { ArrowDown, Loader2, RefreshCw } from "lucide-react";
import { trackPixelEvent } from "../analytics/pixel";

export default function WorkbookDownloadPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session") ?? "";
  const [refreshKey, setRefreshKey] = useState(0);
  const purchaseFired = useRef(false);

  const { data, isLoading, error } = useQuery(
    getWorkbookDownloadUrl,
    { sessionId, _refresh: refreshKey } as any,
    { enabled: !!sessionId },
  );

  // Pixel Purchase event. eventID = Stripe checkout session id (matches CAPI sent
  // server-side from the webhook). Fires once when the download URLs are ready.
  useEffect(() => {
    if (purchaseFired.current) return;
    const stripeId = data?.stripeCheckoutSessionId;
    if (!stripeId) return;
    purchaseFired.current = true;
    const hasCompanion = !!data?.bonusUrl;
    trackPixelEvent("Purchase", {
      value: hasCompanion ? 24 : 17,
      currency: "USD",
      content_name: "Should I Stay or Leave My Partner? — The Workbook",
      content_category: "Workbook",
      content_ids: hasCompanion ? ["workbook", "companion"] : ["workbook"],
      content_type: "product",
      eventID: stripeId,
    });
  }, [data?.stripeCheckoutSessionId, data?.bonusUrl]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-foreground font-bold">Invalid download link.</p>
          <a href="/workbook" className="text-primary underline text-sm">Go back</a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-primary mx-auto" size={32} />
          <p className="text-sm text-muted-foreground">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.workbookUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-foreground font-bold">We're confirming your payment.</p>
          <p className="text-sm text-muted-foreground">This usually takes a few seconds. Click below to try again.</p>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-2 text-primary underline text-sm"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payment confirmed</p>
          <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight">
            {data.bonusUrl ? "Your files are ready." : "Your workbook is ready."}
          </h1>
          <p className="text-base text-muted-foreground">
            {data.bonusUrl
              ? "Download both files. Print the workbook and sit down with a pen tonight."
              : "Print the workbook and sit down with a pen tonight."}
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={data.workbookUrl}
            download
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold py-5 rounded-full shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Download the workbook
            <ArrowDown size={20} />
          </a>
          {data.bonusUrl && (
            <a
              href={data.bonusUrl}
              download
              className="w-full border-2 border-primary/40 bg-card hover:bg-muted/40 text-foreground text-base font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2"
            >
              Download "What If I Regret It?"
              <ArrowDown size={18} />
            </a>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          These links expire in 1 hour. If they stop working, refresh the page to get new ones.
        </p>

        <footer className="text-center text-xs text-muted-foreground/60 pt-4 border-t border-border/50">
          <p>© UnderstandYourPartner</p>
        </footer>
      </div>
    </div>
  );
}
