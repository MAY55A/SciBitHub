"use client";

import { cn } from "@/src/lib/utils";

export const SquareLoader = ({
    className,
    size = "md",
    speed = "normal"
}: {
    className?: string;
    size?: "sm" | "md" | "lg";
    speed?: "slow" | "normal" | "fast";
}) => {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-14 h-14",
    };

    const speedClasses = {
        slow: "animate-[spin_3s_linear_infinite]",
        normal: "animate-[spin_2s_linear_infinite]",
        fast: "animate-[spin_1s_linear_infinite]",
    };

    return (
        <div className={cn(
            "relative",
            sizeClasses[size],
            speedClasses[speed],
            className
        )}>
            {/* Orange moving line (top) */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/50 animate-loader-line animate-[loader-pulse_1.5s_infinite] origin-left scale-x-0" />

            {/* Green moving line (right) */}
            <div className="absolute top-0 right-0 bottom-0 w-0.5 bg-green/50 animate-loader-line animate-[loader-pulse_1.5s_0.5s_infinite] origin-top scale-y-0 animation-delay-100" />

            {/* Orange moving line (bottom) */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50 animate-loader-line animate-[loader-pulse_1.5s_0.25s_infinite] origin-right scale-x-0 animation-delay-200" />

            {/* Green moving line (left) */}
            <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-green/50 animate-loader-line animate-[loader-pulse_1.5s_0.75s_infinite] origin-bottom scale-y-0 animation-delay-300" />
        </div>
    );
};