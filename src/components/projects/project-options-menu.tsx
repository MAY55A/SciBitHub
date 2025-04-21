"use client"

import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Project } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "../custom/alert-dialog";
import { hardDeleteProject, softDeleteProject, updateActivityStatus } from "@/src/utils/project-actions";
import { useToast } from "@/src/hooks/use-toast";
import { ActivityStatus, ProjectStatus } from "@/src/types/enums";

export function ProjectDropdownMenu({ project, showVisit = true }: { project: Project, showVisit?: boolean }) {
    const router = useRouter();
    const { toast } = useToast();
    const handleUpdateStatus = async (status: ActivityStatus) => {
        const res = await updateActivityStatus(project.id!, status);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            project.activity_status = status; // Update the activity status in the UI
            if (!showVisit) {
                router.refresh(); // Refresh the page if the user is on the project page
            }
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
                <DropdownMenuGroup>
                    {showVisit &&
                        <DropdownMenuItem
                            className="px-4"
                            disabled={project.status !== "published"}
                            onClick={() => router.push(`/projects/${project.id}`)}>
                            Visit
                        </DropdownMenuItem>
                    }
                    <DropdownMenuItem
                        className="px-4"
                        onClick={() => router.push(`/projects/${project.id}/edit`)}>
                        Edit
                    </DropdownMenuItem>
                    {project.activity_status !== ActivityStatus.ONGOING &&
                        <DropdownMenuItem
                            className="px-4"
                            disabled={project.status !== "published"}
                            onClick={() => handleUpdateStatus(ActivityStatus.ONGOING)}>
                            {project.activity_status === ActivityStatus.PAUSED ? "Resume" : "Reopen"}
                        </DropdownMenuItem>
                    }
                    {project.activity_status === ActivityStatus.ONGOING &&
                        <>
                            <DropdownMenuItem
                                className="px-4"
                                disabled={project.status !== "published"}
                                onClick={() => handleUpdateStatus(ActivityStatus.PAUSED)}>
                                Pause
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="px-4"
                                disabled={project.status !== "published"}
                                onClick={() => handleUpdateStatus(ActivityStatus.COMPLETED)}>
                        Mark as Completed
                    </DropdownMenuItem>
                        </>
                    }
                    {project.activity_status !== ActivityStatus.CLOSED &&
                        <DropdownMenuItem
                            className="px-4"
                            disabled={project.status !== "published"}
                            onClick={() => handleUpdateStatus(ActivityStatus.CLOSED)}>
                            Close
                        </DropdownMenuItem>
                    }
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
                    <DropdownMenuItem
                        className="px-4"
                        disabled={project.status !== "published"}
                        onClick={() => router.push(`/projects/${project.id}/contributions`)}>
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