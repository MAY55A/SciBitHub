import { DataTable } from "@/src/components/data-table/data-table";
import { fetchAllProjects } from "@/src/lib/services/admin-service";
import { projectsTableColumns } from "./projects-table-columns";
import { projectFilters } from "./projects-table-filters";
import { ProjectsGroupActions } from "./projects-table-group-actions";


export default async function ProjectsTable() {
    const projects = await fetchAllProjects();

    return (
        <div className="max-w-[95vw] sm:max-w-[80vw]">
            <DataTable
                columns={projectsTableColumns}
                data={projects}
                searchColumn="name"
                filters={projectFilters}
            >
                <ProjectsGroupActions />
            </DataTable>
        </div>
    );
}