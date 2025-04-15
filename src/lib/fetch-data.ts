import { createClient } from "../utils/supabase/server";
import { Comment, Contribution, Discussion, ForumTopic, Project, Task } from "../types/models";
import { ProjectStatus, ProjectProgress } from "../types/enums";
import { SupabaseClient } from "@supabase/supabase-js";



export const fetchProjects = async (
    creator?: string,
    query?: string,
    status?: ProjectStatus,
    progress?: ProjectProgress,
    currentPage: number = 1,
    orderBy: string = "created_at",
    sort: "asc" | "desc" = "desc",
    limit: number = 10,
) => {
    const supabase = await createClient();
    try {
        let queryBuilder = supabase
            .from("projects")
            .select(`*,
                creator:users(id, username, profile_picture, metadata)`,
                { count: "exact" });

        // Apply filters
        if (creator) {
            queryBuilder = queryBuilder.eq("creator", creator);
        }
        if (query) {
            queryBuilder = queryBuilder.ilike("name", `%${query}%`);
        }
        if (status) {
            queryBuilder = queryBuilder.eq("status", status);
        }
        if (progress) {
            queryBuilder = queryBuilder.eq("progress", progress);
        }

        // Apply sorting and pagination
        const offset = (currentPage - 1) * limit;
        queryBuilder = queryBuilder
            .order(orderBy, { ascending: sort === "asc" })
            .range(offset, offset + limit - 1);

        const { data, count, error } = await queryBuilder;

        if (error) {
            throw error;
        }

        const totalPages = Math.ceil((count || 0) / limit);

        return {
            data,
            totalPages,
        };
    } catch (error) {
        console.error("Error fetching projects:", error);
        return null;
    }
}

export const fetchProject = async (
    id: string
): Promise<Project | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select(`
                    *,
                    creator:users(id, username, profile_picture, metadata)                `)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }

    return data;
}

export const fetchTask = async (
    id: string
): Promise<Task | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tasks")
        .select(`
                        *,
                        project:projects(id, name, moderation_level),
                        contributions:contributions(count)
                    `)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching task:", error);
        return null;
    }
    data.contributions = data.contributions[0].count;
    return data;
}

export const fetchTasks = async (
    projectId: string
): Promise<Task[] | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tasks")
        .select(`
                    *
                    `)
        .eq("project", projectId)

    if (error) {
        console.error("Error fetching tasks:", error);
        return null;
    }

    return data;
}

export const fetchContributions = async (
    tasks: string[],
    page?: number,
    pageSize: number = 10
): Promise<Contribution[] | null> => {
    const supabase = await createClient();
    const queryBuilder = supabase
        .from("contributions")
        .select(
            `
            *,
            user:users(id, username),
            task:tasks(id, title)
            `
        )
        .in("task", tasks)

    if (page) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        queryBuilder.range(start, end);
    }

    const { data, error } = await queryBuilder;

    if (error) {
        console.error("Error fetching contributions:", error);
        return null;
    }

    return data;
};

export const fetchFirstTaskContributions = async (
    project: string
): Promise<{ contributions: Contribution[], task: string } | null> => {
    const supabase = await createClient();
    const { data: task } = await supabase
        .from("tasks")
        .select(`id`)
        .eq("project", project)
        .order("created_at")
        .limit(1)
        .single();
    const { data, error } = await supabase
        .from("contributions")
        .select(
            `
            *,
            user:users(id, username)
            `
        )
        .eq("task", task?.id)

    if (error) {
        console.error("Error fetching contributions:", error);
        return null;
    }

    return { contributions: data, task: task?.id };
};

export const fetchContribution = async (
    id: string
): Promise<Contribution | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("contributions")
        .select(` *,
                        task:tasks(id, title, type, project:projects(id, name, creator, moderation_level)),
                        user:users(id, username, profile_picture)
                    `)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching contribution:", error);
        return null;
    }
    if (data) {
        data.task.project.creator = { id: data.task.project.creator };
    }
    return data;
}

export const fetchDiscussions = async (
    creator?: string,
    query?: string,
    currentPage: number = 1,
    orderBy: string = "created_at",
    sort: "asc" | "desc" = "desc",
    limit: number = 10,
) => {
    const supabase = await createClient();
    try {
        let queryBuilder = supabase
            .from("discussions_with_replies")
            .select("*",
                { count: "exact" });

        // Apply filters
        if (creator) {
            queryBuilder = queryBuilder.eq("creator_id", creator);
        }
        if (query) {
            queryBuilder = queryBuilder.ilike("title", `%${query}%`);
        }

        // Apply sorting and pagination
        const offset = (currentPage - 1) * limit;
        queryBuilder = queryBuilder
            .order(orderBy, { ascending: sort === "asc" })
            .range(offset, offset + limit - 1);

        const { data, count, error } = await queryBuilder;

        if (error) {
            throw error;
        }

        const totalPages = Math.ceil((count || 0) / limit);

        return {
            data,
            totalPages,
        };
    } catch (error) {
        console.error("Error fetching discussions:", error);
        return null;
    }
}

export const fetchDiscussion = async (
    id: string
): Promise<Discussion | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("discussions_with_replies")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching discussion:", error);
        return null;
    }

    return data;
}

export async function fetchSimilarDiscussions(
    title: string,
    tags: string[],
    category: string,
    excludeId?: string, // optional: exclude the current discussion
    limit = 5
): Promise<Discussion[]> {
    const supabase = await createClient();

    // Convert tags to lowercase for consistency
    const normalizedTags = tags.map(tag => tag.toLowerCase());

    // Build the full-text query from the title
    const { data, error } = await supabase
        .rpc("find_similar_discussions", {
            search_text: title,
            input_tags: normalizedTags,
            input_category: category,
            exclude_id: excludeId ?? null,
            result_limit: limit
        });

    if (error) {
        console.error("Error fetching similar discussions:", error);
        return [];
    }

    return data;
}

export const fetchForumTopics = async (
    project: string,
    query?: string,
    creator?: string,
    currentPage: number = 1,
    orderBy: string = "created_at",
    sort: "asc" | "desc" = "desc",
    limit: number = 10,
) => {
    const supabase = await createClient();
    try {
        let queryBuilder = supabase
            .from("topics_with_replies")
            .select("*",
                { count: "exact" })
            .eq("project_id", project);

        // Apply filters
        if (creator) {
            queryBuilder = queryBuilder.eq("creator_id", creator);
        }
        if (query) {
            queryBuilder = queryBuilder.ilike("title", `%${query}%`);
        }

        // Apply sorting and pagination
        const offset = (currentPage - 1) * limit;
        queryBuilder = queryBuilder
            .order(orderBy, { ascending: sort === "asc" })
            .range(offset, offset + limit - 1);

        const { data, count, error } = await queryBuilder;

        if (error) {
            throw error;
        }

        const totalPages = Math.ceil((count || 0) / limit);

        return {
            data,
            totalPages,
        };
    } catch (error) {
        console.error("Error fetching forum topics:", error);
        return null;
    }
}

export async function fetchFeaturedTopics(
    project: string,
    limit = 5
): Promise<ForumTopic[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from("topics_with_replies")
    .select("*")
    .eq("project_id", project)
    .eq("is_featured", true)
    .limit(limit);

    if (error) {
        console.error("Error fetching similar discussions:", error);
        return [];
    }

    return data;
}
