import { NotAuthorized } from "@/src/components/errors/not-authorized";
import { NotAvailable } from "@/src/components/errors/not-available";
import ProjectEditWrapper from "@/src/components/wrappers/project-edit-wrapper";
import { ProjectEditProvider } from "@/src/contexts/project-edit-context";
import { fetchProject } from "@/src/lib/fetch-data";
import { createClient } from "@/src/utils/supabase/server";
import { notFound } from "next/navigation";

async function getProjectData(id: string) {
    const supabase = await createClient();
    const [userResponse, projectResponse] = await Promise.all([
        supabase.auth.getUser(),
        fetchProject(id),
    ]);

    const user = userResponse.data.user;
    const project = projectResponse;

    return { user, project };
}

export default async function Layout({
    params,
    children,
}: {
    params: { id: string }
    children: React.ReactNode;
}) {
    const { id } = await params;
    const { user, project } = await getProjectData(id);
    if (!project) return notFound();
    if (project.deleted_at) return NotAvailable({ type: "project" });

    if (!user || project.creator.id !== user.id) return <NotAuthorized />;

    const { participation_level, moderation_level, cover_image, creator, deadline, ...data } = project;
    const projectData = {
        ...data,
        shortDescription: project.short_description,
        longDescription: project.long_description,
        coverImage: cover_image,
        deadline: deadline ? new Date(deadline) : undefined,
        participants: project.participants,
        participationLevel: project.participation_level,
        moderationLevel: project.moderation_level,
        creator: project.creator.id,
        tasks: []
    }

    return (
        <ProjectEditProvider initialData={projectData}>
            <ProjectEditWrapper projectId={projectData.id!}>
                {children}
            </ProjectEditWrapper>
        </ProjectEditProvider>
    );
}