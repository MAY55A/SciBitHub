"use client"

import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Task } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "../custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { deleteTask, updateStatus } from "@/src/lib/actions/task-actions";
import { TaskStatus, TaskType } from "@/src/types/enums";
import { useAuth } from "@/src/contexts/AuthContext";
import ReportFormDialog from "../reports/report-form-dialog";

export function TaskDropdownMenu({ task, showVisit = true }: { task: Task, showVisit?: boolean }) {
    // showVisit indicates if the user is on the task page or not (false if he is on the page)
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();

    const handleDelete = async () => {
        const res = await deleteTask(task.id!, task.project.id!, task.data_source);
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        // Redirect to user profile tasks page if deletion is successful
        if (res.success) {
            router.push(`/projects/${task.project.id}?tab=contribution`);
        }
    }

    const handleUpdateStatus = async (status: TaskStatus) => {
        const res = await updateStatus(task.id!, status);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            router.refresh();
        }
    }

    // if not authenticated show nothing (no dropdown menu, no report icon)
    if (!user) {
        return null;
    }
    // if the user is not the creator, show report icon if he is on the page of the task,
    //  and show nothing if he is viewing the task card
    if (user.id !== task.project.creator?.id) {
        return showVisit ?
            null :
            <ReportFormDialog user={user.id} id={task.id!} type="task" />
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                    {showVisit &&
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => router.push(`/tasks/${task.id}`)}>
                            Visit
                        </DropdownMenuItem>
                    }
                    {task.status !== TaskStatus.ACTIVE &&
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => handleUpdateStatus(TaskStatus.ACTIVE)}>
                            Reopen
                        </DropdownMenuItem>
                    }
                    {task.status !== TaskStatus.COMPLETED &&
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => handleUpdateStatus(TaskStatus.COMPLETED)}>
                            Mark as Completed
                        </DropdownMenuItem>
                    }
                    {task.type === TaskType.DATALABELLING &&
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => router.push(`/tasks/${task.id}/dataset`)}>
                            Manage Dataset
                        </DropdownMenuItem>
                    }
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault(); // Prevent dialog from closing immediately when opened
                    }}
                    className="hover:text-destructive">
                    <CustomAlertDialog
                        triggerText="Delete"
                        buttonVariant="ghost"
                        confirmButtonVariant="destructive"
                        title="Are you Sure ?"
                        description="This action cannot be undone."
                        confirmText="Delete task"
                        onConfirm={handleDelete}
                        buttonClass="h-full hover:text-destructive pl-0"
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}