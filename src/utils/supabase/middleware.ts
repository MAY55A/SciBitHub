import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // protected routes
    if ((request.nextUrl.pathname.startsWith("/profile") || request.nextUrl.pathname.startsWith("/admin")) && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/projects/create") && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/reset-password") && user.error) {
      (await cookies()).set("on_reset_page", "false");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // prevent user from accessing other routes when logged in after forgot password (keep them on reset password page)
    const onResetPage = request.cookies.get("on_reset_page")?.value === "true";
    if (request.nextUrl.pathname === "/reset-password" && !onResetPage) {
      (await cookies()).set("on_reset_page", "true");
    }
    if (request.nextUrl.pathname !== "/reset-password" && onResetPage) {
      return NextResponse.redirect(new URL("/reset-password", request.url));
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
