"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useMultistepFormContext } from "../../../../src/contexts/multistep-form-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputData, inputDataSchema } from "@/src/types/user-form-data";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import CountrySelector from "@/src/components/custom/countries-selector";
import { useEffect, useState } from "react";

export default function NameAndCountryForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const id = searchParams.get("id");
    const username = searchParams.get("username");

    const { formData, updateFormData } = useMultistepFormContext();
    // Update form data only once when params are available
    useEffect(() => {
        if (email && username && id) {
            updateFormData({ email, username, id, password: "" });
        }
    }, []);
    const form = useForm({
        resolver: zodResolver(inputDataSchema.pick({ username: true, country: true })),
        defaultValues: { username: formData.username, country: formData.country },
    });
    const [isVerifying, setisVerifying] = useState(false);


    const onSubmit = async (data: Partial<InputData>) => {
        try {
            setisVerifying(true);
            const response = await fetch("/api/check-exists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ table: "users", attribute: "username", value: data.username }),
            });

            const result = await response.json();
            setisVerifying(false);

            if (result.exists) {
                form.setError("username", {
                    type: "manual",
                    message: "This username is already used",
                });
                return;
            }
            updateFormData(data);
            router.push("/sign-up/role");
        } catch (error) {
            console.error("Error checking name:", error);
            form.setError("username", {
                type: "manual",
                message: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full max-w-md px-4 pt-20"
            >
                <h1 className="text-2xl font-medium">Enter Your Name & Country</h1>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="your full name" {...field} />
                            </FormControl>
                            <FormMessage>{isVerifying ? "Verifying name..." : undefined}</FormMessage>
                        </FormItem>
                    )}
                />

                <CountrySelector control={form.control} name="country" />
                <div className="flex gap-4 w-full">
                    {/* Go Back Button */}
                    <Button variant={"secondary"} type="button" className="w-full" onClick={() => router.push("/sign-up/credentials")}>
                        Go Back
                    </Button>
                    {/* Continue Button */}
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Continue
                    </Button>
                </div>
            </form>
        </Form>
    );
}