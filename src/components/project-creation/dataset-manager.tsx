'use client';

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { deleteFromMinIO, uploadFileToMinIO } from "@/src/utils/minio/client";
import { FilesPreview } from "../custom/files-preview";
import { toast } from "@/src/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
    sourcePath: string;
    dataType: "image" | "audio";
    initialFiles: FileFromPath[];
    canEdit: boolean;
};

export default function DatasetManager({ sourcePath, dataType, initialFiles, canEdit }: Props) {
    const [existingFiles, setExistingFiles] = useState<FileFromPath[]>(initialFiles);
    const [files, setFiles] = useState<FileFromPath[]>(initialFiles);
    const [newFiles, setNewFiles] = useState<FileWithPreview[]>([]);
    const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClickUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (!selected) return;
        const newUploaded = Array.from(selected).map((file) => (
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        ));
        setNewFiles((prev) => [...prev, ...newUploaded]);
    };

    const handleDelete = (path: string) => {
        setDeletedFiles((prev) => [...prev, path]);
        setFiles((prev) => prev.filter((f) => f.path !== path));
    };

    const reset = () => {
        setDeletedFiles([]);
        setNewFiles([]);
        setFiles(existingFiles);
    };

    const saveDataset = async () => {
        setLoading(true);
        const deleted: string[] = [];

        // DELETE files
        await Promise.all(
            deletedFiles.map(async (path) => {
                try {
                    await deleteFromMinIO(path);
                    deleted.push(path);
                } catch (error) {
                    toast({
                        description: `Failed to delete ${path.split("/").pop()}`,
                        variant: "destructive",
                    });
                }
            })
        );
        const addedFiles: FileFromPath[] = [];
        // UPLOAD new files
        await Promise.all(
            newFiles.map(async (file, index) => {
                try {
                    const filePath = `${sourcePath}/${Date.now()}-${index}-${file.name}`;
                    await uploadFileToMinIO(file, filePath);
                    addedFiles.push({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        preview: file.preview,
                        path: filePath
                    });
                } catch (error) {
                    toast({
                        description: `Failed to upload ${file.name}`,
                        variant: "destructive",
                    });
                }
            })
        );
        const totalFiles = [...addedFiles, ...existingFiles.filter(f => !deleted.includes(f.path))]
        setExistingFiles(totalFiles);
        setFiles(totalFiles);
        setDeletedFiles([]);
        setNewFiles([]);
        setLoading(false);
        toast({ description: "Dataset saved" });
    };

    return canEdit ? (
        <div className="p-6 space-y-6">
            <div className="flex justify-between gap-4">
                <>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={loading}
                        onClick={handleClickUpload}
                        type="button" // important: prevent it from being interpreted as submit
                    >
                        <Upload size={18} />
                        <span className="text-sm">Upload Files</span>
                    </Button>

                    <Input
                        type="file"
                        multiple
                        accept={dataType === "image" ? "image/*" : "audio/*"}
                        onChange={handleUpload}
                        className="hidden"
                        ref={fileInputRef}
                        disabled={loading}
                    />
                </>
                <div className="flex items-center gap-4">
                    <Button onClick={reset} disabled={loading || (newFiles.length === 0 && deletedFiles.length === 0)} variant="secondary">
                        Reset Dataset
                    </Button>
                    <Button onClick={saveDataset} disabled={loading || (newFiles.length === 0 && deletedFiles.length === 0)}>
                        Save Dataset
                    </Button>
                </div>
            </div>
            <div className="min-h-80 flex flex-wrap gap-6">
                <div className="flex-1 border p-4 rounded-lg">
                    <div className="min-w-[400px] flex items-center justify-between mb-4">
                        <h3 className="text-green">Files</h3>
                        <span className="font-retro">{files.length} files</span>
                    </div>
                    {files.length ?
                        <FilesPreview files={files} onRemove={(_, path) => handleDelete(path!)} />
                        : <p className="flex h-full justify-center items-center text-muted-foreground font-retro p-4">Dataset is Empty</p>
                    }
                </div>
                <div className="flex-2 min-w-[400px] border p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-green">Added Files</h3>
                        <span className="font-retro">{newFiles.length} files</span>
                    </div>
                    {newFiles.length ?
                        <FilesPreview files={newFiles} onRemove={(name) => setNewFiles(prev => prev.filter(f => f.name !== name))} /> : (
                            <p className="flex h-full justify-center items-center text-muted-foreground font-retro p-4">No new files added</p>
                        )}
                </div>
            </div>
        </div>
    ) : (
        <div className="flex-1 border p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-green">Files</h3>
                <span className="font-retro">{files.length} files</span>
            </div>
            <FilesPreview files={files} />
        </div>
    );
}