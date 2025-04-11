import { z } from "zod";
import { FieldType, ModerationLevel, ParticipationLevel, ProjectDomain, ProjectVisibility, Scope, TaskType } from "./enums";

export const fieldInputDataSchema = z.object({
    label: z.string().nonempty("Required"),
    type: z.enum(Object.values(FieldType) as [string, ...string[]], {
        errorMap: () => ({ message: "Required" }),
    }),
    required: z.boolean(),
    placeholder: z.string().optional(),
    description: z.string().optional(),
    params: z.object(<any>{}).optional(),
});

export const taskInputDataSchema = z.object({
    id: z.string().optional(),
    title: z.string().nonempty("Required").min(10, "Title must be at least 10 characters"),
    description: z.string().nonempty("Required").min(10, "Description must be at least 10 characters"),
    tutorial: z.string().nonempty("Required").min(20, "Tutorial must be at least 20 characters"),
    type: z.enum(Object.values(TaskType) as [string, ...string[]], {
        errorMap: () => ({ message: "Required" }),
    }),
    dataSource: z
        .custom<File[]>((val) => val instanceof FileList || Array.isArray(val), {
            message: "You must upload at least one file",
        })
        .optional(),
    datasetPath: z.string().optional(),
    dataType: z.string().nullable().optional(),
    targetCount: z.number().min(1).nullable(),
    fields: z.array(fieldInputDataSchema).refine(fields => fields.length > 0, {
        message: "Task needs at least one field",
    }),
});

export const projectInputDataSchema = z.object({
    name: z.string().max(150, "Name must contain at most 150 characters").min(5, "Name must contain at least 5 characters"),
    shortDescription: z.string().min(30, "Short description must contain at least 30 characters").max(200, "Short description must contain at most 200 characters"),
    longDescription: z.string().min(200, "Long description must contain at least 200 characters"),
    domain: z.enum(Object.values(ProjectDomain) as [string, ...string[]], {
        errorMap: () => ({ message: "Please select a domain" }),
    }),
    scope: z.enum(Object.values(Scope) as [string, ...string[]]),
    countries: z.array(z.string()).optional(),
    visibility: z.enum(Object.values(ProjectVisibility) as [string, ...string[]]),
    participationLevel: z.enum(Object.values(ParticipationLevel) as [string, ...string[]]),
    moderationLevel: z.enum(Object.values(ModerationLevel) as [string, ...string[]]),
    deadline: z.date().optional(),
    tags: z.array(z.string()).optional(),
    links: z.array(z.string().url()).optional(),
    files: z.array(z.string().url()).optional(),
    coverImage: z.string().optional(),
    participants: z.array(z.object({ id: z.string(), username: z.string(), profile_picture: z.string().optional() })).optional(),
    tasks: z.array(taskInputDataSchema),
    status: z.string().optional(),
    creator: z.string().optional(),
    id: z.string().optional(),
});

export type FieldInputData = z.infer<typeof fieldInputDataSchema>;
export type TaskInputData = z.infer<typeof taskInputDataSchema>;
export type ProjectInputData = z.infer<typeof projectInputDataSchema>;