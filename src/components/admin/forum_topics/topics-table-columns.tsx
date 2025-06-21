"use client"

import { DataTableColumnHeader } from "@/src/components/data-table/table-column-header";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ForumTopic } from "@/src/types/models"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import { TopicOptionsMenu } from "./topics-options-menu";
import { Check, X } from "lucide-react";

export const topicsTableColumns: ColumnDef<ForumTopic>[] = [
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
                disabled={!row.getCanSelect()}
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
                <a href={`/admin/users?id=${user.id}`} className="truncate font-semibold hover:underline">{user.deleted_at ? "Deleted user" : user.username}</a>
            );
        },
    },
    {
        id: "project",
        accessorKey: "project.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Project" />
        ),
        cell: ({ row }) => {
            const project = row.original.project;
            return (
                <a href={`/admin/projects?id=${project.id}`} className=" hover:underline">{project.name}</a>
            );
        },
    },
    {
        id: "views",
        accessorKey: "views",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Views" />
        ),
    },
    {
        id: "replies",
        accessorKey: "replies",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Replies" />
        ),
    },
    {
        id: "upvotes",
        accessorKey: "upvotes",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Upvotes" />
        ),
        cell: ({ row }) => {
            const upvotes = row.getValue("upvotes") as number;
            return <div className="text-green-600">{upvotes}</div>
        }
    },
    {
        id: "downvotes",
        accessorKey: "downvotes",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Downvotes" />
        ),
        cell: ({ row }) => {
            const downvotes = row.getValue("downvotes") as number;
            return <div className="text-red-600">{downvotes}</div>
        }
    },
    {
        id: "status",
        accessorFn: (row) => row.deleted_at ? "deleted" : "active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as String;
            if (status === "deleted") {
                return <div className="text-destructive">{status}</div>
            }
            return <div className="text-green-600">{status}</div>
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "featured",
        accessorKey: "is_featured",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Featured" />
        ),
        cell: ({ row }) => {
            const isFeatured = row.getValue("featured") as boolean;
            if (row.original.deleted_at) {
                return <div className="text-muted-foreground">--</div>
            }
            if (isFeatured) {
                return <div className="text-green"><Check size={18} /></div>
            }
            return <div className="text-primary"><X size={18} /></div>
        },
        filterFn: (row, columnId, filterValue) => {
            if (row.original.deleted_at) {
                return false;
            }
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
            const date = format(row.getValue("created at"), "dd/MM/yyyy HH:mm");
            return <div >{date}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const tableMeta = table.options.meta;
            const topic = row.original;
            return (
                <TopicOptionsMenu
                    topic={topic}
                    updateRow={(column, value) => tableMeta?.updateData([row.index], column, value)}
                    removeRow={() => tableMeta?.removeRow(row.index)}
                />
            )
        },
    },
]
