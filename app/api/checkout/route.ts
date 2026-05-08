import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyToken, getUsers } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Reuse existing Stripe customer if user is logged in
  let customerId: string | undefined;
  const token = req.cookies.get("verdi_session")?.value;
  if (token) {
    const userId = verifyToken(token);
    if (userId) {
      const users = await getUsers();
      const user = users.find(u => u.id === userId);
      if (user) {
        const existing = await stripe.customers.list({ email: user.email, limit: 1 });
        if (existing.data.length > 0) {
          customerId = existing.data[0].id;
        } else {
          const created = await stripe.customers.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          });
          customerId = created.id;
        }
      }
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/checkout/uspjeh?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/kosarice`,
    locale: "hr",
    allow_promotion_codes: true,
    customer: customerId,
    subscription_data: {
      metadata: { source: "verdi-website" },
    },
  });

  return NextResponse.json({ url: session.url });
}