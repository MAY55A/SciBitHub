import { cn } from "@/src/lib/utils";
import { Check } from "lucide-react";

export default function Stepper({ steps, currentStep, completed, onClickStep }: { steps: string[]; currentStep: number; completed: number, onClickStep: (step: number) => void }) {
    return (
        <div className="w-full flex flex-wrap justify-center items-center mx-auto my-6">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    {/* Step Indicator */}
                    <div
                        className={cn("w-10 h-10 flex items-center justify-center rounded-full bg-muted font-bold transition-all border cursor-pointer",
                            index <= currentStep ? "text-green" : "",
                            index === currentStep ? "border-green" : "")}
                            onClick={() => index <= completed && index !== currentStep ? onClickStep(index + 1) : undefined}
                    >
                        {index < completed && index !== currentStep ?
                            <Check className="text-green"/>
                            : index + 1}
                    </div>

                    {/* Step Label */}
                    <span className={cn("ml-2 text-sm font-medium", index < completed ? "text-green" : "text-muted-foreground")}>
                        {step}
                    </span>

                    {/* Line Connector (except last step) */}
                    {index < steps.length - 1 && (
                        <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                    )}
                </div>
            ))}
        </div>
    );
}