import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';

export const RoadmapGantt: React.FC = () => {
    const phases = [
        { week: "Week 1", title: "Stabilization", desc: "Stop the bleeding. Use 'In The Moment' scripts to prevent escalation.", color: "bg-red-500" },
        { week: "Week 2", title: "De-escalation", desc: "Lower the daily tension. Apply the 'Partner Translation' guide.", color: "bg-orange-500" },
        { week: "Week 3", title: "Reconnection", desc: "Begin safe vulnerability. Use the 'Deepening Questions'.", color: "bg-green-500" },
        { week: "Week 4+", title: "Maintenance", desc: "New normal. Regular check-ins using the Compatibility Pulse.", color: "bg-blue-500" }
    ];

    return (
        <div className="space-y-4">
            {phases.map((phase, i) => (
                <div key={i} className="flex gap-4 items-start group">
                    {/* Time Column */}
                    <div className="w-20 pt-1 flex flex-col items-center">
                        <span className="text-xs font-bold uppercase text-muted-foreground">{phase.week}</span>
                        <div className="h-full w-px bg-border mt-2 group-last:hidden"></div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${phase.color}`}></div>
                            <h4 className="font-bold text-base">{phase.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {phase.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
