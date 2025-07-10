import CommentsList from "@/src/components/comments/comments-list";
import { ScrollToHashElement } from "@/src/components/custom/scroll-to-hash";
import { NotAvailable } from "@/src/components/errors/not-available";
import { TopicContent } from "@/src/components/forums/topic-content";
import ViewTracker from "@/src/components/forums/view-tracker";
import { fetchForumTopic } from "@/src/lib/fetch-data";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const topic = await fetchForumTopic(id);

    if (!topic) {
        return notFound();
    }

    if (topic.deleted_at) {
        return NotAvailable({ type: "forum topic" });
    }

    if (topic.project.deleted_at) {
        return NotAvailable({ type: "project" });
    }

    return (
        <div className="w-full p-4">
            <ViewTracker topicId={topic.id} />
            <div className="flex flex-col gap-4 px-8">
                <Link href="/projects/[id]?tab=forum" as={`/projects/${topic.project.id}?tab=forum`}>
                    <span className="flex items-center gap-1 font-semibold text-sm underline">
                        <ChevronLeft size={15} />
                        {"Forum: " + topic.project.name}
                    </span>
                </Link>
                <TopicContent topic={topic} />
                <div className="flex flex-col gap-4 border-t-2 border-muted p-2 mt-8">
                    <CommentsList commentedOn={{ forum_topic: id }} />
                </div>
                <ScrollToHashElement />
            </div>
        </div>
    );
}