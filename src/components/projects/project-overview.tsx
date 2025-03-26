"use client"

import { Project } from "@/src/types/models";
import MDEditor from "@uiw/react-md-editor";

export function ProjectOverview({ project }: { project: Project }) {
    return (
        <div className="mt-8">
            <MDEditor.Markdown source={project.description} className="p-8" style={{backgroundColor: "transparent"}}/>
        </div>
    );
}