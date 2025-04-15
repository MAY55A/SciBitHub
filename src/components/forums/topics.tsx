import { fetchForumTopics } from "@/src/lib/fetch-data";
import { ForumTopic } from "@/src/types/models";
import { MessageCircleQuestion } from "lucide-react";
import { TopicCard } from "./topic-card";

export default async function Topics({
    project,
    query,
    currentPage,
    orderBy,
    sort,
    limit,
    creator,
}: {
    project: string;
    query?: string;
    currentPage?: number;
    orderBy?: string;
    sort?: "asc" | "desc";
    limit?: number;
    creator?: string;
}) {

    const topics = await fetchForumTopics(
        project,
        query,
        creator,
        currentPage,
        orderBy,
        sort,
        limit,
    );
    return (
        
        <div className="w-full h-full flex flex-col gap-4 p-2 mt-8">
                {topics?.data && topics.data.length > 0 ?
                    topics.data.map((topic: ForumTopic) => (
                        <TopicCard topic={topic} key={topic.id} />
                    )) :
                    <EmptyState />
                }
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center text-center text-muted-foreground p-10 mt-10 opacity-70">
            <MessageCircleQuestion size={50} />
            <p className="mt-4 text-lg font-semibold">No topics found</p>
        </div>
    );
}