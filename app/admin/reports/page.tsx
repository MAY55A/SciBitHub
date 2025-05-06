
import { Suspense } from "react";
import ReportsTable from "@/src/components/admin/reports/reports-table";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <Suspense fallback={<div className="text-muted">Loading reports...</div>}>
                <ReportsTable />
            </Suspense>
        </div>
    );
}