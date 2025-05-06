
import { Suspense } from "react";
import ProjectsTable from "@/src/components/admin/projects/projects-table";


export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <Suspense fallback={<div className="text-muted">Loading projects...</div>}>
                <ProjectsTable />
            </Suspense>
        </div>
    );
}