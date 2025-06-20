import { fetchDiscussions } from "@/src/lib/fetch-data";
import { Discussion } from "@/src/types/models";
import { MessagesSquare } from "lucide-react";
import { DiscussionCard } from "./discussion-card";
import Pagination from "../custom/pagination";

export default async function Discussions({
    editable,
    query,
    status,
    category,
    tags,
    currentPage,
    orderBy,
    sort,
    limit,
    creator,
}: {
    editable?: boolean;
    query?: string;
    status?: string;
    category?: string;
    tags?: string[];
    currentPage?: number;
    orderBy?: string;
    sort?: "asc" | "desc";
    limit?: number;
    creator?: string;
}) {

    const { data: discussions, totalPages } = await fetchDiscussions(
        creator,
        query,
        status,
        category,
        tags,
        currentPage,
        orderBy,
        sort,
        limit,
    );
    return (
        <div className="w-full flex flex-col gap-16 items-center">
            <div className="flex flex-wrap min-h-80 justify-center gap-8 rounded-lg mt-6">
                {discussions.length > 0 ?
                    discussions.map((discussion: Discussion) => (
                        <DiscussionCard editable={editable} discussion={discussion} key={discussion.id} />
                    )) :
                    <EmptyState status={status} />
                }
            </div>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages ?? 0} />
            </div>
        </div>
    );
}

function EmptyState({ status }: { status?: string }) {
    return (
        <div className="flex flex-col items-center text-center p-10 mt-10">
            <MessagesSquare className="w-20 h-20 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">No {status} discussions found</p>
        </div>
    );
}