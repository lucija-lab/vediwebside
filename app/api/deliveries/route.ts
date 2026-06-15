import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUsers } from "@/lib/auth";
import { getDeliveries, saveDeliveries, updateDelivery, createDelivery } from "@/lib/deliveries";
import { createMinimaxInvoice } from "@/lib/minimax";
import { sendInvoiceEmail } from "@/lib/email";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const all = await getDeliveries();

  const enrichDelivery = (d: Awaited<ReturnType<typeof getDeliveries>>[0]) => {
    if (d.livreurId) {
      const livreur = users.find(u => u.id === d.livreurId);
      return { ...d, livreurPhone: livreur?.phone || null, livreurName: livreur ? `${livreur.firstName} ${livreur.lastName}` : null };
    }
    return d;
  };

  if (user.role === "admin") return NextResponse.json({ deliveries: all.map(enrichDelivery) });
  if (user.role === "livreur") {
    const mine = all.filter(d => d.livreurId === userId || d.status === "pending");
    return NextResponse.json({
      deliveries: mine.map(d => {
        const client = users.find(u => u.id === d.userId);
        return {
          ...enrichDelivery(d),
          clientName: client ? `${client.firstName} ${client.lastName}` : null,
          clientPhone: client?.phone || null,
        };
      }),
    });
  }

  const mine = all.filter(d => d.userId === userId).map(enrichDelivery);
  return NextResponse.json({ deliveries: mine });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const delivery = await createDelivery({ ...body, id: randomBytes(12).toString("hex") });
  return NextResponse.json({ delivery });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const all = await getDeliveries();
  await saveDeliveries(all.filter(d => d.id !== id));
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const all = await getDeliveries();
  const delivery = all.find(d => d.id === id);
  if (!delivery) return NextResponse.json({ error: "Delivery not found" }, { status: 404 });

  if (user.role === "client") {
    if (delivery.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const allowed = ["status", "timeSlot", "scheduledDate"];
    const forbidden = Object.keys(updates).filter(k => !allowed.includes(k));
    if (forbidden.length > 0) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (updates.status && !["skipped"].includes(updates.status)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (delivery.status !== "pending") return NextResponse.json({ error: "Cannot modify non-pending delivery" }, { status: 400 });
  }

  const ok = await updateDelivery(id, updates);

  // Facture Minimax à chaque livraison
  if (updates.status === "delivered" && delivery.status !== "delivered") {
    const client = users.find(u => u.id === delivery.userId);
    if (client) {
      try {
        const invoice = await createMinimaxInvoice({
          customerName: `${client.firstName} ${client.lastName}`,
          customerAddress: client.address,
          customerCity: client.city,
          customerEmail: client.email,
          plan: delivery.plan,
          deliveryDate: delivery.scheduledDate,
        });
        const invoiceNumber = invoice?.InvoiceNumber ?? invoice?.invoiceNumber ?? "—";
        await sendInvoiceEmail(
          client.email,
          client.firstName,
          delivery.plan,
          String(invoiceNumber),
          delivery.scheduledDate,
        );
      } catch (err: any) {
        console.error("Minimax invoice error:", err.message);
      }
    }
  }

  return NextResponse.json({ ok });
}