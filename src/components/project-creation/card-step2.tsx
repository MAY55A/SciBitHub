import { ProjectInputData } from "@/src/types/project-form-data";
import { Edit2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatDate } from "@/src/utils/utils";

export function Step2Card({ data, onEdit }: { data: ProjectInputData, onEdit: (step: number) => void }) {
    return (
        <Card className="flex flex-col shadow-lg justify-between border border-green">
            <CardHeader>
                <CardTitle className="text-center text-md">* Settings *</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4 text-sm">
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Visibility</Label>
                        <Input value={data.visibility} readOnly />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Participation</Label>
                        <Input value={data.participationLevel} readOnly />
                    </div>
                    {data.participants &&
                        <div className="flex flex-col space-y-1.5">
                            <Label className="text-primary">Participants</Label>
                            <Input value={data.participants.length + " participants"} readOnly />
                        </div>
                    }
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Scope</Label>
                        <Input value={data.scope} readOnly />
                    </div>
                    {data.countries &&
                        <div className="flex flex-col space-y-1.5">
                            <Label className="text-primary">Countries</Label>
                            <ul className="flex flex-wrap items-center gap-1 text-sm">
                                {data.countries.map((country, index) => (
                                    <li key={index} className="border border-green rounded-xl p-2">{country}</li>
                                ))}
                            </ul>
                        </div>
                    }
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Moderation</Label>
                        <Input value={data.moderationLevel} readOnly />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Deadline</Label>
                        <Input value={formatDate(data.deadline?.toString() || "", true) || "not specified"} readOnly />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => onEdit(2)}>
                    <Edit2 size={15} className="mr-1" />
                    Edit
                </Button>
            </CardFooter>
        </Card>
    );
}