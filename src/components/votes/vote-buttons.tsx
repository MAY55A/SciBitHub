'use client'

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/src/utils/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { cn } from "@/src/lib/utils";

export const VoteButtons = ({ voted_id, voted_type, upvotes, downvotes }: { voted_id: string, voted_type: string, upvotes: number, downvotes: number }) => {
    const [existingVote, setExistingVote] = useState<{ id: String, vote: number } | null>(null);
    const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
    const [currentDownvotes, setCurrentDownvotes] = useState(downvotes);
    const supabase = createClient();
    const { user } = useAuth();

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
        if (user) {
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
    }
    return (
        <div className="flex gap-1">
            <Button
                variant="ghost"
                className={cn("text-green-700 hover:text-green-500 h-8 px-2", existingVote?.vote === 1 && "border border-green-700")}
                disabled={!user}
                title={existingVote?.vote === 1 ? "cancel upvote" : "upvote"}
                onClick={() => vote(1)}
            >
                <ChevronUp size={15} />
                <span>{currentUpvotes}</span>
            </Button>
            <Button
                variant="ghost"
                className={cn("text-red-700 hover:text-red-500 h-8 px-2", existingVote?.vote === -1 && "border border-red-700")}
                disabled={!user}
                title={existingVote?.vote === -1 ? "cancel downvote" : "downvote"}
                onClick={() => vote(-1)}
            >
                <ChevronDown size={15} />
                <span>{currentDownvotes}</span>
            </Button>
        </div>
    );
}