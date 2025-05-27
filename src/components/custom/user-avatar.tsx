import { UserRole } from "@/src/types/enums";
import { FlaskConicalIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PublicUser } from "@/src/types/models";

export const UserAvatar = ({ user }: { user: PublicUser }) => {
    const username = user.deleted_at ? "**Deleted User**" : user.username;
    return (
        <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-muted/20 rounded-lg">
            <Avatar className="flex shrink-0 overflow-hidden h-10 w-10 rounded-lg hover:shadow-lg hover:bg-muted">
                {!!user.profile_picture && <AvatarImage src={user.profile_picture} alt={username} />}
                <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">
                {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="text-left text-sm ml-1 font-retro">
                <span className="truncate font-semibold">{username}</span>
                <span className="flex items-center gap-1 text-muted-foreground capitalize text-sm">
                    {user.role === UserRole.RESEARCHER ? <FlaskConicalIcon size={12} /> : <UserIcon size={12} />}
                    {user.role}
                </span>
            </div>
        </div>
    );
}