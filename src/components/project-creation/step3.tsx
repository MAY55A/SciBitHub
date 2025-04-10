"use client"

import { TaskFilesMap } from "@/src/contexts/multistep-project-form-context";
import { ProjectInputData, TaskInputData } from "@/src/types/project-form-data";
import { X, ChevronLeft, ChevronRight, PlusCircle, Edit } from "lucide-react";
import { Button } from "../ui/button";
import TaskSetup from "./task-setup";
import { useEffect, useState } from "react";
import { FormMessage } from "../custom/form-message";
import { CancelAlertDialog } from "./cancel-alert-dialog";
import { motion } from "framer-motion";
import { ProjectStatus } from "@/src/types/enums";


export function Step3({ data, onUpdate, onNext, onBack, onSaveStep, onSaveProject, files, updateFiles, dataChanged }: { data: ProjectInputData, onUpdate: (data: Partial<ProjectInputData>) => void, onNext: () => void, onBack: () => void, onSaveStep: () => void, onSaveProject: (data: Partial<ProjectInputData>, status: ProjectStatus) => void, files: TaskFilesMap, updateFiles: (files: TaskFilesMap) => void, dataChanged?: boolean }) {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editForm, setEditForm] = useState(-1);
    const [error, setError] = useState("");
    const [tasks, setTasks] = useState<TaskInputData[]>(data.tasks);
    const [newTask, setNewTask] = useState<Partial<TaskInputData>>();
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const same = tasks.length > 0 && JSON.stringify(data.tasks) === JSON.stringify(tasks);
        setIsSaved(same);
    }, [JSON.stringify(tasks)]);

    function addTask(task: TaskInputData) {
        if (tasks.find(t => t.title === task.title)) {
            setError("Task with the same title already exists");
            return;
        }
        setError("");
        setTasks((prev) => [...prev, task]);
        setNewTask(undefined);
        setShowTaskForm(false);
    }
    function editTask(index: number, updatedTask: TaskInputData) {
        if (updatedTask.title !== tasks[index].title && tasks.find(t => t.title === updatedTask.title)) {
            setError("Task with the same title already exists");
            return;
        }
        setError("");
        setTasks((prev) => prev.map((task, i) => i === index ? updatedTask : task));
        setEditForm(-1);
    }
    const removeTask = (index: number) => {
        setTasks((prev) => prev.filter((_, i) => i !== index));
    };

    const saveData = () => {
        if (tasks.length === 0) {
            setError("Project needs at least one task");
            return;
        }
        updateFiles(
            tasks.reduce((acc: any, task, index) => {
                acc[index] = task.dataSource;
                task.dataSource = undefined;
                return acc;
            }, {})
        );
        onUpdate({ tasks: tasks });
        setIsSaved(true);
        onSaveStep();
    };


    const handleBack = () => {
        onBack();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex flex-col gap-4 p-6 shadow-lg rounded-lg border min-h-[400px] justify-between">
            <div>
                <h2 className="text-primary">Tasks</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Add tasks to your project to define the work that needs to be done. You can add multiple tasks to your project.
                </p>
            </div>

            {tasks.map((task, index) =>
                editForm === index ?
                    (
                        <div
                            className="bg-muted rounded-lg border border-primary"
                            key={index}
                        >
                            <TaskSetup
                                buttonText="Save Task"
                                data={{ ...task, dataSource: task.dataSource || files[index] }}
                                onSubmit={(data) => editTask(index, data)} onChange={() => { }}
                                canEditType={!(data.status && data.status === "published")}
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
                            <span className="w-full truncate text-foreground font-semibold">{task.title}</span>
                            <span className="w-full ">{task.type}</span>
                            <div className="flex">
                                <Button title="edit" variant="ghost" className="text-green p-2" onClick={() => setEditForm(index)}><Edit size={15} /></Button>
                                <Button title="remove" variant="ghost" className="text-primary p-2" onClick={() => removeTask(index)}><X size={15} /></Button>
                            </div>
                        </div>
                    )
            )}

            {/* Task Setup Form (Appears when button is clicked) */}
            {showTaskForm && (
                <TaskSetup buttonText="Add Task" data={newTask} onSubmit={(data) => addTask(data)} onChange={(data) => setNewTask(data)} />
            )}

            {/* Add Task Button */}
            <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 mb-4"
                onClick={() => setShowTaskForm(!showTaskForm)}
            >
                {!showTaskForm && <PlusCircle size={15} />}
                {showTaskForm ? "Cancel" : "Add Task"}
            </Button>
            <FormMessage message={{ error: error }} />

            <div className="w-full flex justify-between">
                <CancelAlertDialog
                    projectStatus={data.status}
                    saveProject={() => data.status && !dataChanged ? undefined : onSaveProject(data, data.status as ProjectStatus || ProjectStatus.DRAFT)}
                />
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleBack}
                    >
                        <ChevronLeft size={18} className="mr-2" />
                        Back
                    </Button>
                    {isSaved ?
                        <Button
                            type="button"
                            onClick={onNext}
                        >
                            Continue
                            <ChevronRight size={18} className="ml-2" />
                        </Button> :
                        <Button
                            type="submit"
                            onClick={saveData}
                        >
                            Save
                        </Button>
                    }
                </div>
            </div>
        </motion.div>

    );
}