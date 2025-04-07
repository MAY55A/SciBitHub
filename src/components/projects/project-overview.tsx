"use client"

import { Project } from "@/src/types/models";
import MDEditor from "@uiw/react-md-editor";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader } from "../ui/card";

export function ProjectOverview({ project }: { project: Project }) {
    return (
        <div className="flex flex-col lg:flex-row mt-8">
            <MDEditor.Markdown source={project.long_description} className="p-8" style={{ backgroundColor: "transparent" }} />
            {project.links &&
                <Card className="my-12 bg-muted/50">
                    <CardHeader><Label className="text-green text-md">External Links</Label></CardHeader>
                    <CardContent>
                        <ul className="min-w-64 list-disc text-sm pl-6 pt-2 underline decoration-green">
                            {project.links.map((link, index) => (
                                <li key={index} className="break-all" ><a href={link} className="break-all">{link}</a></li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            }
        </div>
    );
}