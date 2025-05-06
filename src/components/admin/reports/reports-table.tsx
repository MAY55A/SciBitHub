import { DataTable } from "@/src/components/data-table/data-table";
import { fetchAllReports } from "@/src/lib/services/admin-service";
import { reportsTableColumns } from "./reports-table-columns";
import { reportFilters } from "./reports-table-filters";
import { deleteReports } from "@/src/lib/actions/admin/reports-actions";


export default async function ReportsTable() {
    const reports = await fetchAllReports();

    return (
        <div className="">
            <DataTable
                columns={reportsTableColumns}
                data={reports}
                searchColumn="reporter"
                filters={reportFilters}
                onRemoveSelected={deleteReports}
            >
            </DataTable>
        </div>
    );
}