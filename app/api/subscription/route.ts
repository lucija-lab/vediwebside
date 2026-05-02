import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscriptions";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ subscription: null });

  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ subscription: null });

  const subscription = getUserSubscription(userId);
  return NextResponse.json({ subscription });
}
