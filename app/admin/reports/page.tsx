
import { Suspense } from "react";
import ReportsTable from "@/src/components/admin/reports/reports-table";
import { ReportsGrowthChart } from "@/src/components/admin/stats/reports-growth-chart";
import ReportsStatusPieChart from "@/src/components/admin/stats/reports-status-pie-chart";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReportsGrowthChart />
                <ReportsStatusPieChart/>
            </div>
            <Suspense fallback={<div className="text-muted">Loading reports...</div>}>
                <ReportsTable />
            </Suspense>
        </div>
    );
}