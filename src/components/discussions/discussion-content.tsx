import { Discussion } from "@/src/types/models";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import ShinyText from "../ui/shiny-text";
import { DiscussionDropdownMenu } from "./discussion-options-menu";
import { formatDate } from "@/src/utils/utils";
import { DiscussionStatus } from "@/src/types/enums";
import { DiscussionFiles } from "./discussion-files";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { MarkdownViewer } from "../custom/markdown-viewer";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import { cn } from "@/src/lib/utils";
import { UserAvatar } from "../custom/user-avatar";
import { VoteButtons } from "../votes/vote-buttons";
import ReportFormDialog from "../reports/report-form-dialog";


export function DiscussionContent({ discussion }: { discussion: Discussion }) {
    return (
        <Card
            className="relative border-2 text-sm shadow-lg rounded-lg shadow-muted"
        >
            <CardHeader>
                <div className="flex flex-row items-center justify-between text-xs">
                    <span
                        className={cn("uppercase tracking-[.25em] animate-glow m-2",
                            discussion.status === DiscussionStatus.CLOSED ? "text-destructive" : "text-green-700")}
                    >
                        {discussion.status}
                    </span>
                    <div className="flex flex-col items-end text-muted-foreground text-end p-1">
                        <span>
                            Posted {formatDate(discussion.created_at!, true)}
                        </span>
                        {!!discussion.updated_at &&
                            <span>
                                Modified {formatDate(discussion.updated_at, true)}
                            </span>
                        }
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between pb-4">
                    <UserAvatar user={discussion.creator} />
                    <ShinyText text={discussion.category} disabled={false} speed={4} className='max-w-48 break-words text-center text-green text-xs font-semibold uppercase tracking-[.1em] border border-green rounded-2xl px-3 py-2' />
                </div>

            </CardHeader>
            <CardContent className="px-16">
                <h1
                    className="flex text-xl font-bold text-primary capitalize"
                >
                    {discussion.title}
                </h1>
                <MarkdownViewer source={discussion.body} className="p-8" />
                {!!discussion.files &&
                    <div className="mt-8 flex flex-col gap-2">
                        <span className="font-semibold text-primary">Attached Files :</span>
                        <Suspense fallback={<Skeleton className="w-32 h-10 rounded-lg bg-muted mr-4" />}>
                            <DiscussionFiles paths={discussion.files} />
                        </Suspense>
                    </div>}
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex flex-wrap gap-2">
                    {discussion.tags && discussion.tags?.map((tag) => (
                        <Link
                            href="#"
                            key={tag}
                            className="text-green underline font-semibold"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <VoteButtons voted_id={discussion.id!} voted_type="discussion" upvotes={discussion.upvotes ?? 0} downvotes={discussion.downvotes! ?? 0} creatorId={discussion.creator.id} />
                    <Suspense fallback={null}>
                        <DiscussionActions discussion={discussion} />
                    </Suspense>
                </div>
            </CardFooter>
        </Card>
    );
}

async function DiscussionActions({ discussion }: { discussion: Discussion }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;
    if (user.id === discussion.creator.id) {
        return <DiscussionDropdownMenu discussion={discussion} showVisit={false} />;
    }
    return <ReportFormDialog user={user.id} id={discussion.id!} type="discussion" />;
}