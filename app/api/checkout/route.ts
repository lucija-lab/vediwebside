import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/hr/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/hr/kosarice`,
    locale: "hr",
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { source: "verdi-website" },
    },
  });

  return NextResponse.json({ url: session.url });
}
