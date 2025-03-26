import Link from "@/src/components/custom/Link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import ShinyText from "@/src/components/ui/shiny-text";
import { cn } from "@/src/lib/utils";
import { Task, TaskStatus } from "@/src/types/models";
import { ChevronRight } from "lucide-react";

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
                <Button className="flex items-center gap-1 mr-4" size={"sm"}>
                    <Link href="/tasks/[id]" as={`/tasks/${task.id}`}>Contribute</Link>
                    <ChevronRight size={14} />
                </Button>
                <Progress title={"10"} value={10} className="h-3 border border-primary" />
            </CardFooter>
        </Card>
    );
}