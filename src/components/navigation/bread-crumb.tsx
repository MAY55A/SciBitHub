"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage, BreadcrumbEllipsis } from "@/src/components/ui/breadcrumb";
import { Fragment } from "react";
import Link from "../custom/Link";

export default function DynamicBreadcrumb() {
    const pathname = usePathname(); // Get current URL path
    const segments = pathname.split("/").filter(Boolean); // Remove empty segments
    const items = segments.map((segment, index) => {
        const href = index === segments.length - 1 ? undefined : "/" + segments.slice(0, index + 1).join("/");
        const label = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize segment
        return { href, label };
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) =>
                    item.href ? (
                        <Fragment key={index}>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    asChild
                                    className="max-w-20 truncate md:max-w-none"
                                >
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </Fragment>
                    ) : (
                        <BreadcrumbItem key={index}>
                            <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                                {item.label}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    )
                )}
            </BreadcrumbList>
        </Breadcrumb >
    );
}