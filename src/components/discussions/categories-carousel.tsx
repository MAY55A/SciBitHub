'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/src/components/ui/carousel"
import { DiscussionCategoriesDescriptions, DiscussionCategory } from "@/src/types/enums"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { cn } from "@/src/lib/utils";

export function CategoriesCarousel() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [, startTransition] = useTransition();
    const params = new URLSearchParams(searchParams);
    const currentcategory = params.get('category') as DiscussionCategory | null;

    const handleFilter = (category: DiscussionCategory | null) => {
        params.set('page', '1');
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        startTransition(() => {
            replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true
            }}
            className="w-full lg:max-w-2xl md:max-w-md max-w-sm"
        >
            <CarouselContent>
                {[null, ...Object.values(DiscussionCategory)].map((category, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4 max-w-48" title={category ? DiscussionCategoriesDescriptions[category] : "All categories"}>
                        <div className="p-1">
                            <Button
                                type="button"
                                variant="ghost"
                                className={cn("w-full h-full flex aspect-square whitespace-normal text-muted-foreground hover:text-green border font-semibold capitalize",
                                    currentcategory === category && "border-green text-green font-bold",
                                )}
                                onClick={(e) => { e.preventDefault(); handleFilter(category); }}
                                disabled={currentcategory === category}
                            >
                                {category ?? "all categories"}
                            </Button>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}