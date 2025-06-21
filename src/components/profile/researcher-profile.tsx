import { User } from "@/src/types/models";
import { Building, Check, Globe2, GraduationCap, Link, Mail, MapPin, Phone, School, TestTube2, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ResearcherType } from "@/src/types/enums";

export function ResearcherProfile({ user }: { user: User }) {
    return (
        <div className="max-w-[1000px] grid grid-rows-2 grid-cols-1 lg:grid-cols-2 gap-8 justify-center">
            <div className="relative col-span-full flex lg:flex-row flex-col gap-x-4 gap-y-8 items-center justify-center rounded-lg border border-primary py-8 px-16">
                <span className="absolute top-4 right-4 text-primary" title={user.metadata?.researcherType}>
                    {user.metadata?.researcherType === ResearcherType.ORGANIZATION
                        ? <Building size={"20"} />
                        : user.metadata?.researcherType === ResearcherType.ACADEMIC
                            ? <GraduationCap size={"20"} />
                            : <UserIcon size={"20"} />
                    }
                </span>
                <div className="flex items-center border-primary lg:border-r lg:pr-8 lg:border-b-0 lg:pb-0 border-b pb-8">
                    <Avatar className="flex shrink-0 border border-primary/50 overflow-hidden h-32 w-32 rounded-fully hover:shadow-lg hover:bg-muted">
                        <AvatarImage src={user.profile_picture} alt={user.username} />
                        <AvatarFallback className="rounded-lg text-3xl text-primary font-semibold tracking-[.25em] pl-1">
                            {user.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 items-center space-x-4">
                        <h2 className="text-xl font-semibold">{user.username}</h2>
                        <p className="text-[12px] text-primary uppercase tracking-[.25em]">{user.role}</p>
                        {user.metadata?.isVerified ?
                            <span className="flex items-center text-sm text-green font-semibold gap-2 rounded-3xl border py-2 px-4"><Check size={"15"} /> verified</span>
                            : <span className="items-center text-sm text-muted-foreground font-semibold rounded-3xl border border-muted-foreground py-2 px-4">not verified</span>
                        }
                    </div>
                </div>
                <p className="flex-1 max-h-64 items-center text-muted-foreground text-sm whitespace-normal break-words font-retro">
                    {user.metadata?.bio ? user.metadata.bio : "Hi, welcome to my profile!"}
                </p>
            </div>
            {user.metadata?.researcherType === ResearcherType.ORGANIZATION &&
                <div className="flex flex-col gap-2 justify-center rounded-lg border p-8 font-retro">
                    <p className="flex items-center gap-2 text-sm ">
                        <Building size={"15"} />
                        Organization :
                        <span className="text-muted-foreground">{user.metadata.organizationName || "- not specified -"}</span>
                    </p>
                    <p className="flex flex-wrap items-center gap-2 text-sm ">
                        <Globe2 size={"15"} />
                        Country :
                        <span className="text-muted-foreground">{user.country}</span>
                    </p>
                    <p className="flex items-center gap-2 text-sm ">
                        <MapPin size={"15"} />
                        Location :
                        <span className="text-muted-foreground">{user.metadata.organizationLocation || "- not specified -"}</span>
                    </p>
                    <p className="flex flex-wrap items-center gap-2 text-sm ">
                        <TestTube2 size={"15"} />
                        Fields of Interest :
                        {user.metadata.interests?.map((field, index) =>
                            <span key={index} className="text-muted-foreground border border-green rounded-xl px-4 py-1">{field}</span>
                        )}
                    </p>
                </div>
            }
            {user.metadata?.researcherType === ResearcherType.ACADEMIC &&
                <div className="flex flex-col gap-2 justify-center rounded-lg border p-8 font-retro">
                    <p className="flex flex-wrap items-center gap-2 text-sm ">
                        <GraduationCap size={"15"} />
                        Academic Degree :
                        <span className="text-muted-foreground">{user.metadata.academicDegree || "- not specified -"}</span>
                    </p>
                    <p className="flex flex-wrap items-center gap-2 text-sm ">
                        <School size={"15"} />
                        Institution :
                        <span className="text-muted-foreground">{user.metadata.institutionName || "- not specified -"}</span>
                    </p>
                    <p className="flex flex-wrap items-center gap-2 text-sm ">
                        <Globe2 size={"15"} />
                        Country :
                        <span className="text-muted-foreground">{user.country}</span>
                    </p>
                    <p className="flex flex-wrap items-center gap-2 text-sm ">
                        <TestTube2 size={"15"} />
                        Fields of Interest :
                        {user.metadata.interests?.map((field, index) =>
                            <span key={index} className="text-muted-foreground border border-green rounded-xl px-4 py-1">{field}</span>
                        )}
                    </p>
                </div>
            }
            {user.metadata?.researcherType === ResearcherType.CASUAL &&
                <div className="flex flex-col gap-2 justify-center rounded-lg border p-8 font-retro">
                    <p className="flex flex-wrap items-center gap-2 text-sm ">
                        <Globe2 size={"15"} />
                        Country :
                        <span className="text-muted-foreground">{user.country}</span>
                    </p>
                    <p className="flex flex-wrap items-center gap-2 text-sm ">
                        <TestTube2 size={"15"} />
                        Fields of Interest :
                        {user.metadata.interests?.map((field, index) =>
                            <span key={index} className="text-muted-foreground border border-green rounded-xl px-4 py-1">{field}</span>
                        )}
                    </p>
                </div>
            }
            <div className="flex flex-col gap-2 justify-center rounded-lg border p-8 font-retro">
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