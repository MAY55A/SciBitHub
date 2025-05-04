"use server";

import { createClient } from "@/src/utils/supabase/server";
import { TopicInputData } from "@/src/types/topic-form-data";

export const createTopic = async (data: TopicInputData) => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (!data) {
        return { success: false, message: "Topic data is required." };
    }

    const topic = {
        ...data,
        creator: user.data.user.id,
    };

    const { error } = await supabase.from("forum_topics").insert(topic);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to post topic." };
    }

    return { success: true, message: "Topic created successfully." };
};

export async function editTopic(data: TopicInputData) {
    const supabase = await createClient();

    const { error } = await supabase.from("forum_topics").update({ ...data, updated_at: new Date().toISOString() }).eq("id", data.id);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to update topic." };
    }

    return { success: true, message: "Topic updated successfully." };
}

export async function toggleIsFeatured(is_featured: boolean, id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("forum_topics").update({ is_featured }).eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: is_featured ? "Failed to mark topic as featured." : "Failed to unmark topic as featured." };
    }

    return { success: true, message: is_featured ? "Topic marked as featured." : "Topic unmarked as featured." };
}

export async function deleteTopic(id: string) {
    const supabase = await createClient();
    const { count } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("forum_topic", id);
    // hard delete if no comments exist
    if (!count) {
        const { error } = await supabase.from("forum_topics").delete().eq("id", id);
        if (error) {
            console.error("Database error:", error.message);
            console.log("Database error:", error.message);

            return { success: false, message: "Failed to delete topic." };
        }

    // soft delete if comments exist
    } else {
        const { error } = await supabase.from("forum_topics").update({ deleted_at: new Date().toISOString() }).eq("id", id);
        if (error) {
            console.error("Database error:", error.message);
            console.log("Database error:", error.message);

            return { success: false, message: "Failed to delete topic." };
        }
    }
    return { success: true, message: "Topic deleted successfully." };
}