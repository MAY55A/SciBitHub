import { Skeleton } from '@/src/components/ui/skeleton';

export const AccountSettingsSkeleton = () => (
    <form
        className="border rounded-lg p-10 flex flex-col gap-6 w-full mx-12"
    >
        <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-80 mb-2" />
            <Skeleton className="h-40 w-full" />
        </div>
        <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-80 mb-2" />
            <Skeleton className="h-96 w-full" />
        </div>
        <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-80 mb-2" />
            <Skeleton className="h-40 w-full" />
        </div>
        <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-80 mb-2" />
            <Skeleton className="h-72 w-full" />
        </div>
    </form>
);