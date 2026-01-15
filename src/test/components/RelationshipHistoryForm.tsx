import { useState } from "react";
import { Button } from "../../client/components/ui/button";
import { Input } from "../../client/components/ui/input";
import { Label } from "../../client/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../client/components/ui/select";

interface RelationshipHistoryFormProps {
    onSubmit: (data: RelationshipHistoryData) => void;
}

export interface RelationshipHistoryData {
    relationshipDuration: string;
    livingTogether: boolean;
    hasChildren: boolean;
    previousRelationships: string;
    previousMarriage: boolean;
    majorLifeTransition?: string;
    // Partner behavior
    partnerConflictStyle?: string;
    fightFrequency?: string;
    repairFrequency?: string;
    partnerHurtfulBehavior?: string;
}

export function RelationshipHistoryForm({ onSubmit }: RelationshipHistoryFormProps) {
    const [formData, setFormData] = useState<RelationshipHistoryData>({
        relationshipDuration: "",
        livingTogether: false,
        hasChildren: false,
        previousRelationships: "",
        previousMarriage: false,
        majorLifeTransition: "",
        partnerConflictStyle: "",
        fightFrequency: "",
        repairFrequency: "",
        partnerHurtfulBehavior: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">A Few More Questions</h3>
                <p className="text-sm text-muted-foreground">
                    This helps us personalize your analysis to your specific situation.
                </p>

                {/* Question 1: Duration */}
                <div className="space-y-2">
                    <Label htmlFor="duration">How long have you been together?</Label>
                    <Select
                        value={formData.relationshipDuration}
                        onValueChange={(value) =>
                            setFormData({ ...formData, relationshipDuration: value })
                        }
                    >
                        <SelectTrigger id="duration">
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0-6mo">Less than 6 months</SelectItem>
                            <SelectItem value="6mo-2yr">6 months to 2 years</SelectItem>
                            <SelectItem value="2-5yr">2 to 5 years</SelectItem>
                            <SelectItem value="5-10yr">5 to 10 years</SelectItem>
                            <SelectItem value="10+yr">10+ years</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Question 2: Living Together */}
                <div className="space-y-2">
                    <Label>Do you live together?</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="livingTogether"
                                checked={formData.livingTogether === true}
                                onChange={() => setFormData({ ...formData, livingTogether: true })}
                                className="h-4 w-4"
                            />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="livingTogether"
                                checked={formData.livingTogether === false}
                                onChange={() => setFormData({ ...formData, livingTogether: false })}
                                className="h-4 w-4"
                            />
                            <span>No</span>
                        </label>
                    </div>
                </div>

                {/* Question 3: Children */}
                <div className="space-y-2">
                    <Label>Do you have children together?</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hasChildren"
                                checked={formData.hasChildren === true}
                                onChange={() => setFormData({ ...formData, hasChildren: true })}
                                className="h-4 w-4"
                            />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hasChildren"
                                checked={formData.hasChildren === false}
                                onChange={() => setFormData({ ...formData, hasChildren: false })}
                                className="h-4 w-4"
                            />
                            <span>No</span>
                        </label>
                    </div>
                </div>

                {/* Question 4: Previous Relationships */}
                <div className="space-y-2">
                    <Label htmlFor="previous">
                        How many serious relationships have you had before this one? (Optional)
                    </Label>
                    <Select
                        value={formData.previousRelationships}
                        onValueChange={(value) =>
                            setFormData({ ...formData, previousRelationships: value })
                        }
                    >
                        <SelectTrigger id="previous">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">This is my first</SelectItem>
                            <SelectItem value="1-2">1-2</SelectItem>
                            <SelectItem value="3-5">3-5</SelectItem>
                            <SelectItem value="5+">5+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Question 5: Previous Marriage */}
                <div className="space-y-2">
                    <Label>Have you been married before? (Optional)</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="previousMarriage"
                                checked={formData.previousMarriage === true}
                                onChange={() => setFormData({ ...formData, previousMarriage: true })}
                                className="h-4 w-4"
                            />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="previousMarriage"
                                checked={formData.previousMarriage === false}
                                onChange={() => setFormData({ ...formData, previousMarriage: false })}
                                className="h-4 w-4"
                            />
                            <span>No</span>
                        </label>
                    </div>
                </div>

                {/* Question 6: Life Transition */}
                <div className="space-y-2">
                    <Label htmlFor="transition">
                        Are you experiencing a major life transition right now? (Optional)
                    </Label>
                    <Select
                        value={formData.majorLifeTransition}
                        onValueChange={(value) =>
                            setFormData({ ...formData, majorLifeTransition: value })
                        }
                    >
                        <SelectTrigger id="transition">
                            <SelectValue placeholder="Select if applicable..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None of the above</SelectItem>
                            <SelectItem value="moved">Recently moved / relocated</SelectItem>
                            <SelectItem value="career">Career change or new job</SelectItem>
                            <SelectItem value="health">Health issue (you or partner)</SelectItem>
                            <SelectItem value="financial">Financial stress</SelectItem>
                            <SelectItem value="loss">Family loss or grief</SelectItem>
                            <SelectItem value="baby">Pregnancy / New baby</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* NEW: Partner Behavior Questions */}
                <div className="border-t border-border pt-6 mt-6">
                    <h4 className="font-semibold mb-4">About Your Partner</h4>

                    {/* Question 7: Partner Conflict Style */}
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="partnerConflict">How does your partner typically react during conflicts?</Label>
                        <Select
                            value={formData.partnerConflictStyle}
                            onValueChange={(value) =>
                                setFormData({ ...formData, partnerConflictStyle: value })
                            }
                        >
                            <SelectTrigger id="partnerConflict">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="withdraws">Withdraws / Goes silent</SelectItem>
                                <SelectItem value="engages">Engages / Wants to talk it out</SelectItem>
                                <SelectItem value="escalates">Escalates / Gets more intense</SelectItem>
                                <SelectItem value="deflects">Deflects / Changes subject</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Question 8: Fight Frequency */}
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="fightFreq">How often do you have conflicts?</Label>
                        <Select
                            value={formData.fightFrequency}
                            onValueChange={(value) =>
                                setFormData({ ...formData, fightFrequency: value })
                            }
                        >
                            <SelectTrigger id="fightFreq">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="rarely">Rarely</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Question 9: Repair Frequency */}
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="repairFreq">How often do you successfully repair after conflicts?</Label>
                        <Select
                            value={formData.repairFrequency}
                            onValueChange={(value) =>
                                setFormData({ ...formData, repairFrequency: value })
                            }
                        >
                            <SelectTrigger id="repairFreq">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="always">Always - We always make up</SelectItem>
                                <SelectItem value="sometimes">Sometimes - It depends</SelectItem>
                                <SelectItem value="rarely">Rarely - We stay distant</SelectItem>
                                <SelectItem value="never">Never - Issues pile up</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Question 10: Hurtful Behavior */}
                    <div className="space-y-2">
                        <Label htmlFor="hurtful">What does your partner do that hurts you most? (Optional)</Label>
                        <textarea
                            id="hurtful"
                            value={formData.partnerHurtfulBehavior}
                            onChange={(e) =>
                                setFormData({ ...formData, partnerHurtfulBehavior: e.target.value })
                            }
                            className="w-full min-h-[80px] p-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Goes silent for days, dismisses my feelings, brings up past mistakes..."
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={!formData.relationshipDuration}
            >
                Continue to Test →
            </Button>
        </form>
    );
}
