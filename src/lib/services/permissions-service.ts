import { ParticipationLevel, ProjectVisibility, UserRole } from "@/src/types/enums";
import { createClient } from "@/src/utils/supabase/server";

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

export async function getProjectPermissions(
    projectId: string,
    creatorId: string,
    projectVisibility: ProjectVisibility,
    participationLevel: ParticipationLevel
): Promise<{ canViewContribution: boolean, canSendRequest: boolean, canViewResults: boolean, canEditResults: boolean }> {

    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;
    const permissions = {
        canViewResults: true,
        canEditResults: true,
        canViewContribution: true,
        canSendRequest: false,
    }

    if (user?.id === creatorId) {
        return permissions;
    } else {
        permissions.canEditResults = false;
    }

    if (projectVisibility === ProjectVisibility.PRIVATE) {
        permissions.canViewResults = false;
    }

    if (participationLevel === ParticipationLevel.RESTRICTED) { // and projectVisibility === ProjectVisibility.RESTRICTED
        const query = supabase
            .from("participation_requests")
            .select("id")
            .eq("project_id", projectId)
            .eq("user_id", user?.id)
            .eq("status", "approved")
            .is("deleted_at", null)
            .limit(1)
            .maybeSingle();

        const isContributor = !!user && await getCurrentUserRole() === UserRole.CONTRIBUTOR;
        const isAllowedContributor = isContributor && !!(await query).data;

        if (!isAllowedContributor) {
            permissions.canViewResults = projectVisibility === ProjectVisibility.PUBLIC; // only if project is public allow view
            permissions.canViewContribution = false;
            if (isContributor) {
                permissions.canSendRequest = true;
            }
        }
    }
    return permissions;
}