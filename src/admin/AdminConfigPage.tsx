import React, { useState, useEffect } from "react";
import { useQuery, useAction, getSystemConfig, updateSystemConfig } from "wasp/client/operations";
import { Loader2, Settings, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminConfigPage() {
    const { data: config, isLoading, refetch } = useQuery(getSystemConfig);
    const updateConfigFn = useAction(updateSystemConfig);

    const [enableSoftGate, setEnableSoftGate] = useState(false);
    const [enableCookieBanner, setEnableCookieBanner] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (config) {
            setEnableSoftGate(config.enableSoftGate);
            setEnableCookieBanner(config.enableCookieBanner);
        }
    }, [config]);

    const handleToggle = () => {
        setEnableSoftGate(!enableSoftGate);
        setHasChanges(true); // Naive check, but works for single toggle
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateConfigFn({ enableSoftGate, enableCookieBanner });
            await refetch();
            setHasChanges(false);
            alert("Configuration saved successfully.");
        } catch (e) {
            console.error(e);
            alert("Failed to save configuration.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Settings className="text-primary" />
                        System Configuration
                    </h1>
                    <p className="text-muted-foreground mt-1">Global settings for the application funnel.</p>
                </div>
                <Link to="/admin" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Back to Dashboard
                </Link>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold">Funnel Strategy: Soft Gate</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                            <strong>Enabled (Soft Gate):</strong> Users can finish the test <i>without</i> email. They are gated on the Results Page before checkout ("2-Step Order Form"). Recommended for higher sales conversion.<br />
                            <strong>Disabled (Hard Gate):</strong> Users MUST enter email to finish the test. They cannot see results or offer otherwise. Recommended for maximum lead generation.
                        </p>
                    </div>

                    <button
                        onClick={handleToggle}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 ${enableSoftGate ? 'bg-primary' : 'bg-muted'}`}
                    >
                        <span className="sr-only">Toggle Soft Gate</span>
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${enableSoftGate ? 'translate-x-7' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        Current Mode:
                        <span className={`px-2 py-0.5 rounded text-xs uppercase tracking-wide ${enableSoftGate ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {enableSoftGate ? "Soft Gate (High Sales)" : "Hard Gate (Max Leads)"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-6">
                <div className="flex items-start justify-between gap-6">
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold">Cookie Consent Banner</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                            <strong>Enabled:</strong> Shows the cookie consent strip at the bottom of the screen. Required for GDPR/CCPA compliance in many regions.<br />
                            <strong>Disabled:</strong> Hides the banner completely. Improves UX and reduces friction, but may not be compliant.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEnableCookieBanner(!enableCookieBanner);
                            setHasChanges(true);
                        }}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 ${enableCookieBanner ? 'bg-primary' : 'bg-muted'}`}
                    >
                        <span className="sr-only">Toggle Cookie Banner</span>
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${enableCookieBanner ? 'translate-x-7' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        Current Status:
                        <span className={`px-2 py-0.5 rounded text-xs uppercase tracking-wide ${enableCookieBanner ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {enableCookieBanner ? "Visible" : "Hidden"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
