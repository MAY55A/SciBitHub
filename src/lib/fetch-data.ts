import { createClient } from "@/src/utils/supabase/server";
import { Bookmark, Contribution, Discussion, ForumTopic, ParticipationRequest, Project, Task, Visualization } from "@/src/types/models";
import { ActivityStatus, ProjectStatus } from "@/src/types/enums";

export const fetchProjects = async (
    creator?: string,
    query?: string,
    domain?: string,
    status?: ProjectStatus,
    activityStatus?: ActivityStatus,
    tags?: string[],
    currentPage: number = 1,
    orderBy: string = "created_at",
    sort: "asc" | "desc" = "desc",
    limit: number = 10
): Promise<{ data: any[]; totalPages: number }> => {
    const supabase = await createClient();

    try {
        const from = "projects_with_likes";
        const offset = (currentPage - 1) * limit;
        const to = offset + limit - 1;

        let queryBuilder = supabase
            .from(from)
            .select(
                `*, creator:creator_info`,
                { count: "exact" }
            )
            .is("deleted_at", null);

        // Filters
        if (creator) queryBuilder = queryBuilder.eq("creator", creator);
        if (query) queryBuilder = queryBuilder.ilike("name", `%${query}%`);
        if (domain) queryBuilder = queryBuilder.ilike("domain", `%${domain}%`);
        if (status) queryBuilder = queryBuilder.eq("status", status);
        if (activityStatus) queryBuilder = queryBuilder.eq("activity_status", activityStatus);
        if (tags?.length) queryBuilder = queryBuilder.contains("tags", tags);

        // Order and paginate
        queryBuilder = queryBuilder
            .order(orderBy, { ascending: sort === "asc" })
            .range(offset, to);

        const { data, count, error } = await queryBuilder;

        if (error) {
            throw error;
        }

        return {
            data: data || [],
            totalPages: Math.ceil((count || 0) / limit),
        };
    } catch (err) {
        console.log("Error fetching projects:", err);
        return {
            data: [],
            totalPages: 0,
        };
    }
};

export const fetchProject = async (
    id: string
): Promise<Project | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects_with_likes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }
    const { creator_info, ...projectData } = data;
    return { ...projectData, creator: creator_info, };
}


export const fetchProjectForEditing = async (
    id: string
): Promise<Project | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }
    return { ...data, creator: { id: data.creator } };
}

export const fetchTask = async (
    id: string
): Promise<Task | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tasks")
        .select(`
                        *,
                        project:projects(id, name, moderation_level, activity_status, participation_level, creator:users(id)),
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
                    *,
                    project:projects(id, creator:users(id))
                    `)
        .eq("project", projectId)
        .is("deleted_at", null);

    if (error) {
        console.error("Error fetching tasks:", error);
        return null;
    }

    return data;
}

export const fetchContributions = async (
    tasks?: string[],
    user?: string,
    page?: number,
    pageSize: number = 10
): Promise<{ contributions: Contribution[] | null, totalPages: number }> => {
    const supabase = await createClient();
    const queryBuilder = supabase
        .from("contributions")
        .select(
            `
            *,
            user:users(id, username, deleted_at),
            task:tasks(id, title, type)
            `
            , { count: "exact" })
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

    if (tasks) {
        queryBuilder.in("task", tasks);
    }
    if (user) {
        queryBuilder.eq("user", user);
    }

    if (page) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        queryBuilder.range(start, end);
    }

    const { data, error, count } = await queryBuilder;

    if (error) {
        console.error("Error fetching contributions:", error);
        return { contributions: null, totalPages: 0 };
    }

    const totalPages = Math.ceil((count || 0) / pageSize);
    return { contributions: data, totalPages };
};

