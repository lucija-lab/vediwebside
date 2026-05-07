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

    // GET detail of existing invoice to see full structure
    const detailRes = await fetch(`${BASE}/api/orgs/${orgId}/issuedinvoices/10115632`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const detailText = await detailRes.text();
    let detailData: any;
    try { detailData = JSON.parse(detailText); } catch { detailData = detailText.substring(0, 2000); }

    return NextResponse.json({ orgId, detailStatus: detailRes.status, detailData });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}