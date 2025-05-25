'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/src/components/ui/carousel"
import { ProjectDomain } from "@/src/types/enums"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/src/lib/utils";

export function DomainsCarousel() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const currentDomain = params.get('domain') as ProjectDomain | null;

    const handleFilter = (domain : ProjectDomain | null) => {
        params.set('page', '1');
        if (domain) {
            params.set('domain', domain);
        } else {
            params.delete('domain');
        }
        replace(`${pathname}?${params.toString()}`);
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
                {[null, ...Object.values(ProjectDomain)].map((domain, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4 max-w-48">
                        <div className="p-1">
                            <Button
                                variant="ghost"
                                className={cn("w-full h-full flex aspect-square whitespace-normal text-muted-foreground hover:text-green border font-semibold",
                                    currentDomain === domain && "border-green text-green font-bold",
                                )}
                                onClick={() => handleFilter(domain)}
                                disabled={currentDomain === domain}
                            >
                                {domain ?? "All Domains"}
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