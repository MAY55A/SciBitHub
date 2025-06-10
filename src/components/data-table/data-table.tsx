"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import { useState } from "react"
import { DataTableToolbar } from "@/src/components/data-table/table-toolbar"
import { DataTablePagination } from "./table-pagination"
import { useToast } from "@/src/hooks/use-toast"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    searchColumn: string,
    filters?: {
        column: string, values: {
            label: string
            value: any
        }[]
    }[],
    onRemoveSelected: (ids: string[]) => Promise<{ success: boolean; message: string; }>
}

export function DataTable<TData, TValue>({
    columns,
    data: initialData,
    searchColumn,
    filters,
    onRemoveSelected,
}: DataTableProps<TData, TValue>) {
    const [data, setData] = useState<TData[]>(initialData);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const { toast } = useToast();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
        meta: {
            updateData: (rowIndex: number, column: string, values: any) => {
                console.log("updateData", rowIndex, column, values);
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            if (column === "") { // if columnId is empty, it means more than one column is being updated
                                return {
                                    ...row,
                                    ...values
                                };
                            }
                            if (column.includes(".")) { // if columnId is a nested object, we need to update the nested object (only 2 levels deep)
                                // e.g. columnId = "metadata.isVerified" => metadata: { isVerified: values }
                                const columns = column.split(".");
                                const outerColumn = columns[0];
                                const outerColumnValue = row[outerColumn as keyof TData];
                                const innerColumn = columns[1];
                                return {
                                    ...row,
                                    [outerColumn]: { ...outerColumnValue, [innerColumn]: values },
                                };
                            }
                            return {
                                ...row,
                                [column]: values,
                            };
                        }
                        return row;
                    })
                );
            },
            removeRow: (rowIndex: number) => {
                const setFilterFunc = (old: any) =>
                    old.filter((_row: any, index: number) => index !== rowIndex);
                setData(setFilterFunc);
            },
            removeSelectedRows: async () => {
                const selectedRows = table.getSelectedRowModel().rows;
                const selectedIndexes = selectedRows.map((row) => row.index);

                const setFilterFunc = (old: any[]) =>
                    old.filter((_row, index) => !selectedIndexes.includes(index));
                const res = await onRemoveSelected(selectedRows.map((row) => row.original.id));
                toast({
                    description: res.message,
                    variant: res.success ? "default" : "destructive"
                });
                if (res.success) {
                    setData(setFilterFunc);
                    table.resetRowSelection();
                }

            }
        }
    })

    return (
        <div className="space-y-4 font-retro">
            <DataTableToolbar table={table} searchColumn={searchColumn} filters={filters} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}