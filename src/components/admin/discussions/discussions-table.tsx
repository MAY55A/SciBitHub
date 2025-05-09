import { DataTable } from "@/src/components/data-table/data-table";
import { fetchAllDiscussions } from "@/src/lib/services/admin-service";
import { deleteProjectRequests } from "@/src/lib/actions/request-actions";
import { discussionsTableColumns } from "./discussions-table-columns";
import { discussionFilters } from "./discussions-table-filters";


export default async function DiscussionsTable() {
    const discussions = await fetchAllDiscussions();

    return (
        <div className="max-w-[95vw] sm:max-w-[80vw]">
            <DataTable
                columns={discussionsTableColumns}
                data={discussions}
                searchColumn="title"
                filters={discussionFilters}
                onRemoveSelected={deleteProjectRequests}
            >
            </DataTable>
        </div>
    );
}