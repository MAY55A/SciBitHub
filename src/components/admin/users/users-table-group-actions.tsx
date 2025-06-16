"use client"

import { Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { deleteUsers } from "@/src/lib/actions/admin/users-actions";
import { useTable } from "@/src/contexts/table-context";

export const UsersGroupActions = () => {
    const table = useTable<TData>();
    const { toast } = useToast();

    const removeSelectedUsers = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedIndexes = [];
        const selectedIds = [];
        const selectedNames = [];
        for (const row of selectedRows) {
            selectedIndexes.push(row.index);
            selectedIds.push(row.original.id);
            selectedNames.push(row.original.name);
        }

        const res = await deleteUsers(selectedIds, selectedNames, "soft");
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
            title="This action CANNOT be undone !"
            description="The selected users' authentication accounts will be permanently deleted. Their data in the system will remain for auditing or record-keeping purposes, but they will no longer be able to log in."
            confirmText="Delete All"
            onConfirm={removeSelectedUsers}
            buttonClass="text-destructive hover:border-destructive"
        />
    );
}