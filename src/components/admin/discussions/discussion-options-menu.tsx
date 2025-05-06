"use client"

import { Ellipsis } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Discussion } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useState } from "react";
import { DiscussionStatus } from "@/src/types/enums";
import DiscussionDetailsDialog from "./discussion-details-dialog";
import { deleteDiscussion, updateStatus } from "@/src/lib/actions/admin/discussions-actions";

export function DiscussionOptionsMenu({
    discussion, rowIndex, updateRow
}: {
    discussion: Discussion, rowIndex: number, updateRow: (rowIndex: number, field: string, data: any) => void
}) {
    const [showDialog, setShowDialog] = useState("");
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async () => {
        const res = await deleteDiscussion(discussion.id!);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow(rowIndex, "status", DiscussionStatus.DELETED)
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
            updateRow(rowIndex, "status", status)
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
                            onClick={() => setShowDialog("discussion-details")}>
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
                    {discussion.status !== DiscussionStatus.DELETED &&
                        <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing immediately when opened
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Delete Discussion"
                                buttonVariant="ghost"
                                confirmButtonVariant="destructive"
                                title="Are you Sure ?"
                                description="This action cannot be undone."
                                confirmText="Delete Discussion"
                                onConfirm={handleDelete}
                                buttonClass="h-full hover:text-destructive pl-0"
                            />
                        </DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu >
            {
                showDialog === "discussion-details" &&
                <DiscussionDetailsDialog
                    discussion={discussion}
                    onClose={() => setShowDialog("")} />
            }
        </div >
    )
}