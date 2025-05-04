"use client";
import { useAuth } from "@/src/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { NewComment } from "./new-comment";
import { CommentCard } from "./comment";
import { Button } from "../ui/button";
import { Comment } from "@/src/types/models";
import { createClient } from "@/src/utils/supabase/client";
import { fetchComments } from "@/src/lib/services/comment-service";
import { useRealtimeComments } from "@/src/hooks/use-realtime-comments";
import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";


interface CommentsListProps {
    commentedOn: { discussion: string } | { forum_topic: string } | { parent_comment: string },
    replyingTo?: { user: string, comment: string };
    allowNewComments?: boolean;
}

export default function CommentsList({ commentedOn, replyingTo, allowNewComments = true }: CommentsListProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const hasInitialized = useRef(false);
    const supabase = createClient();

    const loadMore = async () => {
        const nextPage = page + 1;
        const res = await fetchComments(supabase, { ...commentedOn, currentPage: nextPage });
        setCount(res.count);

        if (res.comments.length) {
            setComments((prev) => {
                // Filter out any duplicates that might already exist from realtime
                const newComments = res.comments.filter(
                    newComment => !prev.some(comment => comment.id === newComment.id)
                );
                return [...prev, ...newComments];
            });
            setPage(nextPage);
        }
        setHasMore(res.totalPages > nextPage);
    };

    // remove deleted comment (only current user deleted comments)
    const removeComment = async (id: string) => {
        setComments(prev => prev.filter(c => c.id !== id));
        setCount(prev => prev - 1);
    };

    // Load initial comments
    useEffect(() => {
        if (hasInitialized.current) return; // Skip if already ran (in react 18+, useEffect runs twice in dev strict mode)
        hasInitialized.current = true;

        loadMore();
    }, []);

    // Realtime updates (handles inserts, updates, ! not deletes)
    useRealtimeComments(commentedOn, setComments, setCount);

    return (
        <>
            <div className={cn("py-8 text-sm", !!replyingTo && "py-2 text-xs")}>{count} {count === 1 ? "Reply" : "Replies"}</div>
            <div className={cn(!!replyingTo && "rounded-lg border-l-2 pl-2 pt-2")}>
                {allowNewComments ?
                    <NewComment commentedOn={commentedOn} user={user} replyingTo={replyingTo} /> :
                    <div className="flex flex-col items-center text-muted-foreground p-8 border m-4 rounded-lg">
                        <span>No more replies can be posted</span>
                        <span className="text-sm">This discussion is <strong>closed</strong></span>
                    </div>
                }
                <div className="flex flex-col gap-4">
                    {comments.length ? comments.map(comment => (
                        <CommentCard key={comment.id} comment={comment} currentUser={user} replyingTo={replyingTo} onDelete={removeComment} />
                    )) : (
                        !replyingTo && <div className="text-center text-muted-foreground py-24">No replies yet</div>
                    )}
                </div>
                {hasMore && (
                    <div className="text-center mt-4">
                        <Button variant="link" onClick={loadMore}>Load More <ChevronDown size={14} /></Button>
                    </div>
                )}
            </div>
        </>
    );
}