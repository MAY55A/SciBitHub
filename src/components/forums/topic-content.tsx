import { ForumTopic } from "@/src/types/models";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { TopicDropdownMenu } from "./topic-options-menu";
import { formatDate } from "@/src/utils/utils";
import { Suspense } from "react";
import { MarkdownViewer } from "../custom/markdown-viewer";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import { UserAvatar } from "../custom/user-avatar";
import { Pin } from "lucide-react";
import { VoteButtons } from "../votes/vote-buttons";


export function TopicContent({ topic }: { topic: ForumTopic }) {
    return (
        <Card
            className="relative border-2 text-sm shadow-lg rounded-lg shadow-muted"
        >
            <CardHeader>
                <div className="flex flex-row justify-between text-xs">
                    <div>
                        {topic.is_featured &&
                            <div className="flex items-center gap-1 text-green font-semibold m-[-10px] mb-2">
                                <Pin size={15} />
                                Featured
                            </div>
                        }
                        <UserAvatar user={topic.creator} />
                    </div>
                    <div className="flex flex-col items-end text-muted-foreground text-end">
                        <span>
                            Posted {formatDate(topic.created_at!, true)}
                        </span>
                        {!!topic.updated_at &&
                            <span>
                                Modified {formatDate(topic.updated_at, true)}
                            </span>
                        }
                    </div>
                </div>

            </CardHeader>
            <CardContent className="px-16">
                <h1
                    className="flex text-lg font-bold text-primary capitalize"
                >
                    {topic.title}
                </h1>
                <MarkdownViewer source={topic.content} className="p-2" />
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex flex-wrap gap-2">
                    {topic.tags && topic.tags?.map((tag) => (
                        <Link
                            href="#"
                            key={tag}
                            className="hover:text-green underline font-semibold"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground m-4">{topic.views} views</span>
                    <VoteButtons voted_id={topic.id} voted_type={"forum topic"} upvotes={topic.upvotes ?? 0} downvotes={topic.downvotes ?? 0} />
                    <Suspense fallback={null}>
                        <TopicEditMenu topic={topic} />
                    </Suspense>
                </div>
            </CardFooter>
        </Card>
    );
}

async function TopicEditMenu({ topic }: { topic: ForumTopic }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isCreator = user?.id === topic.creator.id;
    const isProjectCreator = user?.id === topic.project.creator.id;

    if (!isCreator && !isProjectCreator) {
        return null;
    }
    return (
        <TopicDropdownMenu topic={topic} canSetAsFeatured={isProjectCreator} canEdit={isCreator} />
    );
}