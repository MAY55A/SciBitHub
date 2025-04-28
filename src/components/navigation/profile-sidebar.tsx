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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/src/components/ui/sidebar"
import { Home, Settings, ChevronRight, Bookmark, MessagesSquare, LibraryBig, ClipboardList } from "lucide-react"
import { SidebarNavUser } from "./sidebar-nav-user"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { User } from "@/src/types/models"
import { UserNavSkeleton } from "../skeletons/user-nav-skeleton"
import Link from "next/link"
import { UserRole } from "@/src/types/enums"


export const ProfileSidebar = ({ inUrl, user }: { inUrl: (url: string) => boolean, user: User | null }) => {
    // Menu items.
    const menu = [
        {
            title: "Home",
            url: "/profile/home",
            icon: Home,
        },
        {
            title: user?.role === UserRole.RESEARCHER ? "My Projects" : "My Contributions",
            url: user?.role === UserRole.RESEARCHER ? "/profile/projects" : "/profile/contributions",
            icon: user?.role === UserRole.RESEARCHER ? LibraryBig : ClipboardList,
            items: user?.role === UserRole.RESEARCHER ? [
                {
                    title: "Published",
                    url: "/profile/projects?status=published",
                },
                {
                    title: "Pending",
                    url: "/profile/projects?status=pending",
                },
                {
                    title: "Draft",
                    url: "/profile/projects?status=draft",
                },
            ] : [],
            open: true
        },
        {
            title: "My Discussions",
            url: "/profile/discussions",
            icon: MessagesSquare,
            items: [
                {
                    title: "Open",
                    url: "/profile/discussions?status=open",
                },
                {
                    title: "Closed",
                    url: "/profile/discussions?status=closed",
                },
            ],
            open: true
        },
        {
            title: "My Bookmarks",
            url: "/profile/bookmarks",
            icon: Bookmark,
        },
        {
            title: "Settings",
            url: "/profile/settings",
            icon: Settings,
            items: [
                {
                    title: "General",
                    url: "/profile/settings",
                },
                {
                    title: "Reset Password",
                    url: "/profile/settings/reset-password",
                },
                {
                    title: "Delete Account",
                    url: "/profile/settings/delete-account",
                },
            ],
            open: false
        },
    ]
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-green text-md">My Profile</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menu.map((item) => (
                                item.items ? (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={item.open}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem key={item.title}>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} className={inUrl(item.url) ? "text-green" : ""}>
                                                    <Link href={item.url} className="flex items-center gap-2">
                                                        {item.icon && <item.icon size={16} />}
                                                        <span className="truncate">{item.title}</span>
                                                    </Link>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href={subItem.url}>
                                                                    {inUrl(subItem.url) ?
                                                                        <><ChevronRight className="text-green" /><span className="text-sm">{subItem.title}</span></>
                                                                        : <span >{subItem.title}</span>
                                                                    }
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton tooltip={item.title} asChild>
                                            <Link href={item.url} className={inUrl(item.url) ? "text-green" : ""}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
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