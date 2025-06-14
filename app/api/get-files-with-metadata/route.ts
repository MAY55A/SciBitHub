import { getFileWithMetadata } from "@/src/utils/minio/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const paths = searchParams.getAll("paths");

    if (!paths.length) {
        return NextResponse.json([], { status: 200 });
    }

    const results = await Promise.all(
        paths.map(async (path) => {
            try {
                return await getFileWithMetadata(path);
            } catch (e) {
                return null;
            }
        })
    );

    return NextResponse.json(results.filter(Boolean));
}