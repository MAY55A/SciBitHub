import { ProjectInputData } from "@/src/types/project-form-data";
import MDEditor from "@uiw/react-md-editor";
import { Edit2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function Step1Card({ data, onEdit }: { data: ProjectInputData, onEdit: (step: number) => void }) {
    return (
        <Card className="flex flex-col shadow-lg justify-between border border-green">
            <CardHeader>
                <CardTitle className="text-center text-md">* Basic Project Info *</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4 text-sm">
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Name</Label>
                        <Input value={data.name} readOnly />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Short Description</Label>
                        <textarea value={data.shortDescription} className="border p-2 w-full rounded text-sm" readOnly/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Detailed Description</Label>
                        <MDEditor.Markdown
                            source={data.longDescription}
                            className="w-full border border-input rounded-lg p-2"
                            style={{
                                maxHeight: '10rem',
                                maxWidth: '100%',
                                overflowY: 'auto',
                                overflowX: 'auto',
                                scrollbarWidth: 'thin',
                                scrollbarColor: "hsl(var(--background)) hsl(var(--muted))",
                                overflowWrap: "break-word", // Prevents text overflow
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                            }} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Domain</Label>
                        <Input value={data.domain} readOnly />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-primary">Tags</Label>
                        <ul className="flex flex-wrap items-center gap-1 text-sm">
                            {data.tags?.map((tag, index) => (
                                <li key={index} className="border border-green rounded-xl p-2">{tag}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => onEdit(1)}>
                    <Edit2 size={15} className="mr-1" />
                    Edit
                </Button>
            </CardFooter>
        </Card>
    );
}