import { z } from "zod";

export const banDurationInputSchema = z.object({
    days: z
        .string()
        .refine((val) => !val || (/^\d+$/.test(val) && parseInt(val) >= 0), {
            message: "Must be greater than 0",
        }),
    hours: z
        .string()
        .refine((val) => !val || (/^\d+$/.test(val) && parseInt(val) >= 0 && parseInt(val) <= 23), {
            message: "Must be between 0 and 23",
        }),
    minutes: z
        .string()
        .refine((val) => !val || (/^\d+$/.test(val) && parseInt(val) >= 0 && parseInt(val) <= 59), {
            message: "Must be between 0 and 59",
        }),
})
    .refine(
        ({ days, hours, minutes }) => {
            const d = parseInt(days || "0", 10);
            const h = parseInt(hours || "0", 10);
            const m = parseInt(minutes || "0", 10);
            return d + h + m > 0;
        },
        {
            message: "At least one of days, hours, or minutes must be greater than zero.",
        }
    );

export type BanDurationInput = z.infer<typeof banDurationInputSchema>;