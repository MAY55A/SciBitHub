"use client"

import { Ellipsis } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Project } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useState } from "react";
import { softDeleteProject } from "@/src/lib/actions/project-actions";
import { updateProjectStatus } from "@/src/lib/actions/admin/projects-actions";
import ProjectDetailsDialog from "./project-details-dialog";
import { ProjectStatus } from "@/src/types/enums";

export function ProjectOptionsMenu({
    project, rowIndex, updateRow
}: {
    project: Project, rowIndex: number, updateRow: (rowIndex: number, field: string, data: any) => void
}) {
    const [showDialog, setShowDialog] = useState("");
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async () => {
        const res = await softDeleteProject(project.id!, project.name!);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow(rowIndex, "status", ProjectStatus.DELETED)
        }
    }

    const handleUpdateStatus = async (status: ProjectStatus) => {
        const res = await updateProjectStatus(project.id!, status);
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
                        {project.status === ProjectStatus.PUBLISHED &&
                            <DropdownMenuItem
                                className="px-4"
                                onClick={() => router.push(`/projects/${project.id}`)}>
                                Visit Page
                            </DropdownMenuItem>}
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => setShowDialog("project-details")}>
                            View Project Details
                        </DropdownMenuItem>
                        {!project.deleted_at && project.status !== ProjectStatus.PUBLISHED &&
                            <DropdownMenuItem
                                className="px-4 hover:text-green"
                                onClick={() => handleUpdateStatus(ProjectStatus.PUBLISHED)}>
                                Approve Project
                            </DropdownMenuItem>
                        }
                        {!project.deleted_at && project.status !== ProjectStatus.DECLINED &&
                            <DropdownMenuItem
                                className="px-4 hover:text-primary"
                                onClick={() => handleUpdateStatus(ProjectStatus.DECLINED)}>
                                Decline Project
                            </DropdownMenuItem>
                        }

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {!project.deleted_at &&
                        <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing immediately when opened
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Delete Project"
                                buttonVariant="ghost"
                                confirmButtonVariant="destructive"
                                title="Are you Sure ?"
                                description="This action cannot be undone."
                                confirmText="Delete Project"
                                onConfirm={handleDelete}
                                buttonClass="h-full hover:text-destructive pl-0"
                            />
                        </DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu >
            {
                showDialog === "project-details" &&
                <ProjectDetailsDialog
                    project={project}
                    onClose={() => setShowDialog("")} />
            }
        </div >
    )
}