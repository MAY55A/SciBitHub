"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ProjectInputData } from "../types/project-form-data";
import { ModerationLevel, ParticipationLevel, ProjectVisibility, Scope } from "../types/enums";


export type TaskFilesMap = {
    [taskId: string]: File[];
};
// Default values for the form
const defaultFormData: ProjectInputData = {
    name: "",
    shortDescription: "",
    longDescription: "",
    domain: "",
    scope: Scope.GLOBAL,
    visibility: ProjectVisibility.PUBLIC,
    participationLevel: ParticipationLevel.OPEN,
    moderationLevel: ModerationLevel.NONE,
    tasks: [],
};

// Create context with TypeScript
const MultistepProjectFormContext = createContext<{
    data: ProjectInputData;
    updateData: (newData: Partial<ProjectInputData>) => void;
    resetForm: () => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    completedSteps: number;
    setCompletedSteps: (steps: number) => void;
    files: TaskFilesMap;
    setFiles: (files: TaskFilesMap) => void;
}>({
    data: defaultFormData,
    currentStep: 1,
    completedSteps: 0,
    updateData: () => { },
    resetForm: () => { },
    setCurrentStep: () => { },
    setCompletedSteps: () => { },
    files: {},
    setFiles: () => { },
});

const DATA_STORAGE_KEY = "multistep_project_form_data";
const COMPLETED_STEPS_STORAGE_KEY = "multistep_project_form_completed_steps";
const CURRENT_STEP_STORAGE_KEY = "multistep_project_form_current_step";

// Provider component
export function MultistepProjectFormProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ProjectInputData>(() => {
        const savedData = sessionStorage.getItem(DATA_STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : defaultFormData;
    });
    const [currentStep, setCurrentStep] = useState(() => {
        const steps = sessionStorage.getItem(CURRENT_STEP_STORAGE_KEY);
        return Number(steps ?? "1");
    });
    const [completedSteps, setCompletedSteps] = useState(() => {
        const steps = sessionStorage.getItem(COMPLETED_STEPS_STORAGE_KEY);
        return Number(steps ?? "0");
    });
    const [files, setFiles] = useState<TaskFilesMap>({});


    // Update sessionStorage whenever data changes
    useEffect(() => {
        sessionStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        sessionStorage.setItem(CURRENT_STEP_STORAGE_KEY, JSON.stringify(currentStep));
    }, [currentStep]);

    useEffect(() => {
        sessionStorage.setItem(COMPLETED_STEPS_STORAGE_KEY, JSON.stringify(completedSteps));
    }, [completedSteps]);

    // Function to update the form data
    const updateData = (newData: Partial<ProjectInputData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    // Function to reset the form
    const resetForm = () => {
        setData(defaultFormData);
        setCurrentStep(1);
        setCompletedSteps(0);
        sessionStorage.removeItem(DATA_STORAGE_KEY);
        sessionStorage.removeItem(CURRENT_STEP_STORAGE_KEY);
        sessionStorage.removeItem(COMPLETED_STEPS_STORAGE_KEY);
    };

    return (
        <MultistepProjectFormContext.Provider value={{ data, updateData, resetForm, currentStep, setCurrentStep, completedSteps, setCompletedSteps, files, setFiles }}>
            {children}
        </MultistepProjectFormContext.Provider>
    );
}

// Custom hook to use the context
export function useMultistepProjectForm() {
    return useContext(MultistepProjectFormContext);
}