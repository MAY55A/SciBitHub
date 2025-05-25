'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

export function SortByDropdown() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const currentSort = params.get('sort');
    const currentOrderBy = params.get('orderBy');

    const handleSort = (orderBy: string, sort: "asc" | "desc") => {
        params.set('page', '1');
        if (orderBy && sort) {
            params.set('orderBy', orderBy);
            params.set('sort', sort);
        } else {
            params.delete('orderBy');
            params.delete('sort');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size="sm" className="flex items-center gap-2 text-xs">
                    Sort By : {currentOrderBy === "upvotes"
                        ? "most upvoted"
                        : currentOrderBy === "downvotes"
                            ? "most downvoted"
                            : currentOrderBy === "replies"
                                ? "most popular"
                                : currentSort === "asc"
                                    ? "oldest"
                                    : "most recent"
                    }
                    <ChevronDown size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuItem onSelect={() => handleSort("created_at", "desc")}>
                    most recent
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSort("created_at", "asc")}>
                    oldest
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSort("replies", "desc")}>
                    most popular
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSort("upvotes", "desc")}>
                    most upvoted
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSort("downvotes", "desc")}>
                    most downvoted
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}