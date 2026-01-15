import { MessageSquareOff, ShieldAlert, HelpCircle } from "lucide-react";

export default function ProblemAgitationSection() {
    return (
        <div className="bg-white pb-24 pt-24 sm:pb-32 sm:pt-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">
                        Identify The Patterns
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Does this sound familiar?
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Most couples think they are fighting about money or chores. Actually, they are caught in these hidden loops.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <MessageSquareOff className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                The "Nothing's Wrong" Trap
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                                One withdraws to keep the peace. The other pushes for an answer. The silence becomes louder than shouting.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <ShieldAlert className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                The Exhausting Defense
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                                You feel attacked, so you explain your logic. They hear "excuses." You try harder. They get angrier.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                The "Mind Reader" Myth
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">
                                "If they loved me, they'd know." But they don't know. And you feel unseen, while they feel helpless.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
