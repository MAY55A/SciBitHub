"use client"

import { FormMessage, Message } from "@/src/components/custom/form-message";
import Stepper from "@/src/components/custom/stepper";
import { Step1 } from "@/src/components/project-creation/step1";
import { Step2 } from "@/src/components/project-creation/step2";
import { Step3 } from "@/src/components/project-creation/step3";
import { Step4 } from "@/src/components/project-creation/step4";
import { Step5 } from "@/src/components/project-creation/step5";
import { useMultistepProjectForm } from "@/src/contexts/multistep-project-form-context";
import { createProject } from "@/src/lib/project-service";
import { ProjectStatus } from "@/src/types/enums";
import { ProjectInputData } from "@/src/types/project-form-data";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProjectCreationWizard() {
    const { data, updateData, currentStep, setCurrentStep, completedSteps, setCompletedSteps, resetForm, files, setFiles } = useMultistepProjectForm();
    const steps = ["Basic Information", "Participation & Visibility", "Tasks Setup", "Supporting Materials", "Review & Submit"];
    const [message, setMessage] = useState<Message | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const completeStep = () => {
        if (currentStep > completedSteps) {
            setCompletedSteps(currentStep);
        }
    }

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);
    const goToStep = (step: number) => setCurrentStep(step);


    const handleSave = async (data: Partial<ProjectInputData>, status?: ProjectStatus) => {
        if (completedSteps === 0) {
            return;
        }
        setIsLoading(true);
        const res = await createProject(data, status ?? ProjectStatus.DRAFT, files);
        setIsLoading(false);
        if (res.success) {
            if (currentStep === 5) {
                completeStep();
            }
            setMessage({ success: res.message });
            setTimeout(() => {
                resetForm();
                router.push("/profile/projects")
            }
                , 2000);
        } else {
            setMessage({ error: res.message });
            setTimeout(() => setMessage(undefined), 2000);
        }
    };

    if (message) {
        return (
            <div className="w-full flex flex-col items-center h-80 sm:max-w-md p-4 justify-center">
                <FormMessage message={message} classname="py-4 text-lg" />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center h-80 sm:max-w-md p-4 justify-center mt-10">
                <span>Saving....</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-80 m-8">
            <h1 className="text-2xl font-bold mb-4">Create A New Project</h1>
            <Stepper steps={steps} currentStep={currentStep - 1} completed={completedSteps} onClickStep={goToStep} />
            {currentStep === 1 && <Step1 data={data} onUpdate={updateData} onNext={nextStep} onSaveStep={completeStep} onSaveProject={handleSave} />}
            {currentStep === 2 && <Step2 data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} onSaveStep={completeStep} onSaveProject={handleSave} />}
            {currentStep === 3 && <Step3 data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} onSaveStep={completeStep} onSaveProject={handleSave} files={files} updateFiles={setFiles} />}
            {currentStep === 4 && <Step4 data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} onSaveStep={completeStep} onSaveProject={handleSave} />}
            {currentStep === 5 && <Step5 data={data} onBack={prevStep} onEdit={goToStep} onSaveProject={handleSave} />}
        </div>
    );
}