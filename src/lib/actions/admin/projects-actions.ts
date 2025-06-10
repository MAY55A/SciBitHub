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
    const { error, data: project } = await supabase.from('projects').update(data).eq('id', projectId).select('creator').single();

    if (error) {
        console.log("Error updating status:", error.message);
        return { success: false, message: "Failed to update project status." };
    }

    const notification = {
        recipient_id: project.creator,
        message_template: `Your project {project.name} has been ${status}.`,
        project_id: projectId,
        action_url: `/profile/projects`,
    };

    const { error: notifError } = await supabase.from("notifications").insert(notification);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: `Project ${status} successfully.` };
};