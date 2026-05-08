import { NextResponse } from "next/server";
import { getUsers } from "@/lib/auth";
import { getSubscriptions } from "@/lib/subscriptions";
import { getDeliveries } from "@/lib/deliveries";

export async function GET() {
  try {
    const [users, subs, deliveries] = await Promise.all([getUsers(), getSubscriptions(), getDeliveries()]);
    return NextResponse.json({
      users: users.map(u => ({ id: u.id, email: u.email, role: u.role })),
      subscriptions: subs.map(s => ({ id: s.id, userId: s.userId, plan: s.plan, status: s.status, stripeSubId: s.stripeSubscriptionId })),
      deliveries: deliveries.map(d => ({ id: d.id, userId: d.userId, plan: d.plan, status: d.status, subscriptionId: d.subscriptionId })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}