
import React from 'react';
import { Activity, Brain, MessageCircle, BarChart2, FileText, Mail, TrendingUp, BookOpen, Repeat, Archive, Zap, Shield, Heart } from 'lucide-react';

const items = [
    { icon: Activity, label: "Your 5 Vital\nSigns Breakdown" },
    { icon: Brain, label: "Attachment\nStyle Analysis" },
    { icon: MessageCircle, label: "The 'Panic Loop'\nDecoded" },
    { icon: Zap, label: "Compatibility\nRisk Score" },
    { icon: FileText, label: "Custom Scripts\nfor Your Fights" },
    { icon: Mail, label: "Partner\nLetter" },
    { icon: TrendingUp, label: "Trajectory\nPrediction" },
    { icon: BookOpen, label: "Gender &\nChildhood Context" },
    { icon: Repeat, label: "8-Week\nRecovery Protocol" },
];

const ValueStackGrid: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-border">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-card p-6 flex flex-col items-center text-center justify-center border-b border-r border-border md:last:border-r-0 hover:bg-secondary/5 transition-colors aspect-square md:aspect-auto md:h-40"
                    >
                        <div className="bg-primary/5 p-3 rounded-full mb-3 text-primary">
                            <item.icon size={24} />
                        </div>
                        <span className="text-sm font-bold whitespace-pre-line leading-tight">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="text-center space-y-2">
                <div className="text-lg text-muted-foreground">Total Value: <span className="line-through decoration-red-500 decoration-2">$97</span></div>
                <div className="text-2xl font-bold text-primary">YOUR PRICE: $29</div>
                <p className="text-xs text-muted-foreground font-medium pt-2">
                    Everything tailored to YOUR pattern and YOUR answers.
                </p>
                <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-primary border-b border-primary/20 pb-0.5 cursor-pointer">
                        🔒 UNLOCK FULL ANALYSIS
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ValueStackGrid;
