"use server";

import { createClient } from "@/src/utils/supabase/server";

export const addBookmark = async (data: any) => {
    const supabase = await createClient();

    const { error, data: bookmark } = await supabase
        .from("bookmarks")
        .insert(data)
        .select("id")
        .single();
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: "Failed to save item.", bookmark: null };
    }

    return { success: true, message: "Item saved successfully.", bookmark };
};

export async function removeBookmark(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: "Failed to remove bookmark." };
    }

    return { success: true, message: "Bookmark removed successfully." };
}