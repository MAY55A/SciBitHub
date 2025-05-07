"use server";

import { createAdminClient } from "@/src/utils/supabase/admin";
import { toggleIsFeatured } from "../topic-actions";

const supabase = createAdminClient();

export const updateTopicIsFeatured = async (id: string, isFeatured: boolean) => {
    return await toggleIsFeatured(isFeatured, id, supabase);
};

export const toggleDeleteTopic = async (id: string, deleted_at: string | null) => {
    const { error } = await supabase.from("forum_topics").update({ deleted_at }).eq("id", id);
    const verb = deleted_at ? "delete" : "restore";
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: `Failed to ${verb} topic.` };
    }

    return { success: true, message: `Topic ${verb}d successfully.` };
};

export const deleteTopics = async (ids: string[]) => {
    const { error } = await supabase.from("forum_topics").update({deleted_at: new Date().toISOString()}).in("id", ids);
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: "Failed to delete topic(s)." };
    }

    return { success: true, message: "Topic(s) deleted successfully." };
};
