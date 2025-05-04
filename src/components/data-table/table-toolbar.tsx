"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Input } from "../ui/input"
import { DataTableFilter } from "./table-filter"
import { Button } from "../ui/button"
import { DataTableViewOptions } from "./table-column-toggle"

interface DataTableToolbarProps<TData> {
    table: Table<TData>,
    searchColumn: string,
    filters?: {
        column: string, values: {
            label: string
            value: string
            icon?: React.ComponentType<{ className?: string }>
        }[]
    }[],
}

export function DataTableToolbar<TData>({
    table,
    searchColumn,
    filters,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder={`Search by ${searchColumn}...`}
                    value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(event: any) =>
                        table.getColumn(searchColumn)?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[200px] lg:w-[300px]"
                />
                {filters?.map((filter, index) => (
                    <DataTableFilter
                        key={index}
                        column={table.getColumn(filter.column)}
                        title={filter.column}
                        options={filter.values}
                    />
                ))}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X size={15} className="ml-2"/>
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}