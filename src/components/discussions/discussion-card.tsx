import { Discussion } from "@/src/types/models"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Link from "../custom/Link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/src/utils/utils";
import ShinyText from "../ui/shiny-text";
import { DiscussionDropdownMenu } from "./discussion-options-menu";
import { UserHoverCard } from "../custom/user-hover-card";
import { cn } from "@/src/lib/utils";
import { DiscussionStatus } from "@/src/types/enums";
import { VoteDisplay } from "../votes/vote-display";


export function DiscussionCard({ discussion, editable = false, showBody = true }: { discussion: Discussion, editable?: boolean, showBody?: boolean }) {

    return (
        <Card
            className="relative flex flex-col justify-between max-w-[500px] border-2 text-sm shadow-lg rounded-lg shadow-muted transform transition-all hover:scale-105 hover:shadow-2xl hover:shadow-muted"
        >
            <CardHeader>
                {editable &&
                    <div className="absolute top-2 right-2">
                        <DiscussionDropdownMenu discussion={discussion} />
                    </div>
                }
                <div className="flex flex-row items-center justify-between text-xs">
                    <span
                        className={cn("uppercase tracking-[.25em] animate-glow m-2",
                            discussion.status === DiscussionStatus.CLOSED ? "text-destructive" : "text-green-700")}
                    >
                        {discussion.status}
                    </span>
                    <span className="text-end text-muted-foreground mb-4 font-retro">
                        Posted {formatDate(discussion.created_at!)}
                    </span>
                </div>
                <div className="flex flex-row-reverse items-center justify-between font-retro">
                    <ShinyText text={discussion.category} disabled={false} speed={4} className='max-w-52 text-center text-green uppercase tracking-[.1em] text-xs border border-green rounded-full px-2 py-2' />
                    {!editable &&
                        <div>
                            <strong className="text-muted-foreground">Author :</strong>
                            <UserHoverCard user={discussion.creator} />
                        </div>
                    }
                </div>
            </CardHeader>
            <CardContent>
                <Link href="/discussions/[id]" as={`/discussions/${discussion.id}`}>
                    <h2
                        className="flex text-base capitalize font-bold mb-4"
                    >
                        <ChevronRight size={18} className="mt-1 pr-1" />
                        {discussion.title}
                    </h2></Link>
                {showBody &&
                    <p
                        className="text-sm text-muted-foreground line-clamp-3 pl-2 font-retro"
                    >
                        {discussion.body}
                    </p>}
                <div className="w-full flex flex-wrap gap-2 mt-2 font-retro">
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
            </CardContent>
            <CardFooter className="flex justify-between items-center font-retro">
                <span className="text-muted-foreground text-xs font-semibold">{discussion.replies ?? 0} replies</span>
                <VoteDisplay upvotes={discussion.upvotes ?? 0} downvotes={discussion.downvotes ?? 0} />
            </CardFooter>
        </Card>
    );
}