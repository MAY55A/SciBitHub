"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiscussionInputData, discussionInputDataSchema } from "@/src/types/discussion-form-data";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import FileDropzone from "../custom/file-dropzone";
import TagsInput from "@/src/components/custom/tags-input";
import { createDiscussion, updateDiscussion } from "@/src/lib/discussion-service";
import { useToast } from "@/src/hooks/use-toast";
import { getFileWithMetadata } from "@/src/utils/minio/client";
import { DiscussionCategory } from "@/src/types/enums";


export default function DiscussionFormDialog({ data }: { data?: DiscussionInputData }) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();
    const fieldForm = useForm({
        resolver: zodResolver(discussionInputDataSchema),
        defaultValues: { title: "", body: "", category: "", ...data },
    });
    const [newFiles, setNewFiles] = useState<FileWithPreview[]>([]);
    const [existingFiles, setExistingFiles] = useState<FileFromPath[]>([]);

    const removeFile = (name: string) => {
        if(newFiles.find(f=>f.name === name)) {
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
        if (res.success) {
            fieldForm.reset();
            setOpen(false);
        }
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        })
    }

    const handleEdit = async (formData: DiscussionInputData) => {
        setSubmitting(true);
        const res = await updateDiscussion(formData, newFiles, existingFiles.map(f => f.path));
        setSubmitting(false);

        if (res.success) {
            setOpen(false);
        }

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });
    }

    const handleSubmit = async (formData: DiscussionInputData) => {
        console.log("Form submitted:", formData);
        console.log("newFiles:", newFiles);
        if (data) {
            await handleEdit(formData);
        } else {
            await handleCreate(formData);
        }
    }

    useEffect(() => {
        if (data?.files?.length) {
            (async () => {
                const files = await Promise.all(
                    data.files!.map(async (path) =>
                        await getFileWithMetadata(path)
                    )
                );
                setExistingFiles(files.filter(f => f !== null));
            })();
        }
    }, [data]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {data ?
                    <Button variant="ghost" className="h-full font-normal p-0" onClick={() => setOpen(true)}>Edit</Button> :
                    <Button onClick={() => setOpen(true)}>open a discussion</Button>
                }
            </DialogTrigger>
            <DialogContent className="lg:min-w-[700px] md:min-w-[700px] sm:max-w-[425px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Discussion" : "Create A New Discussion"}</DialogTitle>
                    <DialogDescription>
                        Enter discussion details here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...fieldForm}>
                    <form onSubmit={fieldForm.handleSubmit(handleSubmit)} className="space-y-4 p-4 max-h-[80vh] overflow-y-auto ">
                        <FormField
                            control={fieldForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Discussion title" />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={fieldForm.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Body</FormLabel>
                                    <FormControl>
                                        <MDEditor
                                            height={200}
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
                            control={fieldForm.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Category</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(DiscussionCategory).map((type) => (
                                                    <SelectItem value={type} key={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={fieldForm.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Relevant Tags (optional)</FormLabel>
                                    <FormControl>
                                        <TagsInput onChange={field.onChange} tags={field.value ?? []} />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <div>
                            <FormLabel className="text-green">Attached Files</FormLabel>
                            <FileDropzone files={[...existingFiles, ...newFiles]} onUploadFiles={setNewFiles} onRemoveFile={removeFile}/>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "submitting..." : data ? "Save changes" : "Post"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}