import { HttpError } from "wasp/server";
import { Request, Response } from "express";
import { config } from "wasp/server";
import { emailSender } from "wasp/server/email";
import type { MiddlewareConfigFn } from "wasp/server";
// Attempting to import Wasp Auth helpers
// @ts-ignore - Ignoring type check to try dynamic import if types are missing
import { createUser } from "wasp/server/auth";
// @ts-ignore
import argon2 from "argon2";

// Helper to generate crypto token
import crypto from "crypto";

export const magicLinkMiddlewareConfigFn: MiddlewareConfigFn = (middlewareConfig) => {
    return middlewareConfig;
};

export const sendMagicLink = async (email: string, context: any) => {
    // 1. Validate Email
    if (!email || !email.includes("@")) {
        throw new HttpError(400, "Invalid email");
    }

    // 2. Generate Token First (Use as password for new users)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

    // 3. Find or Create User (Shadow or Real)
    let user = await context.entities.User.findUnique({
        where: { email },
        include: {
            auth: {
                include: {
                    identities: true
                }
            }
        }
    });

    if (user) {
        if (user) {
            // Log existing user check specific details only if debug encoding check required
        }
    }

    if (!user) {
        // Use Wasp's createUser to ensure AuthIdentity is created
        // Logic: createUser(userFields, password)
        // We sets password to the token so the MagicLoginCallback can auto-login immediately!
        try {
            // Manually construct the providerData JSON to match Wasp's expected format.
            // We verify the email implicitly since they clicked the link (or will).
            const hashedPassword = await argon2.hash(token);
            const providerData = JSON.stringify({
                hashedPassword,
                isEmailVerified: true
            });

            // createUser(providerId, providerData, userFields)
            user = await createUser(
                { providerName: "email", providerUserId: email },
                providerData,
                { email }
            );
        } catch (e: any) {
            console.error("[sendMagicLink] createUser failed:", e);
            throw new HttpError(500, "Failed to create user");
        }
    }

    // 4. Create Token Record
    await context.entities.MagicLinkToken.create({
        data: {
            token,
            email,
            expiresAt
        }
    });

    // 4. Send Email
    const apiUrl = process.env.WASP_SERVER_URL || "http://localhost:3001";
    const link = `${apiUrl}/auth/magic-login-callback?token=${token}`;

    await emailSender.send({
        to: email,
        subject: "Your Magic Login Link",
        text: `Click here to login: ${link}`,
        html: `<p>Click here to login: <a href="${link}">${link}</a></p>`
    });
};

export const requestMagicLink = async ({ email }: { email: string }, context: any) => {
    await sendMagicLink(email, context);
};

export const verifyMagicLink = async (req: any, res: any, context: any) => {
    const token = req.query.token as string;



    if (!token) {
        return res.status(400).send("Missing token");
    }

    // 1. Find Token (token is @unique in schema)
    const magicLinkToken = await context.entities.MagicLinkToken.findUnique({
        where: { token }
    });

    if (!magicLinkToken) {
        console.error("[verifyMagicLink] Token not found");
        return res.status(400).send("Invalid token");
    }

    // Check validity
    if (magicLinkToken.used) {
        console.error("[verifyMagicLink] Token already used");
        return res.status(403).send("Token already used");
    }

    if (magicLinkToken.expiresAt < new Date()) {
        console.error("[verifyMagicLink] Token expired");
        return res.status(403).send("Token expired");
    }



    // 2. Consume Token
    await context.entities.MagicLinkToken.update({
        where: { id: magicLinkToken.id },
        data: { used: true }
    });

    // 3. Find User with Auth
    const user = await context.entities.User.findUnique({
        where: { email: magicLinkToken.email },
        include: {
            auth: {
                include: {
                    identities: true
                }
            }
        }
    });

    if (!user) {
        console.error("[verifyMagicLink] User not found linked to token");
        return res.status(404).send("User not found");
    }

    // 4. Update User's Password to Token (Temporary)
    // This allows the client-side login to work for ALL users
    try {
        // Hash the token as the new temporary password
        const hashedPassword = await argon2.hash(token);
        const providerData = JSON.stringify({
            hashedPassword,
            isEmailVerified: true
        });

        // Update the auth identity with the new password using Prisma directly
        // Use the compound unique key: providerName + providerUserId (email)
        await context.entities.User.update({
            where: { id: user.id },
            data: {
                auth: {
                    update: {
                        identities: {
                            update: {
                                where: {
                                    providerName_providerUserId: {
                                        providerName: 'email',
                                        providerUserId: user.email
                                    }
                                },
                                data: { providerData }
                            }
                        }
                    }
                }
            }
        });



        // 5. Determine Redirect Path based on latest session
        let redirectPath = "/test"; // Default: start/resume test

        const latestSession = await context.entities.TestSession.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        if (latestSession) {
            if (latestSession.isPaid) {
                redirectPath = "/report";
            } else if (latestSession.isCompleted) {
                redirectPath = "/results"; // Teaser/Paywall
            }
            // If neither, it stays "/test" which auto-resumes
        }

        // Redirect to client for automatic login
        const clientUrl = process.env.WASP_WEB_CLIENT_URL || "http://localhost:3000";
        res.redirect(`${clientUrl}/auth/magic-login-callback?email=${encodeURIComponent(user.email)}&token=${token}&redirectTo=${encodeURIComponent(redirectPath)}`);
    } catch (error: any) {
        console.error("[verifyMagicLink] Password update failed:", error);
        return res.status(500).send("Failed to authenticate");
    }
};
