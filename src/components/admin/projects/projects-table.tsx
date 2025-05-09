import { DataTable } from "@/src/components/data-table/data-table";
import { fetchAllProjects } from "@/src/lib/services/admin-service";
import { deleteProjectRequests } from "@/src/lib/actions/request-actions";
import { projectsTableColumns } from "./projects-table-columns";
import { projectFilters } from "./projects-table-filters";


export default async function ProjectsTable() {
    const projects = await fetchAllProjects();

    return (
        <div className="max-w-[95vw] sm:max-w-[80vw]">
            <DataTable
                columns={projectsTableColumns}
                data={projects}
                searchColumn="name"
                filters={projectFilters}
                onRemoveSelected={deleteProjectRequests}
            >
            </DataTable>
        </div>
    );
}