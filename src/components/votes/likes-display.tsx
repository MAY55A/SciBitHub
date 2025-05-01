import { LucideHeart } from "lucide-react";

export const LikesDisplay = ({ likes }: { likes: number }) => {
    return (
        <div
            className="absolute flex self-end text-pink-700 h-8 px-2 space-x-2 bottom-2 right-2"
            title={likes + " likes"}
        >
            <LucideHeart size={18} color="#bc3e64" />
            <span>{likes}</span>
        </div>
    );
}