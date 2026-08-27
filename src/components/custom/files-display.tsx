'use client';

import { Download, File } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import saveAs from "file-saver";

export const FilesDisplay = ({ files }: { files: (FileFromPath | null)[] }) => {
    const handleDownload = async (e: React.MouseEvent, file: FileFromPath) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!file.preview) {
            console.error("No preview URL available for download");
            return;
        }
        
        try {
            // Option 1: If file.preview is a direct URL to the file
            const response = await fetch(file.preview);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            saveAs(blob, file.name);
        } catch (error) {
            console.error("Failed to download file:", error);
            // Option 2: Fallback - open in new tab if fetch fails
            // window.open(file.preview, '_blank');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, i) => (
                file ? (
                    <div
                        key={i}
                        className="relative flex items-center gap-4 border p-4 rounded-lg shadow group hover:bg-accent transition cursor-pointer"
                        onClick={() => window.open(file.preview || '#', '_blank')}
                    >
                        <Button
                            type="button"
                            variant="secondary"
                            className="p-2 h-8 absolute top-1 right-2 text-sm opacity-0 group-hover:opacity-100"
                            title="Download file"
                            onClick={(e) => handleDownload(e, file)}
                        >
                            <Download size={15} />
                        </Button>
                        {file.type.startsWith("image/") && file.preview ? (
                            <Image
                                src={file.preview}
                                alt={file.name}
                                width={80}
                                height={80}
                                className="object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-muted text-muted-foreground flex flex-col items-center justify-center rounded text-xs">
                                <File size={20} />
                                {file.type.split("/")[1] || "file"}
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-sm break-all">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {file.type || "Unknown type"} – {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                ) : (
                    <div key={i} className="h-20 text-center bg-muted text-muted-foreground flex flex-col items-center justify-center rounded text-xs gap-2">
                        <File size={20} />
                        File not available
                    </div>
                )
            ))}
        </div>
    );
};