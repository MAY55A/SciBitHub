import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full flex flex-col gap-8 mx-auto p-6">
            <Skeleton className="h-[60vh] rounded-lg" />
            <Skeleton className="h-12 rounded-lg m-10" />
            <Skeleton className="h-64 rounded-lg" />
        </div>
    );
}