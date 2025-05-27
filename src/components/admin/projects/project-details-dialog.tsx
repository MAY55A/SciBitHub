"use client"

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Project, Task } from "@/src/types/models";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { MarkdownViewer } from "@/src/components/custom/markdown-viewer";
import { format } from "date-fns";
import { UserHoverCard } from "@/src/components/custom/user-hover-card";
import { Badge } from "../../ui/badge";
import { ActivityStatus, ProjectStatus, TaskStatus } from "@/src/types/enums";
import { ChevronLeft } from "lucide-react";

export default function ProjectDetailsDialog({ project, onClose }: { project: Project, onClose: () => void }) {
    const [open, setOpen] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                !open && onClose()
            }}
        >
            <DialogContent className="max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Project Details</DialogTitle>
                </DialogHeader>
                {selectedTask
                    ? (
                        <div>
                            <h2 className="text-primary font-semibold mb-4">Task: {selectedTask.title}</h2>
                            <div className="grid gap-2 text-sm">
                                <div><strong>Status: </strong>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            selectedTask.deleted_at
                                                ? "text-destructive border-destructive"
                                                : selectedTask.status === TaskStatus.COMPLETED
                                                    ? "text-yellow-500 border-yellow-500"
                                                    : "text-green-500 border-green-500"
                                        }
                                    >
                                        {selectedTask.deleted_at
                                            ? "deleted"
                                            : selectedTask.status
                                        }
                                    </Badge>
                                </div>
                                <p><strong>Created At: </strong> {format(new Date(project.created_at), "PPPpp")}</p>
                                {project.updated_at && <p><strong>Updated At: </strong>{format(new Date(project.updated_at), "PPPpp")}</p>}
                                {project.published_at && <p><strong>Published At: </strong>{format(new Date(project.published_at), "PPPpp")}</p>}
                                {project.deleted_at && <p><strong>Published At: </strong>{format(new Date(project.deleted_at), "PPPpp")}</p>}
                                <p><strong>Type:</strong> {selectedTask.type}</p>
                                {!!selectedTask.data_type &&
                                    <p><strong>Data Type: </strong>{selectedTask.data_type}</p> &&
                                    <p><strong>Dataset: </strong><a href={selectedTask.data_source} className="text-green hover:underline">open task dataset</a> </p>
                                }
                                <p><strong>Description:</strong><br />{selectedTask.description}</p>
                                <div>
                                    <strong>Tutorial:</strong>
                                    <MarkdownViewer source={selectedTask.tutorial} className="p-2 max-h-48 overflow-y-auto border m-1" />
                                </div>
                                <strong>Fields:</strong>
                                <ul className="list-disc list-inside">
                                    {selectedTask.fields?.map((f, i) => (
                                        <li key={i}>{f.label} ({f.type})</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                    : (
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {/* General Info */}
                            <AccordionItem value="general">
                                <AccordionTrigger className="text-md data-[state=open]:text-primary">General</AccordionTrigger>
                                <AccordionContent className="max-h-[60vh] overflow-y-auto">
                                    <div className="grid gap-1 text-sm">
                                    <div><strong>Creator: </strong><UserHoverCard user={project.creator} /></div>
                                    <p><strong>Name: </strong>{project.name}</p>
                                        <div><strong>Status: </strong>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    project.status === ProjectStatus.DELETED
                                                        ? "text-destructive border-destructive"
                                                        : project.status === ProjectStatus.PENDING
                                                            ? "text-yellow-500 border-yellow-500"
                                                            : project.status === ProjectStatus.PUBLISHED
                                                                ? "text-green-500 border-green-500"
                                                                : "text-primary border-primary"
                                                }
                                            >
                                                {project.status}
                                            </Badge>
                                        </div>
                                        {project.status === ProjectStatus.PUBLISHED &&
                                            <div><strong>Activity Status: </strong>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        project.activity_status === ActivityStatus.CLOSED
                                                            ? "text-destructive border-destructive"
                                                            : project.activity_status === ActivityStatus.COMPLETED
                                                                ? "text-yellow-500 border-yellow-500"
                                                                : project.activity_status === ActivityStatus.ONGOING
                                                                    ? "text-green-500 border-green-500"
                                                                    : "text-muted-foreground border-muted-foreground"
                                                    }
                                                >
                                                    {project.activity_status}
                                                </Badge>
                                            </div>
                                        }
                                        <p><strong>Created At: </strong> {format(new Date(project.created_at), "PPPpp")}</p>
                                        {project.updated_at && <p><strong>Updated At: </strong>{format(new Date(project.updated_at), "PPPpp")}</p>}
                                        {project.status === ProjectStatus.PUBLISHED && <p><strong>Published At: </strong>{project.published_at ? format(new Date(project.published_at), "PPPpp") : "Just now"}</p>}
                                        {project.status === ProjectStatus.DELETED && <p><strong>Deleted At: </strong>{project.deleted_at ? format(new Date(project.deleted_at), "PPPpp") : "Just now"}</p>}
                                        <p><strong>Domain: </strong>{project.domain}</p>
                                        {project.tags && project.tags.length > 0 && (
                                            <p><strong>Tags:</strong> {project.tags.join(", ")}</p>
                                        )}
                                        <p><strong>Short Description: </strong>{project.short_description}</p>
                                        <div><strong>Full Description: </strong>
                                            <MarkdownViewer source={project.long_description} className="p-2 max-h-48 overflow-y-auto border m-2" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Settings */}
                            <AccordionItem value="settings">
                                <AccordionTrigger className="text-md data-[state=open]:text-primary">Settings</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid gap-2 text-sm">
                                        <p><strong>Results Visibility:</strong> {project.visibility}</p>
                                        <p><strong>Participation Level:</strong> {project.participation_level}</p>
                                        <p><strong>Moderation Level:</strong> {project.moderation_level}</p>
                                        <p><strong>Scope:</strong> {project.scope}</p>
                                        {project.countries && project.countries.length > 0 && (
                                            <p><strong>Countries:</strong> {project.countries.join(", ")}</p>
                                        )}
                                        {project.deadline && <p><strong>Deadline:</strong> {format(new Date(project.deadline), "PPPpp")}</p>}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Tasks Summary */}
                            <AccordionItem value="tasks">
                                <AccordionTrigger className="text-md data-[state=open]:text-primary">Tasks</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid gap-2 text-sm">
                                        <ul>
                                            {project.tasks.map((task: Task) => (
                                                <li
                                                    key={task.id}
                                                    className="p-2 border rounded hover:bg-muted cursor-pointer"
                                                    onClick={() => setSelectedTask(task)}
                                                >
                                                    {task.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )
                }
                {!!selectedTask &&
                    <DialogFooter>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTask(null)}>
                            <ChevronLeft size={13} className="mr-1" /> Back
                        </Button>
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}