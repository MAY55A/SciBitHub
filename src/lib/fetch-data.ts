import { unstable_cache } from "next/cache";
import { createClient } from "../utils/supabase/server";
import { Contribution, Project, ProjectProgress, ProjectStatus, Task } from "../types/models";



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
    //    return unstable_cache(
    //        async () => {
    try {
        let queryBuilder = supabase
            .from("projects")
            .select("*", { count: "exact" });

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
    //        },
    //        [`projects`, creator || "all", query || "all", status || "all", currentPage.toString(), orderBy, sort], // Cache key as an array
    //        { revalidate: 300, tags: ["projects"] }
    //    )();
}

export const fetchProject = async (
    id: string
): Promise<Project | null> => {
    const supabase = await createClient();
    //    return unstable_cache(
    //        async () => {
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
    //        },
    //        [`project ${id}`],
    //        { revalidate: 300, tags: ["project"] }
    //    )();
}

export const fetchTask = async (
    id: string
): Promise<Task | null> => {
    const supabase = await createClient();
    //    return unstable_cache(
    //        async () => {
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
    //        },
    //        [`task ${id}`],
    //        { revalidate: 3600, tags: ["task"] }
    //    )();
}

export const fetchTasks = async (
    projectId: string
): Promise<Task[] | null> => {
    const supabase = await createClient();
    //    return unstable_cache(
    //        async () => {
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
    //        },
    //        [`project ${id}`],
    //        { revalidate: 300, tags: ["project"] }
    //    )();
}

export const fetchContributions = async (
    tasks: string[],
    limit: number = 5
): Promise<Contribution[] | null> => {
    const supabase = await createClient();
    //    return unstable_cache(
    //        async () => {
    const { data, error } = await supabase
        .from("contributions")
        .select(`
                    *,
                    user:users(id, username),
                    task:tasks(id, title)
                    `)
        .in("task", tasks)
        .limit(limit)

    if (error) {
        console.error("Error fetching contributions:", error);
        return null;
    }

    return data;
    //        },
    //        [`project ${id}`],
    //        { revalidate: 300, tags: ["project"] }
    //    )();
}