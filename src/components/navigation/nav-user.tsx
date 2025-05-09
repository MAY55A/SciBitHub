"use client";

import { Button } from "@/src/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserRole } from "@/src/types/enums";
import { getMenu } from "./profile-sidebar";
import { adminMenu } from "./admin-sidebar";



export const signOutAction = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};
export const NavUser = ({
    user,
}: {
    user: {
        name: string
        email: string
        avatar?: string,
        role: UserRole
    }
}) => {

    const menu = user.role === UserRole.ADMIN ? adminMenu : getMenu(user.role);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={"sm"} className="hover:bg-background">
                    <Avatar className="relative flex shrink-0 overflow-hidden h-8 w-8 rounded-lg hover:shadow-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="center"
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
                    {menu.map((item) => (
                        item &&
                        <DropdownMenuItem className="gap-2 text-muted-foreground hover:text-green" onSelect={() => redirect(item.url)} key={item.title}>
                            <item.icon size={15} />
                            {item?.title}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-muted-foreground hover:text-primary" onClick={signOutAction}>
                    <LogOut size={15} />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
