import { Suspense } from "react";
import UserFormDialog from "@/src/components/admin/users/user-form-dialog";
import UsersTable from "@/src/components/admin/users/users-table";


export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-12">
            <div className="self-start">
                <UserFormDialog />
            </div>

            <Suspense fallback={<div className="text-muted">Loading users...</div>}>
                <UsersTable />
            </Suspense>
        </div>
    );
}