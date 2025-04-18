import { resetPasswordAction } from "@/src/utils/auth-actions";
import { FormMessage, Message } from "@/src/components/custom/form-message";
import { SubmitButton } from "@/src/components/custom/submit-button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default async function ResetPassword(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    return (
        <div className="w-full h-full absolute top-0 left-0 z-50 flex items-center justify-center bg-background" >
            {/*
                This component is used to reset the password of a user.
                It is displayed as a modal overlay on top of the app layout,
                to prevent the user from navigating to other pages and especially their profile.
            */}
            <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
                <h1 className="text-2xl font-medium">Reset password</h1>
                <p className="text-sm text-foreground/60">
                    Please enter your new password below.
                </p>
                <Label htmlFor="password">New password</Label>
                <Input
                    type="password"
                    name="password"
                    placeholder="New password"
                    minLength={8}
                    required
                />
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    minLength={8}
                    required
                />
                <SubmitButton formAction={resetPasswordAction}>
                    Reset password
                </SubmitButton>
                <FormMessage message={searchParams} />
            </form>
        </div>
    );
}
