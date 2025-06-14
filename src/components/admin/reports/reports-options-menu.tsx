"use client"

import { Ellipsis, TriangleAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Report } from "@/src/types/models";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useState } from "react";
import { ReportStatus } from "@/src/types/enums";
import ReportDetailsDialog from "./report-details-dialog";
import { deleteReport, updateReportStatus } from "@/src/lib/actions/admin/reports-actions";

export function ReportOptionsMenu({
    report, updateRow, removeRow
}: {
    report: Report, updateRow: (field: string, data: any) => void, removeRow: () => void
}) {
    const [showDialog, setShowDialog] = useState("");
    const { toast } = useToast();

    const handleDelete = async () => {
        const res = await deleteReport(report.id!);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            removeRow();
        }
    }

    const handleUpdateStatus = async (status: ReportStatus) => {
        const res = await updateReportStatus(report.id!, status);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            updateRow("status", status)
        }
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0"><Ellipsis size={15} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="px-4"
                            onClick={() => setShowDialog("report-details")}>
                            View report Details
                        </DropdownMenuItem>
                        {report.status !== ReportStatus.REVIEWED &&
                            <DropdownMenuItem
                                className="px-4"
                                onClick={() => handleUpdateStatus(ReportStatus.REVIEWED)}>
                                Mark as Reviewed
                            </DropdownMenuItem>
                        }
                        {report.status !== ReportStatus.RESOLVED &&
                            <DropdownMenuItem
                                className="px-4 hover:text-green"
                                onClick={() => handleUpdateStatus(ReportStatus.RESOLVED)}>
                                Mark as Resolved
                            </DropdownMenuItem>
                        }
                        {report.status !== ReportStatus.DISMISSED &&
                            <DropdownMenuItem
                                className="px-4 hover:text-primary"
                                onClick={() => handleUpdateStatus(ReportStatus.DISMISSED)}>
                                Dismiss
                            </DropdownMenuItem>
                        }

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={(event) => {
                            event.preventDefault(); // Prevent dialog from closing immediately when opened
                        }}
                        className="hover:text-destructive">
                        <CustomAlertDialog
                            triggerText="Delete Report"
                            buttonIcon={TriangleAlert}
                            buttonVariant="ghost"
                            confirmButtonVariant="destructive"
                            title="This action CANNOT be undone !"
                            description="The report will be deleted permanently and all traces of it will be lost."
                            confirmText="Delete Report"
                            onConfirm={handleDelete}
                            buttonClass="h-full text-destructive pl-0"
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
            {showDialog === "report-details" &&
                <ReportDetailsDialog
                    report={report}
                    onClose={() => setShowDialog("")} />
            }
        </div >
    )
}