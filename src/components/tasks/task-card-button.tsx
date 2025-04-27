import { ChevronRight } from "lucide-react";
import Link from "../custom/Link";
import { Button } from "../ui/button";
import { getCurrentUserRole } from "@/src/lib/permissions-service";
import { TaskStatus, UserRole } from "@/src/types/enums";

export const TaskCardButton = async ({taskId, status}: {taskId: string, status: TaskStatus}) => {
    const userRole = await getCurrentUserRole();

    return (
        <Button className="flex items-center gap-1 mr-4" size={"sm"}>
            <Link href="/tasks/[id]" as={`/tasks/${taskId}`}>{userRole === UserRole.CONTRIBUTOR && status === TaskStatus.ACTIVE ? "Contribute" : "View"}</Link>
            <ChevronRight size={14} />
        </Button>
    );
}