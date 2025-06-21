'use client'

import { LucideHeart } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/src/utils/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";

export const LikeButton = ({ projectId, likes, creatorId }: { projectId: string, likes: number, creatorId?: string }) => {
    const [existingLike, setExistingLike] = useState<{ id: String } | null>(null);
    const [currentLikes, setCurrentLikes] = useState(likes);
    const supabase = createClient();
    const { user } = useAuth();

    async function checkExistingLike() {
        const { data } = await supabase
            .from("project_likes")
            .select("id")
            .eq("user_id", user!.id)
            .eq("project_id", projectId)
            .maybeSingle();
        setExistingLike(data);
    }

    useEffect(() => {
        if (user) {
            checkExistingLike();
        }
    }, [user]);

    async function like() {
        if (!existingLike) {
            const { error, data: like } = await supabase.from("project_likes").insert({ user_id: user!.id, project_id: projectId }).select("id").single();
            if (error) {
                console.log("Error inserting Like:", error);
            } else {
                // notify project creator if the user is not the creator
                if (creatorId && creatorId !== user!.id) {
                    const notification = {
                        recipient_id: creatorId,
                        message_template: `{user.username} hearted your project {project.name} ❤ .`,
                        project_id: projectId,
                        user_id: user!.id,
                    }
                    const { error: notifError } = await supabase.from("notifications").insert(notification);
                    if (notifError) {
                        console.log("Database notification error:", notifError.message);
                    }
                }
                setExistingLike(like);
                setCurrentLikes(currentLikes + 1);
            }

        } else { // toggle off
            const { error } = await supabase.from("project_likes").delete().eq("id", existingLike.id);
            if (error) {
                console.log("Error deleting Like:", error);
            } else {
                setExistingLike(null);
                setCurrentLikes(currentLikes - 1);
            }
        }
    }

    return (
        <Button
            variant="ghost"
            className="text-pink-700 hover:text-pink-500 h-8 px-2 space-x-2"
            disabled={!user || user.role === "admin"}
            title={existingLike ? "unlike" : "like"}
            onClick={() => like()}
        >
            <LucideHeart size={18} fill={existingLike ? "#e85682" : "transparent"} color="#bc3e64" />
            <span>{currentLikes}</span>
        </Button>
    );
}