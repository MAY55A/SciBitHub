"use client"

import { User } from "@/src/types/models"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { postComment } from "@/src/lib/actions/comment-actions";
import { MarkdownEditor } from "../custom/markdown-editor";


interface NewCommentProps {
    user: User | null;
    commentedOn: { discussion: string } | { forum_topic: string } | { parent_comment: string },
    replyingTo?: { user: string, comment: string };
}
export function NewComment({ user, commentedOn, replyingTo }: NewCommentProps) {
    const [newComment, setNewComment] = useState<string | undefined>(undefined);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push(`/sign-in?redirect_to=${encodeURIComponent(pathname)}`);
            return;
        }

        const res = await postComment({ content: newComment, ...commentedOn }, pathname.replace(/#.*$/, ''));
        if (res.success) {
            setNewComment(undefined);
        }
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });
    };


    return (
        <div className="w-full flex gap-2">
            {!!user &&
                <Avatar className="flex shrink-0 overflow-hidden h-8 w-8 rounded-lg hover:shadow-lg hover:bg-muted">
                    <AvatarImage src={user.profile_picture} alt={user.username} />
                    <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">
                        {user.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>}
            <div className="w-full">
                <div className="text-sm text-muted-foreground pb-2">
                    <strong>{user?.username}</strong>
                    {!!replyingTo &&
                        <span className="mx-1 text-xs font-retro">
                            replying to <a href={`#${replyingTo.comment}`} className="truncate underline font-semibold">{replyingTo.user}</a>
                        </span>
                    }
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="relative">
                        <MarkdownEditor
                            value={newComment}
                            onChange={setNewComment}
                        />
                        <div className="flex justify-end mt-4">
                            {replyingTo ?
                                <Button type="submit" variant="outline" size="sm" disabled={!newComment?.trim()} className="absolute bottom-6 right-2 text-xs h-8">
                                    Reply
                                </Button> :
                                <Button type="submit" size="sm" disabled={!newComment?.trim()} className="absolute bottom-6 right-2 text-xs h-8">
                                    Post
                                </Button>
                            }

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}