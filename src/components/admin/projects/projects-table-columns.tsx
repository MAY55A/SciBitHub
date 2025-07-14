"use client"

import { DataTableColumnHeader } from "@/src/components/data-table/table-column-header";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Project } from "@/src/types/models"
import { ColumnDef } from "@tanstack/react-table"
import { ActivityStatus, ProjectStatus, ResearcherType } from "@/src/types/enums";
import { format } from "date-fns";
import { ProjectOptionsMenu } from "./project-options-menu";

export const projectsTableColumns: ColumnDef<Project>[] = [
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
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
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
        id: "creator",
        accessorKey: "creator.username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Creator" />
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
        id: "research type",
        accessorKey: "creator.metadata.researcherType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Research Type" />
        ),
        cell: ({ row }) => {
            const type = row.original.creator?.metadata?.researcherType;
            return (
                <div>{type}</div>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "domain",
        accessorKey: "domain",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Domain" />
        )
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as ProjectStatus;
            if (status === ProjectStatus.PENDING) {
                return <div className="text-yellow-600">{status}...</div>
            }
            if (status === ProjectStatus.PUBLISHED) {
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
        id: "activity",
        accessorKey: "activity_status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Activity" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as ProjectStatus;
            const activity = row.getValue("activity") as ActivityStatus;
            if (status !== ProjectStatus.PUBLISHED) {
                return <div className="text-muted-foreground">--</div>
            }
            if (activity === ActivityStatus.COMPLETED) {
                return <div className="text-yellow-600">{activity}...</div>
            }
            if (activity === ActivityStatus.ONGOING) {
                return <div className="text-green-700">{activity}</div>
            }
            if (activity === ActivityStatus.CLOSED) {
                return <div className="text-red-600">{activity}</div>
            }
            return <div className="text-muted-foreground">{activity}</div>
        },
        filterFn: (row, columnId, filterValue) => {
            if (row.getValue("status") !== ProjectStatus.PUBLISHED) {
                return false
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
            const date = format(row.getValue("created at"), "dd/MM/yyyy hh:mm");
            return <div >{date}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const tableMeta = table.options.meta;
            const project = row.original;
            return (
                <ProjectOptionsMenu
                    project={project}
                    updateRow={(column, value) => tableMeta?.updateData!([row.index], column, value)}
                    removeRow={() => tableMeta?.removeRow!(row.index)} />
            )
        },
    },
]
