"use client"

import { Ellipsis, TriangleAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Discussion } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useState } from "react";
import { DiscussionStatus } from "@/src/types/enums";
import DiscussionDetailsDialog from "./discussion-details-dialog";
import { deleteDiscussions, restoreDiscussion, updateStatus } from "@/src/lib/actions/admin/discussions-actions";

export function DiscussionOptionsMenu({
    discussion, updateRow, removeRow
}: {
    discussion: Discussion, updateRow: (field: string, data: any) => void, removeRow: () => void
}) {
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async (type: "soft" | "hard") => {
        const res = await deleteDiscussions([discussion.id!], type);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            type === "soft" ? updateRow("", { status: DiscussionStatus.DELETED, deleted_at: new Date().toISOString() }) : removeRow();
        }
    }

    const handleRestore = async () => {
        const res = await restoreDiscussion(discussion.id!);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow("", { status: DiscussionStatus.OPEN, deleted_at: null });
        }
    }

    const handleUpdateStatus = async (status: DiscussionStatus) => {
        const res = await updateStatus(discussion.id!, status);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow("status", status)
        }
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                    <DropdownMenuGroup>
                        {discussion.status !== DiscussionStatus.DELETED &&
                            <DropdownMenuItem
                                className="px-4"
                                onClick={() => router.push(`/discussions/${discussion.id}`)}>
                                Visit Page
                            </DropdownMenuItem>}
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => setShowDialog(true)}>
                            View Discussion Details
                        </DropdownMenuItem>
                        {discussion.status === DiscussionStatus.CLOSED &&
                            <DropdownMenuItem
                                className="px-4 hover:text-green"
                                onClick={() => handleUpdateStatus(DiscussionStatus.OPEN)}>
                                Reopen Discussion
                            </DropdownMenuItem>
                        }
                        {discussion.status === DiscussionStatus.OPEN &&
                            <DropdownMenuItem
                                className="px-4 hover:text-primary"
                                onClick={() => handleUpdateStatus(DiscussionStatus.CLOSED)}>
                                Close Discussion
                            </DropdownMenuItem>
                        }

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {discussion.status === DiscussionStatus.DELETED
                        ? <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing immediately when opened
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Restore Discussion"
                                buttonVariant="ghost"
                                confirmButtonVariant="default"
                                title="Are you Sure ?"
                                description="When restored, the discussion will be reopened and visible to everyone."
                                confirmText="Restore Discussion"
                                onConfirm={handleRestore}
                                buttonClass="h-full hover:text-green pl-0"
                            />
                        </DropdownMenuItem>
                        : <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing immediately when opened
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Delete Discussion"
                                buttonVariant="ghost"
                                confirmButtonVariant="destructive"
                                title="Are you Sure ?"
                                description="The Discussion will be deleted, but it still can be restored later."
                                confirmText="Delete Discussion"
                                onConfirm={() => handleDelete("soft")}
                                buttonClass="h-full hover:text-destructive pl-0"
                            />
                        </DropdownMenuItem>
                    }
                    <DropdownMenuItem
                        onSelect={(event) => {
                            event.preventDefault(); // Prevent dialog from closing immediately when opened
                        }}
                        className="hover:text-destructive">
                        <CustomAlertDialog
                            triggerText="Permanently Delete"
                            buttonIcon={TriangleAlert}
                            buttonVariant="ghost"
                            confirmButtonVariant="destructive"
                            title="This action CANNOT be undone !"
                            description="When deleted permanently, the discussion and all its associated files and comments will be lost forever."
                            confirmText="Permanently Delete Discussion"
                            onConfirm={() => handleDelete("hard")}
                            buttonClass="h-full text-destructive pl-0"
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            {showDialog &&
                <DiscussionDetailsDialog
                    discussion={discussion}
                    onClose={() => setShowDialog(false)} />
            }
        </div >
    )
}