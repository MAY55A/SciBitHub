import { ChevronRight } from "lucide-react";
import Link from "../custom/Link";
import { Button } from "../ui/button";
import { getCurrentUserRole } from "@/src/lib/services/permissions-service";
import { UserRole } from "@/src/types/enums";

export const CreateProjectButton = async () => {
    const userRole = await getCurrentUserRole();

    return userRole === UserRole.RESEARCHER ?
        <Button className="max-w-44 flex gap-2 font-bold">
            <Link href={'/projects/create'}>
                start a project
            </Link>
            <ChevronRight size={14} />
        </Button>
        : null;
}