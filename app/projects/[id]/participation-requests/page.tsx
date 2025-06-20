import { DataTable } from "@/src/components/data-table/data-table";
import { columnsWithUser } from "@/src/components/participation-requests/columns";
import { requestsFilters } from "@/src/components/participation-requests/filters";
import RequestFormDialog from "@/src/components/participation-requests/request-form-dialog";
import { fetchParticipationRequests } from "@/src/lib/fetch-data";
import { RequestsGroupActions } from "@/src/components/participation-requests/group-actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const project = (await params).id;
    const requests = await fetchParticipationRequests({ project });

    return (
        <div className="flex flex-col w-full gap-12 p-16 mx-8">
            <Link href="/projects/[id]" as={`/projects/${project}`}>
                <span className="flex items-center gap-1 font-semibold text-sm underline font-retro hover:text-primary">
                    <ChevronLeft size={15} />
                    Back to Project
                </span>
            </Link>
            <h2 className="text-center font-semibold text-lg">Project Participation Requests</h2>
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground font-retro">
                    Manage the requests for your project. You can accept or reject incoming applications.<br />
                    You can also invite other contributors to join this project.
                </p>
                <RequestFormDialog projectId={project} requests={requests} key={JSON.stringify(requests.map(r => r.id))} />
            </div>
            <DataTable
                key={JSON.stringify(requests.map(r => r.id))}
                columns={columnsWithUser}
                data={requests}
                searchColumn="user"
                filters={requestsFilters}
            >
                <RequestsGroupActions isProjectTable={true} />
            </DataTable>
        </div>
    );
}