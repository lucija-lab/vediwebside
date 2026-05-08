import { randomBytes } from "crypto";
import { getRedis } from "./redis";

const KEY = "verdi:deliveries";

export type DeliveryStatus = "pending" | "assigned" | "delivered" | "skipped" | "failed";

export interface Delivery {
  id: string;
  userId: string;
  subscriptionId?: string;
  livreurId?: string;
  plan: "taman" | "eko" | "super";
  address: string;
  city: string;
  scheduledDate: string;
  timeSlot: string;
  status: DeliveryStatus;
  notes: string;
  createdAt: string;
}

export async function getDeliveries(): Promise<Delivery[]> {
  try {
    const redis = await getRedis();
    const data = await redis.get(KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveDeliveries(deliveries: Delivery[]): Promise<void> {
  const redis = await getRedis();
  await redis.set(KEY, JSON.stringify(deliveries));
}

export async function createDelivery(data: Omit<Delivery, "id" | "createdAt">): Promise<Delivery> {
  const delivery: Delivery = {
    ...data,
    id: randomBytes(12).toString("hex"),
    createdAt: new Date().toISOString(),
  };
  const all = await getDeliveries();
  await saveDeliveries([...all, delivery]);
  return delivery;
}

export async function updateDelivery(id: string, updates: Partial<Delivery>): Promise<boolean> {
  const all = await getDeliveries();
  const idx = all.findIndex(d => d.id === id);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], ...updates };
  await saveDeliveries(all);
  return true;
}