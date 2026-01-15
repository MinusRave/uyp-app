import { useState } from "react";
import { exportUserData, deleteUserAccount } from "wasp/client/operations";
import { Button } from "../../client/components/ui/button";
import { Download, Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../client/components/ui/dialog";
import { Input } from "../../client/components/ui/input";
import { Label } from "../../client/components/ui/label";
import { Textarea } from "../../client/components/ui/textarea";
import { useToast } from "../../client/hooks/use-toast";

export function PrivacyControls() {
    const [isExporting, setIsExporting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [deleteReason, setDeleteReason] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleDataExport = async () => {
        setIsExporting(true);
        try {
            const data = await exportUserData();
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `understandyourpartner-data-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast({
                title: "Data exported successfully",
                description: "Your data has been downloaded as a JSON file.",
            });
        } catch (error) {
            toast({
                title: "Export failed",
                description: "Please try again or contact support.",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmText !== "DELETE") {
            toast({
                title: "Confirmation required",
                description: 'Please type "DELETE" to confirm.',
                variant: "destructive",
            });
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteUserAccount({
                confirmationText: confirmText,
                reason: deleteReason,
            });
            toast({
                title: "Account scheduled for deletion",
                description: `Your account will be deleted on ${new Date(result.scheduledDeletionDate).toLocaleDateString()}. You'll receive a confirmation email.`,
            });
            setShowDeleteModal(false);
            // Optionally redirect to logout
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } catch (error: any) {
            toast({
                title: "Deletion failed",
                description: error.message || "Please try again or contact support.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Data Export */}
            <div>
                <h4 className="font-semibold mb-2">Download My Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                    Export all your data in JSON format (test answers, scores, AI
                    analysis, conflict descriptions).
                </p>
                <Button
                    onClick={handleDataExport}
                    disabled={isExporting}
                    variant="outline"
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Preparing Download...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Download My Data
                        </>
                    )}
                </Button>
            </div>

            {/* Account Deletion */}
            <div className="border-t border-border pt-6">
                <h4 className="font-semibold mb-2 text-destructive">
                    Delete My Account
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete your account and all associated data. This cannot
                    be undone.
                </p>
                <Button
                    onClick={() => setShowDeleteModal(true)}
                    variant="destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                </Button>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Delete Account?
                        </DialogTitle>
                        <DialogDescription>
                            This will permanently delete:
                        </DialogDescription>
                    </DialogHeader>

                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                        <li>Your test results and reports</li>
                        <li>All conflict descriptions and AI analysis</li>
                        <li>Saved translations and downloads</li>
                    </ul>

                    <p className="text-sm font-bold text-destructive">
                        This cannot be undone.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="confirm-text">
                                Type <code className="bg-muted px-1 py-0.5 rounded">DELETE</code> to confirm:
                            </Label>
                            <Input
                                id="confirm-text"
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="DELETE"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="delete-reason">
                                Why are you leaving? (Optional)
                            </Label>
                            <Textarea
                                id="delete-reason"
                                placeholder="Help us improve..."
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setConfirmText("");
                                setDeleteReason("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={confirmText !== "DELETE" || isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete My Account"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
