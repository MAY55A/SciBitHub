import { getFileWithMetadata } from "@/src/utils/minio/client";
import { Button } from "../ui/button";
import Image from "next/image";
import { Download, File } from "lucide-react";

export async function DiscussionFiles({ paths }: { paths: string[] }) {
    const files = (await Promise.all(paths.map(async (path) => await getFileWithMetadata(path))));
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, i) =>
                file ? (
                    <a
                        key={i}
                        href={file.preview || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex items-center gap-4 border p-4 rounded-lg shadow group hover:bg-accent transition"
                    >
                        <Button
                            type="button"
                            variant="secondary"
                            className="p-2 h-8 absolute top-1 right-2 text-sm opacity-0 group-hover:opacity-100"
                            title="download"
                        >
                            <Download size={15} />
                        </Button>
                        {file.type.startsWith("image/") ? (
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
                            <p className="font-medium text-sm break-all">{file?.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {file.type || "Unknown type"} – {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </a>) : (
                    <div key={i} className="h-20 text-center bg-muted text-muted-foreground flex flex-col items-center justify-center rounded text-xs gap-2">
                        <File size={20} />
                        File not available
                    </div>
                ))}
        </div>
    );
}