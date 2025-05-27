import { signInAction } from "@/src/lib/actions/auth-actions";
import { FormMessage, Message } from "@/src/components/custom/form-message";
import { SubmitButton } from "@/src/components/custom/submit-button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { GoogleButton } from "../../../src/components/custom/google-button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className="space-y-7 w-full max-w-md px-4 pt-[40%]">
        <h1 className="text-2xl font-medium text-center">Welcome Back !</h1>
        <p className="text-sm text-foreground font-retro">
          Don't have an account ?{" "}
          <Link className="text-green font-medium underline" href="/sign-up/credentials">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-4 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-foreground underline font-retro"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Login
          </SubmitButton>
          <FormMessage message={searchParams} />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground font-retro">
              Or continue with
            </span>
          </div>
        </div>
      </form>
      <GoogleButton />
    </>
  );
}
