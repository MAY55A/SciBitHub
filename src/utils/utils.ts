import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export const areEqualArrays = (arr1?: any[], arr2?: any[]) => {
  if (!arr1 || !arr2) return arr1 == arr2;
  if (arr1.length !== arr2.length) return false;
  return [...arr1].sort().toString() === [...arr2].sort().toString();
};

/**
 * Checks if an email is already registered in Supabase.
 * @param email - The email address to check.
 * @returns {Promise<{ exists: boolean; message: string }>}
 */
export async function checkEmailExists(supabase: SupabaseClient, email: string) {
  const { data, error } = await supabase
    .from("auth.users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    return { exists: false, message: "Error checking email: " + error.message };
  }

  return { exists: !!data, message: data ? "Email is already registered." : "Email is available." };
}
