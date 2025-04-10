import { Discussion } from "@/src/types/models"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Link from "../custom/Link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/src/utils/utils";
import ShinyText from "../ui/shiny-text";
import { DiscussionDropdownMenu } from "./discussion-options-menu";
import { UserHoverCard } from "../custom/user-hover-card";


export function DiscussionCard({ discussion, editable = false }: { discussion: Discussion, editable?: boolean }) {

    const formattedDate = formatDate(discussion.created_at!);
    return (
        <Card
            className="relative max-w-[400px] border-2 text-sm shadow-lg rounded-lg shadow-muted transform transition-all hover:scale-105 hover:shadow-2xl hover:shadow-muted"
        >
            <CardHeader>
                {editable &&
                    <div className="flex flex-row items-center justify-between pb-4">
                        <ShinyText text={discussion.category} disabled={false} speed={4} className='max-w-48 break-words text-center text-green font-semibold uppercase tracking-[.1em] text-xs border border-green rounded-2xl px-3 py-2' />
                        <DiscussionDropdownMenu discussion={discussion} />
                    </div>}
                <span className="italic text-muted-foreground text-xs mb-4">
                    Posted at {formattedDate}
                </span>
                {!editable &&
                    <div><strong className="text-muted-foreground">Author :</strong> <UserHoverCard user={discussion.creator} /></div>
                }
            </CardHeader>
            <CardContent>
                <Link href="/discussions/[id]" as={`/discussions/${discussion.id}`}>
                    <h2
                        className="flex text-base font-bold mb-4"
                    >
                        <ChevronRight size={18} className="mt-1 pr-1" />
                        {discussion.title}
                    </h2></Link>

                <p
                    className="text-muted-foreground max-h-40 overflow-hidden whitespace-normal pl-2"
                >
                    {discussion.body}
                </p>
            </CardContent>
            <CardFooter>
                <div className="flex flex-wrap gap-2">
                    {discussion.tags && discussion.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs font-semibold border p-2 rounded-3xl"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
}