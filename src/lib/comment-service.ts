import { SupabaseClient } from "@supabase/supabase-js";
import { Comment } from "../types/models";

export const fetchComments = async (
    supabase: SupabaseClient,
    {
        discussion,
        forum_topic,
        parent_comment,
        currentPage = 1,
        orderBy = "created_at",
        sort = "desc",
        limit = 10,
    }: {
        discussion?: string,
        forum_topic?: string,
        parent_comment?: string,
        currentPage?: number,
        orderBy?: string,
        sort?: "asc" | "desc",
        limit?: number,
    }): Promise<{ comments: Comment[], totalPages: number, count: number }> => {
    const data = {
        comments: [] as Comment[],
        totalPages: 0,
        count: 0,
    }
    try {
        let queryBuilder = supabase
            .from("comments_with_votes")
            .select(`*,
                creator:creator_info`,
                { count: "exact" })

        if (discussion) {
            queryBuilder = queryBuilder.eq("discussion", discussion);
        } else if (forum_topic) {
            queryBuilder = queryBuilder.eq("forum_topic", forum_topic);
        } else if (parent_comment) {
            queryBuilder = queryBuilder.eq("parent_comment", parent_comment);
        } else {
            throw new Error("No discussion, forum topic or parent comment provided.");
        }

        // Apply sorting and pagination
        const offset = (currentPage - 1) * limit;
        queryBuilder = queryBuilder
            .order(orderBy, { ascending: sort === "asc" })
            .range(offset, offset + limit - 1);

        const { data: comments, count, error } = await queryBuilder;

        if (error) {
            throw error;
        }

        data.totalPages = Math.ceil((count || 0) / limit);
        data.count = count || 0;
        data.comments = comments;

    } catch (error) {
        console.error("Error fetching discussion comments:", error);
    } finally {
        return data;
    }
}