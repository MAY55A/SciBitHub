"use client"

import { Comment, User } from "@/src/types/models"
import { formatDate } from "@/src/utils/utils";
import { UserHoverCard } from "../custom/user-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { MarkdownViewer } from "../custom/markdown-viewer";
import { Button } from "../ui/button";
import { Edit2, Reply, Trash2 } from "lucide-react";
import { useState } from "react";
import CommentsList from "./comments-list";
import { CustomAlertDialog } from "../custom/alert-dialog";
import { deleteComment, editComment } from "@/src/lib/actions/comment-actions";
import { useToast } from "@/src/hooks/use-toast";
import { cn } from "@/src/lib/utils";
import { MarkdownEditor } from "../custom/markdown-editor";
import { VoteButtons } from "../votes/vote-buttons";
import ReportFormDialog from "../reports/report-form-dialog";


export function CommentCard({ comment, currentUser, replyingTo, onDelete }: { comment: Comment, currentUser: User | null, replyingTo?: { user: string, comment: string }, onDelete: (id: string) => void }) {
    const [showReplies, setShowReplies] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState<string>(comment.content);
    const [newContent, setNewContent] = useState<string>(content);
    const { toast } = useToast();

    const toggleEdit = async () => {
        setIsEditing(!isEditing);
        setNewContent(content);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await editComment(comment.id, newContent);
        setIsSubmitting(false);
        if (res.success) {
            setIsEditing(false);
            setContent(newContent);
        }
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        const res = await deleteComment(comment.id);
        setIsSubmitting(false);
        if (res.success) {
            onDelete(comment.id);
        }
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });
    }

    const creator = {
        ...comment.creator,
        username: comment.creator.deleted_at ? "**Deleted User**" : comment.creator.username,
    }

    return (
        <div>
            <div className="w-full flex gap-2">
                <Avatar className="flex shrink-0 overflow-hidden h-8 w-8 rounded-lg hover:shadow-lg hover:bg-muted">
                    <AvatarImage src={creator.profile_picture} alt={creator.username} />
                    <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">
                        {creator.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <Card className="w-full px-2 bg-muted/50">
                    <CardHeader className="flex-row justify-between p-0">
                        <div id={comment.id}>
                            <UserHoverCard user={creator} />
                            {!!replyingTo &&
                                <span className="ml-[-7px] text-xs text-muted-foreground">
                                    replied to <a href={`#${replyingTo.comment}`} className="truncate underline">{replyingTo.user}</a>
                                </span>
                            }
                        </div>
                        <div className="flex flex-col items-end text-muted-foreground text-xs text-end  p-1">
                            <span>
                                Posted {formatDate(comment.created_at!, true)}
                            </span>
                            {!!comment.updated_at &&
                                <span>
                                    Modified {formatDate(comment.updated_at, true)}
                                </span>
                            }
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isEditing ?
                            <form onSubmit={handleEdit} className="relative">
                                <MarkdownEditor
                                    value={newContent}
                                    onChange={setNewContent}
                                />
                                <div className="flex justify-end mt-4">
                                    <Button type="submit" size="sm" variant="outline" disabled={!newContent?.trim() || newContent === content} className="absolute bottom-6 right-2 text-xs h-8">
                                        {isSubmitting ? "Saving..." : "Save"}
                                    </Button>
                                </div>
                            </form>
                            :
                            <MarkdownViewer source={content} />
                        }
                    </CardContent>
                    <CardFooter className="flex items-center justify-between gap-2 p-2">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className={cn("flex gap-1 items-center text-xs h-8 px-1", showReplies && "text-green")} disabled={isSubmitting || isEditing} onClick={() => setShowReplies(!showReplies)}>
                                <Reply size={14} />
                                Reply
                            </Button>
                            {currentUser?.id === creator.id && (
                                <>
                                    <Button variant="ghost" size="sm" className="flex gap-1 items-center text-xs h-8 px-1" disabled={isSubmitting} onClick={toggleEdit}>
                                        {isEditing ?
                                            <span className="text-green">Cancel</span> :
                                            <>
                                                <Edit2 size={14} />
                                                Edit
                                            </>}
                                    </Button>
                                    <CustomAlertDialog
                                        buttonClass="flex gap-1 items-center text-xs h-8 px-1"
                                        buttonIcon={Trash2}
                                        buttonVariant="ghost"
                                        triggerText="Delete"
                                        buttonSize="sm"
                                        buttonDisabled={isSubmitting || isEditing}
                                        title="Delete Reply"
                                        description="All associated replies will also be deleted."
                                        confirmText="Confirm"
                                        onConfirm={handleDelete} />
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <VoteButtons voted_id={comment.id!} voted_type="comment" upvotes={comment.upvotes ?? 0} downvotes={comment.downvotes! ?? 0} />
                            {!!currentUser &&
                                <ReportFormDialog user={currentUser.id} id={comment.id} type="comment" />
                            }
                        </div>
                    </CardFooter>
                </Card>
            </div>
            {showReplies &&
                <div className="ml-4">
                    <CommentsList commentedOn={{ parent_comment: comment.id }} replyingTo={{ comment: comment.id, user: creator.username }} />
                </div>
            }
        </div>
    );
}