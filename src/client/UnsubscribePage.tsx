import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function UnsubscribePage() {
    const [success, setSuccess] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSuccess(params.get("success") === "true");
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {success ? (
                    <>
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                You've been unsubscribed
                            </h1>
                            <p className="text-gray-600">
                                You won't receive any more reminder emails from us.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> You can still access your test results and purchase your
                                report anytime at{" "}
                                <a
                                    href="/results"
                                    className="underline hover:text-blue-900"
                                >
                                    understandyourpartner.com/results
                                </a>
                            </p>
                        </div>

                        <div className="text-center">
                            <a
                                href="/"
                                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Return to Home
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Unsubscribe
                            </h1>
                            <p className="text-gray-600">
                                Processing your unsubscribe request...
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
