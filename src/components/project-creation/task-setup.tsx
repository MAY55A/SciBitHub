import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FieldInputData, TaskInputData, taskInputDataSchema } from "@/src/types/project-form-data";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowDown, ArrowUp, Edit2, PlusCircle, X } from "lucide-react";
import TaskFieldSetup from "./task-field-setup";
import { useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { TaskType, DataType } from "@/src/types/enums";
import { MarkdownEditor } from "../custom/markdown-editor";
import Link from "next/link";

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

    function addField(field: FieldInputData) {
        if (fields.find(f => f.label === field.label)) {
            form.setError("fields", { message: "A Field with the same label already exists" });
            return;
        }
        form.clearErrors("fields");
        append(field);
    }

    function updateField(index: number, updatedField: FieldInputData) {
        if (updatedField.label !== fields[index].label && fields.find(f => f.label === updatedField.label)) {
            form.setError("fields", { message: "A Field with the same label already exists" });
            return;
        }
        form.clearErrors("fields");
        update(index, updatedField);
    }

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
                            <FormDescription>Task title shown to contributors</FormDescription>
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
                            <FormDescription>Details about what the task involves and expectations</FormDescription>
                            <FormControl>
                                <textarea {...field} placeholder="Task Description" className="border p-2 w-full rounded placeholder:text-muted-foreground text-sm font-retro" />
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
                            <FormDescription>Type of contribution needed</FormDescription>
                            <RadioGroup
                                {...field}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                className="w-full flex gap-8 px-6 pt-4"
                                disabled={!!data?.datasetPath || !canEditType}
                            >
                                {Object.values(TaskType).map(type => (
                                    <div className="flex items-center space-x-2" key={type}>
                                        <RadioGroupItem
                                            value={type}
                                            id={type}
                                        />
                                        <Label htmlFor={type}>{type}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            {field.value === TaskType.SURVEY && <FormDescription>*Each user can contribute only once to a survey</FormDescription>}
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
                                <FormDescription>Type of data to be labeled</FormDescription>
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
                                <FormDescription>Upload files for contributors to work on</FormDescription>
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
                    <Link href={`/tasks/${data.id}/dataset`} className="text-sm underline" target="_blank">see dataset</Link>
                }
                < FormField
                    control={form.control}
                    name="targetCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Target Count (optional)</FormLabel>
                            <FormDescription>Optional goal for how many contributions are needed</FormDescription>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Target number of contributions"
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
                            <FormDescription>Guide or example showing how to contribute correctly</FormDescription>
                            <FormControl>
                                <MarkdownEditor
                                    value={field.value}
                                    onChange={(value: string) => field.onChange(value)}
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
                                <TaskFieldSetup className="p-2 h-5" icon={PlusCircle} title="Add Field" onSubmit={(data) => addField(data)} />
                            </FormLabel>
                            <FormDescription>Custom form fields contributors can fill out when submitting</FormDescription>
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
                                            <TaskFieldSetup className="text-green p-2" icon={Edit2} title="Edit Field" data={field} onSubmit={(data) => updateField(index, data)} />
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