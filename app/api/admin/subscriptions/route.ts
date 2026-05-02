import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUsers } from "@/lib/auth";
import { getSubscriptions } from "@/lib/subscriptions";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = getUsers();
  const me = users.find(u => u.id === userId);
  if (!me || me.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ subscriptions: getSubscriptions() });
}
