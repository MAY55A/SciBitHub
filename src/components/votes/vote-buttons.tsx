'use client'

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/src/utils/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";

export const VoteButtons = ({ voted_id, voted_type, upvotes, downvotes, creatorId }: { voted_id: string, voted_type: string, upvotes: number, downvotes: number, creatorId?: string }) => {
    const [existingVote, setExistingVote] = useState<{ id: String, vote: number } | null>(null);
    const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
    const [currentDownvotes, setCurrentDownvotes] = useState(downvotes);
    const supabase = createClient();
    const { user } = useAuth();
    const pathname = usePathname();

    async function checkExistingVote() {
        const { data } = await supabase
            .from("votes")
            .select("id, vote")
            .eq("voter", user!.id)
            .eq("voted", voted_id)
            .eq("voted_type", voted_type)
            .maybeSingle();
        setExistingVote(data);
    }

    useEffect(() => {
        if (user && user.role !== "admin") {
            checkExistingVote();
        }
    }, [user]);

    async function vote(vote_value: -1 | 1) {
        if (!existingVote) {
            const { error, data: vote } = await supabase.from("votes").insert({ voter: user!.id, voted: voted_id, voted_type, vote: vote_value }).select("id, vote").single();
            if (error) {
                console.log("Error inserting vote:", error);
            } else {
                setExistingVote(vote);
                vote_value === 1 ? setCurrentUpvotes(currentUpvotes + 1) : setCurrentDownvotes(currentDownvotes + 1);
            }

        } else if (existingVote.vote === vote_value) { // toggle off
            const { error } = await supabase.from("votes").delete().eq("id", existingVote.id);
            if (error) {
                console.log("Error deleting vote:", error);
            } else {
                setExistingVote(null);
                vote_value === 1 ? setCurrentUpvotes(currentUpvotes - 1) : setCurrentDownvotes(currentDownvotes - 1);
            }

        } else { // switch vote
            const { error } = await supabase.from("votes").update({ vote: vote_value }).eq("id", existingVote.id);
            if (error) {
                console.log("Error updating vote:", error);
            } else {
                setExistingVote({ id: existingVote.id, vote: vote_value });
                if (vote_value === 1) {
                    setCurrentUpvotes(currentUpvotes + 1);
                    setCurrentDownvotes(currentDownvotes - 1);
                } else {
                    setCurrentUpvotes(currentUpvotes - 1);
                    setCurrentDownvotes(currentDownvotes + 1);
                }
            }
        }

        // notify creator about other users if the vote is new or has changed
        if (creatorId && creatorId !== user!.id && (!existingVote || existingVote.vote !== vote_value)) {
            const notification = {
                recipient_id: creatorId,
                message_template: `{user.username} ${vote_value === 1 ? "upvoted ▲" : "downvoted ▼"} your ${voted_type}.`,
                user_id: user!.id,
                action_url: pathname
            }
            const { error: notifError } = await supabase.from("notifications").insert(notification);
            if (notifError) {
                console.log("Database notification error:", notifError.message);
            }
        }
    }
    return (
        <div className="flex gap-1">
            <Button
                variant="ghost"
                className={cn("text-green-700 hover:text-green-500 h-8 px-2 font-bold", existingVote?.vote === 1 && "border border-green-700")}
                disabled={!user || user.role === "admin"}
                title={existingVote?.vote === 1 ? "cancel upvote" : "upvote"}
                onClick={() => vote(1)}
            >
                <ChevronUp size={15} />
                <span>{currentUpvotes}</span>
            </Button>
            <Button
                variant="ghost"
                className={cn("text-red-700 hover:text-red-500 h-8 px-2 font-bold", existingVote?.vote === -1 && "border border-red-700")}
                disabled={!user || user.role === "admin"}
                title={existingVote?.vote === -1 ? "cancel downvote" : "downvote"}
                onClick={() => vote(-1)}
            >
                <ChevronDown size={15} />
                <span>{currentDownvotes}</span>
            </Button>
        </div>
    );
}