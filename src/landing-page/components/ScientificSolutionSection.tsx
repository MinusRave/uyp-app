import { BrainCircuit, BarChart3 } from "lucide-react";

export default function ScientificSolutionSection() {
    return (
        <div className="bg-slate-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">
                        How Our Relationship Test Works
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Partner Model vs. Self Lens
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Most relationship quizzes just label you. We measure the gap between your perception and your reaction.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
                        {/* Card 1: Partner Model */}
                        <div className="flex flex-col rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 shadow-sm">
                            <div className="flex items-center gap-x-3 text-2xl font-bold leading-7 text-slate-900">
                                <BrainCircuit className="h-8 w-8 flex-none text-primary" aria-hidden="true" />
                                The Partner Model (PM)
                            </div>
                            <p className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                First, we answer: "How do you interpret your partner's behavior?" Do you see intention where there is none? Do you perceive distance as danger?
                            </p>
                        </div>

                        {/* Card 2: Self Lens */}
                        <div className="flex flex-col rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 shadow-sm">
                            <div className="flex items-center gap-x-3 text-2xl font-bold leading-7 text-slate-900">
                                <BarChart3 className="h-8 w-8 flex-none text-primary" aria-hidden="true" />
                                The Self Lens (SL)
                            </div>
                            <p className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                Then, we look at you: "How do you personally react in relational situations?" What happens in your body when there is silence or conflict?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
