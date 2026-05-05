import { NextRequest, NextResponse } from "next/server";
import { getUsers, verifyPassword, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Unesite e-mail i lozinku." }, { status: 400 });
  }

  const users = await getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Pogrešan e-mail ili lozinka." }, { status: 401 });
  }

  const token = createToken(user.id);
  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role || "client" },
  });
  res.cookies.set("verdi_session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "lax",
  });
  return res;
}