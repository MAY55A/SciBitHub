"use client"

import { Button } from "../ui/button";
import { Check, Flag, Trash2, X } from "lucide-react";
import { deleteContributions, updateContributionStatus } from "@/src/utils/contribution-actions";
import { CustomAlertDialog } from "../custom/alert-dialog";
import { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import { ValidationStatusUI } from "../custom/validation-status";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { ValidationStatus } from "@/src/types/enums";



export function StatusWithActions({ contribution, initialStatus }: { contribution: string, initialStatus: ValidationStatus }) {
    const [status, setStatus] = useState(initialStatus);
    const router = useRouter();

    return (
        <div className="w-full flex gap-4 items-center justify-between mt-8">
            <div className="rounded-2xl shadow-md font-bold uppercase tracking-[.1em] text-xs">
                <ValidationStatusUI status={status} withBorder={true} />
            </div>
            <Actions onUpdate={setStatus} status={status} contributions={[contribution]} onDelete={() => router.back()} />
        </div>
    );
}

export function Actions({ status, contributions, onUpdate, onDelete, showText = true }: { status: ValidationStatus, contributions: string[], onUpdate: (status: ValidationStatus) => void, onDelete: () => void, showText?: boolean }) {
    const [pending, setPending] = useState(false);
    const { toast } = useToast()
    const handleUpdateStatus = async (newStatus: ValidationStatus) => {
        setPending(true);
        const res = await updateContributionStatus(contributions, newStatus)
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
        const res = await deleteContributions(contributions)
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
            {status !== ValidationStatus.APPROVED &&
                <Button
                    disabled={pending}
                    variant="outline"
                    size="sm"
                    className="group"
                    onClick={() => handleUpdateStatus(ValidationStatus.APPROVED)}
                >
                    <Check size={15} />
                    <span className=
                        {cn(showText ?
                            "pl-1" :
                            "w-0 overflow-hidden whitespace-nowrap transition-width duration-300 ease-in-out group-hover:w-full group-hover:pl-1"
                        )}>
                        Accept
                    </span>
                </Button>}
            {status !== ValidationStatus.REJECTED &&
                <Button
                    disabled={pending}
                    variant="outline"
                    size="sm"
                    className="group text-primary hover:border-primary"
                    onClick={() => handleUpdateStatus(ValidationStatus.REJECTED)}
                >
                    <X size={15} />
                    <span className=
                        {cn(showText ?
                            "pl-1" :
                            "w-0 overflow-hidden whitespace-nowrap transition-width duration-300 ease-in-out group-hover:w-full group-hover:pl-1"
                        )}>
                        Reject
                    </span>
                </Button>
            }

            <CustomAlertDialog
                buttonDisabled={pending}
                buttonIcon={Trash2}
                triggerText= {showText ? "Delete" : undefined}
                buttonVariant="outline"
                confirmButtonVariant="destructive"
                title="Are you Sure ?"
                description="All data and attached files will be permanently deleted."
                confirmText="Delete Contribution"
                onConfirm={() => handleDelete()}
                buttonClass="text-destructive hover:border-destructive"
            />
            <Button
                variant="ghost"
                size="sm"
                title="report"
            >
                <Flag size={15} color="red" opacity={0.5} />
            </Button>
        </div>
    );
}