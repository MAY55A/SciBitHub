import { AdminSidebarWrapper } from "@/src/components/navigation/admin-sidebar-wrapper"
import DynamicBreadcrumb from "@/src/components/navigation/bread-crumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar"
import { createClient } from "@/src/utils/supabase/server";
import { Forbidden } from "@/src/components/errors/forbidden";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if(user?.app_metadata.role !== "admin") {
        return Forbidden({message: "You do not have the required permissions to access this page."})
    }

    return (
        <SidebarProvider>
            <AdminSidebarWrapper />
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