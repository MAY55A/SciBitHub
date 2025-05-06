"use server";

import { DiscussionStatus } from "@/src/types/enums";
import { createAdminClient } from "@/src/utils/supabase/admin";
import { deleteDiscussion as handleDelete, updateDiscussionStatus } from "../discussion-actions";

const supabase = createAdminClient();

export const updateStatus = async (id: string, status: DiscussionStatus) => {
    return await updateDiscussionStatus(id, status, supabase);
};

export const deleteDiscussion = async (id: string) => {
    return await handleDelete(id, supabase);
};