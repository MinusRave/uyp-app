
import React, { useState } from 'react';
import { useQuery, getAiLogs } from 'wasp/client/operations';
import { Loader2, AlertCircle, CheckCircle, Clock, Database, ChevronDown, ChevronUp } from 'lucide-react';

export default function AiLogsPage() {
    const [skip, setSkip] = useState(0);
    const take = 50;
    const { data, isLoading, error } = useQuery(getAiLogs, { skip, take });

    const totalCount = data?.totalCount || 0;
    const logs = data?.logs || [];

    const handleNext = () => {
        if (skip + take < totalCount) setSkip(skip + take);
    };

    const handlePrev = () => {
        if (skip - take >= 0) setSkip(skip - take);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">AI Interaction Logs</h1>
                <p className="text-slate-500">Monitor usage, costs, and performance of AI models.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Error loading logs: {error.message}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Action</th>
                                    <th className="p-4">Model</th>
                                    <th className="p-4 text-right">Cost</th>
                                    <th className="p-4">Duration</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Tokens</th>
                                    <th className="p-4 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {logs.map((log: any) => (
                                    <LogRow key={log.id} log={log} />
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-slate-400">No logs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-xs text-slate-500">
                            Showing {skip + 1}-{Math.min(skip + take, totalCount)} of {totalCount}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev} disabled={skip === 0}
                                className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium disabled:opacity-50 hover:bg-slate-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext} disabled={skip + take >= totalCount}
                                className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium disabled:opacity-50 hover:bg-slate-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function LogRow({ log }: { log: any }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 whitespace-nowrap text-xs text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-4 text-xs text-slate-700 dark:text-slate-300 max-w-[150px] truncate" title={log.userEmail}>
                    {log.userEmail || '-'}
                </td>
                <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {log.action}
                </td>
                <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {log.model}
                    </span>
                </td>
                <td className="p-4 text-xs font-mono text-right text-emerald-600 font-medium">
                    {log.cost !== null && log.cost !== undefined ? `$${log.cost.toFixed(4)}` : '-'}
                </td>
                <td className="p-4 text-xs font-mono">
                    {log.duration ? `${log.duration.toFixed(2)}s` : '-'}
                </td>
                <td className="p-4">
                    {log.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            <CheckCircle className="w-3 h-3" /> Success
                        </span>
                    ) : log.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
                            <Clock className="w-3 h-3 animate-spin" /> Pending
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                            <AlertCircle className="w-3 h-3" /> Error
                        </span>
                    )}
                </td>
                <td className="p-4 text-xs font-mono text-right">
                    {log.tokensUsed ? (
                        <div className="flex flex-col items-end">
                            <span className="font-bold">{log.tokensUsed} total</span>
                            <span className="text-[10px] text-slate-400">
                                {log.inputTokens || 0} in / {log.outputTokens || 0} out
                            </span>
                        </div>
                    ) : '-'}
                </td>
                <td className="p-4 text-right">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <td colSpan={7} className="p-4">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                                <strong className="block text-slate-700 dark:text-slate-300">Request Prompt (First 500 chars):</strong>
                                <div className="bg-white dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-400 overflow-auto max-h-40">
                                    {log.requestPrompt?.substring(0, 500) || "No prompt logged."}...
                                </div>
                            </div>
                            <div className="space-y-1">
                                <strong className="block text-slate-700 dark:text-slate-300">AI Response (First 500 chars):</strong>
                                <div className="bg-white dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-400 overflow-auto max-h-40">
                                    {log.errorMessage ? <span className="text-red-500">{log.errorMessage}</span> : (log.response?.substring(0, 500) || "No response logged.")}...
                                </div>
                            </div>
                            <div className="col-span-2 text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                                Session ID: <span className="font-mono text-slate-600 dark:text-slate-300">{log.sessionId || "N/A"}</span>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
