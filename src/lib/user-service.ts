import { UserRole } from "../types/enums";
import { createClient } from "../utils/supabase/server";

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