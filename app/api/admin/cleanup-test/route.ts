import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/auth";
import { getRedis } from "@/lib/redis";

const KEEP_EMAILS = ["lucija@verdihrvatska.com", "marijo.valetic@gmail.com"];

export async function GET() {
  const users = await getUsers();
  const kept = users.filter(u => KEEP_EMAILS.includes(u.email.toLowerCase()));
  await saveUsers(kept);

  const redis = await getRedis();
  await redis.del("verdi:subscriptions");
  await redis.del("verdi:deliveries");

  return NextResponse.json({ ok: true, usersKept: kept.length, message: "Test data cleared" });
}