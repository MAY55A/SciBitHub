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
                <TaskFields task={task} />
            </div>
        </div>
    );
}