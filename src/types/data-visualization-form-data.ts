import { z } from "zod";
import { AggregationFunction, ChartType, VisualizationType } from "./enums";

export const visualizationInputDataSchema = z.object({
    id: z.string().optional(),
    title: z.string().max(150, "Title must contain at most 150 characters").min(5, "Title must contain at least 5 characters"),
    type: z.enum(Object.values(VisualizationType) as [string, ...string[]], {
        errorMap: () => ({ message: "Visualization type is required" }),
    }),
    chart_type: z.enum(Object.values(ChartType) as [string, ...string[]]).optional(),
    table_columns: z.array(z.string()).optional(),
    display_field: z.string().optional(),
    group_by: z.string().optional(),
    value_field: z.string().optional(),
    aggregation: z.enum(Object.values(AggregationFunction) as [string, ...string[]]).optional(),
    custom_function: z.string().optional(), // optional JS expression like "x => x * 2"
    task: z.string().nonempty("Task is required"),
}).superRefine((data, ctx) => {
    if (data.type === "chart") {
        if (!data.chart_type) {
            ctx.addIssue({
                path: ["chart_type"],
                message: "Chart type is required for chart visualizations",
                code: z.ZodIssueCode.custom
            });
        }
        if (!data.group_by) {
            ctx.addIssue({
                path: ["group_by"],
                message: "Group by field is required for chart visualizations",
                code: z.ZodIssueCode.custom
            });
        }
        if (data.chart_type !== "pie") {
            if (!data.value_field) {
                ctx.addIssue({
                    path: ["value_field"],
                    message: "Y axis is required for this chart type",
                    code: z.ZodIssueCode.custom
                });
            }
            if (data.group_by === data.value_field) {
                ctx.addIssue({
                    path: ["value_field"],
                    message: "Group by field and value field cannot be the same",
                    code: z.ZodIssueCode.custom
                });
            }
        }
    }

    if (data.type === "gallery") {
        if (!data.display_field) {
            ctx.addIssue({
                path: ["display_field"],
                message: "Display field is required for gallery visualizations",
                code: z.ZodIssueCode.custom
            });
        }
    }

    if (data.type === "table") {
        if (!data.table_columns || data.table_columns.length === 0) {
            ctx.addIssue({
                path: ["table_columns"],
                message: "At least one column must be selected for table visualizations",
                code: z.ZodIssueCode.custom
            });
        }
    }
});

export type VisualizationInputData = z.infer<typeof visualizationInputDataSchema>;