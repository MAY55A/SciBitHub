import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FieldInputData, TaskInputData, taskInputDataSchema } from "@/src/types/project-form-data";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TaskType } from "@/src/types/models";
import { ArrowDown, ArrowUp, Edit2, PlusCircle, X } from "lucide-react";
import TaskFieldSetup from "./task-field-setup";
import { useEffect } from "react";

export default function TaskSetup({ buttonText, data, onSubmit, onChange }: { buttonText: string, data?: Partial<TaskInputData>, onSubmit: (data: TaskInputData) => void, onChange: (data: any) => void }) {
    const form = useForm({
        resolver: zodResolver(taskInputDataSchema),
        defaultValues: { title: "", description: "", type: "", tutorial: "", targetCount: null, fields: [] as FieldInputData[], ...data },
    });

    const { fields, append, remove, update, move } = useFieldArray({ control: form.control, name: "fields" });
    const type = form.watch("type");

    useEffect(() => {
        const subscription = form.watch((values) => {
            onChange(values);
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    const handleSubmit = (data: TaskInputData) => {
        if (data.type === TaskType.DATALABELLING) {
            if (!data.dataSource) {
                form.setError("dataSource", { type: "required", message: "Data source is required for data labelling tasks" });
                return;
            }
        } else {
            data.dataSource = undefined;
        }
        onSubmit({...data, fields});
    };

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 border rounded">
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                {type === TaskType.DATALABELLING &&
                    <FormField
                        control={form.control}
                        name="dataSource"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-primary">Data Source</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="source url/api"
                                        className="border p-2 w-full"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value !== "" ? e.target.value : undefined)}
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}
                    />}
                < FormField
                    control={form.control}
                    name="targetCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-primary">Target Count (optional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="target number of contribuions"
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
                                    onFocus={() => {}}
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
                            <FormDescription>Form fields that the user can interact with.</FormDescription>
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