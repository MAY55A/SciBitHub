"use server";

import { createClient } from "@/src/utils/supabase/server";
import { RequestType, ValidationStatus } from "../types/enums";

export const createRequests = async (projectId: string, users: string[], type: RequestType) => {
    const supabase = await createClient();
    for (const userId of users) {
        const request = {
            project_id: projectId,
            user_id: userId,
            type: type,
            requested_at: new Date().toISOString()
        };
        const { error } = await supabase.from("participation_requests").insert(request);
        if (error) {
            console.error("Database error:", error.message);
            return { success: false, message: users.length === 1 ? "Failed to create request." : "Failed to create requests." };
        }
    }
    return { success: true, message: users.length === 1 ? "Request created successfully." : "Requests created successfully." };
}

export const updateRequestsStatus = async (ids: string[], status: ValidationStatus) => {
    if (ids.length === 0) {
        return { success: false, message: "No requests selected!" };
    }
    const supabase = await createClient();
    const { error } = await supabase.from("participation_requests").update({ status }).in("id", ids);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: ids.length === 1 ? "Failed to update request status!" : "Failed to update all requests status" };
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