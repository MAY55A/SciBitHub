import { fetchTask } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { TaskHeader } from "@/src/components/tasks/task-header";
import { TaskTutorial } from "@/src/components/tasks/task-tutorial";
import { TaskFields } from "@/src/components/tasks/task-fields";

export default async function TaskPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const task = await fetchTask(id);

    if (!task) {
        return notFound();
    }

    return (
        <div className="w-full flex flex-col gap-8 mx-auto p-6">
            <TaskHeader task={task} />
            <div className="w-full flex-col gap-8">
                <TaskTutorial tutorial={task.tutorial} />
                {task.status === "active" ?
                    <TaskFields task={task} /> :
                    <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 border">
                        <h3 className="text-center">This task has been marked as Completed</h3>
                        <p className="text-center text-sm text-muted-foreground">You can no longer contribute to this task</p>
                    </div>
                }
            </div>
        </div>
    );
}