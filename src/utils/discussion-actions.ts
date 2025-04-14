"use server";

import { createClient } from "@/src/utils/supabase/server";
import { deleteFromMinIO } from "./minio/client";
import { DiscussionStatus } from "../types/enums";

// Change later to soft delete
export async function updateDiscussionStatus(id: string, status: DiscussionStatus) {
    const supabase = await createClient();
    const { error } = await supabase.from("discussions").update({ status }).eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to update discussion status." };
    }

    return { success: true, message: "Discussion status updated successfully." };
}

export async function deleteDiscussion(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("discussions").delete().eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to delete discussion." };
    }
    await deleteFromMinIO(`discussions/${id}`, true);

    return { success: true, message: "Discussion deleted successfully." };
}