import { useState } from "react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { requestMagicLink } from "wasp/client/operations";
import { AuthPageLayout } from "./AuthPageLayout";
import { Loader2, Mail, CheckCircle2, ArrowRight } from "lucide-react";

export function Signup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await requestMagicLink({ email });
      setIsSent(true);
    } catch (err) {
      console.error(err);
      alert("Error sending login link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageLayout>
      <div className="w-full max-w-sm mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-muted-foreground mt-2">Enter your email to sign up via Magic Link.</p>
        </div>

        {isSent ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center border border-green-200 dark:border-green-900">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={48} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Check your inbox!</h3>
            <p className="text-sm text-muted-foreground">
              We sent a secure link to <strong>{email}</strong>.
              <br />Click it to verify your account and log in.
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="mt-6 text-sm text-primary underline"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Mail size={18} />}
              <span>Sign Up with Email</span>
            </button>
          </form>
        )}

        <div className="text-center text-sm text-muted-foreground pt-4">
          Already have an account?{" "}
          <WaspRouterLink to={routes.LoginRoute.to} className="underline text-primary font-medium">
            Log in
          </WaspRouterLink>
        </div>
      </div>
    </AuthPageLayout>
  );
}
