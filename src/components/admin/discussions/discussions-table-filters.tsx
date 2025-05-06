import { DiscussionCategory, DiscussionStatus } from "@/src/types/enums";

export const discussionFilters = [
    {
        column: "category",
        values: Object.values(DiscussionCategory).map((category) => ({
            label: category,
            value: category,
        }))
    },
    {
        column: "status",
        values: Object.values(DiscussionStatus).map((status) => ({
            label: status,
            value: status,
        }))
    }
]