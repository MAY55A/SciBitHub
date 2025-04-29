import { z } from "zod";
import { ReportReason } from "./enums";

export const reportInputDataSchema = z.object({
    reported: z.string(),
    reported_type: z.string(),
    reason: z.enum(Object.values(ReportReason) as [string, ...string[]], {
        errorMap: () => ({ message: "Please select the reason for this report" }),
    }),
    description: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.reason === ReportReason.OTHER && !data.description) {
        ctx.addIssue({
            path: ["description"],
            message: "You must provide a description for the 'other' reason",
            code: z.ZodIssueCode.custom
        });
    }
});

export type ReportInputData = z.infer<typeof reportInputDataSchema>;