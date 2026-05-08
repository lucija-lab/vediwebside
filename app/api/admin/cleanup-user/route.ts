import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUsers, saveUsers } from "@/lib/auth";
import { getSubscriptions, saveSubscriptions } from "@/lib/subscriptions";
import { getDeliveries, saveDeliveries } from "@/lib/deliveries";

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await getUsers();
  const me = users.find(u => u.id === userId);
  if (!me || me.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const target = users.find(u => u.email === email);
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.role === "admin" || target.role === "livreur") {
    return NextResponse.json({ error: "Cannot delete admin or livreur accounts" }, { status: 403 });
  }

  const [subs, deliveries] = await Promise.all([getSubscriptions(), getDeliveries()]);

  await Promise.all([
    saveUsers(users.filter(u => u.id !== target.id)),
    saveSubscriptions(subs.filter(s => s.userId !== target.id)),
    saveDeliveries(deliveries.filter(d => d.userId !== target.id)),
  ]);

  return NextResponse.json({ ok: true, deleted: { user: target.email, subscriptions: subs.filter(s => s.userId === target.id).length, deliveries: deliveries.filter(d => d.userId === target.id).length } });
}