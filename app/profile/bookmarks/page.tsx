import Bookmarks from "@/src/components/bookmarks/bookmarks";
import { fetchMyBookmarks } from "@/src/lib/fetch-data";
import { Bookmark } from "@/src/types/models";


export default async function BookmarksPage() {
    const bookmarks = await fetchMyBookmarks();
    const projectBookmarks: Bookmark[] = [];
    const discussionBookmarks: Bookmark[] = [];
    bookmarks.forEach((bookmark) => {
        if (bookmark.project) {
            projectBookmarks.push(bookmark);
        } else if (bookmark.discussion) {
            discussionBookmarks.push(bookmark);
        }
    });

    return (
        <Bookmarks initialProjectBookmarks={projectBookmarks} initialDiscussionBookmarks={discussionBookmarks} />
    );
}


