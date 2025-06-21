import { DataTable } from "@/src/components/data-table/data-table";
import { fetchAllReports } from "@/src/lib/services/admin-service";
import { reportsTableColumns } from "./reports-table-columns";
import { reportFilters } from "./reports-table-filters";
import { ReportsGroupActions } from "./reports-table-group-actions";


export default async function ReportsTable() {
    const reports = await fetchAllReports();

    return (
        <div className="">
            <DataTable
                columns={reportsTableColumns}
                data={reports}
                searchColumn="reporter"
                filters={reportFilters}
            >
                <ReportsGroupActions/>
            </DataTable>
        </div>
    );
}