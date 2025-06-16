"use server";

import { createClient } from "@/src/utils/supabase/server";
import { deleteFromMinIO } from "@/src/utils/minio/client";
import { DiscussionStatus, NotificationTarget } from "@/src/types/enums";
import { SupabaseClient } from "@supabase/supabase-js";

export async function updateDiscussionStatus(id: string, status: DiscussionStatus, client?: SupabaseClient<any, "public", any>) {
    const supabase = client ?? await createClient();
    const { error, data: discussion } = await supabase.from("discussions").update({ status }).eq("id", id).select("creator").single();
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: "Failed to update discussion status." };
    }
    if (client) { // If a client is provided, then it is an admin action (client with service role)
        const notification = {
            recipient_id: discussion.creator,
            message_template: `An admin has ${status === DiscussionStatus.OPEN ? "reopened" : status} your discussion {discussion.title} .`,
            discussion_id: id,
            action_url: `/discussions/${id}`,
        };

        const { error: notifError } = await supabase.from("notifications").insert(notification);
        if (notifError) {
            console.log("Database notification error:", notifError.message);
        }
    }
    return { success: true, message: "Discussion status updated successfully." };
}

export async function deleteDiscussion(id: string) {
    const supabase = await createClient();
    const { count } = await supabase.from("comments").select("id", { count: "exact", head: true }).eq("discussion", id);
    let discussion: { creator: string; title: string };

    // hard delete if no comments exist
    // soft delete if comments exist
    const res = count ? await softDeleteDiscussion(id, supabase) : await hardDeleteDiscussion(id, supabase);
    if (!res) {
        return { success: false, message: "Failed to delete discussion." };
    }
    discussion = res;

    const notification = {
        target: NotificationTarget.TO_ALL_ADMINS,
        message_template: `{user.username} deleted their discussion "${discussion.title.length > 50 ? discussion.title.slice(0, 47) + "..." : discussion.title}".`,
        user_id: discussion.creator
    }

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: "Discussion deleted successfully." };
}

export async function hardDeleteDiscussion(id: string, supabase: SupabaseClient<any, "public", any>) {
    const { error: deleteError, data } = await supabase.from("discussions").delete().eq("id", id).select("creator, title").maybeSingle();
    if (deleteError) {
        console.log("Database error:", deleteError.message);
    }
    const { error: voteDeletionError } = await supabase.from("votes").delete().eq("voted", id);
    if (voteDeletionError) {
        console.log("Database error:", voteDeletionError.message);
    }
    // Delete the files from MinIO
    await deleteFromMinIO(`discussions/${id}`, true);
    return data;
}

export async function softDeleteDiscussion(id: string, supabase: SupabaseClient<any, "public", any>) {
    const { error, data } = await supabase.from("discussions")
        .update({
            status: DiscussionStatus.DELETED,
            deleted_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("creator, title")
        .maybeSingle();
    if (error) {
        console.log("Database error:", error.message);
    }
    return data;
}