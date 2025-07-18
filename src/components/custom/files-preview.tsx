import { Button } from "../ui/button";
import Image from "next/image";
import { X, File } from "lucide-react";
import Link from "next/link";

export const FilesPreview = ({ files, onRemove }: { files: FileWithPreview[] | FileFromPath[], onRemove?(name: string, path?: string): void }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-retro">
            {files.map((file, i) => (
                <Link key={i} className="relative flex items-center gap-4 border p-4 rounded-lg shadow group max-w-96" href={file.preview || "#"} target="_blank" rel="noopener noreferrer">
                    {onRemove && <Button
                        type="button"
                        variant="secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove(file.name, "path" in file ? file.path : "");
                        }} className="p-2 h-8 absolute top-1 right-2 text-sm opacity-0 group-hover:opacity-100"
                        title="Remove"
                    >
                        <X size={15} />
                    </Button>}
                    {file.preview ? (
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
                            {file.type?.split("/")[1] || "file"}
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-sm break-all">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {file.type || "Unknown type"} – {(file.size / 1024).toFixed(1)} KB
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}