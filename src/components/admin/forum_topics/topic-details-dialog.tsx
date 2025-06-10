"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { ForumTopic } from "@/src/types/models";
import { format } from "date-fns";
import { UserHoverCard } from "@/src/components/custom/user-hover-card";
import { Badge } from "@/src/components/ui/badge";
import Link from "@/src/components/custom/Link";
import { MarkdownViewer } from "@/src/components/custom/markdown-viewer";

export default function TopicDetailsDialog({ topic, onClose }: { topic: ForumTopic, onClose: () => void }) {
    const [open, setOpen] = useState(true);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                !open && onClose()
            }}
        >
            <DialogContent className="max-h-[95vh] overflow-y-auto max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Topic Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-1 text-sm font-retro">
                    <div><strong>Author: </strong><UserHoverCard user={topic.creator} /></div>
                    <div><strong>Status: </strong>
                        <Badge
                            variant="secondary"
                            className={
                                topic.deleted_at
                                    ? "text-destructive border-destructive"
                                    : "text-green-500 border-green-500"
                            }
                        >
                            {topic.deleted_at ? "deleted" : "active"}
                        </Badge>
                    </div>
                    <p><strong>Created At: </strong> {format(new Date(topic.created_at!), "PPPpp")}</p>
                    {topic.updated_at && <p><strong>Updated At: </strong>{format(new Date(topic.updated_at), "PPPpp")}</p>}
                    {topic.deleted_at && <p><strong>Deleted At: </strong>{format(new Date(topic.deleted_at), "PPPpp")}</p>}
                    <p><strong>Project: </strong>
                        <Link href={`/projects/${topic.project.id}`} className="hover:underline">{topic.project.name}</Link>
                    </p>
                    {topic.tags && topic.tags.length > 0 && (
                        <p><strong>Tags:</strong> {topic.tags.join(", ")}</p>
                    )}
                    <div><strong>Content: </strong>
                        <MarkdownViewer source={topic.content} className="p-2 max-h-60 overflow-y-auto border m-2" />
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        <p><strong>Views: </strong>{topic.views}</p>
                        <p><strong>Replies: </strong>{topic.replies}</p>
                        <p><strong>Upvotes: </strong><span className="text-green-500">{topic.upvotes}</span></p>
                        <p><strong>Downvotes: </strong><span className="text-red-500">{topic.downvotes}</span></p>
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    )
}