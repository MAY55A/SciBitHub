import { Progress } from "@/src/components/ui/progress";
import { TaskCard } from "../tasks/task-card";
import { fetchTasks } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { LatestContributions } from "./latest-contributions";
import { TaskStatus } from "@/src/types/enums";

export async function ProjectContribution({ projectId }: { projectId: string }) {
    const tasks = await fetchTasks(projectId);

    if (!tasks) {
        return notFound();
    }

    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const totalTasks = tasks.length;

    return (
        <div className="flex flex-col items-center mt-16 gap-16">
            <div className="w-full flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold">Overall Progress</h2>
                <Progress color="green" value={Number((completedTasks/totalTasks).toFixed(1))} className="max-w-[500px] border border-green"/>
                <p className="text-muted-foreground text-sm">{completedTasks} out of {totalTasks} task(s) completed</p>
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