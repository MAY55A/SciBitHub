'use client';

import JSZip from "jszip";
import { Button } from "../ui/button";
import { getFile } from "@/src/utils/minio/client";
import Papa from "papaparse";
import saveAs from "file-saver";
import { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";

export function ExportData({ task, data, files }: { task: string, data: any, files?: Map<string, string> }) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    async function exportTaskData() {
        setIsLoading(true);
        let failedFiles = 0;
        try {
            const zip = new JSZip();

            const csv = Papa.unparse(data);
            zip.file(`${task}.csv`, csv);

            if (files && files.size > 0) {
                const folder = zip.folder(`files`);
                for (const [fileName, filePath] of Array.from(files.entries())) {
                    const url = await getFile(filePath);
                    if (!url) {
                        failedFiles++;
                        if(failedFiles > files.size/10) {
                            throw new Error(`${failedFiles} files failed to download. Please try again later.`);
                        }
                        continue
                    };
                    const response = await fetch(url);
                    const blob = await response.blob();
                    folder?.file(fileName, blob);
                }
            }
            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveAs(zipBlob, `${task}-results.zip`);
            toast({
                title: "Export successful",
                description: `Data for '${task}' has been exported successfully with ${failedFiles} missing files.`,
                variant: "default",
            });

        } catch (error) {
            console.log("Error exporting data:", error);
            toast({
                title: "Error exporting data",
                description: "There was an error exporting the data. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button variant="outline" onClick={exportTaskData} key={task} disabled={isLoading || data.length < 5} title={`Download ${task} data`}>
            <span className="truncate overflow-hidden whitespace-nowrap">{isLoading ? "Exporting data..." : `Download '${task}' data`}</span>
        </Button>
    );
}

