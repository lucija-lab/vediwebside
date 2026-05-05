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
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) return NextResponse.json({ subscription: null });

    const customer = customers.data[0];
    const stripeSubs = await stripe.subscriptions.list({ customer: customer.id, limit: 1, status: "all" });
    if (stripeSubs.data.length === 0) return NextResponse.json({ subscription: null });

    const stripeSub = stripeSubs.data[0];
    const priceId = stripeSub.items.data[0]?.price.id || "";
    const plan = planFromPriceId(priceId);
    const periodEnd = (stripeSub as any).current_period_end;

    const subs = await getSubscriptions();
    const existing = subs.findIndex(s => s.userId === userId);
    const newSub = {
      id: existing >= 0 ? subs[existing].id : randomBytes(12).toString("hex"),
      userId,
      stripeSubscriptionId: stripeSub.id,
      stripeCustomerId: customer.id,
      plan,
      status: stripeSub.status as "active" | "canceled" | "past_due",
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      createdAt: existing >= 0 ? subs[existing].createdAt : new Date().toISOString(),
    };

    if (existing >= 0) subs[existing] = newSub;
    else subs.push(newSub);
    await saveSubscriptions(subs);

    if (stripeSub.status === "active") {
      const deliveries = await getDeliveries();
      const hasDelivery = deliveries.some(d => d.userId === userId && d.status === "pending");
      if (!hasDelivery) {
        await createDelivery({
          userId,
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

    return NextResponse.json({ subscription: newSub });
  } catch {
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}