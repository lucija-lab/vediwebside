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

    const today = new Date().toISOString().split("T")[0];
    const dt = today + "T00:00:00";

    const body: any = {
      InvoiceType: "R",
      DocumentNumbering: { ID: 65500 },
      Customer: { ID: 4334537 },
      DateIssued: dt,
      DateTransaction: dt,
      DateTransactionFrom: dt,
      DateDue: dt,
      AddresseeName: "Test Klijent",
      AddresseeAddress: "Ilica 1",
      AddresseePostalCode: "10000",
      AddresseeCity: "Zagreb",
      AddresseeCountry: { ID: 95 },
      Currency: { ID: 7 },
      ExchangeRate: 1,
      IssuedInvoiceReportTemplate: { ID: 885995 },
      DeliveryNoteReportTemplate: { ID: 770988 },
      PricesOnInvoice: "N",
      RecurringInvoice: "N",
      IssuedInvoiceRows: [
        { RowNumber: 1, Item: { ID: 3668110 }, ItemName: "Verdi Taman Košarica", Quantity: 2, Price: 13.50, VatRate: { ID: 2 }, Discount: 0, DiscountPercent: 0 },
        { RowNumber: 2, Item: { ID: 3668111 }, ItemName: "Verdi Taman Usluga", Quantity: 2, Price: 13.46, VatRate: { ID: 1 }, Discount: 0, DiscountPercent: 0 },
      ],
      IssuedInvoicePaymentMethods: [
        { RowNumber: 1, PaymentMethod: { ID: 207944 }, Amount: 53.92, AmountInDomesticCurrency: 53.92, AlreadyPaid: "N" },
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

    return NextResponse.json({ orgId, postStatus: postRes.status, postData, bodySent: body });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}