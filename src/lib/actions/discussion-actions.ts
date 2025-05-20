"use server";

import { createClient } from "@/src/utils/supabase/server";
import { deleteFromMinIO } from "@/src/utils/minio/client";
import { DiscussionStatus, NotificationType } from "@/src/types/enums";
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
            message_template: `An admin has ${status === DiscussionStatus.OPEN ? "reopened" : status} your discussion {discussion.title}.`,
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

export async function deleteDiscussion(id: string, client?: SupabaseClient<any, "public", any>) {
    const supabase = client ?? await createClient();
    const { count } = await supabase.from("comments").select("id", { count: "exact", head: true }).eq("discussion", id);
    let discussion: { creator: string; title: string };
    // hard delete if no comments exist
    if (!count) {
        const { error: deleteError, data } = await supabase.from("discussions").delete().eq("id", id).select("creator, title").maybeSingle();
        if (deleteError || !data) {
            console.log("Database error:", deleteError?.message || "No data returned");
            return { success: false, message: "Failed to delete discussion." };
        }
        discussion = data;

        // soft delete if comments exist
    } else {
        const { error, data } = await supabase.from("discussions")
            .update({
                files: null,
                status: DiscussionStatus.DELETED,
                deleted_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select("creator, title")
            .maybeSingle();
        if (error || !data) {
            console.log("Database error:", error?.message || "No data returned");
            return { success: false, message: "Failed to delete discussion." };
        }
        discussion = data;
    }
    // Delete the discussion file from MinIO
    await deleteFromMinIO(`discussions/${id}`, true);

    const notification = client // If a client is provided, then it is an admin action (client with service role)
        ? {
            recipient_id: discussion.creator,
            message_template: `An admin deleted your discussion "${discussion.title.length > 50 ? discussion.title.slice(0, 50) + "..." : discussion.title}".`
        } : {
            type: NotificationType.TO_ALL_ADMINS,
            message_template: `{user.username} deleted their discussion "${discussion.title.length > 50 ? discussion.title.slice(0, 50) + "..." : discussion.title}".`,
            user_id: discussion.creator
        }

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: "Discussion deleted successfully." };
}