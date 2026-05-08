import { getRedis } from "./redis";

const KEY = "verdi:subscriptions";

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "paused";

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  plan: "taman" | "eko" | "super";
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  createdAt: string;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const redis = await getRedis();
    const data = await redis.get(KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveSubscriptions(subs: Subscription[]): Promise<void> {
  const redis = await getRedis();
  await redis.set(KEY, JSON.stringify(subs));
}

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const subs = await getSubscriptions();
  return subs.find(s => s.userId === userId && s.status === "active") || null;
}

export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  const subs = await getSubscriptions();
  return subs.filter(s => s.userId === userId && s.status === "active");
}