import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import { Home, Settings, MessagesSquare, LibraryBigIcon, MessageCircleQuestion, Flag, Users } from "lucide-react"
import { SidebarNavUser } from "./sidebar-nav-user"
import { User } from "@/src/types/models"
import { UserNavSkeleton } from "../skeletons/user-nav-skeleton"
import Link from "next/link"


export const AdminSidebar = ({ inUrl, user }: { inUrl: (url: string) => boolean, user: User | null }) => {
    // Menu items.
    const menu = [
        {
            title: "Home",
            url: "/admin/home",
            icon: Home,
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: Users,
        },
        {
            title: "Projects",
            url: "/admin/projects",
            icon: LibraryBigIcon,
        },
        {
            title: "Discussions",
            url: "/admin/discussions",
            icon: MessagesSquare,
        },
        {
            title: "Forum topics",
            url: "/admin/forum_topics",
            icon: MessageCircleQuestion,
        },
        {
            title: "Reports",
            url: "/admin/reports",
            icon: Flag,
        },
        {
            title: "Settings",
            url: "/admin/settings",
            icon: Settings,
        },
    ]
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-green text-md">Admin Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menu.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title} asChild>
                                        <Link href={item.url} className={inUrl(item.url) ? "text-green" : ""}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {user ?
                            <SidebarNavUser user={{
                                name: user.username,
                                email: user.email,
                                avatar: user.profile_picture
                            }} />
                            : <UserNavSkeleton />
                        }
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}