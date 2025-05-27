import { Tag } from "lucide-react";
import { fetchForumTopicsTags } from "@/src/lib/fetch-data";

export async function PopularTags({ project }: { project: string }) {
    const tags = await fetchForumTopicsTags(project);

    return (
        <div className="max-h-80 overflow-auto flex flex-col gap-2 border-2 border-input rounded-lg bg-muted/30 p-4">
            <h2 className="flex gap-2 items-center text-lg font-semibold text-green mb-4"><Tag size={16} /> Tags</h2>
            <div className="flex flex-wrap gap-2 text-sm font-retro">
                {tags.length ?
                tags.map((tag) => (
                    <a href={`/projects/${project}?tab=forum&tag=${tag}`} className="underline hover:text-green" key={tag}>
                        #{tag}
                    </a>
                )) :
                <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                    No tags are available yet.
                </div>
            }</div>
        </div>
    );
}