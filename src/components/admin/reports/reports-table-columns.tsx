"use client"

import { DataTableColumnHeader } from "@/src/components/data-table/table-column-header";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Report } from "@/src/types/models"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import { ReportOptionsMenu } from "./reports-options-menu";
import { ReportStatus } from "@/src/types/enums";

export const reportsTableColumns: ColumnDef<Report>[] = [
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
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        )
    },
    {
        id: "type",
        accessorKey: "reported_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "reporter",
        accessorKey: "reporter.username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Reporter" />
        ),
        cell: ({ row }) => {
            const user = row.original.reporter;
            return (
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <a href={`/admin/users?id=${user.id}`} className="truncate font-semibold hover:underline">{user.username}</a>
                </div>
            );
        },
    },
    {
        id: "reason",
        accessorKey: "reason",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Reason" />
        ),
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as ReportStatus;
            if (status === ReportStatus.REVIEWED) {
                return <div className="text-orange-500">{status}</div>
            }
            if (status === ReportStatus.RESOLVED) {
                return <div className="text-green-600">{status}</div>
            }
            if (status === ReportStatus.PENDING) {
                return <div className="text-yellow-600">{status}</div>
            }
            return <div className="text-red-700">{status}</div>
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "reported at",
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Reported At" />
        ),
        cell: ({ row }) => {
            const date = format(row.getValue("reported at"), "dd/MM/yyyy hh:mm");
            return <div >{date}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const tableMeta = table.options.meta;
            const report = row.original;
            return (
                <ReportOptionsMenu report={report} rowIndex={row.index} updateRow={tableMeta?.updateData} removeRow={tableMeta?.removeRow} />
            )
        },
    },
]
