import { ResearcherType } from "@/src/types/enums";
import { GraduationCap, Building, UserIcon } from "lucide-react";

export function ResearcherIcon({ type, size = 15 }: { type: ResearcherType, size?: number }) {
    switch (type) {
        case ResearcherType.ACADEMIC:
            return <GraduationCap size={size} />;
        case ResearcherType.ORGANIZATION:
            return <Building size={size} />;
        default:
            return <UserIcon size={size} />;
    }
}