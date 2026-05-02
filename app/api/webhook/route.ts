import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getUsers } from "@/lib/auth";
import { getSubscriptions, saveSubscriptions } from "@/lib/subscriptions";
import { createDelivery } from "@/lib/deliveries";
import { randomBytes } from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

function planFromPriceId(priceId: string): "taman" | "super" {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_TAMAN) return "taman";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_SUPER) return "super";
  return "taman";
}

function nextDeliveryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === (session.customer_email || "").toLowerCase());
      if (!user) break;

      const stripeSubId = session.subscription as string;
      const sub = await stripe.subscriptions.retrieve(stripeSubId);
      const priceId = sub.items.data[0]?.price.id || "";
      const plan = planFromPriceId(priceId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const periodEnd = (sub as any).current_period_end;
      const periodEndDate = periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const subs = getSubscriptions();
      const existing = subs.findIndex(s => s.userId === user.id);
      const newSub = {
        id: randomBytes(12).toString("hex"),
        userId: user.id,
        stripeSubscriptionId: stripeSubId,
        stripeCustomerId: session.customer as string,
        plan,
        status: "active" as const,
        currentPeriodEnd: periodEndDate,
        createdAt: new Date().toISOString(),
      };

      if (existing >= 0) subs[existing] = newSub;
      else subs.push(newSub);
      saveSubscriptions(subs);

      // Create first delivery
      createDelivery({
        userId: user.id,
        plan,
        address: user.address,
        city: user.city,
        scheduledDate: nextDeliveryDate(),
        timeSlot: "09:00–13:00",
        status: "pending",
        notes: "",
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const subs = getSubscriptions();
      const idx = subs.findIndex(s => s.stripeSubscriptionId === sub.id);
      if (idx >= 0) {
        subs[idx].status = "canceled";
        saveSubscriptions(subs);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const subs = getSubscriptions();
      const idx = subs.findIndex(s => s.stripeSubscriptionId === sub.id);
      if (idx >= 0) {
        subs[idx].status = sub.status as "active" | "canceled" | "past_due";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const end = (sub as any).current_period_end;
        if (end) subs[idx].currentPeriodEnd = new Date(end * 1000).toISOString();
        saveSubscriptions(subs);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
