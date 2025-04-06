import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full flex flex-col gap-8 p-6">
            <h1 className="text-center font-semibold text-lg">Tasks</h1>
            <Skeleton className="h-12 rounded-lg" />
            <h2 className="text-center font-semibold text-lg mt-8">Contributions</h2>
            <Skeleton className="h-64 rounded-lg" />
        </div>
    );
}