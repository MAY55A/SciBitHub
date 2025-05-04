"use client"

import { FormMessage, Message } from "@/src/components/custom/form-message";
import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage as FormFieldMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { UserInputData, userInputDataSchema } from "@/src/types/user-form-data";
import { updateMetadata } from "@/src/lib/actions/account-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function EducationDetailsForm({ ...details }: { degree: string, institution: string }) {
        const [initialDetails, setInitialDetails] = useState({ academicDegree: details.degree, institutionName: details.institution });

    const form = useForm({
        resolver: zodResolver(userInputDataSchema.pick({ academicDegree: true, institutionName: true })),
        defaultValues: initialDetails
    });
    const [message, setMessage] = useState<Message | null>(null);

    const onSubmit = async (data: Partial<UserInputData>) => {
        setMessage(null);
        if (data.academicDegree === initialDetails.academicDegree && data.institutionName === initialDetails.academicDegree) {
            setMessage({ error: "No changes were made." });
            return;
        }

        const res = await updateMetadata(data);
        if (res.success) {
            setInitialDetails({...initialDetails, ...data});
            setMessage({ success: res.message });
        } else {
            setMessage({ error: res.message });
        }
    }

    const reset = () => {
        form.setValue("academicDegree", initialDetails.academicDegree);
        form.setValue("institutionName", initialDetails.institutionName);
        setMessage(null);
    }

    return (
        <Form {...form}>
            <form
                className="border rounded-lg p-10 flex flex-col gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <h2 className="text-primary font-semibold">Education Details</h2>
                <p className="text-sm text-muted-foreground">
                    This information will be used for verifying your account. Make sure to provide accurate information.
                </p>

                <FormField
                    control={form.control}
                    name="academicDegree"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Academic Degree</FormLabel>
                            <FormControl>
                                <Input placeholder="full degree name" {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FormFieldMessage></FormFieldMessage>
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="institutionName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Institution Name</FormLabel>
                            <FormControl>
                                <Input placeholder="full institution name" {...field} disabled={form.formState.isSubmitting} />
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