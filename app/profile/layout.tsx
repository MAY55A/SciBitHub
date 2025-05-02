import DynamicBreadcrumb from "@/src/components/navigation/bread-crumb"
import { ProfileSidebarWrapper } from "@/src/components/navigation/profile-sidebar-wrapper"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/src/components/ui/sidebar"
import { createClient } from "@/src/utils/supabase/server";
import { Forbidden } from "@/src/components/errors/forbidden";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if(!user) {
        redirect("/login")
    }

    if(user.app_metadata.role === "admin") {
        return Forbidden({message: "You are not allowed to access this page with an admin account."})
    }

    return (
        <SidebarProvider>
            <ProfileSidebarWrapper />
            <SidebarInset>
                <div className="fixed w-full flex h-16 z-20 shrink-0 items-center gap-2 px-4 bg-background/70 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <SidebarTrigger className="-ml-1" />
                    <span className="text-muted-foreground text-sm">|</span>
                    <DynamicBreadcrumb />
                </div>
                <div className="flex justify-center p-4 mt-14">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}