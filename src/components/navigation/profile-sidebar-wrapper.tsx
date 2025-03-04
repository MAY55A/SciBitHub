"use client"

import { usePathname } from "next/navigation"
import { ProfileSidebar } from "./profile-sidebar"
import { useAuth } from "@/src/contexts/AuthContext";

export const ProfileSidebarWrapper = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const isActive = (url: string) => pathname === url;
    const inUrl = (url: string) => pathname.includes(url);


    return <ProfileSidebar isActive={isActive} inUrl={inUrl} user={user} />


}