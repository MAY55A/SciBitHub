import { DataTable } from "@/src/components/data-table/data-table";
import { columnsWithProject } from "@/src/components/participation-requests/columns";
import { requestsFilters } from "@/src/components/participation-requests/filters";
import { fetchParticipationRequests } from "@/src/lib/fetch-data";
import { deleteRequests } from "@/src/utils/request-actions";
import { createClient } from "@/src/utils/supabase/server";

export default async function Page() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const requests = await fetchParticipationRequests({ user: user?.id });

    return (
        <div className="flex flex-col w-full gap-12 p-8 mx-8">
            <p className="text-sm text-muted-foreground mb-8">
                You can manage your requests for project participation here.
                <br /> You can also accept or reject incoming invitations.
            </p>
            <DataTable
                columns={columnsWithProject}
                data={requests}
                searchColumn="project"
                filters={requestsFilters}
                onRemoveSelected={deleteRequests}
            >
            </DataTable>
        </div>
    );
}

