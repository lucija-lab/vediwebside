import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  [key: string]: unknown;
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
      return NextResponse.json({ ok: true });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      const token = randomBytes(32).toString("hex");
      const expiry = Date.now() + 60 * 60 * 1000; // 1 sat

      user.resetToken = token;
      user.resetTokenExpiry = expiry;
      writeFileSync(dataPath, JSON.stringify(users, null, 2));

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://verdihrvatska.com";
      const resetLink = `${siteUrl}/nova-lozinka?token=${token}`;

      await sendPasswordResetEmail(user.email, user.firstName, resetLink);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
