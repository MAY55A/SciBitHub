import { cn } from "@/src/lib/utils";
import { ValidationStatus } from "@/src/types/enums";
import { Check, X, Hourglass } from "lucide-react";

export function ValidationStatusUI({ status, withBorder = false }: { status: ValidationStatus, withBorder?: boolean}) {
    switch (status) {
        case "approved":
            return <span className={cn("flex gap-1 text-xs text-green p-2 rounded-2xl", withBorder ? "border border-green": null)}><Check size={12} /> Approved</span>
        case "rejected":
            return <span className={cn("flex gap-1 text-xs text-destructive p-2 rounded-2xl", withBorder ? "border border-destructive": null)}><X size={12} /> Rejected</span>
        default:
            return <span className={cn("flex gap-1 text-xs text-yellow-400 p-2 rounded-2xl", withBorder ? "border border-yellow-400": null)}><Hourglass size={12} /> Pending...</span>
    }
}