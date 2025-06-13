import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {

  const protectedRoutes = [
    '/profile',
    '/admin',
    '/projects/create'
  ]

  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  let response = NextResponse.next({
    request,
  })

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

  // Only check Supabase if it's a protected route
  if (isProtected) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No session found, redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  /*
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
  */

  return response;
};
