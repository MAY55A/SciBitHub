"use client"

import { Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useTable } from "@/src/contexts/table-context";
import { deleteTopics } from "@/src/lib/actions/admin/topics-actions";

export const TopicsGroupActions = () => {
    const table = useTable<TData>();
    const { toast } = useToast();

    const removeSelectedTopics = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedIndexes = [];
        const selectedIds = [];
        for (const row of selectedRows) {
            selectedIndexes.push(row.index);
            selectedIds.push(row.original.id);
        }

        const res = await deleteTopics(selectedIds, "soft");
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive"
        });
        if (res.success) {
            table.resetRowSelection();
            table.options.meta?.updateData(selectedIndexes, "deleted_at", new Date().toISOString());
        }

    }
    return (
        <CustomAlertDialog
            buttonIcon={Trash2}
            triggerText="Delete selected"
            buttonVariant="outline"
            confirmButtonVariant="destructive"
            title="Are you Sure ?"
            description="All selected topics will be deleted, but they still can be restored later."
            confirmText="Delete All"
            onConfirm={removeSelectedTopics}
            buttonClass="text-destructive hover:border-destructive"
        />
    );
}