
import { type AuthUser } from "wasp/auth";
import { useQuery, getSessionDetail } from "wasp/client/operations";
import { Link } from "wasp/client/router";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import { Loader2, ArrowLeft, CheckCircle, XCircle, DollarSign, Mail } from "lucide-react";
import { cn } from "../../../client/utils";

const SessionDetailPage = ({ user }: { user: AuthUser }) => {
    const { sessionId } = useParams();
    const { data: session, isLoading, error } = useQuery(getSessionDetail, { sessionId: sessionId || "" });

    if (isLoading) {
        return <DefaultLayout user={user}><div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div></DefaultLayout>;
    }

    if (error || !session) {
        return <DefaultLayout user={user}><div className="p-10 text-red-500">Error loading session or session not found.</div></DefaultLayout>;
    }

    const answers = session.answers as Record<string, any>;
    const scores = session.scores as Record<string, number> | null;

    return (
        <DefaultLayout user={user}>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/sessions" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Session Details</h1>
                        <p className="text-sm text-gray-500">ID: {session.id}</p>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatusCard
                        label="Status"
                        value={session.isCompleted ? "Completed" : "In Progress"}
                        icon={session.isCompleted ? <CheckCircle className="text-green-500" /> : <Loader2 className="text-gray-500" />}
                    />
                    <StatusCard
                        label="Payment"
                        value={session.isPaid ? "Paid" : "Unpaid"}
                        icon={session.isPaid ? <DollarSign className="text-green-500" /> : <XCircle className="text-red-500" />}
                    />
                    <StatusCard
                        label="Email"
                        value={session.email ? "Captured" : "Not Captured"}
                        icon={session.email ? <Mail className="text-blue-500" /> : <XCircle className="text-gray-400" />}
                    />
                    <StatusCard
                        label="Step"
                        value={session.currentQuestionIndex.toString()}
                        icon={<div className="font-bold text-lg">{session.currentQuestionIndex}</div>}
                    />
                </div>

                {/* User Profile */}
                <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-strokedark">
                    <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Profile & Demographics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoItem label="User Gender" value={session.userGender} />
                        <InfoItem label="Partner Gender" value={session.partnerGender} />
                        <InfoItem label="User Age" value={session.userAgeRange} />
                        <InfoItem label="Partner Age" value={session.partnerAgeRange} />
                        <InfoItem label="Relationship Status" value={session.relationshipStatus} />
                        <InfoItem label="Duration" value={session.relationshipDuration} />
                        <InfoItem label="Living Together" value={session.livingTogether ? "Yes" : "No"} />
                        <InfoItem label="Has Children" value={session.hasChildren ? "Yes" : "No"} />
                        <InfoItem label="Prev. Marriage" value={session.previousMarriage ? "Yes" : "No"} />
                    </div>
                </div>

                {/* Conflict Profile */}
                <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-strokedark">
                    <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Conflict Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem label="Conflict Style" value={session.partnerConflictStyle} />
                        <InfoItem label="Fight Frequency" value={session.fightFrequency} />
                        <InfoItem label="Repair Frequency" value={session.repairFrequency} />
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conflict Description</p>
                            <p className="mt-1 text-black dark:text-white p-3 bg-gray-50 dark:bg-meta-4 rounded-md">
                                {session.conflictDescription || "N/A"}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Partner Hurtful Behavior</p>
                            <p className="mt-1 text-black dark:text-white p-3 bg-gray-50 dark:bg-meta-4 rounded-md">
                                {session.partnerHurtfulBehavior || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scores */}
                {scores && (
                    <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-strokedark">
                        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Calculated Scores</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(scores).map(([key, value]) => (
                                <div key={key} className="p-4 bg-gray-50 dark:bg-meta-4 rounded-lg">
                                    <p className="text-sm text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
                                    <p className="text-2xl font-bold text-primary">{typeof value === 'number' ? value.toFixed(1) : value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* JSON Dump of Answers (Collapsible or just raw for now) */}
                <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-strokedark">
                    <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Raw Answers Log</h2>
                    <pre className="bg-gray-100 dark:bg-black p-4 rounded overflow-x-auto text-xs">
                        {JSON.stringify(answers, null, 2)}
                    </pre>
                </div>

            </div>
        </DefaultLayout>
    );
};

const StatusCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="bg-white dark:bg-boxdark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-strokedark flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-lg font-bold text-black dark:text-white">{value}</p>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-meta-4 rounded-full">
            {icon}
        </div>
    </div>
);

const InfoItem = ({ label, value }: { label: string, value: any }) => (
    <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-black dark:text-white font-medium">{value || "-"}</p>
    </div>
);

export default SessionDetailPage;
