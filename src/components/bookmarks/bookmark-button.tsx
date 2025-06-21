'use client'

import { BookmarkCheck, BookmarkIcon } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/src/utils/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/hooks/use-toast";
import { addBookmark, removeBookmark } from "@/src/lib/actions/bookmark-actions";
import { UserRole } from "@/src/types/enums";

export const BookmarkButton = ({ projectId, discussionId }: { projectId?: string, discussionId?: string }) => {
    const [existingBookmark, setExistingBookmark] = useState<{ id: string } | null>(null);
    const supabase = createClient();
    const { user } = useAuth();
    const { toast } = useToast();

    async function checkExistingBookmark() {
        const query = supabase
            .from("bookmarks")
            .select("id")
            .eq("user_id", user!.id);

        if (discussionId) {
            query.eq("discussion_id", discussionId);
        } else {
            query.eq("project_id", projectId);
        }

        const { data } = await query.maybeSingle();
        setExistingBookmark(data);
    }

    useEffect(() => {
        if (user) {
            checkExistingBookmark();
        }
    }, [user]);

    async function toggleBookmark() {
        if (!existingBookmark) {
            const bookmark = { user_id: user!.id, project_id: projectId, discussion_id: discussionId };
            const res = await addBookmark(bookmark);
            setExistingBookmark(res.bookmark);
            toast({
                description: res.message,
                variant: res.success ? "default" : "destructive",
            });

        } else {
            const res = await removeBookmark(existingBookmark.id);
            if (res.success) {
                setExistingBookmark(null);
            }
            toast({
                description: res.message,
                variant: res.success ? "default" : "destructive",
            });
        }
    }

    if (!user || user.role === UserRole.ADMIN) {
        return null;
    }

    return (
        <Button
            variant="ghost"
            className="text-muted-foreground px-2"
            title={existingBookmark ? "remove from bookmarks" : "add to bookmarks"}
            onClick={() => toggleBookmark()}
        >
            {existingBookmark
                ? <BookmarkCheck size={18} color="green" />
                : <BookmarkIcon size={18} />
            }
        </Button>
    );
}