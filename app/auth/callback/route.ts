import { createClient } from "@/src/utils/supabase/server";
import { checkEmailExists, encodedRedirect } from "@/src/utils/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data?.session?.user) {
      console.error("Auth exchange failed:", error);
      // Redirect to sign-in page if the confirmation link is clicked after having expired
      if (error?.code === "flow_state_expired") {
        return encodedRedirect("success",`${origin}/sign-in`,"Email confirmed. Please sign in.");
      }
      return encodedRedirect("error",`${origin}/sign-in`,"Authentication failed");
    }

    const { id, email, user_metadata, app_metadata } = data.session.user;
    if (app_metadata.provider === "google") {
      const username = user_metadata?.full_name;
      // Check if user exists in the database
      if (await checkEmailExists(supabase, email!)) {
        // User exists → Log them in
        return NextResponse.redirect(`${origin}/profile`);
      } else {
        // User doesn't exist → Redirect to Step 2 after prefilled Google data
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}/sign-up/name-and-country?id=${id}&username=${username}&email=${email}`);
      }
    }
  }
  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/profile`);
}
