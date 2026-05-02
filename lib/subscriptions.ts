import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "subscriptions.json");

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "paused";

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  plan: "taman" | "super";
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  createdAt: string;
}

export function getSubscriptions(): Subscription[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveSubscriptions(subs: Subscription[]) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(subs, null, 2));
}

export function getUserSubscription(userId: string): Subscription | null {
  const subs = getSubscriptions();
  return subs.find(s => s.userId === userId && s.status === "active") || null;
}
