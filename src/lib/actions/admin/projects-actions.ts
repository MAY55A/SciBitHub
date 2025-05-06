"use server";

import { ProjectStatus } from "@/src/types/enums";
import { createAdminClient } from "@/src/utils/supabase/admin";

export const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
    const supabase = createAdminClient();

    const data = {
        status,
        published_at: status === ProjectStatus.PUBLISHED ? new Date() : undefined,
        deleted_at: status === ProjectStatus.DELETED ? new Date() : undefined,
    }
    const { error } = await supabase.from('projects').update(data).eq('id', projectId);

    if (error) {
        console.log("Error updating status:", error.message);
        return { success: false, message: "Failed to update project status." };
    }

    return { success: true, message: `Project ${status} successfully.` };
};