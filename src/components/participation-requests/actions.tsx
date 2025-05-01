"use client"

import { Button } from "../ui/button";
import { Check, Trash2, X } from "lucide-react";
import { CustomAlertDialog } from "../custom/alert-dialog";
import { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import { ValidationStatus } from "@/src/types/enums";
import { hardDeleteRequests, softDeleteRequests, updateRequestsStatus } from "@/src/utils/request-actions";
import ReportFormDialog from "../reports/report-form-dialog";

export function Actions({ status, requests, user, onUpdate, onDelete, canAcceptOrReject }: { status: ValidationStatus, requests: string[], user: string, onUpdate: (status: ValidationStatus) => void, onDelete: () => void, canAcceptOrReject: boolean }) {
    const [pending, setPending] = useState(false);
    const { toast } = useToast()

    const handleUpdateStatus = async (newStatus: ValidationStatus) => {
        setPending(true);
        const res = await updateRequestsStatus(requests, newStatus)
        setPending(false);
        if (res.success) {
            onUpdate(newStatus);
        }
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive"
        });
    }

    const handleDelete = async () => {
        setPending(true);
        let res;
        if (canAcceptOrReject) {
            res = await softDeleteRequests(requests) // soft delete if the user deleting is not the creator of the request
        } else {
            res = await hardDeleteRequests(requests) // hard delete if the user deleting is the creator of the request
        }
        setPending(false);
        if (res.success) {
            onDelete();
        }
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive"
        });
    }

    return (
        <div className="flex gap-4 font-semibold">
            {canAcceptOrReject && status !== ValidationStatus.APPROVED &&
                <Button
                    disabled={pending}
                    variant="outline"
                    size="sm"
                    className="group"
                    onClick={() => handleUpdateStatus(ValidationStatus.APPROVED)}
                >
                    <Check size={15} />
                    <span className="w-0 overflow-hidden whitespace-nowrap transition-width duration-300 ease-in-out group-hover:w-full group-hover:pl-1">
                        Accept
                    </span>
                </Button>}
            {canAcceptOrReject && status !== ValidationStatus.REJECTED &&
                <Button
                    disabled={pending}
                    variant="outline"
                    size="sm"
                    className="group text-primary hover:border-primary"
                    onClick={() => handleUpdateStatus(ValidationStatus.REJECTED)}
                >
                    <X size={15} />
                    <span className="w-0 overflow-hidden whitespace-nowrap transition-width duration-300 ease-in-out group-hover:w-full group-hover:pl-1">
                        Reject
                    </span>
                </Button>
            }

            <CustomAlertDialog
                buttonDisabled={pending}
                buttonIcon={Trash2}
                buttonVariant="outline"
                confirmButtonVariant="destructive"
                title="Are you Sure ?"
                description="This request will be deleted for both the creator and the receiver."
                confirmText="Delete Request"
                onConfirm={() => handleDelete()}
                buttonClass="text-destructive hover:border-destructive"
            />
            {canAcceptOrReject && requests.length === 1 &&
                <ReportFormDialog user={user} id={requests[0]} type="participation request" />
            }
        </div>
    );
}