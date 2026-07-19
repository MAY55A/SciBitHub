import dotenv from "dotenv"
import fs from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { rmSync } from "fs";
import { createClient } from "@supabase/supabase-js";


// load .env.development.local
dotenv.config({ path: path.join(process.cwd(), ".env.development.local") })

const s3Client = new S3Client({
    region: process.env.MINIO_REGION ?? "us-east-1",
    endpoint: process.env.MINIO_ENDPOINT ?? "http://localhost:9000",
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? "minioadmin",
    }
})

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { autoRefreshToken: false, persistSession: false } }
)

const ASSET_DIR =
    path.join(process.cwd(), ".storage-assets");


async function getFiles(
    dir: string
): Promise<string[]> {

    const entries =
        await fs.readdir(
            dir,
            {
                withFileTypes: true
            }
        );

    const files: string[] = [];

    for (const entry of entries) {

        const fullPath =
            path.join(
                dir,
                entry.name
            );

        if (entry.isDirectory()) {

            files.push(
                ...await getFiles(fullPath)
            );

        } else {

            files.push(fullPath);
        }
    }

    return files;
}


async function ensureMinioBucket(
    bucket: string
) {

    try {

        await s3Client.send(
            new HeadBucketCommand({
                Bucket: bucket
            })
        );

    } catch {

        console.log(
            `Creating MinIO bucket ${bucket}`
        );

        await s3Client.send(
            new CreateBucketCommand({
                Bucket: bucket
            })
        );
    }
}


async function loadMinio() {

    const minioDir =
        path.join(
            ASSET_DIR,
            "minio"
        );

    try {

        await fs.access(minioDir);

    } catch {

        return;
    }

    const buckets =
        await fs.readdir(
            minioDir
        );

    for (const bucket of buckets) {

        await ensureMinioBucket(bucket);

        const bucketPath =
            path.join(
                minioDir,
                bucket
            );

        const files =
            await getFiles(bucketPath);


        for (const file of files) {

            const key =
                path.relative(
                    bucketPath,
                    file
                )
                    .replaceAll("\\", "/");

            console.log(
                `MinIO: ${bucket}/${key}`
            );

            await s3Client.send(
                new PutObjectCommand({

                    Bucket: bucket,

                    Key: key,

                    Body:
                        await fs.readFile(file)

                })
            );
        }
    }
}


async function loadSupabase() {

    const supabaseDir =
        path.join(
            ASSET_DIR,
            "supabase"
        );

    try {

        await fs.access(supabaseDir);

    } catch {

        return;
    }

    const buckets =
        await fs.readdir(
            supabaseDir
        );

    for (const bucket of buckets) {

        const bucketPath =
            path.join(
                supabaseDir,
                bucket
            );

        const files =
            await getFiles(bucketPath);

        for (const file of files) {

            const key =
                path.relative(
                    bucketPath,
                    file
                )
                    .replaceAll("\\", "/");

            console.log(
                `Supabase: ${bucket}/${key}`
            );

            const { error } =
                await supabase.storage
                    .from(bucket)
                    .upload(
                        key,
                        await fs.readFile(file),
                        {
                            upsert: true
                        }
                    );

            if (error) {
                throw error;
            }
        }
    }
}


async function cleanup() {
    const ASSETS_DIR = path.join(process.cwd(), ".storage-assets");
    rmSync(ASSETS_DIR, { recursive: true, force: true })
    console.log("Cleaned up temporary assets")
}

async function main() {

    await loadMinio();

    await loadSupabase();

    console.log(
        "Storage seed completed!"
    );

    await cleanup();
}


main()
    .catch(error => {

        console.error(error);

        process.exit(1);

    });