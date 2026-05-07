import { NextResponse } from "next/server";

const BASE = "https://moj.minimax.hr/HR/API";
const TOKEN_URL = "https://moj.minimax.hr/HR/AUT/oauth20/token";

export async function GET() {
  try {
    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "password",
        username: process.env.MINIMAX_USERNAME!,
        password: process.env.MINIMAX_PASSWORD!,
        client_id: process.env.MINIMAX_CLIENT_ID!,
        client_secret: process.env.MINIMAX_CLIENT_SECRET!,
        scope: "profile",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return NextResponse.json({ step: "auth", error: tokenData });

    const token = tokenData.access_token;
    const orgsRes = await fetch(`${BASE}/api/currentuser/orgs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const orgsData = await orgsRes.json();
    const orgId = orgsData?.Rows?.[0]?.Organisation?.ID;

    // Minimal invoice body to find what works
    const invoiceBody = {
      DocumentDate: new Date().toISOString().split("T")[0],
      Customer: {
        Name: "Test Klijent",
      },
      IssuedInvoiceRows: [
        { Description: "Test usluga", Quantity: 1, UnitOfMeasure: "kom", Price: 10.00, TaxRate: { Percent: 25 } },
      ],
    };

    const invRes = await fetch(`${BASE}/api/orgs/${orgId}/issuedinvoices`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(invoiceBody),
    });
    const invText = await invRes.text();
    let invData: any;
    try { invData = JSON.parse(invText); } catch { invData = invText.substring(0, 1000); }

    return NextResponse.json({ orgId, invStatus: invRes.status, invData, sentBody: invoiceBody });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}