"use client"

import { Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useTable } from "@/src/contexts/table-context";
import { deleteRequests } from "@/src/lib/actions/request-actions";

export const RequestsGroupActions = ({isProjectTable = false}: {isProjectTable?: boolean}) => {
    const table = useTable<TData>();
    const { toast } = useToast();

    const removeSelectedRequests = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedIndexes = [];
        const selectedIds = [];
        for (const row of selectedRows) {
            selectedIndexes.push(row.index);
            selectedIds.push(row.original.id);
        }

        const res = await deleteRequests(selectedIds, isProjectTable);
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
            description="Requests that you created and that are not approved yet will be deleted permanently. However, other requests will still be visible but marked as deleted for both the sender and the recipient."
            confirmText="Delete All"
            onConfirm={removeSelectedRequests}
            buttonClass="text-destructive hover:border-destructive"
        />
    );
}