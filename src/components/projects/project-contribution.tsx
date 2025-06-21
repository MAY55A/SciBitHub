import { Progress } from "@/src/components/ui/progress";
import { TaskCard } from "../tasks/task-card";
import { fetchTasks } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { LatestContributions } from "./latest-contributions";
import { TaskStatus } from "@/src/types/enums";
import { createClient } from "@/src/utils/supabase/server";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function ProjectContribution({ projectId, creator }: { projectId: string, creator?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const tasks = await fetchTasks(projectId);

    if (!tasks) {
        return notFound();
    }

    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="flex flex-col items-center mt-16 gap-16">
            <div className="w-full flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold">Overall Progress</h2>
                <Progress color="green" value={progress} className="max-w-[500px] border border-green" />
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
            <div className="w-full flex flex-col items-center">
                <LatestContributions tasks={tasks.map((task) => task.id!)} />
                {creator && user?.id === creator &&
                    <Link href={`/projects/${projectId}/contributions`} className="flex items-center text-sm text-green gap-1 hover:underline">
                        See all contributions
                        <ChevronRight size={16} />
                    </Link>
                }
            </div>
        </div>
    );
}