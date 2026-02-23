export default function PrivacyPolicyPage() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-8">
                        <strong>Last Updated:</strong> January 15, 2026
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>
                        When you use UnderstandYourPartner, we collect the following information:
                    </p>
                    <ul>
                        <li><strong>Test Responses:</strong> Your answers to the relationship assessment questions</li>
                        <li><strong>Profile Data:</strong> Basic demographic information (age range, relationship status, etc.)</li>
                        <li><strong>Email Address:</strong> Only if you choose to provide it for receiving your results</li>
                        <li><strong>Payment Information:</strong> Processed securely through Stripe (we never store your payment details)</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use your information solely to:</p>
                    <ul>
                        <li>Generate your personalized relationship analysis</li>
                        <li>Process your payment</li>
                        <li>Send you your test results (if you provided an email)</li>
                        <li>Improve our assessment algorithms (anonymized data only)</li>
                    </ul>

                    <h2>3. Data Retention & Deletion</h2>
                    <p>
                        <strong>We automatically delete all your test data after 30 days.</strong> This includes:
                    </p>
                    <ul>
                        <li>Your test responses</li>
                        <li>Your profile information</li>
                        <li>Your generated report</li>
                    </ul>
                    <p>
                        You can also request immediate deletion by contacting us at admin@understandyourpartner.com.
                    </p>

                    <h2>4. Data Sharing</h2>
                    <p>
                        <strong>We never sell your data.</strong> We only share your information with:
                    </p>
                    <ul>
                        <li><strong>Stripe:</strong> For payment processing (they have their own privacy policy)</li>
                        <li><strong>Anthropic (Claude AI):</strong> For generating your personalized analysis (data is not used for AI training)</li>
                    </ul>

                    <h2>5. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt out of email communications</li>
                        <li>Request a copy of your data</li>
                    </ul>

                    <h2>6. Security</h2>
                    <p>
                        We use industry-standard encryption (256-bit SSL) to protect your data in transit and at rest.
                        All data is stored securely and access is strictly limited.
                    </p>

                    <h2>7. Cookies</h2>
                    <p>
                        We use minimal cookies only for:
                    </p>
                    <ul>
                        <li>Session management (keeping you logged in)</li>
                        <li>Analytics (understanding how people use the site)</li>
                    </ul>
                    <p>You can disable cookies in your browser settings.</p>

                    <h2>8. Children's Privacy</h2>
                    <p>
                        Our service is not intended for anyone under 18. We do not knowingly collect data from minors.
                    </p>

                    <h2>9. Changes to This Policy</h2>
                    <p>
                        We may update this policy occasionally. We'll notify you of significant changes via email (if you provided one).
                    </p>

                    <h2>10. Contact Us</h2>
                    <p>
                        Questions about privacy? Email us at <strong>admin@understandyourpartner.com</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
