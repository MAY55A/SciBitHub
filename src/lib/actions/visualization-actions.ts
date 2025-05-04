"use server";

import { createClient } from "@/src/utils/supabase/server";
import { VisualizationInputData } from "@/src/types/data-visualization-form-data";

export const createVisualization = async (data: VisualizationInputData, project: string) => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return { success: false, message: "You are not authenticated." };
    }

    if (!data) {
        return { success: false, message: "Visualization data is required." };
    }

    const { error, data: newRow } = await supabase.from("visualizations").insert({...data, project}).select("id").single();
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to create visualization." };
    }

    return { success: true, message: "Visualization created successfully.", id: newRow.id };
};

export async function updateVisualization(data: VisualizationInputData) {
    const supabase = await createClient();

    const { error } = await supabase.from("visualizations").update({...data, updated_at: new Date().toISOString()}).eq("id", data.id);
    if (error) {
        console.error("Database error:", error.message);
        console.log("Database error:", error.message);

        return { success: false, message: "Failed to update visualization." };
    }

    return { success: true, message: "Visualization updated successfully." };
}

export async function deleteVisualization(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("visualizations").delete().eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        console.log("Database error:", error.message);

        return { success: false, message: "Failed to delete visualization." };
    }

    return { success: true, message: "Visualization deleted successfully." };
}