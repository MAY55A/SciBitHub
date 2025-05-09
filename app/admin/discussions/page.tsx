
import { Suspense } from "react";
import DiscussionsTable from "@/src/components/admin/discussions/discussions-table";
import { DiscussionsGrowthChart } from "@/src/components/admin/stats/discussions-growth-chart";
import { DiscussionsEngagementBarGraph } from "@/src/components/admin/stats/discussions-engagement-bar-graph";


export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DiscussionsGrowthChart />
                <DiscussionsEngagementBarGraph />
            </div>
            <Suspense fallback={<div className="text-muted">Loading discussions...</div>}>
                <DiscussionsTable />
            </Suspense>
        </div>
    );
}