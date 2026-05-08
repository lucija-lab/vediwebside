import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken, getUsers } from "@/lib/auth";
import { getSubscriptions, saveSubscriptions } from "@/lib/subscriptions";
import { createDelivery, getDeliveries } from "@/lib/deliveries";
import { randomBytes } from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

function nextDeliveryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
}

function planFromPriceId(priceId: string): "taman" | "eko" | "super" {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_EKO) return "eko";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_SUPER) return "super";
  return "taman";
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const customers = await stripe.customers.list({ email: user.email, limit: 10 });
    if (customers.data.length === 0) return NextResponse.json({ subscriptions: [] });

    const allStripeSubs = (await Promise.all(
      customers.data.map(c => stripe.subscriptions.list({ customer: c.id, limit: 10, status: "all" }))
    )).flatMap(r => r.data);

    const stripeSubs = { data: allStripeSubs };
    if (stripeSubs.data.length === 0) return NextResponse.json({ subscriptions: [] });

    const subs = await getSubscriptions();
    const deliveries = await getDeliveries();
    const newSubs: typeof subs = [];

    for (const stripeSub of stripeSubs.data) {
      const priceId = stripeSub.items.data[0]?.price.id || "";
      const plan = planFromPriceId(priceId);
      const periodEnd = (stripeSub as any).current_period_end;

      const existingIdx = subs.findIndex(s => s.stripeSubscriptionId === stripeSub.id);
      const entry = {
        id: existingIdx >= 0 ? subs[existingIdx].id : randomBytes(12).toString("hex"),
        userId,
        stripeSubscriptionId: stripeSub.id,
        stripeCustomerId: (stripeSub as any).customer as string,
        plan,
        status: stripeSub.status as "active" | "canceled" | "past_due",
        currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
        createdAt: existingIdx >= 0 ? subs[existingIdx].createdAt : new Date().toISOString(),
      };

      if (existingIdx >= 0) subs[existingIdx] = entry;
      else subs.push(entry);

      newSubs.push(entry);

      if (stripeSub.status === "active") {
        const hasDelivery = deliveries.some(d => d.subscriptionId === stripeSub.id && d.status === "pending");
        if (!hasDelivery) {
          await createDelivery({
            userId,
            subscriptionId: stripeSub.id,
            plan,
            address: user.address,
            city: user.city,
            scheduledDate: nextDeliveryDate(),
            timeSlot: "09:00–13:00",
            status: "pending",
            notes: "",
          });
        }
      }
    }

    await saveSubscriptions(subs);

    const activeNewSubs = newSubs.filter(s => s.status === "active");
    return NextResponse.json({ subscriptions: activeNewSubs, subscription: activeNewSubs[0] ?? null });
  } catch {
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}