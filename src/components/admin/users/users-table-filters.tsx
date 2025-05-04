import { ResearcherType, UserRole } from "@/src/types/enums";

export const usersFilters = [
    {
        column: "role",
        values: [
            {
                label: "Researcher",
                value: UserRole.RESEARCHER,
            },
            {
                label: "Contributor",
                value: UserRole.CONTRIBUTOR,
            },
            {
                label: "Admin",
                value: UserRole.ADMIN,
            }
        ]
    },
    {
        column: "researcher type",
        values: [
            {
                label: "Organization",
                value: ResearcherType.ORGANIZATION,
            },
            {
                label: "Academic",
                value: ResearcherType.ACADEMIC,
            },
            {
                label: "Casual",
                value: ResearcherType.CASUAL,
            }
        ]
    },
    {
        column: "verified",
        values: [
            {
                label: "Yes",
                value: true,
            },
            {
                label: "No",
                value: false,
            }
        ]
    },
    {
        column: "status",
        values: [
            {
                label: "Active",
                value: "active",
            },
            {
                label: "Banned",
                value: "banned",
            },
            {
                label: "Deleted",
                value: "deleted",
            }
        ]
    },

]