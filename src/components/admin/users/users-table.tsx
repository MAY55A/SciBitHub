import { usersTableColumns } from "@/src/components/admin/users/users-table-columns";
import { usersFilters } from "@/src/components/admin/users/users-table-filters";
import { DataTable } from "@/src/components/data-table/data-table";
import { fetchAllUsers } from "@/src/lib/services/admin-service";
import { UsersGroupActions } from "./users-table-group-actions";


export default async function UsersTable() {
    const users = await fetchAllUsers();

    return (
        <div className="max-w-[95vw] sm:max-w-[80vw]">
            <DataTable
                columns={usersTableColumns}
                data={users}
                searchColumn="username"
                filters={usersFilters}
            >
                <UsersGroupActions />
            </DataTable>
        </div >
    );
}