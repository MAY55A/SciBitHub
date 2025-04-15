import { z } from "zod";

export const topicInputDataSchema = z.object({
    id: z.string().optional(),
    title: z.string().max(150, "Title must contain at most 150 characters").min(5, "Title must contain at least 5 characters"),
    content: z.string().min(50, "Body must contain at least 50 characters"),
    tags: z.array(z.string()).optional(),
    project: z.string().optional(),
    creator: z.string().optional(),
});

export type TopicInputData = z.infer<typeof topicInputDataSchema>;