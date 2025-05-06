import { ActivityStatus, ProjectDomain, ProjectStatus, ResearcherType } from "@/src/types/enums";

export const projectFilters = [
    {
        column: "research type",
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
        column: "domain",
        values: Object.values(ProjectDomain).map((domain) => ({
            label: domain,
            value: domain,
        }))
    },
    {
        column: "status",
        values: [
            {
                label: "Published",
                value: ProjectStatus.PUBLISHED,
            },
            {
                label: "Pending",
                value: ProjectStatus.PENDING,
            },
            {
                label: "Declined",
                value: ProjectStatus.DECLINED,
            },
            {
                label: "Deleted",
                value: ProjectStatus.DELETED,
            }
        ]
    },
    {
        column: "activity",
        values: [
            {
                label: "Ongoing",
                value: ActivityStatus.ONGOING,
            },
            {
                label: "Completed",
                value: ActivityStatus.COMPLETED,
            },
            {
                label: "Closed",
                value: ActivityStatus.CLOSED,
            },
            {
                label: "Paused",
                value: ActivityStatus.PAUSED,
            }
        ]
    },
]