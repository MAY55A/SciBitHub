
import { Suspense } from "react";
import ProjectsTable from "@/src/components/admin/projects/projects-table";
import ProjectsDomainsPieChart from "@/src/components/admin/stats/projects-domains-pie-chart";
import ProjectsActivityStatusPieChart from "@/src/components/admin/stats/projects-activity-status-pie-chart";
import { ContributionsGrowthChart } from "@/src/components/admin/stats/contributions-growth-chart";


export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <ContributionsGrowthChart />
            <div className="flex flex-wrap justify-center col-span-2 gap-4">
                <ProjectsDomainsPieChart />
                <ProjectsActivityStatusPieChart />
            </div>
            <Suspense fallback={<div className="text-muted">Loading projects...</div>}>
                <ProjectsTable />
            </Suspense>
        </div>
    );
}