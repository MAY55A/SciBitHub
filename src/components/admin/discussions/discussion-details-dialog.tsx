'use client'

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/badge";
import { MarkdownViewer } from "@/src/components/custom/markdown-viewer";
import { FilesDisplay } from "@/src/components/custom/files-display";
import { UserHoverCard } from "@/src/components/custom/user-hover-card";
import { Discussion } from "@/src/types/models";
import { DiscussionStatus } from "@/src/types/enums";
import { format } from "date-fns";


export default function DiscussionDetailsDialog({ discussion, onClose }: { discussion: Discussion, onClose: () => void }) {
    const [open, setOpen] = useState(true);
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (discussion.files && discussion.files.length > 0) {
            const fetchFiles = async () => {
                try {
                    const url = `/api/get-files-with-metadata?${discussion.files!.map((p) => `paths=${encodeURIComponent(p)}`).join("&")}`;
                    const res = await fetch(url);
                    const data = await res.json();
                    setFiles(data);
                } catch (err) {
                    console.error("Failed to load files", err);
                    setFiles([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchFiles();
        } else {
            setLoading(false);
        }
    }, [discussion.files]);

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
                    <DialogTitle>Discussion Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-1 text-sm font-retro">
                    <div><strong>Author: </strong><UserHoverCard user={discussion.creator} /></div>
                    <p><strong>Title: </strong>{discussion.title}</p>
                    <div><strong>Status: </strong>
                        <Badge
                            variant="secondary"
                            className={
                                discussion.status === DiscussionStatus.DELETED
                                    ? "text-destructive border-destructive"
                                    : discussion.status === DiscussionStatus.OPEN
                                        ? "text-green-500 border-green-500"
                                        : "text-orange-500 border-orange-500"
                            }
                        >
                            {discussion.status}
                        </Badge>
                    </div>
                    <p><strong>Created At: </strong> {format(new Date(discussion.created_at!), "PPPpp")}</p>
                    {discussion.updated_at && <p><strong>Updated At: </strong>{format(new Date(discussion.updated_at), "PPPpp")}</p>}
                    {discussion.status === DiscussionStatus.DELETED && <p><strong>Deleted At: </strong>{discussion.deleted_at ? format(new Date(discussion.deleted_at), "PPPpp") : "Just now"}</p>}
                    <p><strong>Category: </strong>{discussion.category}</p>
                    {discussion.tags && discussion.tags.length > 0 && (
                        <p><strong>Tags:</strong> {discussion.tags.join(", ")}</p>
                    )}
                    <div><strong>Content: </strong>
                        <MarkdownViewer source={discussion.body} className="p-2 max-h-60 overflow-y-auto border m-2" />
                    </div>
                    {discussion.files && discussion.files.length > 0 &&
                        <div><strong>Files: </strong>
                            {loading ? "loading..." : files.length === 0 ? "not available now" : <FilesDisplay files={files} />}
                        </div>
                    }
                    <div className="flex gap-2">
                        <p><strong>Replies: </strong>{discussion.replies}</p>
                        <p><strong>Upvotes: </strong><span className="text-green-500">{discussion.upvotes}</span></p>
                        <p><strong>Downvotes: </strong><span className="text-red-500">{discussion.downvotes}</span></p>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}