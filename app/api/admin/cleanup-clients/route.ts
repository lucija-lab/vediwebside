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

  const clients = users.filter(u => u.role === "client");
  const clientIds = new Set(clients.map(u => u.id));

  const [subs, deliveries] = await Promise.all([getSubscriptions(), getDeliveries()]);

  await Promise.all([
    saveUsers(users.filter(u => u.role !== "client")),
    saveSubscriptions(subs.filter(s => !clientIds.has(s.userId))),
    saveDeliveries(deliveries.filter(d => !clientIds.has(d.userId))),
  ]);

  return NextResponse.json({ ok: true, deleted: { users: clients.length, subscriptions: subs.filter(s => clientIds.has(s.userId)).length, deliveries: deliveries.filter(d => clientIds.has(d.userId)).length } });
}