export const fetchContribution = async (
    id: string
): Promise<Contribution | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("contributions")
        .select(` *,
                        task:tasks(id, title, type, deleted_at, project:projects(id, name, creator, moderation_level)),
                        user:users(id, username, profile_picture, role, deleted_at)
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
    status?: string,
    category?: string,
    tags?: string[],
    currentPage: number = 1,
    orderBy: string = "created_at",
    sort: "asc" | "desc" = "desc",
    limit: number = 10,
) => {
    const supabase = await createClient();
    try {
        let queryBuilder = supabase
            .from("discussions_with_replies_and_votes")
            .select("*, creator:creator_info",
                { count: "exact" })
            .is("deleted_at", null);

        // Apply filters
        if (creator) queryBuilder = queryBuilder.eq("creator", creator);
        if (query) queryBuilder = queryBuilder.ilike("title", `%${query}%`);
        if (status) queryBuilder = queryBuilder.eq("status", status);
        if (category) queryBuilder = queryBuilder.eq("category", category);
        if (tags?.length) queryBuilder = queryBuilder.contains("tags", tags);

        // Apply sorting and pagination
        const offset = (currentPage - 1) * limit;
        const to = offset + limit - 1;
        queryBuilder = queryBuilder
            .order(orderBy, { ascending: sort === "asc" })
            .range(offset, to);

        const { data, count, error } = await queryBuilder;

        if (error) {
            throw error;
        }

        return {
            data: data || [],
            totalPages: Math.ceil((count || 0) / limit),
        };
    } catch (err) {
        console.log("Error fetching discussions:", err);
        return {
            data: [],
            totalPages: 0,
        };
    }
}

export const fetchDiscussion = async (
    id: string
): Promise<Discussion | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("discussions_with_replies_and_votes")
        .select("*, creator:creator_info")
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

    return data?.filter((discussion: any) => discussion.similarity > 0) || [];
}

export const fetchForumTopics = async (
    project: string,
    query?: string,
    tag?: string,
    creator?: string,
    currentPage: number = 1,
    orderBy: string = "created_at",
    sort: "asc" | "desc" = "desc",
    limit: number = 10,
) => {
    const supabase = await createClient();
    try {
        let queryBuilder = supabase
            .from("topics_with_replies_and_votes")
            .select("*",
                { count: "exact" })
            .eq("project_id", project)
            .is("deleted_at", null);

        // Apply filters
        if (creator) {
            queryBuilder = queryBuilder.eq("creator_id", creator);
        }
        if (query) {
            queryBuilder = queryBuilder.ilike("title", `%${query}%`);
        }
        if (tag) {
            queryBuilder = queryBuilder.contains("tags", [tag]);
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
        .from("topics_with_replies_and_votes")
        .select("*")
        .eq("project_id", project)
        .eq("is_featured", true)
        .is("deleted_at", null)
        .limit(limit);

    if (error) {
        console.error("Error fetching similar discussions:", error);
        return [];
    }

    return data;
}


export const fetchForumTopic = async (
    id: string
): Promise<ForumTopic | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("topics_with_replies_and_votes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.log("Error fetching topic:", error);
        return null;
    }
    data.project.creator = { id: data.project.creator };
    return data;
}


export const fetchContributionsData = async (
    task: string,
) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("contributions")
        .select("id, data")
        .eq("task", task)
        .eq("status", "approved")
        .is("deleted_at", null);

    if (error) {
        console.error("Error fetching contributions:", error);
        return null;
    }

    return data;
};

export const fetchTasksForResults = async (
    projectId: string
) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tasks")
        .select("id, title, type, fields")
        .eq("project", projectId)
        .is("deleted_at", null);

    if (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }

    return data;
};

export const fetchVisualizations = async (
    projectId: string
): Promise<Visualization[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("visualizations")
        .select("*")
        .eq("project", projectId)

    if (error) {
        console.error("Error fetching visualizations:", error);
        return [];
    }

    return data;
};

export const fetchProjectResultsSummary = async (
    projectId: string
): Promise<string | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("results_summary")
        .eq("id", projectId)
        .single();

    if (error) {
        console.error("Error fetching results summary:", error);
        return null;
    }

    return data.results_summary;
};

export async function fetchParticipationRequests(
    { project, user }: { project?: string, user?: string }
): Promise<ParticipationRequest[]> {
    const supabase = await createClient();

    const queryBuilder = supabase
        .from("participation_requests")
        .select("*, project:projects(id, name, creator:users(id)), user:users(id, username, profile_picture)")
        .not("requested_at", "is", null) // Only fetch requests that have been made (in case of project draft requests have been created but not sent)

    if (user) {
        queryBuilder.eq("user_id", user);
    }
    if (project) {
        queryBuilder.eq("project_id", project);
    }

    //queryBuilder.is("deleted_at", null);
    const { data, error } = await queryBuilder;
    if (error) {
        console.error("Error fetching participation requests:", error);
        return [];
    }
    return data;
}

export async function fetchForumTopicsTags(projectId: string): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_all_forum_topics_tags", { project_id: projectId });
    if (error) {
        console.error("Error fetching forum topics tags:", error);
        return [];
    }
    return data;
}


export const fetchLatestProjects = async (): Promise<Project[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects_with_likes")
        .select(`*, creator:creator_info`)
        .eq("status", "published")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching latest projects:", error);
        return [];
    }

    return data;
};

export const fetchLatestDiscussions = async (): Promise<Discussion[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("discussions_with_replies_and_votes")
        .select(`*, creator:creator_info`)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching latest discussions:", error);
        return [];
    }

    return data;
};

export async function fetchMyBookmarks(): Promise<Bookmark[]> {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    const queryBuilder = supabase
        .from("bookmarks")
        .select("*, project:projects_with_likes(*, creator: creator_info), discussion:discussions_with_replies_and_votes(*, creator: creator_info)")
        .eq("user_id", user.data.user?.id)

    const { data, error } = await queryBuilder;
    if (error) {
        console.error("Error fetching bookmarks:", error);
        return [];
    }
    return data;
}

export const fetchContributionsPerDay = async (
    user: string,
): Promise<{ contributions: Map<string, number>, years: string[] } | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("contributions")
        .select("id, created_at")
        .is("deleted_at", null)
        .eq("user", user);

    if (error || !data) {
        console.error("Error fetching contributions:", error);
        return null;
    }

    const years: string[] = [];
    // Group by date
    const grouped = data.reduce<Map<string, number>>((acc, row) => {
        const date = row.created_at.split("T")[0]; // 'YYYY-MM-DD'
        if (!years.includes(date.split("-")[0])) {
            years.push(date.split("-")[0]);
        }
        acc.set(date, (acc.get(date) || 0) + 1);
        return acc;
    }, new Map<string, number>());

    return { contributions: grouped, years };
};