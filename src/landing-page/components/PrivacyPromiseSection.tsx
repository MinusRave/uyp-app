import { Shield, Lock, Key, Trash2 } from "lucide-react";
import { Link } from "wasp/client/router";

export default function PrivacyPromiseSection() {
    return (
        <div className="bg-slate-100 dark:bg-slate-900 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-12">
                    <div className="flex items-center gap-3 justify-center mb-4">
                        <Shield className="text-primary" size={32} />
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Your Data Promise
                        </h2>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        We know relationship data is deeply personal. Here's our commitment to you.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1: Privacy */}
                        <div className="flex flex-col items-center text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                <Lock className="text-primary" size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Your Conflicts Stay Private
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                We never share your conflict descriptions or test answers. Period.
                            </p>
                        </div>

                        {/* Card 2: Encryption */}
                        <div className="flex flex-col items-center text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                <Key className="text-primary" size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Encrypted AI Analysis
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                AI analysis happens in an encrypted environment. Your data is protected end-to-end.
                            </p>
                        </div>

                        {/* Card 3: Control */}
                        <div className="flex flex-col items-center text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 sm:col-span-2 lg:col-span-1">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                <Trash2 className="text-primary" size={28} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Delete Anytime
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Your data, your choice. Export or delete everything with one click.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link 
                            to="/privacy-policy" 
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary underline transition-colors"
                        >
                            Read our full Privacy Policy →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
