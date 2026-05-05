import { NextRequest, NextResponse } from "next/server";
import { getUsers, saveUsers, hashPassword, createToken } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, address, city, password } = await req.json();

  if (!firstName || !lastName || !email || !password || !address || !city) {
    return NextResponse.json({ error: "Sva polja su obavezna." }, { status: 400 });
  }

  const users = await getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ error: "E-mail adresa je već registrirana." }, { status: 409 });
  }

  const user = {
    id: randomBytes(16).toString("hex"),
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone: phone || "",
    address,
    city,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    role: "client" as const,
  };

  await saveUsers([...users, user]);

  const token = createToken(user.id);
  const res = NextResponse.json({ ok: true, user: { id: user.id, firstName, lastName, email: user.email } });
  res.cookies.set("verdi_session", token, {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "lax",
  });
  return res;
}