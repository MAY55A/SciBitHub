import { forgotPasswordAction } from "@/src/utils/auth-actions";
import { FormMessage, Message } from "@/src/components/custom/form-message";
import { SubmitButton } from "@/src/components/custom/submit-button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className="flex-1 flex flex-col gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-md mx-auto py-12">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm pt-4">
          Already have an account ?{" "}
          <Link className="text-green font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        </div>
        <div className="flex flex-col gap-6 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
