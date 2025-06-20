"use client"

import { ValidationStatusUI } from "@/src/components/custom/validation-status";
import { DataTableColumnHeader } from "@/src/components/data-table/table-column-header";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { ParticipationRequest, Project, PublicUser } from "@/src/types/models"
import { formatDate } from "@/src/utils/utils"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { RequestType, ValidationStatus } from "@/src/types/enums";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Actions } from "./actions";
import Link from "next/link";

export const columnsWithUser: ColumnDef<ParticipationRequest>[] = [
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
        id: "user",
        accessorKey: "user.username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            return user.deleted_at ?
                (<div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">**Deleted User**</span>
                </div>)
                : (
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
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row, table }) => {
            const type = row.getValue("type") as RequestType;
            // check if the request is in a table from a project or a user POV
            const isProjectRequestsTable = table.getAllColumns().some(col => col.id === "user");
            // check if the request is an incoming application for the project (POV project creator)
            const isIncomingApplication = isProjectRequestsTable && type === RequestType.APPLICATION;
            // check if the request is an incoming invitation for the user (POV user)
            const isIncomingInvitation = !isProjectRequestsTable && type === RequestType.INVITATION;

            // incoming
            if (isIncomingApplication || isIncomingInvitation) {
                return (
                    <div className="text-yellow-500">
                        {type}
                        <ArrowDownLeft size={12} className="ml-1 inline-block" />
                    </div>
                );
            }
            // outgoing
            return (
                <div className="text-green-500">
                    {type}
                    <ArrowUpRight size={12} className="ml-1 inline-block" />
                </div>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "requested at",
        accessorKey: "requested_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Requested At" />
        ),
        cell: ({ row }) => {
            const date = formatDate(row.getValue("requested at"), true);
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
            if (row.original.deleted_at) {
                return <div className="text-muted-foreground">---</div>
            }
            return <ValidationStatusUI status={status} withBorder />
        },
        filterFn: (row, columnId, filterValue) => {
            console.log("filterValue", filterValue)
            // exclude deleted requests from the filter to not filter based on their status
            if (row.original.deleted_at) {
                return false
            }
            // If multiple values are selected, check if the row's value matches any of them
            return filterValue?.includes(row.getValue(columnId));
        }
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const tableMeta = table.options.meta;
            const request = row.original;

            // if the user is present as a column, it means the table is for project requests, and the project creator is viewing them
            // if the user is not present, it means the table is for user requests, and the user is viewing them
            const isProjectRequestsTable = table.getAllColumns().some(col => col.id === "user");
            // check if the request is an incoming application for the project, so the project creator can accept or reject it (POV project creator)
            const isIncomingApplication = isProjectRequestsTable && request.type === RequestType.APPLICATION;

            // check if the request is an incoming invitation for the user, so the user can accept or reject it (POV user)
            const isIncomingInvitation = !isProjectRequestsTable && request.type === RequestType.INVITATION;
            return (
                <div className="w-[300px] flex items-center gap-2 justify-end justify-self-end">
                    {request.deleted_at ?
                        <div className="text-muted-foreground">deleted {formatDate(request.deleted_at, true)}</div>
                        : <Actions
                            canAcceptOrReject={isIncomingInvitation || isIncomingApplication}
                            requests={[request.id!]}
                            status={request.status}
                            user={isProjectRequestsTable ? request.project.creator.id : request.user.id}
                            onUpdate={(newStatus) => { tableMeta?.updateData([row.index], "status", newStatus) }}
                            onDelete={() => tableMeta?.removeRow(row.index)} />}
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
                                onClick={() => navigator.clipboard.writeText(request.id)}
                            >
                                Copy request ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {isProjectRequestsTable ?
                                <DropdownMenuItem><Link href={`/users/${request.user.id}`}>View user</Link></DropdownMenuItem>
                                : <DropdownMenuItem><Link href={`/projects/${request.project.id}`}>View project</Link></DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

export const columnsWithProject: ColumnDef<ParticipationRequest>[] = [
    ...columnsWithUser.slice(0, 1),
    {
        id: "project",
        accessorKey: "project.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Project" />
        ),
        cell: ({ row }) => {
            const project = row.original.project;
            return (
                <div title={project.name}>{project.name}</div>
            );
        },
    },
    ...columnsWithUser.slice(2),
]
