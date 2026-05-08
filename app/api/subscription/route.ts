import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getUserSubscriptions } from "@/lib/subscriptions";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ subscriptions: [] });

  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ subscriptions: [] });

  const subscriptions = await getUserSubscriptions(userId);
  return NextResponse.json({ subscriptions });
}