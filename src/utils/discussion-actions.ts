"use server";

import { createClient } from "@/src/utils/supabase/server";
import { encodedRedirect } from "./utils";
import { deleteFromMinIO } from "./minio/client";

// Change later to soft delete
export async function deleteDiscussion(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("discussion").delete().eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        return encodedRedirect("error", "/profile/discussions", "Failed to delete discussion");
    }
    await deleteFromMinIO(`discussions/${id}`, true);

    return encodedRedirect("success", "/profile/discussions", "Discussion deleted successfully!");
}