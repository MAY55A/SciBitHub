"use client"

import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiscussionInputData, discussionInputDataSchema } from "@/src/types/discussion-form-data";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage as FormFieldMessage, FormDescription } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import FileDropzone from "../custom/file-dropzone";
import TagsInput from "@/src/components/custom/tags-input";
import { createDiscussion, updateDiscussion } from "@/src/lib/services/discussion-service";
import { useToast } from "@/src/hooks/use-toast";
import { getFileWithMetadata } from "@/src/utils/minio/client";
import { DiscussionCategoriesDescriptions, DiscussionCategory } from "@/src/types/enums";
import { MarkdownEditor } from "../custom/markdown-editor";
import { areEqualArrays } from "@/src/utils/utils";
import { Message, FormMessage } from "../custom/form-message";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";


export default function DiscussionFormDialog({ data }: { data?: DiscussionInputData }) {
    const { user, loading } = useAuth();
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<Message | undefined>(undefined);
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(discussionInputDataSchema),
        defaultValues: { title: "", body: "", category: "", ...data },
    });
    const [newFiles, setNewFiles] = useState<FileWithPreview[]>([]);
    const [initialFiles, setInitialFiles] = useState<FileFromPath[]>([]);
    const [existingFiles, setExistingFiles] = useState<FileFromPath[]>([]);

    const removeFile = (name: string) => {
        if (newFiles.find(f => f.name === name)) {
            setNewFiles((prev) => {
                const fileToRemove = prev.find((f) => f.name === name);
                if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
                return prev.filter((f) => f.name !== name);
            });
        } else {
            setExistingFiles((prev) => prev.filter((f) => f.name !== name));
        }
    };

    const handleCreate = async (formData: DiscussionInputData) => {
        setSubmitting(true);
        const res = await createDiscussion(formData, newFiles);
        setSubmitting(false);
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        })

        if (res.success) {
            document.body.style.overflow = "";
            startTransition(() => {
                setOpen(false);
                router.refresh();
            });
        }
    }

    const handleEdit = async (formData: DiscussionInputData) => {
        setMessage(undefined);
        const hasNotChanged = formData.title === data!.title && formData.body === data!.body &&
            formData.category === data!.category && areEqualArrays(formData.tags ?? [], data!.tags ?? []) &&
            newFiles.length === 0 && existingFiles.length === initialFiles.length;

        if (hasNotChanged) {
            setMessage({ error: "No changes made" });
            return;
        }
        setSubmitting(true);
        const res = await updateDiscussion(formData, newFiles, existingFiles.map(f => f.path));
        setSubmitting(false);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            startTransition(() => {
                document.body.style.overflow = "";
                router.refresh();
                setOpen(false);
            });
        }
    }

    const handleSubmit = async (formData: DiscussionInputData) => {

        if (data) {
            await handleEdit(formData);
        } else {
            await handleCreate(formData);
        }
    }

    const resetForm = async () => {
        form.reset();
        form.clearErrors();
        setMessage(undefined);
        setNewFiles([]);
        setExistingFiles(initialFiles);
    }

    useEffect(() => {
        if (data?.files?.length) {
            (async () => {
                const files = await Promise.all(
                    data.files!.map(async (path) => {
                        const file = await getFileWithMetadata(path);
                        if (!file) {
                            return {
                                name: path.split("/").pop() || "Unknown",
                                preview: "",
                                type: "Unknown",
                                size: 0,
                                path,
                            }
                        }
                        return file;
                    }
                    )
                );
                setInitialFiles(files);
                setExistingFiles(files);
            })();
        }
    }, [data]);

    if (loading) {
        return null;
    }

    return (
        //fix overflow issue when dialog is closed
        <Dialog open={!!user && open} onOpenChange={(open) => { setOpen(open); if (!open) document.body.style.overflow = ""; }}>
            <DialogTrigger asChild>
                {data ?
                    <Button variant="ghost" className="h-full font-normal p-0" onClick={() => setOpen(true)}>Edit</Button> :
                    <Button className="font-bold" onClick={() => user ? setOpen(true) : router.push("/sign-in?redirect_to=/discussions")}>Open a Discussion</Button>
                }
            </DialogTrigger>
            <DialogContent className="lg:min-w-[700px] md:min-w-[700px] sm:max-w-[425px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Discussion" : "Create A New Discussion"}</DialogTitle>
                    <DialogDescription>
                        Enter discussion details here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 max-h-[80vh] overflow-y-auto ">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Discussion title" />
                                    </FormControl>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Body</FormLabel>
                                    <FormControl>
                                        <MarkdownEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            minHeight={200}
                                        />
                                    </FormControl>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Category</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(DiscussionCategory).map((category) => (
                                                    <SelectItem value={category} key={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>{DiscussionCategoriesDescriptions[field.value as DiscussionCategory]}</FormDescription>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Relevant Tags (optional)</FormLabel>
                                    <FormControl>
                                        <TagsInput onChange={field.onChange} tags={field.value ?? []} />
                                    </FormControl>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        <div>
                            <FormLabel className="text-green">Attached Files</FormLabel>
                            <FileDropzone files={[...existingFiles, ...newFiles]} onUploadFiles={setNewFiles} onRemoveFile={removeFile} />
                        </div>
                        {!!message && <FormMessage message={message} />}
                        <DialogFooter>
                            <Button type="reset" disabled={submitting} onClick={resetForm} variant="outline" className="mr-2">
                                reset
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "submitting..." : data ? "Save changes" : "Post"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}