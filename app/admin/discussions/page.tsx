
import { Suspense } from "react";
import DiscussionsTable from "@/src/components/admin/discussions/discussions-table";


export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <Suspense fallback={<div className="text-muted">Loading discussions...</div>}>
                <DiscussionsTable />
            </Suspense>
        </div>
    );
}