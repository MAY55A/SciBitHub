"use client"

import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TopicInputData, topicInputDataSchema } from "@/src/types/topic-form-data";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage as FormFieldMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import TagsInput from "@/src/components/custom/tags-input";
import { createTopic, editTopic } from "@/src/lib/actions/topic-actions";
import { useToast } from "@/src/hooks/use-toast";
import { MarkdownEditor } from "../custom/markdown-editor";
import { areEqualArrays } from "@/src/utils/utils";
import { Message, FormMessage } from "../custom/form-message";
import { useRouter } from "next/navigation";


export default function TopicFormDialog({ projectId, data }: { projectId: string, data?: TopicInputData }) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<Message | undefined>(undefined);
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(topicInputDataSchema),
        defaultValues: { title: "", content: "", project: projectId, ...data },
    });

    const handleCreate = async (formData: TopicInputData) => {
        setSubmitting(true);
        const res = await createTopic(formData);
        setSubmitting(false);
        if (res.success) {
            form.reset();
            startTransition(() => {
                router.refresh();
                setOpen(false);
            });
        }
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        })
    }

    const handleEdit = async (formData: TopicInputData) => {
        setMessage(undefined);
        const hasNotChanged = formData.title === data!.title &&
            formData.content === data!.content && areEqualArrays(formData.tags, data!.tags);

        if (hasNotChanged) {
            setMessage({ error: "No changes made" });
            return;
        }
        setSubmitting(true);
        const res = await editTopic(formData);
        setSubmitting(false);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            startTransition(() => {
                router.refresh();
                setOpen(false);
            });
        }
    }

    const handleSubmit = async (formData: TopicInputData) => {

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
    }

    return (
        //fix overflow issue when dialog is closed
        <Dialog open={open} onOpenChange={(open)=>{setOpen(open); if(!open) document.body.style.overflow = "";}}>
            <DialogTrigger asChild>
                {data ?
                    <Button variant="ghost" className="h-full font-normal p-0" onClick={() => setOpen(true)}>Edit</Button> :
                    <Button onClick={() => setOpen(true)} className="w-full">Create a New Topic</Button>
                }
            </DialogTrigger>
            <DialogContent className="lg:min-w-[700px] md:min-w-[700px] sm:max-w-[425px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{data ? "Edit Topic" : "Create A New Topic"}</DialogTitle>
                    <DialogDescription>
                        Enter topic details here.
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
                                        <Input {...field} placeholder="Topic title" />
                                    </FormControl>
                                    <FormFieldMessage></FormFieldMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Content</FormLabel>
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
        </Dialog>
    );
}