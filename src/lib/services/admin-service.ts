import { Discussion, ForumTopic, Project, Report, User } from "@/src/types/models";
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

export async function fetchAllForumTopics(): Promise<ForumTopic[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("topics_with_replies_and_votes")
        .select("*")

    if (error) {
        console.error("Error fetching all topics:", error);
        return [];
    }
    return data;
}

// for stats
export const fetchMostActiveForums = async () => {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('admin_most_active_forums')

    if (error || !data) {
        console.error("Error fetching most active forums:", error);
        return [];
    }

    return data;
};

export const fetchMetrics = async (
    params: {
        table_name: string,
        category_column: string,
        category_one: string,
        category_two: string,
    }
): Promise<{
    total: number,
    month_total: number,
    category_one_total: number,
    category_two_total: number,
    percentageChange: string,
} | null> => {
    const supabase = createAdminClient();
    let { data, error } = await supabase.rpc('get_table_metrics', params)

    if (error || !data) {
        console.error("Error fetching metrics:", error);
        return null;
    }

    data = data[0];
    const allTimeMinusCurrentMonth = data.total - data.month_total;
    const percentageChange = allTimeMinusCurrentMonth > 0
        ? Math.round((data.month_total / allTimeMinusCurrentMonth) * 100)
        : data.month_total > 0
            ? 100 // when there was no previous data but we have current month
            : 0;

    return {
        ...data,
        percentageChange: percentageChange > 0 ? `+${percentageChange}%` : percentageChange + "%",
    };
};

export const fetchTopContributors = async (
    params: {
        limit?: number,
        time_range?: '7d' | '30d'
    } = {}
): Promise<{
    user_id: string;
    username: string;
    profile_picture: string | null;
    contribution_count: number;
    last_contribution: string; // date string
}[]> => {
    const supabase = createAdminClient();
    let { data, error } = await supabase.rpc('get_top_contributors', params)

    if (error || !data) {
        console.error("Error fetching top contributors:", error);
        return [];
    }

    return data;
};