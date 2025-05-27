import { MessageCircleQuestion } from "lucide-react";
import { fetchFeaturedTopics } from "@/src/lib/fetch-data";
import Link from "next/link";

export async function FeaturedTopics({ project }: { project: string }) {
    const topics = await fetchFeaturedTopics(project);

    return (
        <div className="lg:flex-1 overflow-auto flex flex-col gap-2 border-2 border-input rounded-lg bg-muted/30 p-4">
            <h2 className="flex gap-2 items-center text-lg font-semibold text-green mb-4"><MessageCircleQuestion /> Featured Topics</h2>
            {topics.length ?
                topics.map((topic) => (
                    <div key={topic.id} className="flex flex-col gap-2 p-2 pb-4 border-b border-input last:border-b-0 text-sm">
                        <Link href="/topics/[id]" as={`/projects/${topic.project.id}`} className="flex items-center gap-2 font-semibold">
                            <span className="text-xl">&#8227;</span>
                            <span className="hover:underline">{topic.title}</span>
                        </Link>
                        <div className="line-clamp-3 text-muted-foreground">
                            {topic.content}
                        </div>
                    </div>
                )) :
                <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                    No topics are featured yet.
                </div>
            }
        </div>
    );
}