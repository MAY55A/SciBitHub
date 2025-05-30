import { Contribution } from "@/src/types/models";
import Link from "next/link";
import { formatDate } from "@/src/utils/utils";
import { ValidationStatusUI } from "../custom/validation-status";
import { ChevronRight } from "lucide-react";

export default function ContributionCard({ contribution }: { contribution: Contribution }) {

    return (
        <div className="border border-border rounded-md p-4 bg-muted/30 hover:bg-muted/40 transition font-retro">
            <div className="flex justify-between items-center gap-2 mb-2">
                <h3 className="font-semibold">
                    <Link
                        href={`/tasks/${contribution.task.id}`}
                        className="hover:underline"
                    >
                        Task: {contribution.task.title}
                    </Link>
                </h3>
                <span className="text-xs text-muted-foreground text-end">submitted {formatDate(contribution.created_at!, true)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Type: {contribution.task.type}</span>
            </div>
            <div className="flex justify-between ">
                <Link
                    href={`/contributions/${contribution.id}`}
                    className="flex items-center gap-1 text-sm hover:underline text-primary font-semibold"
                >
                    View Contribution <ChevronRight size={12} /> 
                </Link>
                <ValidationStatusUI status={contribution.status} withBorder />
            </div>
        </div>
    );
}