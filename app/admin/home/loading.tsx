import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
    return (
        <div className='container flex max-w-7xl flex-col space-y-4 p-4'>
            <div className='flex flex-1 flex-col space-y-2'>
                <div className='flex items-center justify-between space-y-2'>
                    <h2 className='text-2xl font-bold tracking-tight'>
                        Overview
                    </h2>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-56"></Skeleton>
                <Skeleton></Skeleton>
                <Skeleton></Skeleton>
                <Skeleton></Skeleton>
                <Skeleton></Skeleton>
            </div>
        </div>
    );
}