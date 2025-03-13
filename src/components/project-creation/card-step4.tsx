import { ProjectInputData } from "@/src/types/project-form-data";
import { Edit2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import Image from 'next/image'
import { Button } from "../ui/button";

export function Step4Card({ data, onEdit }: { data: ProjectInputData, onEdit: (step: number) => void }) {

    return (
        <Card className="flex flex-col shadow-lg justify-between border border-green">
            <CardHeader>
                <CardTitle className="text-center text-md">* Resources *</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap w-full items-center justify-center gap-4 text-sm">
                    {!data.coverImage && (!data.links || data.links?.length === 0) &&
                        <p className="self-center text-muted-foreground">No resources added</p>
                    }
                    
                    {data.coverImage &&
                        <div className="flex flex-col space-y-1.5">
                            <Label className="text-primary">Cover Image</Label>
                            <Image
                                src={data.coverImage}
                                alt="Preview"
                                width={300}
                                height={300}
                                className='rounded-lg'
                            />
                        </div>
                    }
                    {data.links &&
                        <div className="flex flex-col space-y-1.5 whitespace-anywhere break-words">
                            <Label className="text-primary">External Links</Label>
                            <ul className="list-disc text-sm pl-6 pt-6 underline decoration-primary">
                                {data.links.map((link, index) => (
                                    <li key={index} className="break-all" ><a href={link} className="break-all">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => onEdit(4)}>
                    <Edit2 size={15} className="mr-1" />
                    Edit
                </Button>
            </CardFooter>
        </Card>
    );
}