"use client"

import { Message, FormMessage } from "@/src/components/custom/form-message";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage as FieldMessage, FormLabel } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { adminResetPassword } from "@/src/lib/actions/admin/users-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    password: z.string()
        .min(8, "Password must contain at least 8 characters")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
        ),
    confirmPassword: z.string().min(8, "Password must contain at least 8 characters")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export function ResetPasswordForm({ userId }: { userId: string }) {
    const form = useForm({
        resolver: (zodResolver(formSchema)),
        defaultValues: { password: "", confirmPassword: "" }
    });
    const [message, setMessage] = useState<Message | null>(null);

    const onSubmit = async (formData: { password: string, confirmPassword: string }) => {
        const res = await adminResetPassword(userId, formData.password);
        if (res.success) {
            setMessage({ success: res.message });
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            setMessage({ error: res.message });
        }
    }

    const reset = () => {
        form.reset();
        setMessage(null);
    }

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-4 border rounded-lg p-10"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <h2 className="text-primary font-semibold">Reset Password</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    You will be logged out after successful reset.
                </p>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input placeholder="new password" type="password" {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FieldMessage></FieldMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="retype password" type="password" {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FieldMessage></FieldMessage>
                        </FormItem>
                    )}
                />
                {message && <FormMessage message={message} />}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button type="button" variant="secondary" size="sm" onClick={reset}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}