import { ReportReason, ReportStatus } from "@/src/types/enums";

export const reportFilters = [
    {
        column: "type",
        values: [
            { label: "Project", value: "project" },
            { label: "Task", value: "task" },
            { label: "Discussion", value: "discussion" },
            { label: "Comment", value: "comment" },
            { label: "Forum topic", value: "forum topic" },
            { label: "Contribution", value: "contribution" },
        ]
    },
    {
        column: "reason",
        values: Object.values(ReportReason).map((reason) => ({
            label: reason,
            value: reason,
        }))
    },
    {
        column: "status",
        values: Object.values(ReportStatus).map((status) => ({
            label: status,
            value: status,
        }))
    }
]