import { fetchDiscussions } from "@/src/lib/fetch-data";
import { Discussion } from "@/src/types/models";
import { MessagesSquare } from "lucide-react";
import { DiscussionCard } from "./discussion-card";

export default async function Discussions({
    editable,
    query,
    currentPage,
    orderBy,
    sort,
    limit,
    creator,
}: {
    editable?: boolean;
    query?: string;
    currentPage?: number;
    orderBy?: string;
    sort?: "asc" | "desc";
    limit?: number;
    creator?: string;
}) {

    const discussions = await fetchDiscussions(
        creator,
        query,
        currentPage,
        orderBy,
        sort,
        limit,
    );
    return (
        <div className="flex flex-wrap min-h-80 justify-center gap-8 rounded-lg mt-6">
            {discussions?.data && discussions.data.length > 0 ?
                discussions.data.map((discussion: Discussion) => (
                    <DiscussionCard editable={editable} discussion={discussion} key={discussion.id} />
                )) :
                <EmptyState />
            }
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center text-center p-10 mt-10">
            <MessagesSquare className="w-20 h-20 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">No discussions found</p>
        </div>
    );
}