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

    // Try creating invoice directly without BusinessPremise lookup
    const invoiceBody = {
      DocumentDate: new Date().toISOString().split("T")[0],
      DueDate: new Date().toISOString().split("T")[0],
      Customer: {
        Name: "Test Klijent",
        Address: "Testna ulica 1",
        City: "Zagreb",
        CountryCode: "HR",
        Email: "lucija@verdihrvatska.com",
        CustomerCode: "02",
      },
      IssuedInvoiceRows: [
        { Description: "Povrće – Taman košarica", Quantity: 2, UnitOfMeasure: "kom", Price: 13.50, VATRate: 5 },
        { Description: "Verdi – dostava i usluga", Quantity: 2, UnitOfMeasure: "kom", Price: 13.46, VATRate: 25 },
      ],
      IssuedInvoicePayments: [{ PaymentType: { PaymentTypeCode: "K" } }],
      Note: "Hvala što svakom svojom kupnjom podupirete lokalne OPG-ove putem Verdi webshopa!",
    };

    const invRes = await fetch(`${BASE}/api/orgs/${orgId}/issuedinvoices`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(invoiceBody),
    });
    const invText = await invRes.text();
    let invData: any;
    try { invData = JSON.parse(invText); } catch { invData = invText.substring(0, 500); }

    return NextResponse.json({ orgId, invStatus: invRes.status, invData });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}