import Link from "@/src/components/custom/Link";
import ShinyText from "@/src/components/ui/shiny-text";
import { cn } from "@/src/lib/utils";
import { TaskStatus } from "@/src/types/enums";
import { Task } from "@/src/types/models";
import { formatDate } from "@/src/utils/utils";
import { ChevronLeft } from "lucide-react";
import { TaskDropdownMenu } from "./task-options-menu";

export function TaskHeader({ task }: { task: Task }) {
    return (
        <div className="relative w-full flex flex-col min-h-[30vh] p-8 rounded-lg bg-muted/40">
            <div className="w-full flex justify-between gap-4">
                <Link href="/projects/[id]?tab=contribution" as={`/projects/${task.project.id}?tab=contribution`} className="">
                    <span className="flex items-center gap-1 font-semibold text-sm underline">
                        <ChevronLeft size={15} />
                        {"Project: " + task.project.name}
                    </span>
                </Link>
                <div className="flex flex-col items-end mb-4">
                    <span className="italic text-muted-foreground text-xs">Created on {formatDate(task.created_at!)}</span>
                    {task.updated_at ?
                        <span className="italic text-muted-foreground text-xs">Updated on {formatDate(task.updated_at)}</span>
                        : null
                    }
                </div>
            </div>
            <div className="self-end bg-muted/50 rounded-2xl font-semibold uppercase tracking-[.1em] text-xs">
                <ShinyText
                    text={task.status} disabled={false} speed={4}
                    className={cn('border px-3 py-2 rounded-2xl', task.status === TaskStatus.ACTIVE ? "text-green border-green" : "text-destructive border-destructive")}
                />
            </div>
            <div className="relative flex flex-col justify-between w-full h-full text-foreground">
                <div className="mt-8">
                    <h1 className="text-2xl font-bold text-primary">{task.title}</h1>
                    <p className="text-muted-foreground uppercase text-sm">{task.type}</p>
                </div>
                <div className="mt-8">
                    <p className="">{task.description}</p>
                </div>
                <div className="mt-8">
                    <p><strong className="text-green mr-2">+ Target Contributions Count :</strong> {task.target_count ?? "---"} </p>
                    <p><strong className="text-green mr-2">+ Contributions :</strong> {task.contributions ?? 0} </p>
                    <p><strong className="text-green mr-2">+ Progress :</strong> {task.target_count ? (100 * (task.contributions ?? 0) / task.target_count).toFixed(1) : "---"} %</p>
                </div>
            </div>
            <div className="absolute bottom-4 right-4">
                <TaskDropdownMenu task={task} showVisit={false} />
            </div>
        </div>
    );
}