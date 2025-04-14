import { fetchSimilarDiscussions } from "@/src/lib/fetch-data";
import { DiscussionCard } from "./discussion-card";
import { MessagesSquare } from "lucide-react";


export async function SimilarDiscussions({ title, tags, category, id }: { title: string; tags?: string[]; category: string; id: string }) {
    const discussions = await fetchSimilarDiscussions(title, tags ?? [], category, id);

    return (
        <aside className="sticky top-32 flex flex-col gap-2 border-2 border-input rounded-lg p-4 h-[calc(100vh-8rem)] bg-muted/30">
            <h2 className="flex gap-2 items-center text-lg font-semibold text-primary"><MessagesSquare /> Similar Discussions</h2>
            {discussions.length ?
                discussions.map((discussion) => (
                    <DiscussionCard discussion={discussion} showBody={false} key={discussion.id} />
                )) :
                <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                    No similar discussions found.
                </div>
            }
        </aside>
    );
}