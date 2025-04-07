"use client"

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { ProjectDomain, ProjectStatus } from "@/src/types/models";
import { ProjectInputData, projectInputDataSchema } from "@/src/types/project-form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import TagsInput from "../custom/tags-input";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { areEqualArrays } from "@/src/utils/utils";
import { CancelAlertDialog } from "./cancel-alert-dialog";

export function Step1({ initialName, data, onUpdate, onNext, onSaveStep, onSaveProject, dataChanged }: { initialName?: string, data: ProjectInputData, onUpdate: (data: Partial<ProjectInputData>) => void, onNext: () => void, onSaveStep: () => void, onSaveProject: (data: Partial<ProjectInputData>, status: ProjectStatus) => void, dataChanged?: boolean }) {
    const [isVerifiying, setIsVerifying] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const form = useForm({
        resolver: zodResolver(projectInputDataSchema.pick({ name: true, shortDescription: true, longDescription: true, domain: true, tags: true })),
        defaultValues: data,
    });

    const saveData = async (data: Partial<ProjectInputData>) => {
        try {
            if (initialName !== data.name) {
                setIsVerifying(true);
                const response = await fetch("/api/check-exists", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ table: "projects", attribute: "name", value: data.name }),
                });

                const result = await response.json();
                setIsVerifying(false);

                if (result.exists) {
                    form.setError("name", {
                        type: "manual",
                        message: "There exists already a project with this name",
                    });
                    return;
                }
            }
            onUpdate({ ...data });
            setIsSaved(true);
            onSaveStep();
        } catch (error) {
            console.error("Error checking name:", error);
            form.setError("name", {
                type: "manual",
                message: "Something went wrong. Please try again.",
            });
        }
    };
    const watchedFields = form.watch();
    useEffect(() => {
        const same = watchedFields.name.length > 0 && watchedFields.name === data.name &&
            watchedFields.shortDescription === data.shortDescription && watchedFields.longDescription === data.longDescription &&
            watchedFields.domain === data.domain && areEqualArrays(watchedFields.tags, data.tags);
        setIsSaved(same);
    }, [JSON.stringify(watchedFields)]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(saveData)}
                className="w-full flex flex-col gap-8 p-6 shadow-lg rounded-lg border animate-fade-slide">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Project Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter project name" {...field} />
                            </FormControl>
                            <FormMessage>{isVerifiying && "Verifying name..."}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Short Description</FormLabel>
                            <FormDescription>Brief summary shown on project cards or listings</FormDescription>
                            <FormControl>
                                <textarea {...field} placeholder="Task Description" className="border p-2 w-full rounded placeholder:text-muted-foreground text-sm" />
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Detailed Description</FormLabel>
                            <FormControl>
                                <MDEditor
                                    height={300}
                                    preview="edit"
                                    previewOptions={{
                                        rehypePlugins: [[rehypeSanitize]],
                                    }}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Research Domain</FormLabel>
                            <FormControl>
                                <select {...field} className="w-full p-2 border rounded mt-1">
                                    {["select a domain", ...Object.values(ProjectDomain).sort()].map(value =>
                                        <option key={value} value={value}>{value}</option>
                                    )}
                                </select>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Relevant Tags</FormLabel>
                            <FormControl>
                                <TagsInput onChange={field.onChange} tags={field.value ?? []} />
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <div className="w-full flex justify-between">
                    <CancelAlertDialog
                        projectStatus={data.status}
                        saveProject={data.name.length === 0 || !dataChanged ? undefined : () => onSaveProject(data, data.status as ProjectStatus ?? ProjectStatus.DRAFT)}
                    />
                    {isSaved ?
                        <Button
                            type="button"
                            onClick={onNext}
                        >
                            Continue
                            <ChevronRight size={18} className="ml-2" />
                        </Button> :
                        <Button
                            type="submit"
                        >
                            {form.formState.isSubmitting ? "Saving..." : "Save"}
                        </Button>
                    }
                </div>
            </form>
        </Form>
    );
}