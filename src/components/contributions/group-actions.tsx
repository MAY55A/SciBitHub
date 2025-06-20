"use client"

import { Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useTable } from "@/src/contexts/table-context";
import { softDeleteContributions } from "@/src/lib/actions/contribution-actions";

export const ContributionsGroupActions = () => {
    const table = useTable<TData>();
    const { toast } = useToast();

    const removeSelectedContributions = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedIndexes = [];
        const selectedIds = [];
        for (const row of selectedRows) {
            selectedIndexes.push(row.index);
            selectedIds.push(row.original.id);
        }

        const res = await softDeleteContributions(selectedIds);
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive"
        });
        if (res.success) {
            table.options.meta?.removeRows(selectedIndexes);
        }

    }
    return (
        <CustomAlertDialog
            buttonIcon={Trash2}
            triggerText="Delete selected"
            buttonVariant="outline"
            confirmButtonVariant="destructive"
            title="This action CANNOT be undone !"
            description="All the selected contributions will be deleted permanently."
            confirmText="Delete All"
            onConfirm={removeSelectedContributions}
            buttonClass="text-destructive hover:border-destructive"
        />
    );
}