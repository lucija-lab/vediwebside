import { NextRequest, NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/auth";
import { getSubscriptions, saveSubscriptions } from "@/lib/subscriptions";
import { getDeliveries, saveDeliveries } from "@/lib/deliveries";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_CLEANUP_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getUsers();
  const clients = users.filter(u => u.role === "client");
  const clientIds = new Set(clients.map(u => u.id));

  await Promise.all([
    saveUsers(users.filter(u => u.role !== "client")),
    saveSubscriptions((await getSubscriptions()).filter(s => !clientIds.has(s.userId))),
    saveDeliveries((await getDeliveries()).filter(d => !clientIds.has(d.userId))),
  ]);

  return NextResponse.json({ ok: true, deleted: { clients: clients.length } });
}