import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

const FILE = path.join(process.cwd(), "data", "deliveries.json");

export type DeliveryStatus = "pending" | "assigned" | "delivered" | "skipped" | "failed";

export interface Delivery {
  id: string;
  userId: string;
  livreurId?: string;
  plan: "taman" | "super";
  address: string;
  city: string;
  scheduledDate: string;
  timeSlot: string;
  status: DeliveryStatus;
  notes: string;
  createdAt: string;
}

export function getDeliveries(): Delivery[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveDeliveries(deliveries: Delivery[]) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(deliveries, null, 2));
}

export function createDelivery(data: Omit<Delivery, "id" | "createdAt">): Delivery {
  const delivery: Delivery = {
    ...data,
    id: randomBytes(12).toString("hex"),
    createdAt: new Date().toISOString(),
  };
  const all = getDeliveries();
  saveDeliveries([...all, delivery]);
  return delivery;
}

export function updateDelivery(id: string, updates: Partial<Delivery>): boolean {
  const all = getDeliveries();
  const idx = all.findIndex(d => d.id === id);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], ...updates };
  saveDeliveries(all);
  return true;
}
