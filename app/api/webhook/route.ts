import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getUsers } from "@/lib/auth";
import { getSubscriptions, saveSubscriptions } from "@/lib/subscriptions";
import { createDelivery } from "@/lib/deliveries";
import { createMinimaxInvoice } from "@/lib/minimax";
import { sendInvoiceEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

function planFromPriceId(priceId: string): "taman" | "eko" | "super" {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_TAMAN) return "taman";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_EKO) return "eko";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_SUPER) return "super";
  return "taman";
}

function deliveryDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
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

      const users = await getUsers();
      const user = users.find(u => u.email.toLowerCase() === (session.customer_email || "").toLowerCase());
      if (!user) break;

      const stripeSubId = session.subscription as string;
      const sub = await stripe.subscriptions.retrieve(stripeSubId);
      const priceId = sub.items.data[0]?.price.id || "";
      const plan = planFromPriceId(priceId);
      const periodEnd = (sub as any).current_period_end;
      const periodEndDate = periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const subs = await getSubscriptions();
      const existing = subs.findIndex(s => s.stripeSubscriptionId === stripeSubId);
      const newSub = {
        id: existing >= 0 ? subs[existing].id : randomBytes(12).toString("hex"),
        userId: user.id,
        stripeSubscriptionId: stripeSubId,
        stripeCustomerId: session.customer as string,
        plan,
        status: "active" as const,
        currentPeriodEnd: periodEndDate,
        createdAt: existing >= 0 ? subs[existing].createdAt : new Date().toISOString(),
      };

      if (existing >= 0) subs[existing] = newSub;
      else subs.push(newSub);
      await saveSubscriptions(subs);

      const delivery1Date = deliveryDate(1);
      const delivery2Date = deliveryDate(15);

      await createDelivery({
        userId: user.id,
        subscriptionId: stripeSubId,
        plan,
        address: user.address,
        city: user.city,
        scheduledDate: delivery1Date,
        timeSlot: "09:00–13:00",
        status: "pending",
        notes: "1ère livraison",
      });

      await createDelivery({
        userId: user.id,
        subscriptionId: stripeSubId,
        plan,
        address: user.address,
        city: user.city,
        scheduledDate: delivery2Date,
        timeSlot: "09:00–13:00",
        status: "pending",
        notes: "2ème livraison",
      });

      createMinimaxInvoice({
        customerName: `${user.firstName} ${user.lastName}`.trim() || user.email,
        customerAddress: user.address ?? "",
        customerCity: user.city ?? "",
        customerPostalCode: "10000",
        customerEmail: user.email,
        plan,
        deliveryDate: delivery1Date,
        delivery2Date,
      }).then(invoice => {
        const invoiceNumber = invoice?.InvoiceNumber ?? invoice?.DocumentNumber ?? invoice?.ID ?? "—";
        return sendInvoiceEmail(user.email, user.firstName, plan, String(invoiceNumber), delivery1Date, delivery2Date);
      }).catch(err => console.error("Minimax/email error:", err.message));

      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const subs = await getSubscriptions();
      const idx = subs.findIndex(s => s.stripeSubscriptionId === sub.id);
      if (idx >= 0) {
        subs[idx].status = "canceled";
        await saveSubscriptions(subs);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const subs = await getSubscriptions();
      const idx = subs.findIndex(s => s.stripeSubscriptionId === sub.id);
      if (idx >= 0) {
        subs[idx].status = sub.status as "active" | "canceled" | "past_due";
        const end = (sub as any).current_period_end;
        if (end) subs[idx].currentPeriodEnd = new Date(end * 1000).toISOString();
        await saveSubscriptions(subs);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}