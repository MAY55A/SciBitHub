"use client"

import { Button } from "../ui/button";
import { useMultistepProjectForm } from "@/src/contexts/multistep-project-form-context";
import { ChevronLeft } from "lucide-react";
import { Step1Card } from "./card-step1";
import { Step2Card } from "./card-step2";
import { Step3Card } from "./card-step3";
import { Step4Card } from "./card-step4";
import { ProjectStatus } from "@/src/types/models";
import { CancelAlertDialog } from "./cancel-alert-dialog";
import { ProjectInputData } from "@/src/types/project-form-data";

export function Step5({ onBack, onEdit, onSaveProject }: { onBack: () => void, onEdit: (step: number) => void, onSaveProject: (data: ProjectInputData, status: ProjectStatus) => void}) {
    const { data } = useMultistepProjectForm();


    const handleSave = async (status: ProjectStatus) => {

    };

    return (
        <form
            className="w-full flex flex-col gap-8 p-6 shadow-lg rounded-lg border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <Step1Card data={data} onEdit={onEdit} />
                <Step2Card data={data} onEdit={onEdit} />
                <Step3Card data={data} onEdit={onEdit} />
                <Step4Card data={data} onEdit={onEdit} />
            </div>
            <div className="w-full max-w-80 flex flex-col gap-2 self-center">
                <Button
                    type="button"
                    onClick={() => onSaveProject(data, ProjectStatus.PENDING)}
                >
                    Publish
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onSaveProject(data, ProjectStatus.DRAFT)}
                >
                    Save as Draft
                </Button>
            </div>

            <div className="w-full flex justify-between">
                <CancelAlertDialog
                    saveDraft={() => onSaveProject(data, ProjectStatus.DRAFT)}
                />
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onBack}
                >
                    <ChevronLeft size={18} className="mr-2" />
                    Back
                </Button>
            </div>
        </form>
    );
}