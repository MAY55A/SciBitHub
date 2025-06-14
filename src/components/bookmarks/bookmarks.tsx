'use client';

import { useState } from 'react';
import { Book, MessagesSquare } from 'lucide-react';
import CompactBookmarkCard from './bookmark-card';
import { Bookmark } from '@/src/types/models';
import { useToast } from '@/src/hooks/use-toast';

export default function Bookmarks({ initialProjectBookmarks, initialDiscussionBookmarks }: { initialProjectBookmarks: Bookmark[], initialDiscussionBookmarks: Bookmark[] }) {
    const [projectBookmarks, setProjectBookmarks] = useState(initialProjectBookmarks);
    const [discussionBookmarks, setDiscussionBookmarks] = useState(initialDiscussionBookmarks);
    const { toast } = useToast();
    const handleRemoveBookmark = (id: string, type: 'project' | 'discussion') => {
        if (type === 'project') {
            setProjectBookmarks((prev) => prev.filter(b => b.id !== id));
        } else {
            setDiscussionBookmarks((prev) => prev.filter(b => b.id !== id));
        }
        toast({
            description: "Bookmark removed successfully.",
            variant: "default",
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-foreground">

            {/* Bookmarked Projects */}
            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
                    <Book className="w-5 h-5" /> Saved Projects
                </h2>

                {projectBookmarks.length ? (
                    <div className="space-y-3 h-80 overflow-y-auto">
                        {projectBookmarks.map((pb) => (
                            <CompactBookmarkCard
                                key={pb.id}
                                bookmarkId={pb.id}
                                itemId={pb.project.id!}
                                type="project"
                                title={pb.project.name}
                                description={pb.project.deleted_at ? "This project has been deleted !" : pb.project.short_description }
                                date={pb.created_at}
                                onRemove={() => handleRemoveBookmark(pb.id, 'project')}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm font-retro">No saved projects yet.</p>
                )}

            </section>

            {/* Bookmarked Discussions */}
            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
                    <MessagesSquare className="w-5 h-5" /> Saved Discussions
                </h2>

                {discussionBookmarks.length ?
                    <div className="space-y-3 h-80 overflow-y-auto">
                        {discussionBookmarks.map((db) => (
                            <CompactBookmarkCard
                                key={db.id}
                                bookmarkId={db.id}
                                itemId={db.discussion.id!}
                                type="discussion"
                                title={db.discussion.title}
                                description={db.discussion.deleted_at ? "This discussion has been deleted !" : db.discussion.body}
                                date={db.created_at}
                                onRemove={() => handleRemoveBookmark(db.id, 'discussion')}
                            />
                        ))
                        }
                    </div> :
                    <p className="text-muted-foreground text-sm font-retro">No saved discussions yet.</p>}
            </section>
        </div>
    );
}