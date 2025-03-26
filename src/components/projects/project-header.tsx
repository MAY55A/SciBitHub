import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import ShinyText from "@/src/components/ui/shiny-text";
import { Project, ResearcherType } from "@/src/types/models";
import { formatDate } from "@/src/utils/utils";
import { Building, CheckCircle2, GraduationCap, UserIcon } from "lucide-react";
import Image from "next/image";

export function ProjectHeader({ project }: { project: Project }) {
    const Icon = ResearcherIcon(project.creator.metadata!.researcherType!);
    return (
        <div className="relative w-full min-h-[50vh] p-4 rounded-lg">
            {project.cover_image !== undefined &&
                <Image
                    priority
                    src={project.cover_image}
                    fill
                    alt="project cover image"
                    className="z-[-1] object-cover object-center opacity-40 rounded-lg"
                />
            }
            <div className="relative w-full flex justify-between">
                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-muted/20 rounded-lg">
                    <Avatar className="flex shrink-0 overflow-hidden h-10 w-10 rounded-fully hover:shadow-lg hover:bg-muted">
                        <AvatarImage src={project.creator.profile_picture} alt={project.creator.username} />
                        <AvatarFallback className="rounded-lg">
                            {project.creator.username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="flex items-center gap-1 truncate font-semibold text-red-700 text-xs"><Icon size={16} />{project.creator.metadata!.researcherType}</span>
                        <span className="ml-2 truncate font-semibold text-red-700">{project.creator.username}</span>
                        {project.creator.metadata!.isVerified ? (
                            <span className="flex items-center gap-1 text-xs text-green-900"><CheckCircle2 size={13} />verified</span>
                        ) : null
                        }
                    </div>
                </div>
                <div className="flex flex-col text-right">
                    <span className="italic text-muted-foreground text-xs mb-4">published on {formatDate(project.created_at)}</span>
                    <div className="bg-muted/50 rounded-2xl">
                        <ShinyText text={project.domain} disabled={false} speed={4} className='text-green font-semibold uppercase tracking-[.1em] text-xs border border-green rounded-2xl px-3 py-2' />
                    </div>
                </div>
            </div>
            <div className="relative flex flex-col justify-between w-full max-w-[600px] h-full text-foreground p-8">
                <div className="mt-16">
                    <h1 className="text-2xl font-bold text-primary">{project.name}</h1>
                    <p className="text-foreground"><strong>+ Scope:</strong> {project.scope}</p>
                    {project.countries &&
                        <p className="text-foreground"><strong>+ Countries:</strong> {project.countries.join(", ")}</p>
                    }
                    <p className="text-foreground"><strong>+ Participation:</strong> {project.participation_level}</p>
                    <p className="text-foreground"><strong>+ Moderation:</strong> {project.moderation_level}</p>
                    <p className="text-foreground mt-8"><strong>+ Deadline:</strong> {project.deadline ? formatDate(project.deadline.toString()) : "- not specified -"}</p>
                </div>
                <div className="flex flex-wrap mt-8">
                    <strong className="mr-2">+ Tags: </strong>
                    {project.tags?.map((tag, index) => (
                        <span key={index} className="text-xs text-muted-foreground bg-muted/30 dark:bg-muted/50 rounded-2xl px-2 py-1 mr-2 mb-2 border border-foreground">{tag}</span>
                    )) || "No tags added"}
                </div>
            </div>
        </div>
    );
}

export function ResearcherIcon(type: ResearcherType) {
    switch (type) {
        case ResearcherType.ACADEMIC:
            return GraduationCap;
        case ResearcherType.ORGANIZATION:
            return Building;
        default:
            return UserIcon;
    }
}