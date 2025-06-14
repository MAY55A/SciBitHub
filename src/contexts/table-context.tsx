"use client"

import { createContext, useContext } from "react";
import { Table } from "@tanstack/react-table";

const TableContext = createContext<Table<any> | null>(null);

export function useTable<TData>() {
    const table = useContext(TableContext);
    if (!table) throw new Error("useTable must be used within a TableContext.Provider");
    return table as Table<TData>;
}

export { TableContext };