"use client";

import { cn } from "@/src/lib/utils";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FilesPreview } from "./files-preview";

type FileDropzoneProps = {
    files: any[];
    onUploadFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
    onRemoveFile: (name: string) => void;
    maxFiles?: number;
    maxSizeMB?: number;
};

export default function FileDropzone({ files, onUploadFiles, onRemoveFile, maxFiles = 5, maxSizeMB = 5 }: FileDropzoneProps) {
    const [errors, setErrors] = useState<string[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newErrors: string[] = [];
            const existingNames = new Set(files.map((f) => f.name));
            const remainingSlots = maxFiles - files.length;

            const validFiles: FileWithPreview[] = [];

            for (const file of acceptedFiles) {
                if (validFiles.length >= remainingSlots) {
                    newErrors.push("Maximum number of files reached.");
                    break;
                }

                if (existingNames.has(file.name)) {
                    newErrors.push("File with the same name already picked");
                    continue;
                }

                if (file.size > maxSizeMB * 1024 * 1024) {
                    newErrors.push(
                        `File too large: (${(file.size / 1024 / 1024).toFixed(
                            2
                        )} MB)`
                    );
                    continue;
                }

                const fileWithPreview: FileWithPreview = Object.assign(file, {
                    preview: file.type.startsWith("image/")
                        ? URL.createObjectURL(file)
                        : null,
                });

                validFiles.push(fileWithPreview);
            }

            if (validFiles.length > 0) {
                onUploadFiles((prev: FileWithPreview[]) => [...prev, ...validFiles]);
            }

            setErrors(newErrors);
        },
        [files, maxFiles, maxSizeMB, onUploadFiles, onRemoveFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        noClick: files.length >= maxFiles,
    });

    return (
        <div className="space-y-4 m-2">
            {files.length > 0 && (
                <FilesPreview files={files} onRemove={onRemoveFile} />
            )}
            <div
                {...getRootProps()}
                className={cn("border-2 border-dashed p-6 rounded-xl text-center text-muted-foreground",
                    isDragActive && "border-green",
                    errors.length > 0 && "bg-red-500/10 border-destructive"
                )}
            >
                <input {...getInputProps()} />
                {isDragActive ?
                    <p>Drop the files here...</p> :
                    files.length >= maxFiles ?
                        <p>You can upload up to {maxFiles} files.</p> :
                        <p>Drag & drop files here, or click to select</p>
                }

                {errors.length > 0 && (
                    <div className="text-red-700 p-4 space-y-1 text-sm">
                        {errors.map((err, i) => (
                            <p key={i}>• {err}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

