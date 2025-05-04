"use server";

import { createClient } from "@/src/utils/supabase/server";

export const postComment = async (data: any) => {
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

    const { error } = await supabase.from("comments").insert(comment);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to post reply." };
    }

    return { success: true, message: "Reply posted successfully." };
};

export async function editComment(id: string, content: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("comments").update({content, updated_at: new Date().toISOString()}).eq("id", id);
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