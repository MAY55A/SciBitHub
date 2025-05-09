
import { Suspense } from "react";
import TopicsTable from "@/src/components/admin/forum_topics/topics-table";
import { MostActiveForums } from "@/src/components/admin/stats/most-active-forums";
import { ForumsInteractionsChart } from "@/src/components/admin/stats/forums-interactions-chart";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ForumsInteractionsChart />
                <MostActiveForums />
            </div>
            <Suspense fallback={<div className="text-muted">Loading topics...</div>}>
                <TopicsTable />
            </Suspense>
        </div>
    );
}