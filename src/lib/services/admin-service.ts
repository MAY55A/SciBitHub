import { Discussion, Project, Report, User } from "@/src/types/models";
import { createAdminClient } from "@/src/utils/supabase/admin";

export async function fetchAllUsers(): Promise<User[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("users_and_accounts_data")
        .select("*")

    if (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
    return data;
}

export async function fetchAllProjects(): Promise<Project[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("projects_with_likes")
        .select("*, creator:creator_info, tasks:tasks(*)")
        .neq("status", "draft") // Exclude draft projects

    if (error) {
        console.error("Error fetching all projects:", error);
        return [];
    }
    return data;
}

export async function fetchAllDiscussions(): Promise<Discussion[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("discussions_with_replies_and_votes")
        .select("*, creator:creator_info")

    if (error) {
        console.error("Error fetching all discussions:", error);
        return [];
    }
    return data;
}

export async function fetchAllReports(): Promise<Report[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("reports")
        .select("*, reporter:users(id, username, profile_picture, role, metadata)")

    if (error) {
        console.error("Error fetching all reports:", error);
        return [];
    }
    return data;
}