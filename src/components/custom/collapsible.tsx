'use client'

import { cn } from "@/src/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function CustomCollapsible({ triggerText, button, children }: { triggerText: string, button?: React.ReactNode, children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="w-full">
            <div className="flex items-center justify-between border-b py-2">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center text-lg font-semibold hover:underline transition-all"
                >
                    {triggerText}
                    <ChevronDown
                        className={`ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </button>
                {button && <div>{button}</div>}
            </div>
            <div className={cn("overflow-hidden transition-all duration-300", open ? "max-h-full opacity-100" : "max-h-0 opacity-0")}>
                {children}
            </div>
        </div>
    );
}