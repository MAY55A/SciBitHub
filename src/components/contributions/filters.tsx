import { ValidationStatus } from "@/src/types/enums";

export const contributionsFilters = [
    {
        column: "status",
        values: [
            {
                label: "Pending",
                value: ValidationStatus.PENDING,
            },
            {
                label: "Approved",
                value: ValidationStatus.APPROVED,
            },
            {
                label: "Rejected",
                value: ValidationStatus.REJECTED,
            },
        ]
    },
]