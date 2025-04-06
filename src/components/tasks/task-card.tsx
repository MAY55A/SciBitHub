import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card";
import ShinyText from "@/src/components/ui/shiny-text";
import { cn } from "@/src/lib/utils";
import { Task, TaskStatus } from "@/src/types/models";
import { TaskCardButton } from "./task-card-button";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export function TaskCard({ task }: { task: Task }) {
    return (
        <Card className="max-w-[400px] flex flex-col justify-between shadow-md">
            <CardHeader>
                <div className="flex justify-between font-semibold uppercase tracking-[.1em] text-xs">
                    <span>{task.type}</span>
                    <ShinyText text={task.status} disabled={false} speed={4} className={cn('border px-3 py-2 rounded-2xl', task.status === TaskStatus.ACTIVE ? "text-green border-green" : "text-destructive border-destructive")} />
                </div>
            </CardHeader>
            <CardContent>
                <h2
                    className="text-base font-bold mb-4"
                >
                    {task.title}
                </h2>
                <p
                    className="text-muted-foreground max-h-40 overflow-hidden whitespace-normal line-clamp-3 pl-2"
                >
                    {task.description}
                </p>
            </CardContent>
            <CardFooter>
                <Suspense fallback={<Skeleton className="w-32 h-10 rounded-lg bg-muted mr-4" />}>
                    <TaskCardButton taskId={task.id!} status={task.status!} />
                </Suspense>
            </CardFooter>
        </Card>
    );
}