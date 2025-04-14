import { Discussion } from "@/src/types/models";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import ShinyText from "../ui/shiny-text";
import { DiscussionDropdownMenu } from "./discussion-options-menu";
import { formatDate } from "@/src/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DiscussionStatus, UserRole } from "@/src/types/enums";
import { FlaskConicalIcon, UserIcon } from "lucide-react";
import { DiscussionFiles } from "./discussion-files";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { MarkdownViewer } from "../custom/markdown-viewer";
import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import { cn } from "@/src/lib/utils";


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
                    <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-muted/20 rounded-lg">
                        <Avatar className="flex shrink-0 overflow-hidden h-10 w-10 rounded-lg hover:shadow-lg hover:bg-muted">
                            <AvatarImage src={discussion.creator.profile_picture} alt={discussion.creator.username} />
                            <AvatarFallback className="rounded-lg">
                                {discussion.creator.username?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-left text-sm ml-2">
                            <span className="truncate font-semibold">{discussion.creator.username}</span>
                            <span className="flex items-align gap-1 text-muted-foreground capitalize text-xs">
                                {discussion.creator.role === UserRole.RESEARCHER ? <FlaskConicalIcon size={14} /> : <UserIcon size={14} />}
                                {discussion.creator.role}
                            </span>
                        </div>
                    </div>
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
                <Suspense fallback={null}>
                    <DiscussionEditMenu creatorId={discussion.creator.id} discussion={discussion} />
                </Suspense>
            </CardFooter>
        </Card>
    );
}

async function DiscussionEditMenu({ creatorId, discussion }: { creatorId: string, discussion: Discussion }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.id !== creatorId) return null;

    return (
        <DiscussionDropdownMenu discussion={discussion} showVisit={false} />
    );
}