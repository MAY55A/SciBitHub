import { z } from "zod";
import { DiscussionCategory } from "./enums";

export const discussionInputDataSchema = z.object({
    id: z.string().optional(),
    title: z.string().max(150, "Title must contain at most 150 characters").min(5, "Title must contain at least 5 characters"),
    body: z.string().min(200, "Body must contain at least 200 characters"),
    category: z.enum(Object.values(DiscussionCategory) as [string, ...string[]], {
        errorMap: () => ({ message: "Please select a category" }),
    }),
    tags: z.array(z.string()).optional(),
    files: z.array(z.string()).optional(),
    creator: z.string().optional(),
});

export type DiscussionInputData = z.infer<typeof discussionInputDataSchema>;