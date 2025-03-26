"use client"

import { FormMessage, Message } from "@/src/components/custom/form-message";
import { Step1 } from "@/src/components/project-creation/step1";
import { Step2 } from "@/src/components/project-creation/step2";
import { Step3 } from "@/src/components/project-creation/step3";
import { Step4 } from "@/src/components/project-creation/step4";
import { Step5 } from "@/src/components/project-creation/step5";
import { useProjectEdit } from "@/src/contexts/project-edit-context";
import useNavigationGuard from "@/src/hooks/use-navigation-guard";
import { updateProject } from "@/src/lib/project-service";
import { ProjectStatus } from "@/src/types/models";
import { ProjectInputData } from "@/src/types/project-form-data";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export default function Page() {
    const { data, currentStep, updateData, setCurrentStep, files, setFiles } = useProjectEdit();
    const [message, setMessage] = useState<Message | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const initialData = useRef(data);
    const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initialData.current), [data]);
    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);
    const goToStep = (step: number) => setCurrentStep(step);
    useNavigationGuard(isDirty);

    const handleSave = async (data: Partial<ProjectInputData>, status?: ProjectStatus) => {
        try {
            setIsLoading(true);
            if (status)
                data.status = status;
            const res = await updateProject(initialData.current, data, files);
            setIsLoading(false);
            if (res.success) {
                setMessage({ success: res.message });
                setTimeout(() => router.push("/profile/projects"), 3000);
            } else {
                setMessage({ error: res.message });
                setTimeout(() => setMessage(undefined), 2000);
            }
        } catch (err) {
            setIsLoading(false);
            setMessage({ error: "An error occurred while saving the project." });
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
        <div className="w-full max-w-[1000px] flex flex-col items-center justify-center min-h-80 m-8">
            <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
            {currentStep === 1 && <Step1 initialName={initialData.current.name} data={data} onUpdate={updateData} onNext={nextStep} onSaveStep={() => { }} onSaveProject={handleSave} dataChanged={isDirty} />}
            {currentStep === 2 && <Step2 data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} onSaveStep={() => { }} onSaveProject={handleSave} dataChanged={isDirty} />}
            {currentStep === 3 && <Step3 data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} onSaveStep={() => { }} onSaveProject={handleSave} files={files} updateFiles={setFiles} dataChanged={isDirty} />}
            {currentStep === 4 && <Step4 data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} onSaveStep={() => { }} onSaveProject={handleSave} dataChanged={isDirty} />}
            {currentStep === 5 && <Step5 data={data} onBack={prevStep} onEdit={goToStep} onSaveProject={handleSave} dataChanged={isDirty} />}
        </div>
    );
}