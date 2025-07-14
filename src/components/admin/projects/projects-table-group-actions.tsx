"use client"

import { Trash2 } from "lucide-react";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { softDeleteProjects } from "@/src/lib/actions/admin/projects-actions";
import { useTable } from "@/src/contexts/table-context";
import { Project } from "@/src/types/models";

export const ProjectsGroupActions = () => {
    const table = useTable<Project>();
    const { toast } = useToast();

    const removeSelectedProjects = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedIndexes: number[] = [];
        const selectedIds: string[] = [];
        const selectedNames: string[] = [];
        for (const row of selectedRows) {
            selectedIndexes.push(row.index);
            selectedIds.push(row.original.id!);
            selectedNames.push(row.original.name);
        }

        const res = await softDeleteProjects(selectedIds, selectedNames);
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
            description="All selected projects will be deleted, but they still can be restored later."
            confirmText="Delete All"
            onConfirm={removeSelectedProjects}
            buttonClass="text-destructive hover:border-destructive"
        />
    );
}