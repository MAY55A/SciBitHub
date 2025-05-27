import { ForumTopic } from "@/src/types/models"
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "../custom/Link";
import { formatDate } from "@/src/utils/utils";
import { UserHoverCard } from "../custom/user-hover-card";
import { VoteDisplay } from "../votes/vote-display";


export function TopicCard({ topic }: { topic: ForumTopic }) {

    return (
        <Card
            className="relative text-sm shadow-lg bg-muted/70 rounded-lg shadow-muted transition-all hover:shadow-2xl hover:shadow-muted"
        >
            <CardContent>
                <div className="flex flex-row items-center justify-between text-muted-foreground mt-4 font-retro">
                    <div>
                        <strong>By </strong>
                        <UserHoverCard user={topic.creator} />
                    </div>
                    <span className="text-end text-muted-foreground text-xs">
                        Posted {formatDate(topic.created_at!)}
                    </span>
                </div>
                <Link href="/forum-topics/[id]" as={`/forum-topics/${topic.id}`}>
                    <h3
                        className="text-base capitalize font-bold"
                    >
                        {topic.title}
                    </h3></Link>
                <div className="w-full flex flex-wrap gap-2 font-retro">
                    {topic.tags && topic.tags?.map((tag) => (
                        <a href={`/projects/${topic.project.id}?tab=forum&tag=${tag}`} className="underline hover:text-green" key={tag}>
                            #{tag}
                        </a>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="w-full flex flex-wrap gap-2 items-center font-retro font-medium text-sm text-muted-foreground">
                <span>{topic.replies ?? 0} replies</span> |
                <span>{topic.views ?? 0} views</span> |
                <VoteDisplay upvotes={topic.upvotes ?? 0} downvotes={topic.downvotes ?? 0} />
            </CardFooter>
        </Card>
    );
}