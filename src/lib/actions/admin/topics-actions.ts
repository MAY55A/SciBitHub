"use server";

import { createAdminClient } from "@/src/utils/supabase/admin";
import { toggleIsFeatured } from "../topic-actions";

const supabase = createAdminClient();

export const updateTopicIsFeatured = async (id: string, isFeatured: boolean) => {
    return await toggleIsFeatured(isFeatured, id, supabase);
};

export const toggleDeleteTopic = async (id: string, deleted_at: string | null) => {
    const { error, data: topic } = await supabase.from("forum_topics").update({ deleted_at }).eq("id", id).select('creator').single();
    const verb = deleted_at ? "delete" : "restore";
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: `Failed to ${verb} topic.` };
    }

    const notification = {
        recipient_id: topic.creator,
        message_template: `Your forum topic {topic.title} has been ${verb}d .`,
        topic_id: id,
        action_url: `/forum-topics/${id}`,
    };
    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: `Topic ${verb}d successfully.` };
};

export const deleteTopics = async (ids: string[]) => {
    const { error, data: topics } = await supabase.from("forum_topics").update({ deleted_at: new Date().toISOString() }).in("id", ids).select('id, creator, project, title');
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: "Failed to delete topic(s)." };
    }
    const notifications = topics.map(topic => ({
        recipient_id: topic.creator,
        message_template: `Your topic ${topic.title.length > 50 ? topic.title.slice(0,50) : topic.title} in project {project.name} forum has been deleted .`,
        project_id: topic.project,
        action_url: `/projects/${topic.project}?tab=forum`,
    }));
    const { error: notifError } = await supabase.from("notifications").insert(notifications);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: "Topic(s) deleted successfully." };
};
