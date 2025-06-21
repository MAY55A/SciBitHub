import { ForumTopic } from "@/src/types/models";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { TopicDropdownMenu } from "./topic-options-menu";
import { formatDate } from "@/src/utils/utils";
import { Suspense } from "react";
import { MarkdownViewer } from "../custom/markdown-viewer";
import { createClient } from "@/src/utils/supabase/server";
import { UserAvatar } from "../custom/user-avatar";
import { Pin } from "lucide-react";
import ReportFormDialog from "../reports/report-form-dialog";
import { VoteButtons } from "../votes/vote-buttons";


export function TopicContent({ topic }: { topic: ForumTopic }) {
    return (
        <Card
            className="relative bg-muted/50 border-2 text-sm shadow-lg rounded-lg shadow-muted"
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
                    <div className="flex flex-col items-end text-muted-foreground text-end font-retro">
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
            <CardFooter className="flex justify-between font-retro font-semibold">
                <div className="flex flex-wrap gap-2">
                    {topic.tags && topic.tags?.map((tag) => (
                        <a href={`/projects/${topic.project.id}?tab=forum&tag=${tag}`} className="underline hover:text-green" key={tag}>
                            #{tag}
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground m-4">{topic.views} views</span>
                    <VoteButtons voted_id={topic.id} voted_type={"forum topic"} upvotes={topic.upvotes ?? 0} downvotes={topic.downvotes ?? 0} creatorId={topic.creator?.id} />
                    <Suspense fallback={null}>
                        <TopicActions topic={topic} />
                    </Suspense>
                </div>
            </CardFooter>
        </Card>
    );
}

async function TopicActions({ topic }: { topic: ForumTopic }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const isCreator = !!topic.creator && user?.id === topic.creator.id;
    const isProjectCreator = !!topic.project.creator && user?.id === topic.project.creator.id;
    const isAdmin = user.app_metadata.role === "admin";

    if (!isCreator && !isProjectCreator && !isAdmin) {
        return <ReportFormDialog user={user.id} id={topic.id!} type="topic" />
    }

    return <TopicDropdownMenu topic={topic} canSetAsFeatured={isProjectCreator || isAdmin} canEdit={isCreator} />
}