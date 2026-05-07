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

    const today = new Date().toISOString().split("T")[0];

    const body = {
      DateIssued: today,
      DateTransaction: today,
      DateDue: today,
      DocumentNumbering: { ID: 62860 },
      AddresseeName: "Test Klijent",
      AddresseeAddress: "Ilica 1",
      AddresseeCity: "Zagreb",
      AddresseeCountry: { ID: 95 },
      Note: "Test faktura",
      IssuedInvoiceRows: [
        { Item: { ID: 3668110 }, Quantity: 2, Price: 13.50, VatRate: { ID: 2 } },
        { Item: { ID: 3668111 }, Quantity: 2, Price: 13.46, VatRate: { ID: 1 } },
      ],
      IssuedInvoicePaymentMethods: [
        { PaymentMethod: { ID: 207944 } },
      ],
    };

    const postRes = await fetch(`${BASE}/api/orgs/${orgId}/issuedinvoices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const postText = await postRes.text();
    let postData: any;
    try { postData = JSON.parse(postText); } catch { postData = postText.substring(0, 3000); }

    return NextResponse.json({ orgId, postStatus: postRes.status, postData, bodySent: body });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}