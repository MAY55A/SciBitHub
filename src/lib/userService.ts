import { createClient } from "@/src/utils/supabase/client";

/** 
 * Check if an email is already taken 
 */
export async function isEmailTaken(email: string): Promise<boolean> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();
        console.log(data,error);
        return data !== null;
}