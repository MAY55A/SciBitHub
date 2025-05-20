'use client'

import { NotificationItem } from '@/src/components/notifications/notification-item';
import { useNotifications } from '@/src/contexts/notification-context';
import { cn } from '@/src/lib/utils';
import { BellOffIcon, Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Notifications() {
    const { notifications, unreadCount, loadMore, hasMore, markAsRead, isLoading } = useNotifications();
    const [ref, inView] = useInView();

    useEffect(() => {
        if (inView && hasMore) {
            loadMore();
        }
    }, [inView, hasMore]);

    if (notifications.length === 0) {
        if(isLoading) {
            return (
                <div className="h-[50vh] flex flex-col gap-4 justify-center items-center">
                    <Loader className="h-5 w-5 animate-spin" />
                </div>
            );
        }
        return (
            <div className="h-[50vh] flex flex-col gap-4 justify-center items-center">
                <p className="text-lg text-muted-foreground">No notifications available</p>
                <BellOffIcon className="text-muted-foreground" size={30} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1000px] mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">
                Notifications <span className='text-sm text-primary'>{unreadCount > 0 && `(${unreadCount} unread)`}</span>
            </h1>

            <div className="space-y-3">
                {notifications.map(notification => (
                    <div className={cn('rounded-lg border p-4', !notification.is_read && 'bg-muted')} key={notification.id}>
                        <NotificationItem
                            notification={notification}
                            markAsRead={markAsRead}
                        />
                    </div>
                ))}
            </div>

            {/* Infinite scroll loader */}
            <div ref={ref} className="py-6 flex justify-center">
                {hasMore ? (
                    <Loader className="h-5 w-5 animate-spin" />
                ) : notifications.length > 6 && (
                    <p className="text-muted-foreground text-sm">No more notifications</p>
                )}
            </div>
        </div>
    );
}