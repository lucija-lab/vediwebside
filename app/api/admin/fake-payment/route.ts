import { NextResponse } from "next/server";
import { getUsers } from "@/lib/auth";
import { createDelivery } from "@/lib/deliveries";
import { getRedis } from "@/lib/redis";
import { randomBytes } from "crypto";

// Simule un paiement Stripe pour tester le flow complet sans carte
export async function GET() {
  const users = await getUsers();
  const client = users.find(u => u.role === "client");
  if (!client) return NextResponse.json({ error: "Aucun client trouvé — inscris-toi d'abord" }, { status: 400 });

  const plan = "taman";
  const today = new Date();
  const scheduledDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Créer abonnement dans Redis
  const redis = await getRedis();
  const subData = await redis.get("verdi:subscriptions");
  const subs = subData ? JSON.parse(subData) : [];
  subs.push({
    id: randomBytes(12).toString("hex"),
    userId: client.id,
    plan,
    status: "active",
    stripeSubscriptionId: "fake_" + randomBytes(8).toString("hex"),
    createdAt: new Date().toISOString(),
  });
  await redis.set("verdi:subscriptions", JSON.stringify(subs));

  // Créer livraison pending
  const delivery = await createDelivery({
    userId: client.id,
    plan,
    address: client.address || "Test adresse 1",
    city: client.city || "Zagreb",
    scheduledDate,
    timeSlot: "08:00-12:00",
    status: "pending",
    notes: "",
  });

  return NextResponse.json({
    ok: true,
    client: `${client.firstName} ${client.lastName} (${client.email})`,
    plan,
    deliveryId: delivery.id,
    scheduledDate,
    message: "Paiement simulé — va dans Admin > Deliveries pour assigner le livreur",
  });
}