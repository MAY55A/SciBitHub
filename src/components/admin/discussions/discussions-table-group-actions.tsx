"use client"

import { Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { deleteDiscussions } from "@/src/lib/actions/admin/discussions-actions";
import { useTable } from "@/src/contexts/table-context";
import { Discussion } from "@/src/types/models";

export const DiscussionsGroupActions = () => {
    const table = useTable<Discussion>();
    const { toast } = useToast();

    const removeSelectedDiscussions = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedIndexes: number[] = [];
        const selectedIds: string[] = [];
        for (const row of selectedRows) {
            selectedIndexes.push(row.index);
            selectedIds.push(row.original.id!);
        }

        const res = await deleteDiscussions(selectedIds, "soft");
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive"
        });
        if (res.success) {
            table.resetRowSelection();
            table.options.meta?.updateData!(selectedIndexes, "status", "deleted");
        }

    }
    return (
        <CustomAlertDialog
            buttonIcon={Trash2}
            triggerText="Delete selected"
            buttonVariant="outline"
            confirmButtonVariant="destructive"
            title="Are you Sure ?"
            description="All selected discussions will be deleted, but they still can be restored later."
            confirmText="Delete All"
            onConfirm={removeSelectedDiscussions}
            buttonClass="text-destructive hover:border-destructive"
        />
    );
}