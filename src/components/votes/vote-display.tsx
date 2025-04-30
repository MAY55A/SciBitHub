import { ChevronDown, ChevronUp } from "lucide-react";

export const VoteDisplay = ({ upvotes, downvotes }: { upvotes: number, downvotes: number }) => {
    return (
        <div className="flex gap-2">
            <div className="flex items-center text-green-700">
                <ChevronUp size={15} />
                <span>{upvotes}</span>
            </div>
            <div className="flex items-center text-red-700">
                <ChevronDown size={15} />
                <span>{downvotes}</span>
            </div>
        </div>
    );
}