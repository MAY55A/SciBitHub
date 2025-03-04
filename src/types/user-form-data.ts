import { z } from "zod";

export const inputDataSchema = z.object({
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

export type InputData = z.infer<typeof inputDataSchema>;