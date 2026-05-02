import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const dataPath = join(process.cwd(), "data", "users.json");
    let users: User[] = [];
    try {
      users = JSON.parse(readFileSync(dataPath, "utf-8"));
    } catch {
      // file may not exist yet
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Always return success to avoid email enumeration attacks
    if (user) {
      // In production: send a real password reset email here
      // For now, we log the request and return success silently
      console.log(`[forgot-password] Reset requested for: ${email}`);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
