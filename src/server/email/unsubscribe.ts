import { type TestSession } from "wasp/entities";

// Unsubscribe handler
export async function handleUnsubscribe(req: any, res: any, context: any) {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send("Missing unsubscribe token");
    }

    try {
        // Token is the session ID
        const session = await context.entities.TestSession.findUnique({
            where: { id: token },
        });

        if (!session) {
            return res.status(404).send("Session not found");
        }

        // Update unsubscribe status
        await context.entities.TestSession.update({
            where: { id: token },
            data: {
                unsubscribedFromEmails: true,
                unsubscribedAt: new Date(),
            },
        });

        // Redirect to confirmation page
        const clientUrl = process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000";
        return res.redirect(`${clientUrl}/unsubscribe?success=true`);
    } catch (error) {
        console.error("Error handling unsubscribe:", error);
        return res.status(500).send("Error processing unsubscribe request");
    }
}

// Middleware config (required for Wasp API)
export const unsubscribeMiddlewareConfigFn = (middlewareConfig: any) => {
    return middlewareConfig;
};
