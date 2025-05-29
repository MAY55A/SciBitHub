import { LucideHeart } from "lucide-react";

export const LikesDisplay = ({ likes }: { likes: number }) => {
    return (
        <div
            className="flex text-pink-700 px-2 items-center space-x-2 font-semibold"
            title={likes + " likes"}
        >
            <LucideHeart size={18} color="#bc3e64" className="font-extrabold" />
            <span>{likes}</span>
        </div>
    );
}