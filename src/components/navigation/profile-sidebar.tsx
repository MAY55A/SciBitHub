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
import { Home, Settings, ChevronRight } from "lucide-react"
import { SidebarNavUser } from "./sidebar-nav-user"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { User } from "@/src/types/models"
import { UserNavSkeleton } from "../skeletons/user-nav-skeleton"

// Menu items.
const menu = [
    {
        title: "Home",
        url: "/profile/home",
        icon: Home,
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
    },
]


export const ProfileSidebar = ({ isActive, inUrl, user }: { isActive: (url: string) => boolean, inUrl: (url: string) => boolean, user: User | null }) => {
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
                                        defaultOpen={true}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem key={item.title}>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} className={inUrl(item.url) ? "text-green" : ""}>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={subItem.url}>
                                                                    {isActive(subItem.url) ?
                                                                        <><ChevronRight className="text-green" /><span className="text-sm">{subItem.title}</span></>
                                                                        : <span >{subItem.title}</span>
                                                                    }
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url} className={isActive(item.url) ? "text-green" : ""}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
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
                                avatar: user.profile_picture || '/images/avatar.png'
                            }} />
                            : <UserNavSkeleton />
                        }
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}