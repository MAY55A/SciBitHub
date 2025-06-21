"use server";

import { ProjectStatus } from "@/src/types/enums";
import { createAdminClient } from "@/src/utils/supabase/admin";
import { hardDeleteProject as hardDelete, softDeleteProject as softDelete } from "../project-actions";

const supabase = createAdminClient();

export const updateProjectStatus = async (projectId: string, projectName: string, status: ProjectStatus) => {
    const data = {
        status,
        published_at: status === ProjectStatus.PUBLISHED ? new Date() : undefined,
        deleted_at: status === ProjectStatus.DELETED ? new Date() : null,
        name: status === ProjectStatus.DELETED ? `${projectName} (deleted)` : projectName.replace(/ \(deleted\)$/, "")
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

export const softDeleteProjects = async (projectsIds: string[], projectsNames: string[]) => {
    if (projectsIds.length === 0) {
        return { success: false, message: "No projects selected for deletion." };
    }
    const deleted: string[] = [];
    const failed: string[] = [];
    for (let i = 0; i < projectsIds.length; i++) {
        const res = await softDelete(projectsIds[i], projectsNames[i], supabase);
        if (res.success) {
            deleted.push(projectsIds[i]);
        } else {
            failed.push(projectsIds[i]);
        }
    }
    return { success: failed.length === 0, message: failed.length === 0 ? "Projects deleted successfully." : `Deleted ${deleted.length} project(s), but ${failed.length} failed.` };
};

export const hardDeleteProject = async (projectId: string) => {
    return await hardDelete(projectId, supabase);
};