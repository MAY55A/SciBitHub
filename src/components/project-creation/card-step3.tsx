import { ProjectInputData } from "@/src/types/project-form-data";
import { Edit2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

export function Step3Card({ data, onEdit }: { data: ProjectInputData, onEdit: (step: number) => void }) {
    return (
        <Card className="flex flex-col shadow-lg justify-between border border-green">
            <CardHeader>
                <CardTitle className="text-center text-md">* Tasks *</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {data.tasks.map((task, index) =>
                        <div
                            className="flex justify-between items-center gap-4 text-sm text-muted-foreground bg-muted p-4 rounded-lg border border-primary"
                            key={index}
                        >
                            <span className="truncate text-foreground font-semibold">{task.title}</span>
                            <span>{task.type}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => onEdit(3)}>
                    <Edit2 size={15} className="mr-1" />
                    Edit
                </Button>
            </CardFooter>
        </Card >
    );
}