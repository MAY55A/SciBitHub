"use client"

import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ForumTopic } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "../custom/alert-dialog";
import { deleteTopic, toggleIsFeatured } from "@/src/lib/actions/topic-actions";
import { useToast } from "@/src/hooks/use-toast";
import TopicFormDialog from "./topic-form-dialog";

export function TopicDropdownMenu({ topic, canEdit = false, canSetAsFeatured = false }: { topic: ForumTopic, canEdit?: boolean, canSetAsFeatured?: boolean }) {
    const router = useRouter();
    const { toast } = useToast();

    const handleFeature = async (isFeatured: boolean) => {
        const res = await toggleIsFeatured(isFeatured, topic.id!);
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            router.refresh();
        }
    }

    const handleDelete = async () => {
        const res = await deleteTopic(topic.id!);
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        // Redirect to project forum page if deletion is successful
        if (res.success) {
            router.push(`/projects/${topic.project.id}?tab=forum`);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50">
                <DropdownMenuGroup>
                    {canSetAsFeatured && topic.is_featured &&
                        <DropdownMenuItem
                            title="Unmark As Featured"
                            className="px-4"
                            onClick={() => handleFeature(false)}
                        >
                            Unmark As Featured
                        </DropdownMenuItem>
                    }
                    {canSetAsFeatured && !topic.is_featured &&
                        <DropdownMenuItem
                            title="Mark As Featured"
                            className="px-4"
                            onClick={() => handleFeature(true)}
                        >
                            Mark As Featured
                        </DropdownMenuItem>
                    }
                    {canEdit &&
                        <DropdownMenuItem
                            title="Edit"
                            className="px-4"
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing
                                document.body.style.overflow = ""; // Restore scroll manually (when form dialog is closed focus is locked)
                            }}
                        >
                            <TopicFormDialog projectId={topic.project.id!} data={{ ...topic, creator: topic.creator?.id, project: topic.project.id }} />
                        </DropdownMenuItem>
                    }
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault(); // Prevent dialog from closing
                    }}
                    className="hover:text-destructive">
                    <CustomAlertDialog
                        triggerText="Delete"
                        buttonVariant="ghost"
                        confirmButtonVariant="destructive"
                        title="Are you Sure ?"
                        description="This action cannot be undone."
                        confirmText="Delete Topic"
                        onConfirm={handleDelete}
                        buttonClass="h-full hover:text-destructive pl-0"
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}