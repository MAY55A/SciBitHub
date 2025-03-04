"use client"

import { Message, FormMessage } from "@/src/components/custom/form-message";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage as FieldMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { updateEmail } from "@/src/utils/account-actions";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function EmailForm({ currentEmail }: { currentEmail: string }) {
    const form = useForm({
        defaultValues: { email: currentEmail },
    });
    const [message, setMessage] = useState<Message | null>(null);

    const onSubmit = async ({ email }: { email: string }) => {
        if (email === currentEmail) {
            setMessage({ error: "No changes were made." });
        } else {
            const res = await updateEmail(email);
            if (res.success) {
                setMessage({ success: res.message });
            } else {
                setMessage({ error: res.message });
            }
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
                <h2 className="text-primary font-semibold">Email</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    This is your account email, it will not be visible to others.
                </p>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="your email address" type="email" {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FieldMessage></FieldMessage>
                        </FormItem>
                    )}
                />
                {message && <FormMessage message={message} />}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button type="button" variant="secondary" size="sm" onClick={reset}>
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        disabled={form.formState.isSubmitting || !form.formState.isValid}
                    >
                        {form.formState.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}