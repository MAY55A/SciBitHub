"use server";

import { createClient } from "@/src/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { ActivityStatus, NotificationType, ProjectStatus, RequestType } from "@/src/types/enums";
import { deleteFromMinIO } from "@/src/utils/minio/client";

/*
const updateParticipants = async (supabase: SupabaseClient<any, "public", any>, participants: any, oldParticipants: any, projectId: string, status: string) => {
    if (participants.length > 0) {
        const existingInvitationIds = new Set(oldParticipants?.map(p => p.user_id) ?? []);
        const newInvitations = [];
        const invitationsToKeep = new Set();

        participants.forEach(p => {
            if (!existingInvitationIds.has(p.id)) {
                newInvitations.push({
                    user_id: p.id,
                    project_id: projectId,
                    type: RequestType.INVITATION,
                    requested_at: status === "published" ? new Date().toISOString() : undefined,
                });
            } else {
                invitationsToKeep.add(p.id);
            }
        });

        // Insert new invitations
        if (newInvitations.length > 0) {
            const { error: insertError } = await supabase.from("participation_requests").insert(newInvitations);
            if (insertError) {
                console.error("Database error:", insertError.message);
                return { success: false, message: "Failed to save participation requests" };
            }
        }

        // Remove invitations that are no longer in the participants list
        const invitationsToDelete = Array.from(existingInvitationIds.difference(invitationsToKeep));

        if (invitationsToDelete.length > 0) {
            const { error: deleteError } = await supabase.from("participation_requests").delete().in("user_id", invitationsToDelete);
            if (deleteError) {
                console.error("Database error:", deleteError.message);
                return { success: false, message: "Failed to remove old invitations" };
            }
        }
    }
    return { success: true, message: "Participants updated successfully!" };
}
*/

// For published projects
export async function softDeleteProject(projectId: string, projectName: string, client?: SupabaseClient<any, "public", any>) {
    const supabase = client ?? await createClient();
    const currentDate = new Date().toISOString();
    try {
        const { error: projectError, data: project } = await supabase.from("projects")
            .update({
                name: `${projectName} (deleted)`,
                deleted_at: currentDate,
                status: ProjectStatus.DELETED,
            })
            .eq("id", projectId)
            .select("id, creator")
            .single();
        if (projectError) {
            throw projectError;
        }

        /*
        const { error: tasksError } = await supabase.from("tasks")
            .update({
                deleted_at: currentDate,
            })
            .eq("project", projectId);
        if (tasksError) {
            throw tasksError;
        }

        const { error: storageError } = await supabase.storage
            .from("projects")
            .remove([`cover_images/${projectId}`]);
        if (storageError) {
            throw storageError;
        }

        */

        const notification = client ? // notify creator if an admin deleted the project else notify admins
            {
                message_template: `Your project "${projectName.length > 50 ? projectName.slice(0, 47) + "..." : projectName}" has been deleted.`,
                recipient_id: project.creator,
            }
            : {
                type: NotificationType.TO_ALL_ADMINS,
                message_template: `{user.username} deleted their project "${projectName.length > 50 ? projectName.slice(0, 47) + "..." : projectName}".`,
                user_id: project.creator
            }

        const { error: notifError } = await supabase.from("notifications").insert(notification);
        if (notifError) {
            console.log("Database notification error:", notifError.message);
        }

        return { success: true, message: "Project deleted successfully." };

    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, message: "Failed to delete project." };
    }
}

// No notification for admins for deleting unpublished projects
export async function hardDeleteProject(projectId: string, client?: SupabaseClient<any, "public", any>) {
    const supabase = client ?? await createClient();
    try {
        const { error: deleteError, data: project } = await supabase.from("projects").delete().eq("id", projectId).select("name, creator").single();
        if (deleteError) {
            throw deleteError;
        }

        const { error: storageError } = await supabase.storage
            .from("projects")
            .remove([`cover_images/${projectId}`]);
        if (storageError) {
            throw storageError;
        }

        // Remove all associated task files from MinIO
        await deleteFromMinIO(`/projects/${projectId}`, true);

        // notify creator if an admin deleted the project
        if (client) {
            const notification = {
                message_template: `Your project "${project.name > 50 ? project.name.slice(0, 47) + "..." : project.name}" has been deleted.`,
                recipient_id: project.creator,
            }
            const { error: notifError } = await supabase.from("notifications").insert(notification);
            if (notifError) {
                console.log("Database notification error:", notifError.message);
            }
        }

        return { success: true, message: "Project deleted successfully." };

    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, message: "Failed to delete project." };
    }
}

export async function updateActivityStatus(id: string, activity_status: ActivityStatus) {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").update({ activity_status }).eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to update project activity status." };
    }

    return { success: true, message: "Project's activity status updated successfully." };
}

export async function updateSummary(projectId: string, results_summary: string | null) {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").update({ results_summary }).eq("id", projectId);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to update results summary." };
    }

    return { success: true, message: "Results summary updated successfully." };
}