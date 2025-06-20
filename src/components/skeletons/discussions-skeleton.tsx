import { Skeleton } from "../ui/skeleton";

export default function DiscussionsSkeleton() {
    return (
        <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-8">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
        </div>
    );
}