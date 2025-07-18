import { DataTable } from "@/src/components/data-table/data-table";
import { fetchAllForumTopics } from "@/src/lib/services/admin-service";
import { topicsTableColumns } from "./topics-table-columns";
import { topicFilters } from "./topics-table-filters";
import { TopicsGroupActions } from "./topics-table-group-actions";

export default async function TopicsTable() {
    const topics = await fetchAllForumTopics();

    return (
        <div className="max-w-[95vw] sm:max-w-[80vw]">
            <DataTable
                columns={topicsTableColumns}
                data={topics}
                searchColumn="title"
                filters={topicFilters}
            >
                <TopicsGroupActions/>
            </DataTable>
        </div>
    );
}