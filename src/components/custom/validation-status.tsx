import { cn } from "@/src/lib/utils";
import { ValidationStatus } from "@/src/types/enums";
import { Check, X, Hourglass } from "lucide-react";
import { Badge } from "../ui/badge";

export function ValidationStatusUI({ status, withBorder = false }: { status: ValidationStatus, withBorder?: boolean}) {
    switch (status) {
        case "approved":
            return <Badge className={cn("flex items-center justify-center gap-1 text-green p-2", withBorder ? "border-green": null)} variant="secondary"><Check size={12} /> Approved</Badge>
        case "rejected":
            return <Badge className={cn("flex items-center justify-center gap-1 text-destructive p-2", withBorder ? "border-destructive": null)} variant="secondary"><X size={12} /> Rejected</Badge>
        default:
            return <Badge className={cn("flex items-center justify-center gap-1 text-yellow-500 p-2", withBorder ? "border-yellow-500": null)} variant="secondary"><Hourglass size={12} /> Pending</Badge>
    }
}