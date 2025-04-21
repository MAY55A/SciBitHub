'use server';

import { TaskStatus } from "../types/enums";
import { deleteFromMinIO } from "./minio/client";
import { createClient } from "./supabase/server";


export async function updateStatus(id: string, status: TaskStatus) {
    const supabase = await createClient();
    const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to update task status." };
    }

    return { success: true, message: "Task's status updated successfully." };
}

export async function deleteTask(taskId: string, projectId: string, data_source?: string | null) {
    const supabase = await createClient();
    const { count: tasks } = await supabase.from("tasks").select("*", { count: "exact", head: true }).eq("project", projectId).neq("id", taskId).is("deleted_at", null);

    if (!tasks) {
        return { success: false, message: "Cannot delete the only task in a project." };
    }

    const { count } = await supabase.from("contributions").select("*", { count: "exact", head: true }).eq("task", taskId);
    // hard delete if no contributions exist
    if (!count) {
        const { error: deleteError } = await supabase.from("tasks").delete().eq("id", taskId);
        if (deleteError) {
            console.error("Database error:", deleteError.message);
            return { success: false, message: "Failed to delete task." };
        }
        if (data_source) {
            await deleteFromMinIO(data_source, true);
        }

        // soft delete if contributions exist
    } else {
        const { error: updateError } = await supabase.from("tasks").update({ deleted_at: new Date().toISOString() }).eq("id", taskId);
        if (updateError) {
            console.error("Database error:", updateError.message);
            return { success: false, message: "Failed to delete task." };
        }
    }

    return { success: true, message: "Task deleted successfully!" };
}