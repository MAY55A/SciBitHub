import { fetchSimilarDiscussions } from "@/src/lib/fetch-data";
import { ChevronRight, MessagesSquare } from "lucide-react";
import { BookmarkButton } from "../bookmarks/bookmark-button";
import { VoteDisplay } from "../votes/vote-display";
import Link from "next/link";


export async function SimilarDiscussions({ title, tags, category, id }: { title: string; tags?: string[]; category: string; id: string }) {
    const discussions = await fetchSimilarDiscussions(title, tags ?? [], category, id);

    return (
        <aside className="sticky top-32 flex flex-col gap-2 border-2 border-input rounded-lg p-4 h-[calc(100vh-8rem)] bg-muted/30">
            <h2 className="flex gap-2 items-center text-lg font-semibold text-primary mb-4"><MessagesSquare /> Similar Discussions</h2>
            {discussions.length ?
                discussions.map((discussion) => (
                    <div key={discussion.id} className="flex flex-col gap-2 p-4 border border-input rounded-lg hover:bg-muted/50 transition-colors font-retro">

                        <Link href="/discussions/[id]" as={`/discussions/${discussion.id}`}>
                            <h2
                                className="flex text-base capitalize font-bold"
                            >
                                <ChevronRight size={18} className="mt-1 pr-1" />
                                {discussion.title}
                            </h2></Link>
                        <p
                            className="text-sm text-muted-foreground line-clamp-3 pl-2"
                        >
                            {discussion.body}
                        </p>
                        <div className="w-full flex flex-wrap gap-2 mt-2">
                            {discussion.tags && discussion.tags?.map((tag) => (
                                <a
                                    href={`/discussions?tags=${tag}`}
                                    key={tag}
                                    className="text-sm font-semibold hover:underline text-green/80"
                                >
                                    #{tag}
                                </a>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-xs font-semibold">{discussion.replies ?? 0} replies</span>
                            <div className="flex items-center gap-2">
                                <VoteDisplay upvotes={discussion.upvotes ?? 0} downvotes={discussion.downvotes ?? 0} />
                                <BookmarkButton discussionId={discussion.id} />
                            </div>
                        </div>
                    </div>
                )) :
                <div className="flex items-center justify-center h-full w-full text-muted-foreground font-retro">
                    No similar discussions found.
                </div>
            }
        </aside>
    );
}