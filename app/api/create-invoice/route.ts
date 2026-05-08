import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" as any });

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_TAMAN!]: "taman",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_EKO!]: "eko",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_SUPER!]: "super",
};

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "customer"],
  });

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Not paid" }, { status: 400 });
  }

  const sub = session.subscription as Stripe.Subscription;
  const priceId = sub?.items?.data?.[0]?.price?.id;
  const plan = PRICE_TO_PLAN[priceId] ?? "taman";

  const customer = session.customer as Stripe.Customer | null;
  const name = customer?.name ?? session.customer_details?.name ?? "Client";
  const email = customer?.email ?? session.customer_details?.email ?? "";

  if (email) {
    const firstName = name.split(" ")[0];
    sendOrderConfirmationEmail(email, firstName, plan).catch(err =>
      console.error("Email confirmation error:", err.message)
    );
  }

  return NextResponse.json({ ok: true });
}