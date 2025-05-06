"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Report } from "@/src/types/models";
import { format } from "date-fns";
import { UserHoverCard } from "@/src/components/custom/user-hover-card";
import { Badge } from "../../ui/badge";
import { ReportStatus } from "@/src/types/enums";
import Link from "../../custom/Link";

export default function ReportDetailsDialog({ report, onClose }: { report: Report, onClose: () => void }) {
    const [open, setOpen] = useState(true);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                !open && onClose()
            }}
        >
            <DialogContent className="max-h-[95vh] overflow-y-auto max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Report Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-1 text-sm">
                    <div><strong>Reporter: </strong><UserHoverCard user={report.reporter} /></div>
                    <div><strong>Status: </strong>
                        <Badge
                            variant="secondary"
                            className={
                                report.status === ReportStatus.DISMISSED
                                    ? "text-destructive border-destructive"
                                    : report.status === ReportStatus.RESOLVED
                                        ? "text-green-500 border-green-500"
                                        : report.status === ReportStatus.PENDING
                                            ? "text-yellow-500 border-yellow-500"
                                            : "text-orange-500 border-orange-500"
                            }
                        >
                            {report.status}
                        </Badge>
                    </div>
                    <p><strong>Reported At: </strong> {format(new Date(report.created_at!), "PPPpp")}</p>
                    <p><strong>Reason: </strong><span>{report.reason}</span></p>
                    {report.description && <p><strong>Description: </strong>{report.description}</p>}
                    <p><strong className="capitalize">Reported {report.reported_type}: </strong>
                        <Link href={report.reported_link} className="hover:underline">
                            view {report.reported_type}
                        </Link>
                    </p>
                </div>
            </DialogContent >
        </Dialog >
    )
}