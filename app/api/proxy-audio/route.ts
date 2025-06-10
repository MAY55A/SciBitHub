import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
        return NextResponse.json({ error: "Missing url param" }, { status: 400 });
    }

    try {
        // Fetch the audio from your original URL
        const res = await fetch(url);

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch audio" }, { status: res.status });
        }

        // Create a streaming response with same headers
        const headers = new Headers(res.headers);
        headers.set("Access-Control-Allow-Origin", "*"); // Just in case for debugging

        return new NextResponse(res.body, {
            status: res.status,
            headers: headers,
        });
    } catch (error) {
        console.error("Error proxying audio:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}