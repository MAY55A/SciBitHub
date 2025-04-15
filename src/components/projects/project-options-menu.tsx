"use client"

import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Project } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "../custom/alert-dialog";
import { deleteProject } from "@/src/utils/project-actions";

export function ProjectDropdownMenu({ project, showVisit = true }: { project: Project, showVisit?: boolean }) {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    {showVisit &&
                        <DropdownMenuItem disabled={project.status !== "published"} onClick={() => router.push(`/projects/${project.id}`)}>
                            Visit
                        </DropdownMenuItem>
                    }
                    <DropdownMenuItem onClick={() => router.push(`/projects/${project.id}/edit`)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={project.status !== "published"}>
                        Mark as Completed
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {project.status === "published" && project.participation_level === "restricted" &&
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Manage Participants</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem>Invite</DropdownMenuItem>
                                    <DropdownMenuItem>Kick out</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>View requests</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    }
                    <DropdownMenuItem disabled={project.status !== "published"} onClick={() => router.push(`/projects/${project.id}/contributions`)}>
                        Manage Contributions
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
                        confirmText="Delete Project"
                        onConfirm={() => deleteProject(project.id!)}
                        buttonClass="h-full hover:text-destructive pl-0"
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}