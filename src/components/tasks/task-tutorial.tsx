"use client"

import MDEditor from "@uiw/react-md-editor";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { MarkdownViewer } from "../custom/markdown-viewer";

export function TaskTutorial({ tutorial }: { tutorial: string }) {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="w-full">Open Tutorial</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[95vh]">
                <SheetHeader>
                    <SheetTitle className="text-center font-semibold text-lg text-green mb-8">Tutorial</SheetTitle>
                    <MarkdownViewer source={tutorial} className="p-8 max-h-[80vh] overflow-y-auto flex flex-col items-center" />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}