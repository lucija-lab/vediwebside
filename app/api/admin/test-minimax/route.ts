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

    // GET les numérotations disponibles
    const numRes = await fetch(`${BASE}/api/orgs/${orgId}/document-numbering`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await numRes.text();

    // GET méthodes de paiement disponibles
    const pmRes = await fetch(`${BASE}/api/orgs/${orgId}/paymentmethod`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const pmText = await pmRes.text();
    let pmData: any;
    try { pmData = JSON.parse(pmText); } catch { pmData = pmText.substring(0, 1000); }

    const today = new Date().toISOString().split("T")[0];

    // Test A: sans DocumentNumbering (Minimax choisit le défaut)
    const body: any = {
      DateIssued: today,
      DateDue: today,
      AddresseeName: "Test Klijent",
      IssuedInvoiceRows: [
        { Item: { ID: 3668110 }, Quantity: 2, Price: 13.50, VatRate: { ID: 2 } },
        { Item: { ID: 3668111 }, Quantity: 2, Price: 13.46, VatRate: { ID: 1 } },
      ],
    };

    const postRes = await fetch(`${BASE}/api/orgs/${orgId}/issuedinvoices`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const postText = await postRes.text();
    let postData: any;
    try { postData = JSON.parse(postText); } catch { postData = postText.substring(0, 2000); }

    return NextResponse.json({ orgId, pmStatus: pmRes.status, pmData, postStatus: postRes.status, postData, bodySent: body });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}