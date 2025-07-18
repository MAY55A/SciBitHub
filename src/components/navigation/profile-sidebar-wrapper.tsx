"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { ProfileSidebar } from "./profile-sidebar"
import { useAuth } from "@/src/contexts/AuthContext";

export const ProfileSidebarWrapper = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams().toString();
    const currentUrl = searchParams ? `${pathname}?${searchParams}` : pathname;

    const inUrl = (url: string) => currentUrl.includes(url);

    return <ProfileSidebar inUrl={inUrl} user={user} />
}