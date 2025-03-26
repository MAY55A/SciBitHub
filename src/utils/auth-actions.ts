"use server";

import { encodedRedirect } from "@/src/utils/utils";
import { createClient } from "@/src/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { InputData } from "@/src/types/user-form-data";

export const signUpAction = async (inputData: InputData) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  if (!inputData) {
    return encodedRedirect(
      "error",
      "/sign-up/confirmation",
      "Account data is required",
    );
  }
  var message = "Thanks for signing up !";

  if (inputData.password && inputData.password.length > 0) {
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: inputData.email,
      password: inputData.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up/confirmation", error.message);
    }
    message = "Thanks for signing up ! Please check your email for a verification link."
    inputData.id = data.user?.id!;
  }
  // Insert the new user into the users table
  const metadata = inputData.role === "researcher" ? { interests: inputData.fieldsOfInterest, researcherType: inputData.researcherType, isVerified: false } : { interests: inputData.fieldsOfInterest };
  const { error: dbError } = await supabase.from("users").insert({
    id: inputData.id,
    username: inputData.username,
    role: inputData.role,
    country: inputData.country,
    is_suspended: false,
    metadata: metadata,
  });

  if (dbError) {
    console.error("Database error:", dbError.message);
    return encodedRedirect("error", "/sign-up/confirmation", "User registered, but failed to save in database.");
  }

  return encodedRedirect(
    "success",
    "/sign-up/confirmation",
    message,
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  const referer = (await headers()).get("referer");
  const url = new URL(referer || "");
  const redirectTo = url.searchParams.get("redirect_to") || "/profile";

  return redirect(redirectTo);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/profile/settings/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/profile/settings/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/profile/settings/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.log(error.message);
    encodedRedirect(
      "error",
      "/profile/settings/reset-password",
      error.message,
    );
  }

  encodedRedirect("success",
    "/profile/settings/reset-password",
    "Password updated");
};