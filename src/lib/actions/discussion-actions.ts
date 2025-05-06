"use server";

import { createClient } from "@/src/utils/supabase/server";
import { deleteFromMinIO } from "@/src/utils/minio/client";
import { DiscussionStatus } from "@/src/types/enums";
import { SupabaseClient } from "@supabase/supabase-js";

export async function updateDiscussionStatus(id: string, status: DiscussionStatus, client?: SupabaseClient<any, "public", any>) {
    const supabase = client ?? await createClient();
    const { error } = await supabase.from("discussions").update({ status }).eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to update discussion status." };
    }

    return { success: true, message: "Discussion status updated successfully." };
}

export async function deleteDiscussion(id: string, client?: SupabaseClient<any, "public", any>) {
    const supabase = client ?? await createClient();
    const { count } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("discussion", id);
    // hard delete if no comments exist
    if (!count) {
        const { error: deleteError } = await supabase.from("discussions").delete().eq("id", id);
        if (deleteError) {
            console.error("Database error:", deleteError.message);
            return { success: false, message: "Failed to delete discussion." };
        }

    // soft delete if comments exist
    } else {
        const { error } = await supabase.from("discussions")
            .update({
                files: null,
                status: DiscussionStatus.DELETED,
                deleted_at: new Date().toISOString(),
            })
            .eq("id", id);
        if (error) {
            console.error("Database error:", error.message);
            return { success: false, message: "Failed to delete discussion." };
        }
    }
    // Delete the discussion file from MinIO
    await deleteFromMinIO(`discussions/${id}`, true);

    return { success: true, message: "Discussion deleted successfully." };
}