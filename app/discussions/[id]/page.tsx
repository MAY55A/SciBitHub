import { fetchDiscussion } from "@/src/lib/fetch-data";
import { notFound } from "next/navigation";
import { DiscussionContent } from "@/src/components/discussions/discussion-content";
import { SimilarDiscussions } from "@/src/components/discussions/similar-discussions";
import { DiscussionStatus } from "@/src/types/enums";
import CommentsList from "@/src/components/comments/comments-list";
import { NotAvailable } from "@/src/components/errors/not-available";
import { ScrollToHashElement } from "@/src/components/custom/scroll-to-hash";

export default async function DiscussionPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const discussion = await fetchDiscussion(id);

    if (!discussion) {
        return notFound();
    }

    if (discussion.deleted_at) {
        return NotAvailable({ type: "discussion" });
    }

    return (
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-3 p-4">
            <div className="col-span-1 lg:col-span-2 px-8">
                <DiscussionContent discussion={discussion} />
                <div className="flex flex-col gap-4 border-t-2 border-muted p-2 mt-8">
                    <CommentsList commentedOn={{ discussion: id }} allowNewComments={discussion.status === DiscussionStatus.OPEN} />
                </div>
                <ScrollToHashElement/>
            </div>
            <div className="relative">
                <SimilarDiscussions title={discussion.title} tags={discussion.tags} category={discussion.category} id={discussion.id!} />
            </div>
        </div>
    );
}