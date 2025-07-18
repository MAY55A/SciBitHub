import {
    Bell,
    ChevronsUpDown,
    CircleUser,
    LogOut,
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/src/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
    SidebarMenuButton,
    useSidebar,
} from "@/src/components/ui/sidebar"
import { signOutAction } from "./nav-user"
import { redirect } from "next/navigation"
import { UserRole } from "@/src/types/enums"
export function SidebarNavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar?: string,
        role: string
    }
}) {
    const { isMobile } = useSidebar()
    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-primary hover:text-primary"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">
                            {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">
                                {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className="gap-2 text-muted-foreground hover:text-green"
                        onSelect={() => redirect(user.role === UserRole.ADMIN ? "/admin" : "/profile")}
                    >
                        <CircleUser size={15} />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2 text-muted-foreground hover:text-green"
                        onSelect={() => redirect(user.role === UserRole.ADMIN ? "/admin/notifications" : "/profile/notifications")}
                    >
                        <Bell size={15} />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-muted-foreground hover:text-primary" onClick={signOutAction}>
                    <LogOut size={15} />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}