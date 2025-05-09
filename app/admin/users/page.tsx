import { Suspense } from "react";
import UserFormDialog from "@/src/components/admin/users/user-form-dialog";
import UsersTable from "@/src/components/admin/users/users-table";
import UsersRolesPieChart from "@/src/components/admin/stats/users-roles-pie-chart";
import { UsersGrowthChart } from "@/src/components/admin/stats/users-growth-chart";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UsersGrowthChart />
                <UsersRolesPieChart />
            </div>
            <div className="w-full max-w-[500px]">
                <UserFormDialog />
            </div>

            <Suspense fallback={<div className="text-muted">Loading users...</div>}>
                <UsersTable />
            </Suspense>
        </div>
    );
}