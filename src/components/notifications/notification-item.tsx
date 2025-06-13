import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDate } from '@/src/utils/utils';
import { Notification } from '@/src/types/models';
import { redirect, RedirectType } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { CheckCheck } from 'lucide-react';

export function NotificationItem({ notification, markAsRead }: { notification: Notification, markAsRead: (id: string) => void }) {
    const handleClick = () => {
        markAsRead(notification.id);
        if (notification.action_url) {
            redirect(notification.action_url, RedirectType.push);
        }
    };

    return (
        <div
            className={cn('z-60 flex items-start gap-3 p-3 rounded-lg', !notification.is_read && 'bg-muted/50')}
            onClick={handleClick}
        >
            {notification.user && (
                <Avatar className="relative flex shrink-0 overflow-hidden h-8 w-8 rounded-lg hover:shadow-lg">
                    <AvatarImage src={notification.user.profile_picture ?? undefined} alt="avatar" />
                    <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">{notification.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>)}
            <div className="flex-1 font-retro text-sm">
                {parseNotification(notification)}
                <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(notification.created_at, true)}
                </p>
            </div>
            {!notification.is_read &&
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 rounded-full bg-muted"
                    title='Mark as read'
                    onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                        notification.is_read = true;
                    }}
                >
                    <CheckCheck className="h-4 w-4" />
                </Button>
            }
        </div>
    );
}

export function parseNotification(
    notification: Notification,
) {
    const parts = notification.message_template.split(" ");
    return parts.map((part, i) => {
        if (part.startsWith('{') && part.endsWith('}')) {
            try { // if it is at the end of a phrase, make sure there is no dot exactly after } ({user.username} is valid, {user.username}. is not)
                const keys = part.slice(1, -1).split('.'); // ex: 'user.username' => ['user', 'username']
                const entity = notification[keys[0] as keyof Notification]; // ex: user object
                if (!entity) return "";
                const text = entity[keys[1]] as String; // ex: => user.username = 'John Doe'
                if (!text) return "";

                return (
                    <Link
                        key={i}
                        href={`/${keys[0]}s/${entity.id}`} // ex: '/users/123'
                        className={cn('hover:underline font-medium', keys[0] === 'user' ? 'text-primary' : 'text-green')}
                        onClick={(e) => e.stopPropagation()} // Prevent parent link triggering
                    >
                        {text.length > 50 ? text.slice(0, 50) + "... " : text + " "}
                    </Link>
                );
            } catch (error) {
                console.log("Error parsing notification part:", part, error);
                return "";
            }
        }
        return part + " "; // Add space after each part
    });
}