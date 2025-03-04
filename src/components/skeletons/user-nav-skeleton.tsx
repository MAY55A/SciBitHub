import { Skeleton } from "../ui/skeleton"

export const UserNavSkeleton = () => {
    return (
        <div className="flex items-center space-x-2 p-2">
            <Skeleton className="h-8 w-8 bg-gray-200  rounded-lg animate-pulse"/>
            <div className="flex-1 space-y-1">
                <Skeleton className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"/>
                <Skeleton className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"/>
            </div>
        </div>
    )
}