"use server";

import { createClient } from "@/src/utils/supabase/server";
import { deleteFromMinIO } from "@/src/utils/minio/client";
import { ValidationStatus } from "@/src/types/enums";

export const updateContributionStatus = async (ids: string[], status: ValidationStatus) => {
    if (ids.length === 0) {
        return { success: false, message: "No contributions selected!" };
    }
    const supabase = await createClient();
    const { error, data } = await supabase.from("contributions").update({ status }).in("id", ids).select("id, user, task");
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: ids.length === 1 ? "Failed to update contribution status!" : "Failed to update all contributions status" };
    }

    // Send notifications to users
    const notifications = data.map((contribution) => {
        return {
            recipient_id: contribution.user,
            message_template: `Your contribution to {task.title} was ${status}.`,
            task_id: contribution.task,
            action_url: `/contributions/${contribution.id}`
        }
    })
    const { error: notifError } = await supabase.from("notifications").insert(notifications);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: ids.length === 1 ? `Contribution ${status} successfully!` : `Contributions ${status} successfully!` };
}

export async function softDeleteContributions(ids: string[]) {
    const supabase = await createClient();
    const currentDate = new Date().toISOString();
    const { error, data } = await supabase.from("contributions").update({ deleted_at: currentDate }).in("id", ids).select("id, user, task");
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: "Failed to delete contribution(s)" };
    }

    // Send notifications to users
    const notifications = data.map((contribution) => {
        return {
            recipient_id: contribution.user,
            message_template: `Your contribution to {task.title} was deleted.`,
            task_id: contribution.task,
        }
    })
    const { error: notifError } = await supabase.from("notifications").insert(notifications);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: "Contribution(s) deleted successfully!" };
}

export async function hardDeleteContributions(ids: string[]) {
    const supabase = await createClient();
    const { error, data: contributions } = await supabase.from("contributions").delete().in("id", ids).select("data");
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to delete contribution(s)" };
    }

    contributions.forEach(async (contribution) => {
        for (const field in contribution.data) {
            if (contribution.data[field].files) {
                for (const file of contribution.data[field].files) {
                    await deleteFromMinIO(file)
                }
            }
        }
    });

    return { success: true, message: "Contribution(s) deleted successfully!" };
}