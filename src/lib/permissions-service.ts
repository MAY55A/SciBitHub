import { ProjectVisibility, UserRole } from "../types/enums";
import { createClient } from "../utils/supabase/server";

export async function getCurrentUserRole(): Promise<UserRole | null> {
    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
        return null;
    }
    const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
    return data?.role;
}

export async function getProjectResultsPermissions(
    projectId: string,
    creatorId: string,
    projectVisibility: ProjectVisibility,
): Promise<{ canView: boolean, canEdit: boolean }> {

    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
        return { canView: true, canEdit: false };
    }

    if (user.id === creatorId) {
        return { canView: true, canEdit: true };
    }

    if (projectVisibility === ProjectVisibility.PUBLIC) {
        return { canView: true, canEdit: false };
    }
    if (projectVisibility === ProjectVisibility.PRIVATE) {
        return { canView: false, canEdit: false };
    }
    // projectVisibility = ProjectVisibility.RESTRICTED
    const { data: approvedRequest } = await supabase
        .from("participation_requests")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .eq("status", "approved")
        .limit(1)
        .maybeSingle();

    if (approvedRequest) {
        return { canView: true, canEdit: false };
    }

    return { canView: false, canEdit: false };
}