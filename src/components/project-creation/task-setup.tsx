import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FieldInputData, TaskInputData, taskInputDataSchema } from "@/src/types/project-form-data";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DataType, TaskType } from "@/src/types/models";
import { ArrowDown, ArrowUp, Edit2, PlusCircle, X } from "lucide-react";
import TaskFieldSetup from "./task-field-setup";
import { useEffect, useRef, useState } from "react";

export default function TaskSetup({ buttonText, data, onSubmit, onChange, canEditType = true }: { buttonText: string, data?: Partial<TaskInputData>, onSubmit: (data: TaskInputData) => void, onChange: (data: any) => void, canEditType?: boolean }) {
    const form = useForm({
        resolver: zodResolver(taskInputDataSchema.omit({ datasetPath: true, })),
        defaultValues: { title: "", description: "", type: "", tutorial: "", targetCount: null, fields: [] as FieldInputData[], dataSource: [], ...data },
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>(data?.dataSource || []);
    const { fields, append, remove, update, move } = useFieldArray({ control: form.control, name: "fields" });
    const selectRef = useRef<HTMLButtonElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const type = form.watch("type");
    const dataType = form.watch("dataType");

    useEffect(() => {
        const subscription = form.watch((values) => {
            onChange(values);
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    useEffect(() => {
        if (type !== TaskType.DATALABELLING) {
            form.setValue("dataType", undefined);
            form.setValue("dataSource", undefined);
            setSelectedFiles([]);
        }
    }, [type]);

    const handleSubmit = (formData: TaskInputData) => {
        if (formData.type === TaskType.DATALABELLING) {
            if (!formData.dataType) {
                form.setError("dataType", { type: "required", message: "A type for the data is required" });
                selectRef.current?.focus();
                return;
            }
            if (selectedFiles.length === 0 && !data?.datasetPath) {
                form.setError("dataSource", { type: "required", message: "A data set is required" });
                fileInputRef.current?.focus();
                return;
            }
            formData.dataSource = selectedFiles;
        }
        onSubmit({ ...formData, fields });
    };
    //console.log(form.getValues("dataType"));
    return (

        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 p-4 border rounded animate-fade-slide"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Task Title" className="border p-2 w-full" />
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Description</FormLabel>
                            <FormControl>
                                <textarea {...field} placeholder="Task Description" className="border p-2 w-full rounded placeholder:text-muted-foreground text-sm" />
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!data?.datasetPath || !canEditType}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(TaskType).map((type) => (
                                        <SelectItem value={type} key={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {field.value === TaskType.SURVEY && <FormDescription>*Each user can contribute only once to a survey.</FormDescription>}
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                {type === TaskType.DATALABELLING &&
                    <FormField
                        control={form.control}
                        name="dataType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Data Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined} disabled={!!data?.datasetPath}>
                                    <FormControl>
                                        <SelectTrigger ref={selectRef}>
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(DataType).map((type) => (
                                            <SelectItem value={type} key={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}
                    />
                }
                {!data?.datasetPath && !!dataType &&
                    <FormField
                        control={form.control}
                        name="dataSource"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Dataset</FormLabel>
                                <FormControl>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept={
                                            dataType === "image"
                                                ? "image/jpeg, image/png, image/webp, image/gif, image/svg+xml"
                                                : dataType === "audio"
                                                    ? "audio/mpeg, audio/wav, audio/ogg, audio/flac"
                                                    : "*"
                                        }
                                        onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
                                    />
                                </FormControl>
                                {/* Display selected files */}
                                {selectedFiles.length > 0 &&
                                    <p className="text-sm text-muted-foreground">Selected Files: {selectedFiles.length}</p>
                                }
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}
                    />
                }
                {!!data?.datasetPath &&
                    <a href="" className="text-sm underline">see dataset</a>
                }
                < FormField
                    control={form.control}
                    name="targetCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Target Count (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="target number of contributions"
                                    className="border p-2 w-full"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value !== "" ? Number(e.target.value) : null)}
                                />
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tutorial"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Tutorial</FormLabel>
                            <FormControl>
                                <MDEditor
                                    onFocus={() => { }}
                                    preview="edit"
                                    previewOptions={{
                                        rehypePlugins: [[rehypeSanitize]],
                                    }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                />
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    name="fields"
                    render={({ field }) => (
                        <FormItem className="pb-12">
                            <FormLabel className="flex justify-between text-primary">
                                Fields
                                <TaskFieldSetup className="p-2 h-5" icon={PlusCircle} title="Add Field" onSubmit={(data) => append(data)} />
                            </FormLabel>
                            <FormDescription>Form fields where the user can input data.</FormDescription>
                            <div className="flex flex-col gap-4 text-sm">
                                {!fields.length &&
                                    <div className="text-muted-foreground mb-8 text-center p-2 border rounded">No fields added</div>
                                }
                                {fields.map((field, index) => (
                                    <div
                                        className="w-full flex justify-between items-center gap-4 bg-muted px-4 py-1 rounded-lg text-muted-foreground border border-green"
                                        key={field.id}>
                                        <span className="w-full truncate text-foreground font-semibold">{field.label}</span>
                                        <span className="w-full">type: {field.type}</span>
                                        <div className="flex">
                                            {index > 0 && <Button title="move up" variant="ghost" className="p-2" onClick={() => move(index, index - 1)}><ArrowUp size={15} /></Button>}
                                            {index < fields.length - 1 && <Button title="move down" variant="ghost" className="p-2" onClick={() => move(index, index + 1)}><ArrowDown size={15} /></Button>}
                                            <TaskFieldSetup className="text-green p-2" icon={Edit2} title="Edit Field" data={field} onSubmit={(data) => update(index, data)} />
                                            <Button title="remove" variant="ghost" className="text-primary p-2" onClick={() => remove(index)}><X size={15} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <Button
                    className="w-full"
                    type="submit"
                >
                    {buttonText}
                </Button>
            </form>
        </Form>
    );
}