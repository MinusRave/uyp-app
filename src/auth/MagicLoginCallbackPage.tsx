import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { login } from "wasp/client/auth";

export default function MagicLoginCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token"); // This is actually the OTP/Password passed from server
    const email = searchParams.get("email");
    const redirectTo = searchParams.get("redirectTo") || "/";

    const [status, setStatus] = useState("Verifying...");
    const [error, setError] = useState("");

    useEffect(() => {
        const performLogin = async () => {
            if (!token || !email) {
                setStatus("");
                setError("Invalid login link.");
                return;
            }

            try {
                setStatus("Logging in...");
                // Use the standard Wasp Email Login
                // The 'token' param here is the temporary password set by the server
                await login({ email, password: token });

                // If success (no error thrown), redirect to results or home
                setStatus("Success! Redirecting...");

                // Give a moment for the auth state to update, then navigate
                setTimeout(() => {
                    navigate(redirectTo);
                }, 500);
            } catch (e: any) {
                // Login failed - this should NOT happen anymore since server updates password
                console.error("Magic login failed:", e);
                setStatus("");
                setError("Login failed. Please try requesting a new magic link.");
                return;
            }
        };

        performLogin();
    }, [token, email, navigate]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="p-8 bg-card rounded-2xl shadow-sm border border-border max-w-md w-full text-center">
                <h2 className="text-xl font-bold mb-4">Magic Login</h2>
                {status && <p className="text-primary animate-pulse">{status}</p>}
                {error && (
                    <div className="text-destructive mb-4">
                        <p>{error}</p>
                        <Link to="/login" className="text-sm underline mt-2 block">Back to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
