import { Skeleton } from "../ui/skeleton";

export default function ProjectsSkeleton() {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
        </div>
    );
}