import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import ShinyText from "@/src/components/ui/shiny-text";
import { Project } from "@/src/types/models";
import { formatDate } from "@/src/utils/utils";
import Image from "next/image";
import { ProjectDropdownMenu } from "./project-options-menu";
import { createClient } from "@/src/utils/supabase/server";
import { Suspense } from "react";
import ReportFormDialog from "../reports/report-form-dialog";
import { LikeButton } from "../votes/like-button";
import { UserHoverCard } from "../custom/user-hover-card";
import { Badge } from "../ui/badge";
import { BookmarkButton } from "../bookmarks/bookmark-button";

export function ProjectHeader({ project }: { project: Project }) {
    const creator = {
        ...project.creator,
        username: project.creator.deleted_at ? "**Deleted User**" : project.creator.username
    };
    return (
        <div className="relative w-full min-h-[50vh] p-4 rounded-lg">
            {project.cover_image ?
                <>
                    <Image
                        priority
                        src={project.cover_image}
                        fill
                        alt="project cover image"
                        className="z-[-1] object-cover object-center rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background to-muted/60"></div>
                </> :
                <div
                    className="absolute top-0 right-0 w-full h-full bg-[url('/images/project-background-light.png')] dark:bg-[url('/images/project-background-dark.png')] bg-cover bg-center bg-no-repeat rounded-lg"
                />
            }

            <div className="relative w-full flex justify-between gap-4 font-retro">
                <div className="flex gap-2 px-2 py-1.5 text-left text-sm hover:bg-muted/20 rounded-lg">
                    <Avatar className="flex shrink-0 overflow-hidden h-10 w-10 rounded-lg hover:shadow-lg hover:bg-muted">
                        {!!creator.profile_picture && <AvatarImage src={creator.profile_picture} alt={creator.username} />}
                        <AvatarFallback className="text-primary opacity-80 text-sm rounded-lg border border-primary">
                            {creator.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <UserHoverCard user={creator} />
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs mb-4 text-end">Published {formatDate(project.created_at)}</span>
                    <div className="bg-muted/50 rounded-2xl">
                        <ShinyText text={project.domain} disabled={false} speed={4} className='text-green text-center font-semibold uppercase tracking-[.1em] text-xs border border-green rounded-2xl px-2 py-2' />
                    </div>
                </div>
            </div>
            <div className="relative flex flex-col justify-between w-full max-w-[800px] h-full text-foreground p-8">
                <h1 className="text-xl lg:text-2xl font-bold text-primary">{project.name}</h1>
                <div className="mt-4 font-retro">
                    <p className="text-foreground"><strong>+ Scope:</strong> {project.scope}</p>
                    {project.countries &&
                        <p className="text-foreground"><strong>+ Countries:</strong> {project.countries.join(", ")}</p>
                    }
                    <p className="text-foreground"><strong>+ Participation:</strong> {project.participation_level}</p>
                    <p className="text-foreground"><strong>+ Moderation:</strong> {project.moderation_level}</p>
                    {!!project.deadline && <p className="text-foreground"><strong>+ Deadline:</strong> {formatDate(project.deadline.toString())}</p>}
                </div>
                <div className="flex flex-wrap mt-8 font-retro">
                    <strong className="mr-2">Tags: </strong>
                    {project.tags?.map((tag, index) => (
                        <Badge variant="outline" key={index} className="text-muted-foreground border-primary/50 mr-2 mb-2">{tag}</Badge>
                    )) || "No tags added"}
                </div>
            </div>
            <div className="absolute bottom-4 right-4 space-x-2">
                <LikeButton projectId={project.id!} likes={project.likes ?? 0} creatorId={project.creator.id} />
                <BookmarkButton projectId={project.id} />
                <Suspense fallback={null}>
                    <ProjectActions creatorId={project.creator.id} project={project} />
                </Suspense>
            </div>

        </div>
    );
}

async function ProjectActions({ creatorId, project }: { creatorId: string, project: Project }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }
    if (user.id === creatorId) {
        return (
            <ProjectDropdownMenu project={project} showVisit={false} />
        );
    };
    return (
        <ReportFormDialog user={user.id} id={project.id!} type="project" />
    );
}