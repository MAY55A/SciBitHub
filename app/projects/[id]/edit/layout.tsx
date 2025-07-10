import { Forbidden } from "@/src/components/errors/forbidden";
import { NotAvailable } from "@/src/components/errors/not-available";
import ProjectEditWrapper from "@/src/components/wrappers/project-edit-wrapper";
import { ProjectEditProvider } from "@/src/contexts/project-edit-context";
import { fetchProjectForEditing } from "@/src/lib/fetch-data";
import { createClient } from "@/src/utils/supabase/server";
import { notFound, redirect } from "next/navigation";

async function getProjectData(id: string) {
    const supabase = await createClient();
    const [userResponse, projectResponse] = await Promise.all([
        supabase.auth.getUser(),
        fetchProjectForEditing(id),
    ]);

    const user = userResponse.data.user;
    const project = projectResponse;

    return { user, project };
}

export default async function Layout({
    params,
    children,
}: {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
}) {
    const { id } = await params;
    const { user, project } = await getProjectData(id);
    if (!project) return notFound();
    if (project.deleted_at) return NotAvailable({ type: "project" });

    if (!user) {
        redirect(`/sign-in?redirect_to=projects/${id}/edit`);
    }

    if (project.creator?.id !== user.id) {
        return <Forbidden message="You do not have the permission to edit this project." />;
    }

    const { participation_level, moderation_level, cover_image, creator, deadline, ...data } = project;
    const projectData = {
        ...data,
        shortDescription: project.short_description,
        longDescription: project.long_description,
        coverImage: cover_image,
        deadline: deadline ? new Date(deadline) : undefined, // even though the type is Date, it is stored as string in the database
        participants: [], // fetch later only for non published restricted projects, otherwise participants are handled in seperate interface (participation requests)
        participationLevel: project.participation_level,
        moderationLevel: project.moderation_level,
        creator: project.creator.id,
        tasks: [] // fetch later
    }

    return (
        <ProjectEditProvider initialData={projectData}>
            <ProjectEditWrapper projectId={projectData.id!} projectStatus={projectData.status!} projectParticipationLevel={projectData.participationLevel!}>
                {children}
            </ProjectEditWrapper>
        </ProjectEditProvider>
    );
}