import { User } from "@/src/types/models";
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