import { Project } from "@/src/types/models"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Link from "../custom/Link";
import Image from "next/image";
import { ChevronsRight } from "lucide-react";
import { formatDate } from "@/src/utils/utils";
import ShinyText from "../ui/shiny-text";
import { ProjectDropdownMenu } from "./project-options-menu";
import { UserHoverCard } from "../custom/user-hover-card";
import { LikesDisplay } from "../votes/likes-display";
import { BookmarkButton } from "../bookmarks/bookmark-button";


export function ProjectCard({ project, editable = false }: { project: Project, editable?: boolean }) {
    let prefix = "Published ";
    let color = undefined;
    if (editable) {
        color = "#1e40af";
        prefix = "create ";
        if (project.status === "published") {
            color = "#009900";
            prefix = "Published ";
        }
        if (project.status === "declined") {
            color = "#990000";
            prefix = "Created ";
        }
        if (project.status === "pending") {
            color = "#eab308";
        }
    }

    const date = project.published_at || project.created_at;
    const formattedDate = formatDate(date);

    return (
        <Card
            className="relative w-full max-w-[900px] h-full border-2 border-primary/30 text-sm rounded-lg transform hover:shadow-2xl hover:shadow-muted"
            style={{
                borderColor: color,
            }}
        >
            {project.cover_image ?
                <>
                    <Image
                        className="z-[-2] object-cover object-center rounded-lg"
                        src={project.cover_image}
                        alt="Project Cover"
                        fill
                    />
                    <div className="absolute z-[-1] inset-0 bg-gradient-to-r from-background to-muted/60 rounded-lg"></div>
                </> :
                <div
                    className="absolute z-[-2] top-0 right-0 w-full h-full bg-[url('/images/project-background-light.png')] dark:bg-[url('/images/project-background-dark.png')] bg-cover bg-center opacity-60 rounded-lg"
                />
            }
            <CardHeader>
                {editable &&
                    <div className="flex flex-row items-center justify-between pb-4">
                        <span
                            className="text-xs uppercase tracking-[.25em] animate-glow"
                            style={{ color: color }}
                        >
                            {project.status}
                        </span>
                        <ProjectDropdownMenu project={project} />
                    </div>}
                <div className="flex flex-row justify-between gap-2 font-retro">
                    <span className="text-muted-foreground text-sm mb-4">
                        {prefix + formattedDate}
                    </span>
                    <div className="bg-muted/50 rounded-2xl border border-green" title={project.domain}>
                        <ShinyText text={project.domain} disabled={false} speed={4} className='max-w-52 text-center text-green font-semibold uppercase tracking-[.1em] text-xs rounded-2xl px-3 py-2' />
                    </div>
                </div>
                {!editable &&
                    <div><strong className="text-muted-foreground">Creator :</strong> <UserHoverCard user={project.creator} /></div>
                }
            </CardHeader>
            <CardContent>
                <Link href="/projects/[id]" as={`/projects/${project.id}`}>
                    <h2
                        className="flex text-base font-bold mb-4"
                    >
                        <ChevronsRight size={18} className="mt-1 pr-1" />
                        {project.name}
                    </h2></Link>

                <p
                    className="text-foreground/80 pl-2 font-retro"
                >
                    {project.short_description}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-end gap-4 pb-2 pr-2">
                <div className="flex flex-wrap gap-2 font-retro pb-4">
                    {project.tags && project.tags?.map((tag) => (
                        <a
                            href={`/projects?tags=${tag}`}
                            key={tag}
                            title={tag}
                            className="text-xs font-semibold border border-primary/50 hover:text-primary p-2 rounded-3xl"
                            style={{
                                borderColor: color,
                            }}
                        >
                            {tag}
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <LikesDisplay likes={project.likes ?? 0} />
                    <BookmarkButton projectId={project.id} />
                </div>
            </CardFooter>
        </Card>
    );
}