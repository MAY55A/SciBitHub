import { useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { Comment } from "../types/models";

export const useRealtimeComments = (
    commentedOn: { discussion: string } | { forum_topic: string } | { parent_comment: string },
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
    setCount: React.Dispatch<React.SetStateAction<number>>
) => {
    const supabase = createClient();

    useEffect(() => {
        const filterKey = Object.keys(commentedOn)[0];
        const filterValue = commentedOn[filterKey as keyof typeof commentedOn];
        let newComment: Comment;
        const channel = supabase
            .channel("realtime:comments")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "comments",
                    filter: `${filterKey}=eq.${filterValue}`
                },
                async (payload) => {
                    console.log("Realtime Event:", payload.eventType, payload);

                    // Manually join user data
                    if (payload.eventType === "INSERT") {
                        setCount(prev => prev + 1); // Increment count for new comment
                        newComment = payload.new as Comment;
                        const { data: user } = await supabase
                            .from("users")
                            .select("id, username, profile_picture, role, metadata")
                            .eq("id", payload.new.creator)
                            .single();
                        newComment.creator = user!;  // Replace ID with full user object
                    }
                    setComments((prev) => {
                        // Handle INSERTS (new comments)
                        if (payload.eventType === "INSERT") {
                            return [newComment, ...prev]; // Prepend new comments
                        }

                        // Handle UPDATES (edited comments)
                        if (payload.eventType === "UPDATE") {
                            return prev.map((comment) =>
                                comment.id === payload.new.id ? { ...payload.new, creator: comment.creator } as Comment : comment
                            );
                        }

                        // Handle DELETES
                        // ! Note: This will never be triggered because filtering doesnt work on delete events (supabase limitation)
                        // ! also payload.old only has "id", because the comments raplica is set to default (not full)
                        // ! so even if filters worked the deleted comment will still not be ignored
                        // ! because it wont pass the filter (it needs other columns for filtering)
                        if (payload.eventType === "DELETE") {
                            return prev.filter((comment) => comment.id !== payload.old.id);
                        }

                        return prev;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [commentedOn]);
};