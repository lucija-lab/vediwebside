import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/auth";
import { getSubscriptions, saveSubscriptions } from "@/lib/subscriptions";
import { getDeliveries, saveDeliveries } from "@/lib/deliveries";

export async function GET() {
  try {
    const users = await getUsers();
    const clients = users.filter(u => u.role === "client");
    const clientIds = new Set(clients.map(u => u.id));

    const [subs, deliveries] = await Promise.all([getSubscriptions(), getDeliveries()]);

    await Promise.all([
      saveUsers(users.filter(u => u.role !== "client")),
      saveSubscriptions(subs.filter(s => !clientIds.has(s.userId))),
      saveDeliveries(deliveries.filter(d => !clientIds.has(d.userId))),
    ]);

    return NextResponse.json({ ok: true, deleted: { users: clients.length } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}