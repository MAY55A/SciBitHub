"use client"

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ProjectInputData, projectInputDataSchema } from "@/src/types/project-form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import InputFile from "./input-file";
import { useEffect, useState } from "react";
import { areEqualArrays } from "@/src/utils/utils";
import { CancelAlertDialog } from "./cancel-alert-dialog";
import { ProjectStatus } from "@/src/types/enums";

export function Step4({ data, onUpdate, onNext, onBack, onSaveStep, onSaveProject, dataChanged }: { data: ProjectInputData, onUpdate: (data: Partial<ProjectInputData>) => void, onNext: () => void, onBack: () => void, onSaveStep: () => void, onSaveProject: (data: Partial<ProjectInputData>, status: ProjectStatus) => void, dataChanged?: boolean }) {
    const form = useForm({
        resolver: zodResolver(projectInputDataSchema.pick({ coverImage: true, links: true })),
        defaultValues: data,
    });
    const [isSaved, setIsSaved] = useState(false);
    const [newLink, setNewLink] = useState("");

    const handleAddLink = () => {
        if (newLink.trim().length > 0) {
            if (form.getValues('links')?.includes(newLink)) {
                form.setError("links", { message: "Link already added" });
                return;
            }
            form.clearErrors('links');
            form.setValue('links', [...(form.getValues('links') ?? []), newLink]);
            setNewLink('');
        }
    }
    const handleDeleteLink = (index: number) => {
        const links = [...form.getValues('links')!];
        links.splice(index, 1);
        form.setValue('links', links);
    }

    const watchedFields = form.watch();
    useEffect(() => {
        const coverImageChanged = watchedFields.coverImage !== data.coverImage;
        const linksChanged = !areEqualArrays(watchedFields.links, data.links);
        setIsSaved(!coverImageChanged && !linksChanged);
    }, [watchedFields.coverImage, watchedFields.links]);


    const saveData = (data: Partial<ProjectInputData>) => {
        onUpdate(data);
        setIsSaved(true);
        onSaveStep();
    };
    const handleError = (errors: any) => {
        if (errors.links)
            form.setError("links", { message: "Invalid links" })
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(saveData, handleError)}
                className="w-full flex flex-col gap-8 p-6 shadow-lg rounded-lg border animate-fade-slide">
                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Cover Image (optional)</FormLabel>
                            <FormDescription>Visual thumbnail or banner for project branding</FormDescription>
                            <FormControl>
                                <InputFile onFileSelect={(file) => field.onChange(file)} file={field.value} setError={(error) => form.setError("coverImage", {"message": error})}></InputFile>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="links"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">External Links (optional)</FormLabel>
                            <FormDescription>Related URLs, datasets, or documentation for more info</FormDescription>
                            <FormControl>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        {field.value?.map((link, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <Input
                                                    value={link}
                                                    readOnly={true}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteLink(index)}
                                                    disabled={form.formState.isSubmitting}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Contact */}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add an external link"
                                            value={newLink}
                                            onChange={(e) => setNewLink(e.target.value)}
                                            disabled={form.formState.isSubmitting}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddLink}
                                            disabled={newLink.trim().length === 0}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage>
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <div className="w-full flex justify-between">
                    <CancelAlertDialog
                        projectStatus={data.status}
                        saveProject={() => data.status && !dataChanged ? undefined : onSaveProject(data, data.status as ProjectStatus || ProjectStatus.DRAFT)}
                    />
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onBack}
                        >
                            <ChevronLeft size={18} className="mr-2" />
                            Back
                        </Button>
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
                </div>
            </form>
        </Form >
    );
}