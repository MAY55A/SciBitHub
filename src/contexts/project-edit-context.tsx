"use client"

import { createContext, ReactNode, useContext, useState } from "react";
import { ProjectInputData } from "../types/project-form-data";
import { TaskFilesMap } from "./multistep-project-form-context";


// Create context for editing
const ProjectEditContext = createContext<{
    data: ProjectInputData;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    updateData: (newData: Partial<ProjectInputData>) => void;
    resetToOriginal: () => void;
    files: TaskFilesMap;
    setFiles: (files: TaskFilesMap) => void;
} | null>(null);

// Provider for editing an existing project
export function ProjectEditProvider({
    children,
    initialData,
}: {
    children: ReactNode;
    initialData: ProjectInputData;
}) {
    const [data, setData] = useState<ProjectInputData>(initialData);
    const [currentStep, setCurrentStep] = useState(1);
    const [files, setFiles] = useState<TaskFilesMap>({});


    // Update function
    const updateData = (newData: Partial<ProjectInputData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    // Reset to original data
    const resetToOriginal = () => {
        setData(initialData);
    };

    return (
        <ProjectEditContext.Provider value={{ data, currentStep, setCurrentStep, updateData, resetToOriginal, files, setFiles }}>
            {children}
        </ProjectEditContext.Provider>
    );
}

export function useProjectEdit() {
    const context = useContext(ProjectEditContext);
    if (!context) {
        throw new Error("useProjectEdit must be used within a ProjectEditProvider");
    }
    return context;
}