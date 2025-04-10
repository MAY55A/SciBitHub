import { ValidationStatus } from "@/src/types/enums";
import { Check, Hourglass, X } from "lucide-react";

export const contributionsFilters = [
    {
        column: "status",
        values: [
            {
                label: "Pending",
                value: ValidationStatus.PENDING,
                //icon: Hourglass
            },
            {
                label: "Approved",
                value: ValidationStatus.APPROVED,
                //icon: Check
            },
            {
                label: "Rejected",
                value: ValidationStatus.REJECTED,
                //icon: X
            },
        ]
    },
]