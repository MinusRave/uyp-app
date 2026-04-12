import type { MiddlewareConfigFn } from "wasp/server";

export const sessionRedirectMiddlewareConfigFn: MiddlewareConfigFn = (middlewareConfig) => {
    return middlewareConfig;
};

/**
 * Server-side redirect for external entry points (Stripe return, email links).
 *
 * The client SPA is served as static files — direct URL access to routes like
 * /report or /results returns 404 from the file server. This API endpoint
 * receives the target page + query params and redirects to the client root
 * with a `_to` param that the SPA picks up for client-side navigation.
 */
export const sessionRedirect = async (req: any, res: any, _context: any) => {
    const clientUrl = process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000";

    const to = req.query.to as string; // e.g. "report" or "results"
    if (!to) {
        return res.status(400).send("Missing 'to' parameter");
    }

    // Forward all query params except 'to' into the target path
    const targetParams = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
        if (key === "to") continue;
        if (typeof value === "string") targetParams.set(key, value);
    }

    const targetQuery = targetParams.toString();
    const targetPath = `/${to}${targetQuery ? "?" + targetQuery : ""}`;

    // Redirect to client root with _to param — index.html always resolves at /
    res.redirect(`${clientUrl}/?_to=${encodeURIComponent(targetPath)}`);
};
