"use client"

import { DataTableColumnHeader } from "@/src/components/data-table/table-column-header";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Discussion } from "@/src/types/models"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import { DiscussionOptionsMenu } from "./discussion-options-menu";
import { DiscussionStatus } from "@/src/types/enums";

export const discussionsTableColumns: ColumnDef<Discussion>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                disabled={row.original.deleted_at !== null}
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        )
    },
    {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        )
    },
    {
        id: "author",
        accessorKey: "creator.username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Author" />
        ),
        cell: ({ row }) => {
            const user = row.original.creator;
            if (!user) {
                return <div className="text-muted-foreground">Unknown</div>;
            }
            return (
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <a href={`/admin/users?id=${user.id}`} className="truncate font-semibold hover:underline">{user.deleted_at ? "Deleted user" : user.username}</a>
                </div>
            );
        },
    },
    {
        id: "category",
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        )
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as DiscussionStatus;
            if (status === DiscussionStatus.CLOSED) {
                return <div className="text-orange-500">{status}</div>
            }
            if (status === DiscussionStatus.OPEN) {
                return <div className="text-green-600">{status}</div>
            }
            return <div className="text-red-700">{status}</div>
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "created at",
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const date = format(row.getValue("created at"), "dd/MM/yyyy hh:mm");
            return <div >{date}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const tableMeta = table.options.meta;
            const discussion = row.original;
            return (
                <DiscussionOptionsMenu
                    discussion={discussion}
                    updateRow={(column, value) => tableMeta?.updateData!([row.index], column, value)}
                    removeRow={() => tableMeta?.removeRow!(row.index)}
                />
            )
        },
    },
]
