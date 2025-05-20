"use server";

import { createClient } from "@/src/utils/supabase/server";
import { RequestType, ValidationStatus } from "@/src/types/enums";
import { ParticipationRequest } from "@/src/types/models";

export const createRequests = async (projectId: string, users: string[], type: RequestType) => {
    const supabase = await createClient();
    const requests = [];
    const notifications = [];
    const { data: project } = await supabase.from("projects").select("creator").eq("id", projectId).single();
    if (!project) {
        return { success: false, message: "Project not found." };
    }

    for (const userId of users) {
        requests.push({
            project_id: projectId,
            user_id: userId,
            type: type,
            requested_at: new Date().toISOString()
        });
        notifications.push(type === RequestType.INVITATION
            ? {
                recipient_id: userId,
                message_template: `{user.username} has invited you to join their project {project.name}.`,
                project_id: projectId,
                user_id: project.creator,
            } : {
                recipient_id: project.creator,
                message_template: `{user.username} has requested to join your project {project.name}.`,
                project_id: projectId,
                user_id: userId,
            });
    }

    const { error } = await supabase.from("participation_requests").insert(requests);
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: users.length === 1 ? "Failed to create request." : "Failed to create requests." };
    }

    const { error: notifError } = await supabase.from("notifications").insert(notifications);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: users.length === 1 ? "Request created successfully." : "Requests created successfully." };
}

export const updateRequestsStatus = async (ids: string[], status: ValidationStatus) => {
    if (ids.length === 0) {
        return { success: false, message: "No requests selected!" };
    }
    const supabase = await createClient();
    const { error, data: requests } = await supabase.from("participation_requests").update({ status }).in("id", ids).select("id, user_id, type, project:project_id(id, creator)");
    if (error) {
        console.log("Database error:", error.message);
        return { success: false, message: ids.length === 1 ? "Failed to update request status!" : "Failed to update all requests status" };
    }

    // Send notifications to the users
    const areInvitations = requests[0].type === RequestType.INVITATION;
    const action = status === ValidationStatus.APPROVED ? "accepted" : "rejected";
    const type = areInvitations ? "invitation" : "request";
    const notifications = requests.map((request: any) => {
        return {
            recipient_id: areInvitations ? request.project.creator : request.user_id,
            message_template: `{user.username} has ${action} your ${type} to join {project.name}.`,
            project_id: request.project.id,
            user_id: areInvitations ? request.user_id : request.project.creator,
        };
    });
    const { error: notifError } = await supabase.from("notifications").insert(notifications);
    if (notifError) {
        console.log("Database notification error:", notifError.message);
    }

    return { success: true, message: ids.length === 1 ? "Request status updated successfully!" : "Requests status updated successfully" };
}

export async function softDeleteRequests(ids: string[]) {
    console.log("Soft Deleting requests with IDs:", ids);
    const supabase = await createClient();
    const currentDate = new Date().toISOString();
    const { error } = await supabase.from("participation_requests").update({ deleted_at: currentDate }).in("id", ids);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to delete request(s)" };
    }

    return { success: true, message: "Request(s) deleted successfully!" };
}

export async function hardDeleteRequests(ids: string[]) {
    console.log("Deleting requests with IDs:", ids);

    const supabase = await createClient();
    const { error } = await supabase.from("participation_requests").delete().in("id", ids);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to delete request(s)" };
    }

    return { success: true, message: "Request(s) deleted successfully!" };
}

export async function deleteRequests(ids: string[], isProjectPage: boolean = false) {
    if (ids.length === 0) {
        return { success: false, message: "No requests selected!" };
    }
    // Determine the request type based on the page context :
    // For requests viewed in project page, the requests created by the project creator are of type INVITATION;
    // For requests viewed in user profile, the requests created by the user are of type APPLICATION
    const createdRequestType = isProjectPage ? RequestType.INVITATION : RequestType.APPLICATION;

    console.log("Deleting requests with IDs:", ids);

    const supabase = await createClient();
    // hard delete the requests that are of the createdRequestType (created by the current user)
    const { error: deleteError } = await supabase.from("participation_requests").delete().in("id", ids).eq("type", createdRequestType);
    if (deleteError) {
        console.error("Database error:", deleteError.message);
        return { success: false, message: "Failed to delete request(s)" };
    }

    // soft delete the requests that are not of the createdRequestType (created by other users)
    const currentDate = new Date().toISOString();
    const { error: updateError } = await supabase.from("participation_requests").update({ deleted_at: currentDate }).in("id", ids).neq("type", createdRequestType);
    if (updateError) {
        console.error("Database error:", updateError.message);
        return { success: false, message: "Failed to delete request(s)" };
    }
    return { success: true, message: "Request(s) deleted successfully!" };
}

export async function deleteProjectRequests(ids: string[]) {
    return deleteRequests(ids, true);
}