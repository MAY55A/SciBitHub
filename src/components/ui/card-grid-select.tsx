"use client";

import { useState } from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/src/lib/utils";

interface CardGridSelectProps {
    options: { title: string; description: string }[];
    value: string[];
    showDescription: boolean;
    onChange: (selected: string[]) => void;
}

export default function CardGridSelect({ options, value, showDescription, onChange }: CardGridSelectProps) {
    const [selected, setSelected] = useState(value);

    const toggleSelection = (title: string) => {
        const newSelected = selected.includes(title)
            ? selected.filter((item) => item !== title)
            : [...selected, title];
        value = newSelected;
        setSelected(newSelected);
        onChange(newSelected);
    };

    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
            {options.map(({ title, description }) => (
                <Card
                    key={title}
                    className={cn(
                        "p-4 cursor-pointer border-2 transition-all",
                        selected.includes(title) ? "border-green" : "border-border",
                    )}
                    onClick={() => toggleSelection(title)}
                >
                    <CardContent className={cn(showDescription ? null : "p-2 text-sm text-center")}>
                        <h3
                            className={cn(
                                "font-semibold",
                                selected.includes(title) ? "text-green" : null,
                            )}>{title}</h3>
                        {showDescription && <p className="text-sm text-muted-foreground font-retro">{description}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}