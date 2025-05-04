import { usersTableColumns } from "@/src/components/admin/users/users-table-columns";
import { usersFilters } from "@/src/components/admin/users/users-table-filters";
import { DataTable } from "@/src/components/data-table/data-table";
import { fetchAllUsers } from "@/src/lib/services/admin-service";
import { deleteProjectRequests } from "@/src/lib/actions/request-actions";


export default async function UsersTable() {
    const users = await fetchAllUsers();

    return (
        <div className="">
            <DataTable
                columns={usersTableColumns}
                data={users}
                searchColumn="username"
                filters={usersFilters}
                onRemoveSelected={deleteProjectRequests}
            >
            </DataTable>
        </div>
    );
}