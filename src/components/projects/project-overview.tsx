import { Project } from "@/src/types/models";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader } from "../ui/card";
import { MarkdownViewer } from "../custom/markdown-viewer";

export function ProjectOverview({ project }: { project: Project }) {
    return (
        <div className="flex flex-col lg:flex-row mt-8 p-4">
            <div>
                <h2 className="text-xl font-semibold text-green mb-8">Description</h2>
                <MarkdownViewer source={project.long_description} className="p-4" />
            </div>
            {project.links &&
                <Card className="bg-muted/50">
                    <CardHeader><Label className="text-green text-md">External Links</Label></CardHeader>
                    <CardContent>
                        <ul className="min-w-64 list-disc text-sm pl-6 pt-2 underline decoration-green font-retro">
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