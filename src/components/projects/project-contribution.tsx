import { Progress } from "@/src/components/ui/progress";
import { TaskCard } from "../tasks/task-card";
import { fetchTasks } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { LatestContributions } from "./latest-contributions";

export async function ProjectContribution({ projectId }: { projectId: string }) {
    const tasks = await fetchTasks(projectId);

    if (!tasks) {
        return notFound();
    }

    return (
        <div className="flex flex-col mt-8 gap-12">
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold">Overall Progress</h2>
                <Progress value={33} />
            </div>
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            </div>
            <LatestContributions tasks={tasks.map((task) => task.id!)} />
        </div>
    );
}