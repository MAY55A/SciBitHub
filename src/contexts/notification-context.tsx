'use client'

import { ToastAction } from '@radix-ui/react-toast';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { parseNotification } from '@/src/components/notifications/notification-item';
import { useToast } from '@/src/hooks/use-toast';
import { useAuth } from './AuthContext';
import { createClient } from '@/src/utils/supabase/client';
import { Notification } from '@/src/types/models';

type NotificationContextType = {
    notifications: Notification[];
    lastNotifications: Notification[];
    unreadCount: number;
    loadMore: () => Promise<void>;
    hasMore: boolean;
    markAsRead: (id: string) => Promise<void>;
    isLoading: boolean;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const supabase = createClient();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [realtimeCount, setRealtimeCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const lastNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

    const PAGE_SIZE = 10;
    const selectQuery = `
        *,  
        user:user_id (id, username, profile_picture, deleted_at),
        project:project_id (id, name),
        forum_topic:topic_id (id, title),
        comment:comment_id (id, content),
        task:task_id (id, title),
        discussion:discussion_id (title)
    `;

    const fetch = useCallback(async (offset: number, limit: number) => {
        setIsLoading(true);
        const { data, count } = await supabase
            .from('notifications')
            .select(selectQuery, { count: 'exact' })
            .or(`recipient_id.eq.${user?.id},type.eq.to_all_${user?.role}s,type.eq.to_all_users`)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1); // Correct range calculation
        setIsLoading(false);
        return { data: data || [], total: count || 0 };
    }, [user?.id]);

    const loadMore = async () => {
        // Calculate adjusted offset accounting for realtime inserts
        const adjustedOffset = (page * PAGE_SIZE) + realtimeCount;
        const { data, total } = await fetch(adjustedOffset, PAGE_SIZE);

        setNotifications(prev => [...prev, ...data]);
        setHasMore(total > adjustedOffset + PAGE_SIZE);
        setPage(prev => prev + 1);
    };

    const markAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Real-time listener
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel('realtime-notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `or(recipient_id.eq.${user?.id},type.eq.to_all_${user?.role}s,type.eq.to_all_users)`
            }, async (payload) => {
                // Fetch the full joined notification
                const { data: notification } = await supabase
                    .from('notifications')
                    .select(selectQuery)
                    .eq('id', payload.new.id)
                    .single();

                if (notification) {
                    // Update local state
                    setNotifications(prev => [notification, ...prev]); // Page shows all
                    setUnreadCount(prev => prev + 1);
                    setRealtimeCount(prev => prev + 1); // Increment realtime counter
                    // Show toast
                    toast({
                        description: parseNotification(notification),
                        duration: 900000, // 15 minutes
                        action: notification.action_url && <ToastAction onClick={notification.action_url} altText='View' >View</ToastAction>
                    });
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user?.id]);

    // Initial load
    useEffect(() => {
        if (user && !notifications.length) {
            const loadInitial = async () => {
                const { data, total } = await fetch(0, PAGE_SIZE);
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_read).length);
                setHasMore(total > PAGE_SIZE);
            };
            loadInitial();
        }
    }, [user?.id]);

    return (
        <NotificationContext.Provider value={{ notifications, lastNotifications, unreadCount, loadMore, hasMore, markAsRead, isLoading }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};