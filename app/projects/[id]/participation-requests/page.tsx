import { DataTable } from "@/src/components/data-table/data-table";
import { columnsWithUser } from "@/src/components/participation-requests/columns";
import { requestsFilters } from "@/src/components/participation-requests/filters";
import RequestFormDialog from "@/src/components/participation-requests/request-form-dialog";
import { fetchParticipationRequests } from "@/src/lib/fetch-data";
import { deleteProjectRequests } from "@/src/lib/actions/request-actions";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const project = (await params).id;
    const requests = await fetchParticipationRequests({project});

    return (
        <div className="flex flex-col w-full gap-12 p-16 mx-8">
            <h2 className="text-center font-semibold text-lg">Project Participation Requests</h2>
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground font-retro">Manage the requests for your project. You can accept or reject incoming applications.</p>
                <RequestFormDialog projectId={project}/>
            </div>
            <DataTable
                columns={columnsWithUser}
                data={requests}
                searchColumn="user"
                filters={requestsFilters}
                onRemoveSelected={deleteProjectRequests}
            >
            </DataTable>
        </div>
    );
}