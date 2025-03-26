import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

const ALLOWED_TABLES: Record<string, string[]> = {
    users: ["username", "email"], // Only allow checking username or email in users table
    projects: ["name"], // Example: Checking project titles
};

export async function POST(req: Request) {
    const supabase = await createClient();
    const { table, attribute, value }: { table: string; attribute: string; value: string } = await req.json();

    // Validate table and attribute
    if (!table || !attribute || !value) {
        return NextResponse.json({ error: "Table, attribute, and value are required" }, { status: 400 });
    }

    if (!(table in ALLOWED_TABLES) || !ALLOWED_TABLES[table].includes(attribute)) {
        return NextResponse.json({ error: "Unauthorized table or attribute" }, { status: 403 });
    }

    // Perform the database query
    const { data, error } = await supabase
        .from(table)
        .select("id")
        .eq(attribute, value)
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exists: !!data }, { status: 200 });
}