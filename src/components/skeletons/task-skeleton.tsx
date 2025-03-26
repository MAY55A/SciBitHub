import { Skeleton } from "../ui/skeleton";

export default function ProjectsSkeleton() {
    return (
        <div className="w-full max-w-[1000px] grid grid-rows-2 grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="lg:h-64 h-96 col-span-full rounded-lg" />
            <Skeleton className="rounded-lg border" />
            <Skeleton className="rounded-lg border" />
        </div>
    );
}