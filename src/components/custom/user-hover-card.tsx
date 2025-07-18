import { CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { PublicUser } from "@/src/types/models";
import { ResearcherIcon } from "./researcher-icon";

export function UserHoverCard({ user }: { user: PublicUser | null }) {
    if (!user?.username) {
        return <span className="text-primary/70 truncate pl-1 text-sm">**Deleted User**</span>;
    }

    const username = user.deleted_at ? "**Deleted User**" : user.username;
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link" className="max-w-full justify-start font-semibold truncate pl-1">{username}</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" side="right" align="start">
                <div className="flex space-x-4">
                    <Avatar className="relative flex shrink-0 overflow-hidden h-10 w-10 rounded-lg hover:shadow-lg">
                        {!!user.profile_picture && <AvatarImage src={user.profile_picture} alt={username} />}
                        <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">
                            {username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 font-retro">
                        <h4 className="text-sm font-semibold">{username}</h4>
                        <p className="text-sm">
                            <span>{user.role}</span>
                            {!!user.metadata?.researcherType &&
                                <span className="flex items-center gap-1 text-muted-foreground"><ResearcherIcon type={user.metadata!.researcherType!} size={13} />{user.metadata!.researcherType} researcher</span>
                            }
                        </p>
                        {!!user.metadata?.isVerified &&
                            <span className="flex items-center gap-1 text-green-800 font-semibold"><CheckCircle2 size={13} />verified</span>
                        }
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}