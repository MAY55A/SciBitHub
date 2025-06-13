import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "us-east-1",
    endpoint: "http://localhost:9000",
    forcePathStyle: true,
    credentials: {
        accessKeyId: "minioadmin",
        secretAccessKey: "minioadmin",
    }
});

const bucketName = "sci-bit-hub";

export const uploadFileToMinIO = async (file: File, filePath: string) => {
    const arrayBuffer = await file.arrayBuffer(); // Get ArrayBuffer from File
    const uint8Array = new Uint8Array(arrayBuffer); // Convert to Uint8Array

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        Body: uint8Array,
        ContentType: file.type,
    });

    await s3Client.send(command);
    //return `http://localhost:9000/sci-bit-hub/${filePath}`; // Public URL
};

export const deleteFromMinIO = async (filePath: string, isFolder: boolean = false) => {
    if (isFolder) {
        const prefix = filePath.endsWith("/") ? filePath : `${filePath}/`;
        let continuationToken: string | undefined = undefined;

        const allObjects: { Key: string }[] = [];

        do {
            const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
                Bucket: bucketName,
                Prefix: prefix,
                ContinuationToken: continuationToken,
            });

            const response = await s3Client.send(listCommand);

            if (response.Contents) {
                for (const obj of response.Contents) {
                    if (obj.Key) {
                        allObjects.push({ Key: obj.Key });
                    }
                }
            }

            continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
        } while (continuationToken);

        if (allObjects.length === 0) {
            console.log("No files found in folder.");
            return;
        }

        // Delete in chunks of 1000 (S3 limit per delete batch)
        const chunkSize = 1000;
        for (let i = 0; i < allObjects.length; i += chunkSize) {
            const chunk = allObjects.slice(i, i + chunkSize);
            const deleteCommand = new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: { Objects: chunk },
            });
            await s3Client.send(deleteCommand);
        }

        console.log(`Deleted folder recursively: ${filePath}`);
    } else {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: filePath,
        });
        await s3Client.send(deleteCommand);
        console.log(`Deleted file: ${filePath}`);
    }
};

export const getFile = async (filePath: string) => {
    try {
        // Check if the file exists
        await s3Client.send(new HeadObjectCommand({
            Bucket: bucketName,
            Key: filePath,
        }));

        // If the file exists, generate a signed URL (valid for 1 hour)
        const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: filePath,
        });

        const fileUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
        return fileUrl;

    } catch (error) {
        console.log("Error fetching file:", error);
        return null;
    }
};

export const getFileWithMetadata = async (filePath: string) => {
    try {
        const headResult = await s3Client.send(new HeadObjectCommand({
            Bucket: bucketName,
            Key: filePath,
        }));

        const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: filePath,
        });

        const fileUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

        return {
            path: filePath,
            preview: fileUrl,
            name: filePath.split("/").pop() || "",
            type: headResult.ContentType || "application/octet-stream",
            size: headResult.ContentLength || 0,
        };
    } catch (error) {
        console.log("Error fetching file:", error);
        return null;
    }
};

export const getRandomFile = async (folderPath: string) => {
    try {
        // List all files in the folder
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: folderPath,
        });

        const response = await s3Client.send(command);
        const files = response.Contents?.map((obj) => obj.Key) || [];

        if (files.length === 0) {
            console.log("No files found in folder:", folderPath);
            return null;
        }

        // Pick a random file
        const randomFile = files[Math.floor(Math.random() * files.length)];

        if (!randomFile) {
            console.log("No file found in folder:", folderPath);
            return null;
        }

        // Generate a signed URL (valid for 1 hour)
        const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: randomFile,
        });
        const fileUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

        return { filePath: randomFile, fileUrl };
    } catch (error) {
        console.log("Error fetching random file:", error);
        return null;
    }
};
