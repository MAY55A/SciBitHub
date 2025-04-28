"use client"

import { ValidationStatusUI } from "@/src/components/custom/validation-status";
import { DataTableColumnHeader } from "@/src/components/data-table/table-column-header";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Contribution } from "@/src/types/models"
import { formatDate } from "@/src/utils/utils"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Actions } from "@/src/components/contributions/actions";
import { ValidationStatus } from "@/src/types/enums";

export const columns: ColumnDef<Contribution>[] = [
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
        id: "contributor",
        accessorKey: "user.username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contributor" />
        ),
        cell: ({ row }) => {
            const username = row.original.deleted_at ? "**Deleted User**" : row.getValue("contributor") as string;
            return <p>{username}</p>
        },
    },
    {
        accessorKey: "data",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Data" />
        ),
        cell: ({ row }) => {
            const data = JSON.stringify(row.getValue("data"));
            return <p>{data.slice(0, 100) + (data.length > 100 ? "..." : "")}</p>
        },
    },
    {
        id: "submitted at",
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Submitted At" />
        ),
        cell: ({ row }) => {
            const date = formatDate(row.getValue("submitted at"), true);
            return <div >{date}</div>
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as ValidationStatus;
            return <ValidationStatusUI status={status} />
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const tableMeta = table.options.meta;
            const contribution = row.original
            const router = useRouter();
            return (
                <div className="w-[300px] flex items-center gap-2 justify-end">
                    <Actions showText={false} contributions={[contribution.id!]} status={contribution.status} onUpdate={(newStatus) => { tableMeta?.updateData(row.index, "status", newStatus) }} onDelete={() => tableMeta?.removeRow(row.index)} />
                </div>
            )
        },
    },
    {
        id: "more",
        cell: ({ row, table }) => {
            const tableMeta = table.options.meta;
            const contribution = row.original
            const router = useRouter();
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(contribution.id!)}
                        >
                            Copy contribution ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View contributor</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push(`/contributions/${contribution.id}`)}
                        >View contribution details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]