import { Project, User } from "@/src/types/models";
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
        console.error("Error fetching all users:", error);
        return [];
    }
    return data;
}