"use client"

import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Discussion } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "../custom/alert-dialog";
import { deleteDiscussion } from "@/src/utils/discussion-actions";
import DiscussionFormDialog from "./discussion-form-dialog.tsx";

export function DiscussionDropdownMenu({ discussion }: { discussion: Discussion }) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36">
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className="px-4"
                        onClick={() => router.push(`/discussions/${discussion.id}`)}
                    >
                        Visit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="px-4"
                        onSelect={(event) => {
                            event.preventDefault(); // Prevent menu from closing
                        }}
                    >
                        <DiscussionFormDialog data={{ ...discussion, creator: discussion.creator.id }} />
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault(); // Prevent menu from closing
                    }}
                    className="hover:text-destructive">
                    <CustomAlertDialog
                        triggerText="Delete"
                        buttonVariant="ghost"
                        confirmButtonVariant="destructive"
                        title="Are you Sure ?"
                        description="This action cannot be undone."
                        confirmText="Delete discussion"
                        onConfirm={() => deleteDiscussion(discussion.id!)}
                        buttonClass="h-full hover:text-destructive pl-0"
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}