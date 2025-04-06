import { ChevronRight } from "lucide-react";
import Link from "../custom/Link";
import { Button } from "../ui/button";
import { TaskStatus, UserRole } from "@/src/types/models";
import { getCurrentUserRole } from "@/src/lib/user-service";

export const TaskCardButton = async ({taskId, status}: {taskId: string, status: TaskStatus}) => {
    const userRole = await getCurrentUserRole();

    return (
        <Button className="flex items-center gap-1 mr-4" size={"sm"}>
            <Link href="/tasks/[id]" as={`/tasks/${taskId}`}>{userRole === UserRole.CONTRIBUTOR && status === TaskStatus.ACTIVE ? "Contribute" : "View"}</Link>
            <ChevronRight size={14} />
        </Button>
    );
}