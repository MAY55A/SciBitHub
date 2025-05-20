"use server";

import { createClient } from "@/src/utils/supabase/server";
import { TopicInputData } from "@/src/types/topic-form-data";
import { ForumTopic } from "@/src/types/models";

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
    const { error: topicError, data: topicData } = await supabase.from("forum_topics").insert(topic).select("id, project:projects(id, creator)").single();
    if (topicError) {
        console.error("Database error:", topicError.message);
        return { success: false, message: "Failed to post topic." };
    }

    // notify project creator
    const notification = {
        recipient_id: (topicData as unknown as ForumTopic).project.creator,
        message_template: "{user.username} created a new topic {topic.title} in {project.name} forum.",
        user_id: user.data.user.id,
        topic_id: topicData.id,
        action_url: `/forum_topics/${topicData.id}`
    };
    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.error("Database notification error:", notifError.message);
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

export async function toggleIsFeatured(is_featured: boolean, id: string, client: any) {
    const supabase = client ?? await createClient();
    const action = is_featured ? "mark" : "unmark";

    const { error, data: topic } = await supabase.from("forum_topics").update({ is_featured }).eq("id", id).select("creator").single();
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: `Failed to ${action} topic as featured.` };
    }

    // notify topic creator
    const notification = {
        recipient_id: topic.creator,
        message_template: `Your forum topic {topic.title} has been ${action}ed as featured.`,
        topic_id: id,
        action_url: `/forum_topics/${id}`
    };
    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.error("Database notification error:", notifError.message);
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
        const { error, data } = await supabase.from("forum_topics").update({ deleted_at: new Date().toISOString() }).eq("id", id).select("creator, project:projects(id, creator)").single();
        if (error) {
            console.log("Database error:", error.message);
            return { success: false, message: "Failed to delete topic." };
        }

        const topic = data as unknown as ForumTopic;
        // notify project creator
        const notification = {
            recipient_id: topic.project.creator,
            message_template: "{user.username} deleted a topic in {project.name} forum.",
            user_id: topic.creator,
            project_id: topic.project.id,
        };
        const { error: notifError } = await supabase.from("notifications").insert(notification);
        if (notifError) {
            console.error("Database notification error:", notifError.message);
        }

    }
    return { success: true, message: "Topic deleted successfully." };
}