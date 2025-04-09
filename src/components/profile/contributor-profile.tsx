import { User } from "@/src/types/models";
import { Globe2, Link, Mail, Phone, TestTube2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ContributorProfile({ user }: { user: User }) {
    return (
        <div className="max-w-[1000px] grid grid-rows-2 grid-cols-1 lg:grid-cols-2 gap-8 justify-center">
            <div className="relative col-span-full flex lg:flex-row flex-col gap-x-4 gap-y-8 items-center justify-center rounded-lg border border-green py-8 px-16">
                <div className="flex items-center lg:border-r lg:pr-8 lg:border-b-0 lg:pb-0 border-b border-green pb-8">
                    <Avatar className="flex shrink-0 overflow-hidden h-32 w-32 rounded-fully hover:shadow-lg hover:bg-muted">
                        <AvatarImage src={user.profile_picture} alt={user.username} />
                        <AvatarFallback className="rounded-lg text-2xl">
                            {user.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 items-center space-x-4">
                        <h2 className="text-xl font-semibold">{user.username}</h2>
                        <p className="text-[12px] text-green uppercase tracking-[.25em]">{user.role}</p>
                    </div>
                </div>
                <p className="flex-1 max-h-64 items-center text-muted-foreground text-sm whitespace-normal break-words ">
                    {user.metadata?.bio ? user.metadata.bio : "Hi, welcome to my profile!"}
                </p>
            </div>
            <div className="flex flex-col gap-2 justify-center rounded-lg border p-8 ">
                <p className="flex flex-wrap items-center gap-2 text-sm ">
                    <Globe2 size={"15"} />
                    Country :
                    <span className="text-muted-foreground">{user.country}</span>
                </p>
                <p className="flex flex-wrap items-center gap-2 text-sm ">
                    <TestTube2 size={"15"} />
                    Fields of Interest :
                    {user.metadata?.interests?.map((field, index) =>
                        <span key={index} className="text-muted-foreground border border-green rounded-xl px-4 py-1">{field}</span>
                    )}
                </p>
            </div>
            <div className="flex flex-col gap-2 justify-center rounded-lg border p-8 ">
                {user.metadata?.contactEmail &&
                    <p className="flex items-center gap-2 text-sm ">
                        <Mail size={"15"} />
                        Email :
                        <span className="text-muted-foreground">{user.metadata.contactEmail}</span>
                    </p>
                }
                {user.metadata?.phone &&
                    <p className="flex items-center gap-2 text-sm ">
                        <Phone size={"15"} />
                        Phone :
                        <span className="text-muted-foreground">{user.metadata.phone}</span>
                    </p>
                }
                {user.metadata?.contacts && user.metadata?.contacts.map((contact, index) =>
                    <p className="flex items-center gap-2 text-sm " key={index}>
                        <Link size={"15"} />
                        Link :
                        <a className="text-muted-foreground underline" href={contact}>{contact}</a>
                    </p>
                )}
                {!user.metadata?.contacts && !user.metadata?.phone && !user.metadata?.contactEmail &&
                    <p className="text-center">No contacts available</p>
                }
            </div>
        </div >
    );
}