"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useAuth } from "@/src/contexts/AuthContext";
import { AdminSidebar } from "./admin-sidebar";

export const AdminSidebarWrapper = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams().toString();
    const currentUrl = searchParams ? `${pathname}?${searchParams}` : pathname;

    const inUrl = (url: string) => currentUrl.includes(url);

    return <AdminSidebar inUrl={inUrl} user={user} />
}