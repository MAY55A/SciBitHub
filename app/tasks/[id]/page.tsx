import { fetchTask } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { TaskHeader } from "@/src/components/tasks/task-header";
import { TaskTutorial } from "@/src/components/tasks/task-tutorial";
import { TaskFields } from "@/src/components/tasks/task-fields";
import { ActivityStatus, ParticipationLevel } from "@/src/types/enums";
import { NotAvailable } from "@/src/components/errors/not-available";
import { getProjectPermissions } from "@/src/lib/services/permissions-service";
import { RestrictedProjectMessage } from "@/src/components/projects/restricted-project-message";

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const task = await fetchTask(id);

    if (!task) {
        return notFound();
    }

    if (task.deleted_at) {
        return NotAvailable({ type: "task" });
    }

    if (task.project.deleted_at) {
        return NotAvailable({ type: "project" });
    }

    if (task.project.activity_status !== ActivityStatus.ONGOING) {
        return (
            <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 border">
                <h3 className="text-center">This project has been <strong className="capitalize">{task.project.activity_status}</strong></h3>
                <p className="text-center text-sm text-muted-foreground">No more contributions can be made</p>
            </div>
        );
    }


    if (task.project.participation_level === ParticipationLevel.RESTRICTED) {
        const { canViewContribution, canSendRequest } = await getProjectPermissions(
            task.project.id!, task.project.visibility, task.project.participation_level, task.project.creator?.id
        );
        if (!canViewContribution) {
            return (
                <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 ">
                    <RestrictedProjectMessage projectId={task.project.id!} canSendRequest={canSendRequest} />
                </div>
            );
        }
    }

    return (
        <div className="w-full flex flex-col gap-8 mx-auto p-6">
            <TaskHeader task={task} />
            <div className="w-full flex-col gap-8">
                <TaskTutorial tutorial={task.tutorial} />
                {task.status === "active" ?
                    <TaskFields task={task} /> :
                    <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 border">
                        <h3 className="text-center">This task has been marked as <strong>Completed</strong></h3>
                        <p className="text-center text-sm text-muted-foreground">No more contributions can be made</p>
                    </div>
                }
            </div>
        </div>
    );
}