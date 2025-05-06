"use client"

import { Ellipsis } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Report } from "@/src/types/models";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "@/src/components/custom/alert-dialog";
import { useToast } from "@/src/hooks/use-toast";
import { useState } from "react";
import { ReportStatus } from "@/src/types/enums";
import ReportDetailsDialog from "./report-details-dialog";
import { deleteReport, updateReportStatus } from "@/src/lib/actions/admin/reports-actions";

export function ReportOptionsMenu({
    report, rowIndex, updateRow, removeRow
}: {
    report: Report, rowIndex: number, updateRow: (rowIndex: number, field: string, data: any) => void, removeRow: (rowIndex: number) => void
}) {
    const [showDialog, setShowDialog] = useState("");
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = async () => {
        const res = await deleteReport(report.id!);
        toast({
            title: res.success ? "Success !" : "Error !",
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            removeRow(rowIndex);
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
            updateRow(rowIndex, "status", status)
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
                        }                        {report.status !== ReportStatus.RESOLVED &&
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
                            buttonVariant="ghost"
                            confirmButtonVariant="destructive"
                            title="Are you Sure ?"
                            description="This action cannot be undone."
                            confirmText="Delete Report"
                            onConfirm={handleDelete}
                            buttonClass="h-full hover:text-destructive pl-0"
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