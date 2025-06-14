"use client"

import { Ellipsis, TriangleAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Project } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useState } from "react";
import { hardDeleteProject, updateProjectStatus } from "@/src/lib/actions/admin/projects-actions";
import ProjectDetailsDialog from "./project-details-dialog";
import { ProjectStatus } from "@/src/types/enums";

export function ProjectOptionsMenu({
    project, updateRow, removeRow
}: {
    project: Project, updateRow: (field: string, data: any) => void, removeRow: () => void
}) {
    const [showDialog, setShowDialog] = useState("");
    const router = useRouter();
    const { toast } = useToast();

    const deletePermanently = async () => {
        const res = await hardDeleteProject(project.id!);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            removeRow();
        }
    }

    const handleUpdateStatus = async (status: ProjectStatus) => {
        const res = await updateProjectStatus(project.id!, project.name, status);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow("status", status)
            if (status === ProjectStatus.DELETED) {
                project.deleted_at = new Date().toISOString();
            }
        }
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-68" align="end" sideOffset={10}>
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
                    {project.deleted_at
                        ? <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing immediately when opened
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Restore Project"
                                buttonVariant="ghost"
                                confirmButtonVariant="default"
                                title="Are you Sure ?"
                                description="When restored, the project will be published and visible to everyone."
                                confirmText="Restore Project"
                                onConfirm={() => handleUpdateStatus(ProjectStatus.PUBLISHED)}
                                buttonClass="h-full hover:text-green pl-0"
                            />
                        </DropdownMenuItem>
                        : <DropdownMenuItem
                            onSelect={(event) => {
                                event.preventDefault(); // Prevent dialog from closing immediately when opened
                            }}
                            className="hover:text-destructive">
                            <CustomAlertDialog
                                triggerText="Delete Project"
                                buttonVariant="ghost"
                                confirmButtonVariant="destructive"
                                title="Are you Sure ?"
                                description="The project will be deleted, but it still can be restored later."
                                confirmText="Delete Project"
                                onConfirm={() => handleUpdateStatus(ProjectStatus.DELETED)}
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
                            description="When deleted permanently, the project and all its associated tasks, forum topics and comments will be lost forever, only contributions will be kept."
                            confirmText="Permanently Delete Project"
                            onConfirm={deletePermanently}
                            buttonClass="h-full text-destructive pl-0"
                        />
                    </DropdownMenuItem>
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