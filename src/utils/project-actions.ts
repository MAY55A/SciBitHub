"use server";

import { createClient } from "@/src/utils/supabase/server";
import { encodedRedirect } from "./utils";
import { SupabaseClient } from "@supabase/supabase-js";
import { ActivityStatus, RequestType } from "../types/enums";

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

export async function updateActivityStatus(id: string, activity_status: ActivityStatus) {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").update({ activity_status }).eq("id", id);
    if (error) {
        console.error("Database error:", error.message);
        return { success: false, message: "Failed to update project activity status." };
    }

    return { success: true, message: "Project's activity status updated successfully." };
}