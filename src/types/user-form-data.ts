import { z } from "zod";
import { UserRole } from "./enums";

export const userInputDataSchema = z.object({
    id: z.string().optional(), // to store google account id
    username: z.string().max(50, "Name must contain at most 50 characters").min(5, "Name must contain at least 5 characters"),
    email: z.string().email(),
    password: z.string()
        .min(8, "Password must contain at least 8 characters")
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
        )
        .optional(),
    role: z.enum(["researcher", "contributor"]),
    fieldsOfInterest: z.array(z.string()),
    researcherType: z.enum(["academic", "organization", "casual"]).nullable(),
    country: z.string().nonempty("You must choose a country"),
    bio: z.string().max(500, "Bio must contain at most 500 characters").optional(),
    profilePicture: z.string().optional(),
    contacts: z.array(z.string()).optional(),
    phone: z.string().optional(),
    contactEmail: z.string().optional(),
    organizationName: z.string().optional(),
    organizationLocation: z.string().optional(),
    academicDegree: z.string().optional(),
    institutionName: z.string().optional(),
});

export const basicUserInputDataSchema = z.object({
    id: z.string().optional(),
    username: userInputDataSchema.shape.username,
    password: userInputDataSchema.shape.password,
    email: userInputDataSchema.shape.email,
    role: z.enum(Object.values(UserRole) as [string, ...string[]], {
        errorMap: () => ({ message: "Role is required" }),
    }),
    researcherType: z.enum(["academic", "organization", "casual"]).optional(),
}).superRefine((data, ctx) => {
    if (data.role === "researcher" && !data.researcherType) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Researcher type is required for researchers",
            path: ["researcherType"],
        })
    }
});

export type UserInputData = z.infer<typeof userInputDataSchema>;
export type BasicUserInputData = z.infer<typeof basicUserInputDataSchema>;