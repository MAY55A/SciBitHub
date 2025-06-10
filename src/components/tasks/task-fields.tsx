"use client"

import { useEffect, useRef, useState } from "react";
import { FormGenerator } from "./form-generator";
import { Button } from "../ui/button";
import { createContribution, hasUserContributed } from "@/src/lib/services/contribution-service";
import { FormMessage, Message } from "../custom/form-message";
import { MessageCircleQuestion, Info } from "lucide-react";
import ImageViewer from "../custom/image-viewer";
import { getRandomFile } from "@/src/utils/minio/client";
import { AudioVisualizer } from "../custom/audio-visualizer";
import { useAuth } from "@/src/contexts/AuthContext";
import Link from "../custom/Link";
import { usePathname } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "@/src/hooks/use-toast";
import { TaskType, DataType } from "@/src/types/enums";
import { Task } from "@/src/types/models";
import { Label } from "../ui/label";

export function TaskFields({ task }: { task: Task }) {
    const { user } = useAuth();
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [message, setMessage] = useState<Message | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [isFirstSurvey, setIsFirstSurvey] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [file, setFile] = useState<{ filePath: string; fileUrl: string } | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const pathname = usePathname();
    const { toast } = useToast()
    const isContributor = user && user.role === "contributor";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (file) {
            formData.data_file = file.filePath;
        }
        console.log('Form Data:', formData);
        setLoading(true);
        const res = await createContribution(formData, task.id!, task.project.moderation_level);
        setLoading(false);
        toast({
            description: res.message,
            variant: res.success ? "default" : "destructive"
        });
        if (res.success) {
            setTimeout(() => reset(), 3000);
        }
    };

    const fetchRandomFile = async () => {
        const result = await getRandomFile(task.data_source!);
        if (result) {
            setFile(result);
        }
    };

    const checkContribution = async () => {
        const result = await hasUserContributed(user!.id, task.id!);
        setIsFirstSurvey(!result);
    };

    useEffect(() => {
        if (task.type === TaskType.DATALABELLING)
            fetchRandomFile();
    }, []);

    useEffect(() => {
        if (isContributor && task.type === TaskType.SURVEY)
            checkContribution();
    }, [user]);

    const reset = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
        setFormData({});
        setMessage(undefined);
        setFile(null);
        if (task.type === TaskType.DATALABELLING) {
            fetchRandomFile();
        } else if(task.type === TaskType.SURVEY) {
            setIsFirstSurvey(false);
        }
    };

    if (!isFirstSurvey) {
        return (
            <div className="w-full flex-col justify-center rounded-lg p-10 py-24 my-8 border font-retro">
                <h3 className="text-center">You have already contributed to this task</h3>
                <p className="text-center text-sm text-muted-foreground">You can only contribute once to a survey type task</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-wrap items-center justify-center rounded-lg p-4 my-8 border">
            {task.type === TaskType.DATALABELLING &&
                <div className="flex-[0.3]">
                    <FileDisplay type={task.data_type! as DataType} source={file} />
                </div>
            }
            <div className="flex-[0.7] min-w-80 flex flex-col justify-between p-8 pb-2 px-2 rounded-lg">
                <h3 className="text-center font-semibold text-lg text-primary">Task</h3>
                <FormGenerator
                    ref={formRef}
                    fields={task.fields}
                    handleSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}>

                    <div className="items-top flex space-x-2 pt-12 font-retro">
                        <Checkbox id="terms1"
                            onCheckedChange={(checked) => setAccepted(checked.valueOf() as boolean)} />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I confirm that my contribution is accurate and appropriate.
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Providing false or inappropriate data may result in reporting or restrictions on your account.
                            </p>
                        </div>
                    </div>
                    <ul className="text-sm text-muted-foreground font-retro">
                        <li className="flex items-center gap-1"> <Info size={15} />Once submitted, contributions cannot be deleted.</li>
                        {task.type === TaskType.SURVEY && <li className="flex gap-1"> <Info size={15} />Each user can submit only once to survey type tasks.</li>}
                    </ul>

                    {!!message && <FormMessage message={message} />}

                    <div className="flex justify-between items-end space-y-4">
                        <MessageCircleQuestion className="text-green" opacity={0.3} size={15} />
                        <div className="flex items-center gap-2">
                            {!isContributor && <Link href={`/sign-in?redirect_to=${pathname}`} className="flex items-center gap-1 text-muted-foreground text-xs font-retro">
                                <Info size={15} /> You need to login as a contributor first
                            </Link>}
                            <Button type="submit" disabled={loading || !isContributor || !accepted || (task.type === TaskType.DATALABELLING && !file)}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                            {task.type === TaskType.DATALABELLING && <Button type="button" variant="secondary" disabled={loading} onClick={reset}>
                                Skip
                            </Button>}
                        </div>
                    </div>
                </FormGenerator>
            </div>
        </div>
    );
}

function FileDisplay({ type, source }: { type: DataType, source: { filePath: string; fileUrl: string } | null }) {
    if (source) {
        switch (type) {
            case DataType.IMAGE:
                return <ImageViewer images={[source.fileUrl]} />;
            case DataType.AUDIO:
                return <AudioVisualizer url={source.fileUrl} />;
        }
    }

    return <span className="h-80 min-w-80 flex justify-center items-center bg-muted text-muted-foreground border rounded-lg">No Available File</span>;
}