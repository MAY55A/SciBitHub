"use client"

import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Step1Card } from "./card-step1";
import { Step2Card } from "./card-step2";
import { Step3Card } from "./card-step3";
import { Step4Card } from "./card-step4";
import { CancelAlertDialog } from "./cancel-alert-dialog";
import { ProjectInputData } from "@/src/types/project-form-data";
import { ProjectStatus } from "@/src/types/enums";

export default function Step5({ data, onBack, onEdit, onSaveProject, dataChanged }: { data: ProjectInputData, onBack: () => void, onEdit: (step: number) => void, onSaveProject: (data: ProjectInputData, status?: ProjectStatus) => void, dataChanged?: boolean }) {

    return (
        <form
            className="w-full flex flex-col gap-8 p-6 shadow-lg rounded-lg border animate-fade-slide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <Step1Card data={data} onEdit={onEdit} />
                <Step2Card data={data} onEdit={onEdit} />
                <Step3Card data={data} onEdit={onEdit} />
                <Step4Card data={data} onEdit={onEdit} />
            </div>

            {data.status && data.status !== ProjectStatus.DRAFT ?
                (<div className="w-full max-w-80 flex flex-col gap-2 self-center">
                    <Button
                        type="button"
                        onClick={() => onSaveProject(data)}
                    >Save</Button>
                </div>) :
                (<div className="w-full max-w-80 flex flex-col gap-2 self-center">
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
                </div>)
            }

            <div className="w-full flex justify-between">
                <CancelAlertDialog
                    projectStatus={data.status}
                    saveProject={() => data.status && !dataChanged ? undefined : onSaveProject(data, data.status as ProjectStatus || ProjectStatus.DRAFT)}
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