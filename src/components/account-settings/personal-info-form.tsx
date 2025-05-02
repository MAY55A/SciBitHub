"use client"

import CountrySelector from "@/src/components/custom/countries-selector";
import { FormMessage, Message } from "@/src/components/custom/form-message";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage as FormFieldMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { UserInputData, userInputDataSchema } from "@/src/types/user-form-data";
import { updateInfo } from "@/src/utils/account-actions";
import { Textarea } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function PersonalInformationForm({ ...info }: { username: string, country: string, bio: string }) {
    const [initialInfo, setInitialInfo] = useState(info);
    const form = useForm({
        resolver: zodResolver(userInputDataSchema.pick({ username: true, country: true, bio: true })),
        defaultValues: info
    });
    const [message, setMessage] = useState<Message | null>(null);

    const onSubmit = async (data: Partial<UserInputData>) => {
        setMessage(null);
        if (JSON.stringify(data) === JSON.stringify(initialInfo)) {
            setMessage({ error: "No changes were made." });
            return;
        }
        if (data.bio === initialInfo.bio) {
            data = { username: data.username, country: data.country }
        }

        const res = await updateInfo(data);
        if (res.success) {
            setInitialInfo({ ...initialInfo, ...data });
            setMessage({ success: res.message });
        } else {
            setMessage({ error: res.message });
        }
    }

    const reset = () => {
        form.setValue("username", initialInfo.username);
        form.setValue("country", initialInfo.country);
        form.setValue("bio", initialInfo.bio);
        setMessage(null);
    }

    return (
        <Form {...form}>
            <form
                className="border rounded-lg p-10 flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <h2 className="text-primary font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground">
                    This information will be displayed publicly so be careful what you share.
                </p>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="your username" {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FormFieldMessage></FormFieldMessage>
                        </FormItem>
                    )}
                />
                <CountrySelector control={form.control} name="country" />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={3}
                                    maxLength={500}
                                    placeholder="Write a few sentences about yourself..."
                                    className="w-full p-2 border rounded-lg text-sm text-muted-foreground"
                                    disabled={form.formState.isSubmitting}
                                    {...field} />
                            </FormControl>
                            <FormFieldMessage></FormFieldMessage>
                        </FormItem>
                    )}
                />
                {message && <FormMessage message={message} />}

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button type="reset" variant="secondary" size="sm" onClick={reset}>
                        Reset
                    </Button>
                    <Button
                        type="submit" size="sm"
                        disabled={form.formState.isSubmitting || !form.formState.isValid}
                    >
                        {form.formState.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form >
        </Form >
    );
}