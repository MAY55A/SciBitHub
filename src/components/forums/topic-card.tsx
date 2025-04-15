import { ForumTopic } from "@/src/types/models"
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "../custom/Link";
import { formatDate } from "@/src/utils/utils";
import { UserHoverCard } from "../custom/user-hover-card";
import { ArrowRight } from "lucide-react";


export function TopicCard({ topic }: { topic: ForumTopic }) {

    return (
        <Card
            className="relative text-sm shadow-lg bg-muted/70 rounded-lg shadow-muted transform transition-all hover:scale-95 hover:shadow-2xl hover:shadow-muted"
        >
            <CardContent>
                <div className="flex flex-row items-center justify-between text-xs mt-4">
                    <Link href="/forum-topics/[id]" as={`/forum-topics/${topic.id}`}>
                        <h3
                            className="text-base capitalize font-bold"
                        >
                            {topic.title}
                        </h3></Link>
                    <span className="text-end text-muted-foreground">
                        Posted {formatDate(topic.created_at!)}
                    </span>
                </div>
                <div className="w-full flex flex-wrap gap-2">
                    {topic.tags && topic.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs underline hover:text-green"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
                <div>
                    <strong className="text-muted-foreground">By </strong>
                    <UserHoverCard user={topic.creator} />
                </div>
            </CardContent>
            <CardFooter className="w-full flex justify-between">
                <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground text-xs font-semibold">{topic.replies ?? 0} replies</span> |
                    <span className="text-muted-foreground text-xs font-semibold">{topic.views ?? 0} views</span>
                </div>
                <Link href="/forum-topics/[id]" as={`/forum-topics/${topic.id}`}>
                    <ArrowRight />
                </Link>
            </CardFooter>
        </Card>
    );
}