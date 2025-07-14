"use client"

import { DataTableColumnHeader } from "@/src/components/data-table/table-column-header";
import { Checkbox } from "@/src/components/ui/checkbox";
import { User } from "@/src/types/models"
import { ColumnDef } from "@tanstack/react-table"
import { UserRole } from "@/src/types/enums";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { format } from "date-fns";
import { UserOptionsMenu } from "./user-options-menu";

export const usersTableColumns: ColumnDef<User>[] = [
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
        id: "username",
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Username" />
        ),
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-2" title={user.username}>
                    <Avatar className="relative flex shrink-0 overflow-hidden h-8 w-8 rounded-lg hover:shadow-lg">
                        <AvatarImage src={user.profile_picture ?? undefined} alt={user.username} />
                        <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">
                            {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.username}</span>
                    </div>
                </div>
            );
        },
    },
    {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        )
    },
    {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        )
    },
    {
        id: "role",
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const role = row.getValue("role") as UserRole;
            if (role === UserRole.RESEARCHER) {
                return (
                    <div className="text-primary">{role}</div>
                );
            }
            if (role === UserRole.CONTRIBUTOR) {
                return (
                    <div className="text-green">{role}</div>
                );
            }
            return (
                <div className="text-destructive">{role}</div>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "researcher type",
        accessorKey: "metadata.researcherType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Researcher Type" />
        ),
        cell: ({ row }) => {
            const researcherType = row.original.metadata?.researcherType;
            if (researcherType === undefined) {
                return <div className="text-muted-foreground">--</div>
            }
            return <div>{researcherType}</div>
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "verified",
        accessorKey: "metadata.isVerified",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified" />
        ),
        cell: ({ row }) => {
            const isVerified = row.original.metadata?.isVerified;
            if (isVerified === undefined) {
                return <div className="text-muted-foreground">--</div>
            }
            if (isVerified) {
                return <div className="text-green">Yes</div>
            }
            return <div className="text-muted-foreground">No</div>
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "status",
        accessorFn: (row) => {
            if (row.deleted_at) return "deleted";
            if (row.banned_until) return "banned";
            return "active";
        },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const user = row.original;
            const isVerified = row.original.metadata?.isVerified;
            if (row.original.deleted_at) {
                return <div className="text-red-700">deleted</div>
            }
            if (user.banned_until) {
                return <div className="text-yellow-700">banned</div>
            }
            return <div className="text-green-700">active</div>
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "joined at",
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Joined At" />
        ),
        cell: ({ row }) => {
            const date = format(row.getValue("joined at"), "dd/MM/yyyy hh:mm");
            return <div >{date}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const tableMeta = table.options.meta;
            const user = row.original;
            return (
                <UserOptionsMenu
                    user={user}
                    updateRow={(column, value) => tableMeta?.updateData!([row.index], column, value)}
                    removeRow={() => tableMeta?.removeRow!(row.index)}
                />
            )
        },
    },
]
