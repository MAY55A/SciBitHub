"use client"

import { Ellipsis, TriangleAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { ForumTopic } from "@/src/types/models";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useState } from "react";
import { deleteTopics, toggleDeleteTopic, updateTopicIsFeatured } from "@/src/lib/actions/admin/topics-actions";
import TopicDetailsDialog from "./topic-details-dialog";
import { useRouter } from "next/navigation";

export function TopicOptionsMenu({
    topic, updateRow, removeRow
}: {
    topic: ForumTopic, updateRow: (field: string, data: any) => void, removeRow: () => void
}) {
    const [showDialog, setShowDialog] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const toggleDelete = async (deleted_at: string | null) => {
        const res = await toggleDeleteTopic(topic.id!, deleted_at);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow("deleted_at", deleted_at)
        }
    }

    const toggleIsFeatured = async (isFeatured: boolean) => {
        const res = await updateTopicIsFeatured(topic.id!, isFeatured);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow("is_featured", isFeatured)
        }
    }

    const permanentDelete = async () => {
        const res = await deleteTopics([topic.id!], "hard");
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            removeRow();
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
                        {!topic.deleted_at &&
                            <DropdownMenuItem
                                className="px-4"
                                onClick={() => router.push(`/forum-topics/${topic.id}`)}>
                                Visit Page
                            </DropdownMenuItem>}
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => setShowDialog("topic-details")}>
                            View topic Details
                        </DropdownMenuItem>
                        {!topic.deleted_at && (topic.is_featured
                            ? <DropdownMenuItem
                                className="px-4"
                                onClick={() => toggleIsFeatured(false)}>
                                Unmark as Featured
                            </DropdownMenuItem>
                            : <DropdownMenuItem
                                className="px-4"
                                onClick={() => toggleIsFeatured(true)}>
                                Mark as Featured
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {topic.deleted_at
                        ? <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault();
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Restore Topic"
                                buttonVariant="ghost"
                                title="Are you Sure ?"
                                description="This topic will be restored and visible to others."
                                confirmText="Restore Topic"
                                onConfirm={() => toggleDelete(null)}
                                buttonClass="h-full hover:text-destructive pl-0"
                            />
                        </DropdownMenuItem>
                        : <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing immediately when opened
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Delete Topic"
                                buttonVariant="ghost"
                                confirmButtonVariant="destructive"
                                title="Are you Sure ?"
                                description="This topic will no longer be visible to others. You can restore it later."
                                confirmText="Delete Topic"
                                onConfirm={() => toggleDelete(new Date().toISOString())}
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
                            description="When deleted permanently, the topic and all its comments will be lost forever."
                            confirmText="Permanently Delete Topic"
                            onConfirm={permanentDelete}
                            buttonClass="h-full text-destructive pl-0"
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            {showDialog === "topic-details" &&
                <TopicDetailsDialog
                    topic={topic}
                    onClose={() => setShowDialog("")} />
            }
        </div >
    )
}