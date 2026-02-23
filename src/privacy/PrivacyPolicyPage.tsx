import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-primary" size={32} />
                        <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Last updated: January 15, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Data We Collect</h2>
                        <p className="text-muted-foreground mb-3">
                            When you use UnderstandYourPartner, we collect the following information:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Email address</strong> - To send you your test results</li>
                            <li><strong>Test responses</strong> - Your answers to the 28 relationship questions</li>
                            <li><strong>Demographics</strong> - Age range, gender, relationship status, relationship history</li>
                            <li><strong>Conflict descriptions</strong> - Optional text you provide for personalized analysis</li>
                            <li><strong>Payment information</strong> - Processed securely via Stripe (we don't store card details)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Data</h2>
                        <p className="text-muted-foreground mb-3">
                            We use your information to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Generate personalized AI analysis</strong> - Your test answers and conflict descriptions are sent to Anthropic's Claude AI to create your custom report</li>
                            <li><strong>Send test results</strong> - We email you a link to access your full report</li>
                            <li><strong>Process payments</strong> - Via Stripe's secure payment platform</li>
                            <li><strong>Improve our service</strong> - Anonymized, aggregated analytics to understand usage patterns</li>
                        </ul>
                        <p className="text-muted-foreground mt-4">
                            <strong>We NEVER:</strong>
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>Sell your personal data to third parties</li>
                            <li>Share your conflict descriptions or test answers with anyone</li>
                            <li>Use your data for advertising purposes</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. Who We Share Data With</h2>
                        <p className="text-muted-foreground mb-3">
                            We share limited data with these trusted service providers:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Anthropic</strong> - AI provider for generating your personalized analysis (data sent via encrypted API)</li>
                            <li><strong>Stripe</strong> - Payment processing (they handle all payment card information securely)</li>
                        </ul>
                        <p className="text-muted-foreground mt-4">
                            These providers are bound by strict confidentiality agreements and cannot use your data for their own purposes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                        <p className="text-muted-foreground mb-3">
                            We take security seriously:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Encrypted in transit</strong> - All data sent over HTTPS/TLS</li>
                            <li><strong>Encrypted at rest</strong> - Database encryption for stored data</li>
                            <li><strong>Secure AI processing</strong> - AI analysis happens in Anthropic's encrypted environment</li>
                            <li><strong>Limited access</strong> - Only essential team members can access user data, and only for support purposes</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Your Rights (GDPR/CCPA)</h2>
                        <p className="text-muted-foreground mb-3">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Access your data</strong> - Download all your data in JSON format from your account settings</li>
                            <li><strong>Delete your account</strong> - Permanently delete your account and all associated data with one click</li>
                            <li><strong>Opt out of emails</strong> - Unsubscribe from marketing emails anytime (you'll still receive transactional emails like purchase receipts)</li>
                            <li><strong>Correct inaccurate data</strong> - Contact us to update any incorrect information</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Active accounts</strong> - Data retained indefinitely while your account is active</li>
                            <li><strong>Deleted accounts</strong> - All data permanently purged within 30 days of deletion request</li>
                            <li><strong>Payment records</strong> - Stripe retains payment records for 7 years (legal requirement for tax/fraud prevention)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
                        <p className="text-muted-foreground mb-3">
                            We use minimal cookies:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li><strong>Essential cookies</strong> - Session management (required for the site to function)</li>
                            <li><strong>Analytics</strong> - Privacy-friendly analytics via Plausible (no personal data collected)</li>
                            <li><strong>Meta Pixel</strong> - Only loaded if you consent via our cookie banner</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                        <p className="text-muted-foreground">
                            Our service is not intended for anyone under 18. We do not knowingly collect data from minors.
                            If you believe a minor has provided us with personal information, please contact us immediately.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
                        <p className="text-muted-foreground">
                            We may update this privacy policy from time to time. We'll notify you of significant changes
                            via email. Continued use of the service after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
                        <p className="text-muted-foreground">
                            Questions about this privacy policy or how we handle your data?
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Email: <a href="mailto:admin@understandyourpartner.com" className="text-primary hover:underline">admin@understandyourpartner.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
