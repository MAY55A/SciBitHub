import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full flex flex-col gap-8 mx-auto p-6">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="w-full grid lg:grid-cols-2 gap-8">
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
            </div>
        </div>
    );
}