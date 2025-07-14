"use client"

import { Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useTable } from "@/src/contexts/table-context";
import { deleteReports } from "@/src/lib/actions/admin/reports-actions";
import { Report } from "@/src/types/models";

export const ReportsGroupActions = () => {
    const table = useTable<Report>();
    const { toast } = useToast();

    const removeSelectedReports = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedIndexes: number[] = [];
        const selectedIds: string[] = [];
        for (const row of selectedRows) {
            selectedIndexes.push(row.index);
            selectedIds.push(row.original.id!);
        }

        const res = await deleteReports(selectedIds);
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive"
        });
        if (res.success) {
            table.options.meta?.removeRows!(selectedIndexes);
        }

    }
    return (
        <CustomAlertDialog
            buttonIcon={Trash2}
            triggerText="Delete selected"
            buttonVariant="outline"
            confirmButtonVariant="destructive"
            title="This action CANNOT be undone !"
            description="All selected reports will be deleted permanently."
            confirmText="Delete All"
            onConfirm={removeSelectedReports}
            buttonClass="text-destructive hover:border-destructive"
        />
    );
}