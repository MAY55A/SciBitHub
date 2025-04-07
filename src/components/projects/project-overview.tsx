"use client"

import { Project } from "@/src/types/models";
import MDEditor from "@uiw/react-md-editor";

export function ProjectOverview({ project }: { project: Project }) {
    return (
            <MDEditor.Markdown source={project.long_description} className="p-8" style={{ backgroundColor: "transparent" }} />
            {project.links &&
        </div>
    );
}