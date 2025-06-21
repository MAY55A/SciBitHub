"use server";

import { DiscussionStatus } from "@/src/types/enums";
import { createAdminClient } from "@/src/utils/supabase/admin";
import { updateDiscussionStatus, softDeleteDiscussion, hardDeleteDiscussion } from "../discussion-actions";

const supabase = createAdminClient();

export const updateStatus = async (id: string, status: DiscussionStatus) => {
    return await updateDiscussionStatus(id, status, supabase);
};

export const restoreDiscussion = async (id: string) => {
    const data = {
        status: DiscussionStatus.OPEN,
        deleted_at: null,
    }
    const { error, data: project } = await supabase.from('discussions').update(data).eq('id', id).select('creator').single();

    if (error) {
        console.log("Error updating status:", error.message);
        return { success: false, message: "Failed to restore discussion." };
    }

    if (project.creator) {
        const notification = {
            recipient_id: project.creator,
            message_template: `Your discussion {discussion.title} has been restored.`,
            discussion_id: id,
            action_url: `/discussions/${id}`,
        };

        const { error: notifError } = await supabase.from("notifications").insert(notification);
        if (notifError) {
            console.log("Database notification error:", notifError.message);
        }
    }

    return { success: true, message: `Discussion restored successfully.` };
};

export const deleteDiscussions = async (ids: string[], deletionType: "soft" | "hard" = "soft") => {

    if (ids.length === 0) {
        return { success: false, message: "No discussions selected for deletion." };
    }

    const deleted: string[] = [];
    const failed: string[] = [];
    const notifications: { recipient_id: string; message_template: string }[] = [];

    for (const id of ids) {
        let discussion: { creator: string | null; title: string } | null = null;

        const res = deletionType === "soft"
            ? await softDeleteDiscussion(id, supabase)
            : await hardDeleteDiscussion(id, supabase);

        if (!res) {
            failed.push(id);
            continue;
        }

        discussion = res;
        deleted.push(id);

        const message = `Your discussion "${discussion.title.length > 50 ? discussion.title.slice(0, 47) + "..." : discussion.title}" has been deleted.`;
        if (discussion.creator) {
            notifications.push({
                recipient_id: discussion.creator,
                message_template: message,
            });
        }
    }

    if (notifications.length > 0) {
        const { error: notifError } = await supabase.from("notifications").insert(notifications);
        if (notifError) {
            console.log("Database notification error:", notifError.message);
        }
    }

    return {
        success: failed.length === 0,
        message:
            failed.length === 0
                ? deleted.length === 1 ? "Discussion deleted successfully." : "All discussions deleted successfully."
                : ids.length === 1 ? 'Failed to delete discussion.' : `Deleted ${deleted.length} discussion(s), but ${failed.length} failed.`,
    };
};