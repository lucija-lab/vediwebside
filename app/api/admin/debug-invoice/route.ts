import { NextResponse } from "next/server";

const BASE = "https://moj.minimax.hr/HR/API";
const TOKEN_URL = "https://moj.minimax.hr/HR/AUT/oauth20/token";

async function getToken() {
  const res = await fetch(TOKEN_URL, {
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
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  try {
    const token = await getToken();
    // Fetch last 5 issued invoices
    const res = await fetch(`${BASE}/api/orgs/44623/issuedinvoices?$top=5&$orderby=DateIssued desc`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    // Return full structure of first invoice
    const first = data?.Rows?.[0] ?? data?.[0];
    if (!first) return NextResponse.json({ error: "No invoices found", raw: data });

    const invRes = await fetch(`${BASE}/api/orgs/44623/issuedinvoices/${first.IssuedInvoiceId ?? first.ID ?? first.Id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const inv = await invRes.json();
    return NextResponse.json({ invoice: inv });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}