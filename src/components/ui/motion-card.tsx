"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { LucideIcon } from "lucide-react";

interface CardProps {
    title: string;
    content: string;
    icon: LucideIcon;
    isSelected: boolean;
    onClick: () => void;
}

export default function Card({ title, content, icon: Icon, isSelected, onClick }: CardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "cursor-pointer border rounded-xl p-8 shadow-lg transition-all duration-200 flex flex-col items-start gap-4 w-full max-w-md min-w-48",
                isSelected ? `border-green text-green-700` : "border"
            )}
            onClick={onClick}
        >
            {/* Icon and Title in the same row */}
            <div className={cn("flex items-center gap-4", isSelected ? `text-green` : null)}>
                <Icon className="w-md h-md" />
                <h3 className="font-semibold">{title}</h3>
            </div>

            <p className="text-sm text-muted-foreground font-retro">{content}</p>
        </motion.div>
    );
}