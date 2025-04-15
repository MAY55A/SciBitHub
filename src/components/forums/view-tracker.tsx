'use client';

import { createClient } from '@/src/utils/supabase/client';
import { useEffect } from 'react';

export default function ViewTracker({ topicId }: { topicId: string }) {
    useEffect(() => {
        const key = `viewed-topic-${topicId}`;

        if (!sessionStorage.getItem(key)) {
            const supabase = createClient();
            supabase.rpc('increment_views', { topic_id: topicId }).then(({ data, error }) => {
                if (error) console.error("Failed to add view:", error);
                if (data) console.error("add view:", data);
            });;
            sessionStorage.setItem(key, "true");
        }
    }, [topicId]);

    return null;
}