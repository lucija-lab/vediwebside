import { NextResponse } from "next/server";
import { createMinimaxInvoice } from "@/lib/minimax";

export async function GET() {
  try {
    const invoice = await createMinimaxInvoice({
      customerName: "Test Klijent",
      customerAddress: "Testna ulica 1",
      customerCity: "Zagreb",
      customerEmail: "lucija@verdihrvatska.com",
      plan: "taman",
      deliveryDate: new Date().toISOString().split("T")[0],
    });
    return NextResponse.json({ ok: true, invoice });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}