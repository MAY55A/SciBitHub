
import { Suspense } from "react";
import TopicsTable from "@/src/components/admin/forum_topics/topics-table";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <Suspense fallback={<div className="text-muted">Loading topics...</div>}>
                <TopicsTable />
            </Suspense>
        </div>
    );
}