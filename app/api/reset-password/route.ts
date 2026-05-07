import { NextRequest, NextResponse } from "next/server";
import { getUsers, saveUsers, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Podaci nisu potpuni." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Lozinka mora imati najmanje 6 znakova." }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find(
      u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > Date.now()
    );

    if (!user) {
      return NextResponse.json({ error: "Veza je nevažeća ili je istekla." }, { status: 400 });
    }

    user.passwordHash = hashPassword(password);
    delete user.resetToken;
    delete user.resetTokenExpiry;
    await saveUsers(users);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ error: "Greška servera." }, { status: 500 });
  }
}