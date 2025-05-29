import { removeBookmark } from "@/src/lib/actions/bookmark-actions";
import { formatDate } from "@/src/utils/utils";
import { BookmarkMinus, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";

type CompactBookmarkCardProps = {
    bookmarkId: string;
    itemId: string;
    type: "project" | "discussion";
    title: string;
    description: string;
    date: string;
    onRemove: () => void;
};

export default function CompactBookmarkCard({
    bookmarkId,
    itemId,
    type,
    title,
    description,
    date,
    onRemove
}: CompactBookmarkCardProps) {
    const href = type === "project" ? `/projects/${itemId}` : `/discussions/${itemId}`;
    const icon = type === "project" ? <FileText className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />;

    const handleRemove = async () => {
        const res = await removeBookmark(bookmarkId);
        if (res.success) {
            onRemove();
        }
    }


    return (
        <div className="flex gap-3 border border-border rounded-md p-4 font-retro bg-muted/30 hover:bg-muted/40 transition">
            <div className="mt-1">{icon}</div>
            <div className="flex-1">
                <Link href={href} className="text-sm font-semibold hover:underline">
                    {title}
                </Link>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {description}
                </p>
            </div>
            <div className="flex flex-col justify-between items-end gap-4 text-muted-foreground max-w-[30%]">
                <button
                    onClick={handleRemove}
                    className="hover:text-destructive"
                    title="Remove from bookmarks"
                >
                    <BookmarkMinus className="w-4 h-4" />
                </button>
                <p className="text-xs text-end">bookmarked {formatDate(date, true)} </p>
            </div>
        </div>
    );
}