import '@tanstack/react-table'

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData?: (rowIndex: number[], columnId: string, value: any) => void;
        removeRow?: (rowIndex: number) => void;
        removeRows?: (rowIndexes: number[]) => void;
    }
}