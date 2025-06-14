import { getFileWithMetadata } from "@/src/utils/minio/client";
import { FilesDisplay } from "../custom/files-display";

export async function DiscussionFiles({ paths }: { paths: string[] }) {
    const files = await Promise.all(
        paths.map(async (path) => {
            try {
                return await getFileWithMetadata(path);
            } catch (error) {
                console.error("Failed to fetch file:", error);
                return null;
            }
        })
    );

    return (
        <FilesDisplay files={files} />
    );
}