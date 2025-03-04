"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from "@/src/components/ui/breadcrumb";
import React from "react";

export default function DynamicBreadcrumb() {
    const pathname = usePathname(); // Get current URL path
    const segments = pathname.split("/").filter(Boolean); // Remove empty segments
    const baseLink = "/" + segments.shift();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Always show the Home link */}
                <BreadcrumbItem>
                    <BreadcrumbLink href={baseLink}>Profile</BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, index) => {
                    const href = baseLink + "/" + segments.slice(0, index + 1).join("/");
                    const isLast = index === segments.length - 1;
                    const label = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize segment
                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}