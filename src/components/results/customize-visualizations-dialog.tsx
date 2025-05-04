"use client"

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Task } from "@/src/types/models";
import { VisualizationInputData } from "@/src/types/data-visualization-form-data";
import { Edit, X, PlusCircle } from "lucide-react";
import { VisualizationForm } from "./visualization-form";
import { useToast } from "@/src/hooks/use-toast";
import { createVisualization, deleteVisualization, updateVisualization } from "@/src/lib/actions/visualization-actions";
import { FormMessage } from "../custom/form-message";
import { CustomAlertDialog } from "../custom/alert-dialog";


export default function CustomizeDataVisualizationDialog({ projectId, tasks, currentVisualizations }: { projectId: string, tasks: Task[], currentVisualizations: VisualizationInputData[] }) {
    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editForm, setEditForm] = useState(-1);
    const [error, setError] = useState("");
    const [visualizations, setVisualizations] = useState<VisualizationInputData[]>(currentVisualizations);
    const [newVisualization, setNewVisualization] = useState<Partial<VisualizationInputData>>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    async function addVisualization(visualization: VisualizationInputData) {
        if (visualizations.find(r => r.title === visualization.title)) {
            setError("A Visualization with the same title already exists");
            return;
        }

        setError("");
        setIsSubmitting(true);
        const res = await createVisualization(visualization, projectId);
        setIsSubmitting(false);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            setVisualizations((prev) => [...prev, { ...visualization, id: res.id }]);
            setNewVisualization(undefined);
            setShowForm(false);
        }
    }
    async function editVisualization(index: number, updatedVisualization: VisualizationInputData) {
        if (updatedVisualization.title !== tasks[index].title && tasks.find(t => t.title === updatedVisualization.title)) {
            setError("A Visualization with the same title already exists");
            return;
        }


        setError("");
        setIsSubmitting(true);
        const res = await updateVisualization(updatedVisualization);
        setIsSubmitting(false);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            setVisualizations((prev) => prev.map((visualization, i) => i === index ? updatedVisualization : visualization));
            setEditForm(-1);
        }
    }
    const removeVisualization = async (id: string) => {
        setIsSubmitting(true);
        const res = await deleteVisualization(id);
        setIsSubmitting(false);

        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive",
        });

        if (res.success) {
            setVisualizations((prev) => prev.filter((v) => v.id !== id));
        }
    };

    return (
        //fix overflow issue when dialog is closed
        <Dialog open={open} onOpenChange={(open) => { setOpen(open); if (!open) document.body.style.overflow = ""; }}>            <DialogTrigger asChild>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}>Customize Results visualization</Button>
        </DialogTrigger>
            <DialogContent className="lg:min-w-[700px] md:min-w-[700px] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Customize Results visualization</DialogTitle>
                    <DialogDescription>
                        Configure how you want data to be displayed here.
                    </DialogDescription>
                </DialogHeader>
                {visualizations?.map((visualization, index) =>
                    editForm === index ?
                        (
                            <div
                                className="bg-muted rounded-lg border border-primary"
                                key={index}
                            >
                                <VisualizationForm
                                    buttonText={isSubmitting ? "Saving..." : "Save"}
                                    buttonDisabled={isSubmitting}
                                    data={visualization}
                                    tasks={tasks}
                                    onSubmit={(data) => editVisualization(index, data)} onChange={() => { }}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full flex items-center gap-2 mb-4"
                                    onClick={() => setEditForm(-1)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) :
                        (
                            <div
                                className="flex justify-between items-center gap-4 text-sm text-muted-foreground bg-muted p-4 rounded-lg border border-primary"
                                key={index}
                            >
                                <span className="w-full truncate text-foreground font-semibold">{visualization.title}</span>
                                <span className="w-full capitalize">{visualization.chart_type} {visualization.type}</span>
                                <div className="flex">
                                    <Button title="edit" variant="ghost" className="text-green p-2" onClick={() => setEditForm(index)}><Edit size={15} /></Button>
                                    <CustomAlertDialog
                                        buttonIcon={X}
                                        buttonVariant="ghost"
                                        buttonClass="text-primary p-2"
                                        title={"Are you sure ?"}
                                        description={"This action cannot be undone."}
                                        confirmText="Delete"
                                        onConfirm={() => removeVisualization(visualization.id!)} />
                                </div>
                            </div>
                        )
                )}
                <FormMessage message={{ error: error }} />

                {showForm && (
                    <VisualizationForm
                        buttonText={isSubmitting ? "Submitting..." : "Add Visualization"}
                        buttonDisabled={isSubmitting}
                        data={newVisualization}
                        tasks={tasks}
                        onSubmit={(data) => addVisualization(data)}
                        onChange={(data) => setNewVisualization(data)} />
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 mb-4"
                    onClick={() => setShowForm(!showForm)}
                    disabled={isSubmitting}
                >
                    {!showForm && <PlusCircle size={15} />}
                    {isSubmitting ? "Submitting..." : showForm ? "Cancel" : "Add Visualization"}
                </Button>

            </DialogContent>
        </Dialog>
    );
}