import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full max-w-[1000px] flex flex-col items-center justify-center min-h-80 m-8">
            <Skeleton className="h-10 w-52"/>
            <Skeleton className="w-full h-[70vh] rounded-lg m-8" />
        </div>
    );
}