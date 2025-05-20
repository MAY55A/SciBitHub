'use client'

import { BellIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { NotificationItem } from "./notification-item";
import { Button } from "../ui/button";
import { useNotifications } from "@/src/contexts/notification-context";


export function NotificationBell() {
    const { lastNotifications, unreadCount, markAsRead } = useNotifications();

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className="p-2">
                        <BellIcon opacity={0.7} size={20} />
                        {/* Unread counter badge */}
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 border-2 border-primary text-primary text-xs font-medium rounded-lg h-5 w-5 flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-96 m-2">
                    {lastNotifications.length === 0
                        ? <div className="px-4 py-12 text-sm">
                            No notifications available
                        </div>
                        : lastNotifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                            >
                                <NotificationItem notification={n} markAsRead={markAsRead} />
                            </DropdownMenuItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}