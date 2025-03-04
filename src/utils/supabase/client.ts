import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

function useSupabaseClient() {
  return useMemo(createClient, []);
}

export default useSupabaseClient;
