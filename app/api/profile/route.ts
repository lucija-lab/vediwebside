import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUsers, saveUsers } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { firstName, lastName, phone, address, city } = await req.json();

  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  users[idx] = {
    ...users[idx],
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(phone !== undefined && { phone }),
    ...(address && { address }),
    ...(city && { city }),
  };

  saveUsers(users);
  return NextResponse.json({ ok: true, user: users[idx] });
}
