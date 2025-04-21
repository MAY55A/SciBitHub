import { Contribution } from "@/src/types/models";
import { ValidationStatusUI } from "../custom/validation-status";
import Link from "../custom/Link";
import { formatDate } from "@/src/utils/utils";
import { StatusWithActions } from "./actions";
import { UserHoverCard } from "../custom/user-hover-card";

export function ContributionHeader({ contribution, showActions }: { contribution: Contribution, showActions: boolean }) {
    return (
        <div className="w-full flex flex-col min-h-[30vh] p-8 rounded-lg bg-muted/50 shadow-md">
            <div className="w-full flex justify-between gap-4">
                <div className="italic text-muted-foreground text-xs">Submitted {formatDate(contribution.created_at!, true)},  by
                    <UserHoverCard user={contribution.user} />
                </div>
                {!showActions && <div className="rounded-2xl shadow-md font-bold uppercase tracking-[.1em] text-xs">
                    <ValidationStatusUI status={contribution.status} withBorder={true} />
                </div>}
            </div>

            <div className="mt-8">
                <p><strong className="text-muted-foreground mr-2">+ ID :</strong> {contribution.id} </p>
                <p><strong className="text-muted-foreground mr-2">+ Type :</strong> {contribution.task.type} </p>
                <p><strong className="text-muted-foreground mr-2">+ Task :</strong>
                    <Link href="/tasks/[id]" as={`/tasks/${contribution.task.id}`} className="underline">
                        {contribution.task.title}
                    </Link>
                </p>
                <p><strong className="text-muted-foreground mr-2">+ Project :</strong>
                    <Link href="/projects/[id]" as={`/projects/${contribution.task.project.id}`} className="underline">
                        {contribution.task.project.name}
                    </Link>
                </p>
                <p><strong className="text-muted-foreground mr-2">+ Moderation :</strong> {contribution.task.project.moderation_level} </p>
            </div>
            {showActions && <StatusWithActions contribution={contribution.id!} initialStatus={contribution.status} />}
        </div>
    );
}