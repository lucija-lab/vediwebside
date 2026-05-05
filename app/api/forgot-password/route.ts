import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getUsers, saveUsers } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const users = await getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      const token = randomBytes(32).toString("hex");
      const expiry = Date.now() + 60 * 60 * 1000;

      user.resetToken = token;
      user.resetTokenExpiry = expiry;
      await saveUsers(users);

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