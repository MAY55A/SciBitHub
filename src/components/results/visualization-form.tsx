'use client';

import { AggregationFunction, ChartType, FieldType, TaskType, VisualizationType } from "@/src/types/enums";
import { Button } from "../ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { VisualizationInputData, visualizationInputDataSchema } from "@/src/types/data-visualization-form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Task } from "@/src/types/models";
import { Checkbox } from "../ui/checkbox";
import { FieldConfig } from "@/src/types/models";

export function VisualizationForm({ buttonText, buttonDisabled, data, tasks, onSubmit, onChange }: { buttonText: string; buttonDisabled: boolean, data?: Partial<VisualizationInputData>; tasks: Task[], onSubmit: (data: VisualizationInputData) => void; onChange: (data: Partial<VisualizationInputData>) => void; }) {
    const form = useForm({
        resolver: zodResolver(visualizationInputDataSchema),
        defaultValues: { title: "", type: "", task: "", ...data, display_field: data?.display_field ?? undefined, table_columns: data?.table_columns ?? [], group_by: data?.group_by ?? undefined, value_field: data?.value_field ?? undefined, aggregation: data?.aggregation ?? undefined, custom_function: data?.custom_function ?? undefined },
    });
    const chartsWithOneAxis = [ChartType.PIE];
    const [fields, setFields] = useState<FieldConfig[]>([]);
    const [isGalleryDisabled, setIsGalleryDisabled] = useState(false);
    const currentTask = form.watch("task");
    const currentType = form.watch("type");
    const currentChartType = form.watch("chart_type");

    useEffect(() => {
        const task = tasks.find(task => task.id === currentTask);
        const fileField = { label: "data_file", type: FieldType.FILE, required: true };
        const taskFields = task?.type === TaskType.DATALABELLING ? [fileField, ...(task.fields)] : task?.fields;
        setFields(taskFields || []);
        setIsGalleryDisabled(task?.type !== TaskType.DATACOLLECTION);
    }, [currentTask]);

    useEffect(() => {
        const values = form.watch();
        onChange(values);
    }, [form.watch(), onChange]);

    const handleSubmit = (formData: VisualizationInputData) => {
        if (formData.type === VisualizationType.TABLE) {
            formData.chart_type = undefined;
            formData.group_by = undefined;
            formData.value_field = undefined;
        } else if (formData.type === VisualizationType.CHART) {
            formData.table_columns = undefined;
            if (chartsWithOneAxis.includes(formData.chart_type as ChartType)) {
                formData.value_field = undefined;
            }
        }
        onSubmit({ ...formData });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit, (error) => console.log(error))}
                className="space-y-4 p-4 border rounded animate-fade-slide"
            >
                <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-green">Task</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a task" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {tasks.map((task) => (
                                            <SelectItem value={task.id!} key={task.id}>{task.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-green">Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Visualization Title" className="border p-2 w-full" />
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
                            <FormLabel className="text-green">Type</FormLabel>
                            <RadioGroup
                                {...field}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                className="w-full flex flex-wrap gap-8 px-6 pt-4"
                            >
                                {Object.values(VisualizationType).map(type => (
                                    <div className="flex items-center space-x-2" key={type}>
                                        <RadioGroupItem
                                            value={type}
                                            id={type}
                                            disabled={type === VisualizationType.GALLERY && isGalleryDisabled}
                                            title={type === VisualizationType.GALLERY && isGalleryDisabled ? "Available only for data collection tasks" : ""}
                                        />
                                        <Label htmlFor={type}>{type}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            <FormMessage></FormMessage>
                        </FormItem>
                    )}
                />
                {currentType === VisualizationType.GALLERY && (
                    <FormField
                        control={form.control}
                        name="display_field"
                        render={({ field }) => {
                            const fileFields = fields.filter(f => f.type === FieldType.FILE);
                            return (
                                <FormItem>
                                    <FormLabel className="text-green">Display Field</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={fileFields.length ? "Select a field" : "No file fields are available"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {fileFields.map((f) => (
                                                <SelectItem value={f.label} key={f.label}>{f.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                )}
                {currentType === VisualizationType.TABLE && (
                    <FormField
                        control={form.control}
                        name="table_columns"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-green">Columns</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-2 p-2 border rounded-md">
                                        {fields.length ? [...fields].map((f) => (
                                            <div key={f.label}>
                                                <Checkbox
                                                    checked={field.value?.includes(f.label)}
                                                    onCheckedChange={(checked) => {
                                                        const current = field.value ?? [];
                                                        let newValue = checked
                                                            ? [...current, f.label]
                                                            : current.filter((v) => v !== f.label);

                                                        field.onChange(newValue);
                                                    }}
                                                />
                                                <span className="ml-2">{f.label}</span>
                                            </div>
                                        )) :
                                            <span className="text-sm text-muted-foreground">Choose a task first</span>
                                        }
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {currentType === VisualizationType.CHART &&
                    <>
                        <FormField
                            control={form.control}
                            name="chart_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Chart Type</FormLabel>
                                    <RadioGroup
                                        {...field}
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                        className="w-full flex flex-wrap gap-8 px-6 pt-4"
                                    >
                                        {Object.values(ChartType).map(type => (
                                            <div className="flex items-center space-x-2" key={type}>
                                                <RadioGroupItem
                                                    value={type}
                                                    id={type}
                                                />
                                                <Label htmlFor={type}>{type}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="group_by"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green">Group By</FormLabel>
                                    <FormDescription>
                                        Field to group the data by. Each unique value will form a separate section (e.g., bar, pie slice, point).
                                    </FormDescription>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a field" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {fields.map((f) => (
                                                <SelectItem value={f.label} key={f.label}>{f.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        {!chartsWithOneAxis.includes(currentChartType as ChartType) &&
                            <FormField
                                control={form.control}
                                name="value_field"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-green">Value Field</FormLabel>
                                        <FormDescription>
                                            Field to be used for calculation (e.g., sum, average). If left empty, a count of records will be used.
                                        </FormDescription>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a field" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {fields.map((f) => (
                                                    <SelectItem value={f.label} key={f.label}>{f.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />}
                        <FormField
                            control={form.control}
                            name={"aggregation"}
                            render={({ field }) => (
                                <FormItem className="min-w-[250px]">
                                    <FormLabel className="text-green">Aggregation Function</FormLabel>
                                    <FormDescription>
                                        Choose how the data should be aggregated (e.g., count, sum, average). Determines how values in the value field are combined per group.
                                    </FormDescription>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a function" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(AggregationFunction).map((f) => (
                                                <SelectItem value={f} key={f}>{f}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        {form.watch("aggregation") === AggregationFunction.CUSTOM && (
                            <FormField
                                control={form.control}
                                name={"custom_function"}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="font-semibold">Custom Function</FormLabel>
                                        <FormDescription>
                                            Define a custom aggregation function that applies to the selected value field. This allows you to perform more complex calculations (e.g., a custom formula or logic) on your data.
                                        </FormDescription>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., x => x * 2"
                                                className="border p-2 w-full"
                                            />
                                        </FormControl>
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />
                        )}
                    </>
                }
                <div className="pt-8">
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={buttonDisabled}
                    >
                        {buttonText}
                    </Button></div>
            </form>
        </Form>
    );
}