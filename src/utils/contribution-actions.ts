"use server";

import { createClient } from "@/src/utils/supabase/server";
import { deleteFromMinIO } from "./minio/client";
import { ValidationStatus } from "../types/enums";

export const updateContributionStatus = async (ids: string[], status: ValidationStatus) => {
    if (ids.length === 0) {
        return { success: false, message: "No contributions selected!" };
    }
    const supabase = await createClient();
    const { error } = await supabase.from("contributions").update({ status }).in("id", ids);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: ids.length === 1 ? "Failed to update contribution status!" : "Failed to update all contributions status" };
    }
    return { success: true, message: ids.length === 1 ? "Contribution status updated successfully!" : "Contributions status updated successfully" };
}

export async function deleteContributions(ids: string[]) {
    console.log("Deleting contributions with IDs:", ids);

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