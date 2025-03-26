"use client"

import MDEditor from "@uiw/react-md-editor";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

export function TaskTutorial({ tutorial }: { tutorial: string }) {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="w-full">Open Tutorial</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle className="text-center font-semibold text-lg text-green mb-8">Tutorial</SheetTitle>
                    <MDEditor.Markdown source={tutorial} style={{ backgroundColor: "transparent" }} className="p-8" />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}