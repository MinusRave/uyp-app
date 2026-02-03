import React from 'react';
import { Network, Activity, Heart, ArrowRight } from 'lucide-react';

export const TherapyFlowchart: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-gray-100 shadow-sm font-sans">
            <h3 className="text-lg font-bold text-gray-900 mb-8 text-center uppercase tracking-wide">The "Why Therapy Fails" Decision Tree</h3>

            <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center relative">

                {/* Path 1: The Standard Path */}
                <div className="flex-1 flex flex-col relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Traditional Route</div>

                    {/* Step 1 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center mb-12 relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Activity className="w-5 h-5 text-gray-600" />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Focus on "Communication"</h4>
                        <p className="text-sm text-gray-600">Couples learn "I statements" and active listening techniques.</p>

                        {/* Down Arrow */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-300">
                            <ArrowRight className="w-6 h-6 rotate-90" />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center mb-12 relative flex-1">
                        <h4 className="font-bold text-gray-800 mb-2">Techniques Fail in Heat of Moment</h4>
                        <p className="text-sm text-gray-600">When the amygdala (fear brain) is triggered, logic goes offline. "I statements" become weapons.</p>

                        {/* Down Arrow */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-300">
                            <ArrowRight className="w-6 h-6 rotate-90" />
                        </div>
                    </div>

                    {/* Step 3 - Dead End */}
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
                        <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-3">OUTCOME</div>
                        <h4 className="font-bold text-red-900 mb-2">The "Hopeless" Cycle</h4>
                        <p className="text-sm text-red-700">"We tried therapy and it didn't work. We must be broken."</p>
                    </div>

                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-gray-100 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 border border-gray-100 rounded-full text-xs font-bold text-gray-400">VS</div>
                </div>


                {/* Path 2: The MRI Approach */}
                <div className="flex-1 flex flex-col relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded font-bold">The MRI Method</div>

                    {/* Step 1 */}
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 text-center mb-12 relative shadow-sm ring-1 ring-purple-100">
                        <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Network className="w-5 h-5 text-purple-700" />
                        </div>
                        <h4 className="font-bold text-purple-900 mb-2">Focus on "Nervous System"</h4>
                        <p className="text-sm text-purple-700">Identify the biological "fight or flight" triggers that hijack the conversation.</p>

                        {/* Down Arrow */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-purple-300">
                            <ArrowRight className="w-6 h-6 rotate-90" />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 text-center mb-12 relative flex-1 shadow-sm ring-1 ring-purple-100">
                        <h4 className="font-bold text-purple-900 mb-2">Regulate, Then Relate</h4>
                        <p className="text-sm text-purple-700">Tools to soothe the body first. Safety is established before solving problems.</p>

                        {/* Down Arrow */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-purple-300">
                            <ArrowRight className="w-6 h-6 rotate-90" />
                        </div>
                    </div>

                    {/* Step 3 - Success */}
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center shadow-md">
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-3">OUTCOME</div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <h4 className="font-bold text-green-900">Sustainable Change</h4>
                            <Heart className="w-4 h-4 text-green-600 fill-current" />
                        </div>
                        <p className="text-sm text-green-700">Triggers lose their power. Connection becomes the default state again.</p>
                    </div>

                </div>

            </div>
        </div>
    );
};
