import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';

interface TOCSection {
    id: string;
    label: string;
    time?: string;
    isPriority?: boolean; // For "Emergency Scripts"
    isInteractive?: boolean;
}

interface TableOfContentsProps {
    sections: TOCSection[];
    activeSection: string;
}

export function TableOfContents({ sections, activeSection }: TableOfContentsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [readSections, setReadSections] = useState<Set<string>>(new Set());

    // Mark section as read when it becomes active
    useEffect(() => {
        if (activeSection) {
            setReadSections(prev => new Set(prev).add(activeSection));
        }
    }, [activeSection]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -100; // Offset for sticky header if any
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    const totalTime = sections.reduce((acc, curr) => {
        const mins = parseInt(curr.time?.split(' ')[0] || '0');
        return acc + mins;
    }, 0);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-24 left-4 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-3 rounded-full lg:hidden hover:scale-105 transition-transform"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <div className={`
        fixed top-0 left-0 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-40
        transition-transform duration-300 ease-in-out w-80 shadow-2xl lg:shadow-none lg:translate-x-0 lg:w-80
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="h-full overflow-y-auto p-6">

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                User Navigation
                            </h3>
                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <Clock size={12} /> Total read time: ~{totalTime} min
                            </div>
                        </div>

                        <div className="p-2 space-y-1">
                            {sections.map((section) => {
                                const isActive = activeSection === section.id;
                                const isRead = readSections.has(section.id);

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`
                      w-full text-left p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group
                      ${isActive
                                                ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                        w-5 h-5 rounded-full flex items-center justify-center border transition-colors
                        ${isActive ? 'border-primary bg-primary text-white' :
                                                    isRead ? 'border-primary/50 text-primary' : 'border-slate-300 text-transparent'}
                      `}>
                                                {(isActive || isRead) && <CheckCircle2 size={12} />}
                                            </div>

                                            <span className={isActive ? 'font-bold' : ''}>
                                                {section.label}
                                            </span>
                                        </div>

                                        {section.isPriority && (
                                            <span className="text-yellow-500 animate-pulse">⚡</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 p-3 border-t border-slate-100 dark:border-slate-800 text-xs text-center text-slate-400">
                            Your progress is saved automatically
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
