"use server";

import { createClient } from "@/src/utils/supabase/server";

export const postComment = async (data: any, commentPage: string) => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (!data) {
        return { success: false, message: "Reply data is required." };
    }

    const comment = {
        creator: user.data.user.id,
        ...data
    };

    const { error, data: commentData } = await supabase
        .from("comments")
        .insert(comment)
        .select("id, discussion:discussions(creator), topic:forum_topics(id,creator), parent_comment:comments(creator)")
        .single();
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to post reply." };
    }

    const notificationParties = {
        recipient_id: commentData.discussion?.creator ?? commentData?.topic?.creator ?? commentData.parent_comment?.creator,
        user_id: user.data.user.id,
    };
    let notification = {};
    if (commentData.discussion) {
        notification = {
            discussion_id: comment.discussion,
            message_template: `{user.username} replied to your discussion: {discussion.title} ↩ .`,
            action_url: `/discussions/${comment.discussion}#${commentData.id}`,
        }
    } else if (commentData.topic) {
        notification = {
            topic_id: comment.forum_topic,
            message_template: `{user.username} replied to your topic: {forum_topic.title} ↩ .`,
            action_url: `/forum_topics/${comment.topic_id}#${commentData.id}`,
        }
    } else if (commentData.parent_comment) {
        notification = {
            message_template: `{user.username} replied to your comment ↩ .`,
            action_url: `${commentPage}#${commentData.id}`,
        }
    }

    const { error: notifError } = await supabase.from("notifications").insert({...notification, ...notificationParties});
    if (notifError) {
        console.error("Database notification error:", notifError.message);
    }

    return { success: true, message: "Reply posted successfully." };
};

export async function editComment(id: string, content: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("comments").update({ content, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        console.log("Database error:", error.message);

        return { success: false, message: "Failed to update reply." };
    }

    return { success: true, message: "Reply updated successfully." };
}

export async function deleteComment(id: string) {
    const supabase = await createClient();

    // all replies will also be deleted due to foreign key constraint (on cascade delete)
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        console.log("Database error:", error.message);

        return { success: false, message: "Failed to delete reply." };
    }

    return { success: true, message: "Reply deleted successfully." };
}