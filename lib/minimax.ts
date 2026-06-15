const BASE = "https://moj.minimax.hr/HR/API";
const TOKEN_URL = "https://moj.minimax.hr/HR/AUT/oauth20/token";

let cachedToken: { token: string; expires: number } | null = null;
let cachedOrgId: number | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.token;

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

  if (!res.ok) throw new Error(`MiniMax auth failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

async function getOrgId(): Promise<number> {
  if (cachedOrgId) return cachedOrgId;
  const token = await getToken();
  const res = await fetch(`${BASE}/api/currentuser/orgs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`MiniMax orgs error: ${res.status}`);
  const data = await res.json();
  const org = data?.Rows?.[0] ?? data?.[0];
  if (!org) throw new Error("No MiniMax organisation found");
  cachedOrgId = org.Organisation?.ID ?? org.OrganisationId ?? org.organisationId;
  return cachedOrgId!;
}

// VatRate ID 1 = 25% (S), VatRate ID 2 = 5% (code "0" dans Minimax)
// DocumentNumbering 65500 = "Verdi shop" (défaut B2C)
// Customer 4334537 = client générique pour B2C webshop
const PLAN_ROWS: Record<string, Array<{ itemId: number; price: number; vatRateId: number; vatPercent: number }>> = {
  taman: [
    { itemId: 3774045, price: 13.50, vatRateId: 2, vatPercent: 5 },
    { itemId: 3774050, price: 13.46, vatRateId: 1, vatPercent: 25 },
  ],
  eko: [
    { itemId: 3774056, price: 18.00, vatRateId: 2, vatPercent: 5 },
    { itemId: 3671799, price: 11.48, vatRateId: 1, vatPercent: 25 },
  ],
  super: [
    { itemId: 3774022, price: 19.50, vatRateId: 2, vatPercent: 5 },
    { itemId: 3774033, price: 12.02, vatRateId: 1, vatPercent: 25 },
  ],
};

export async function createMinimaxInvoice(params: {
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode?: string;
  customerEmail: string;
  plan: string;
  deliveryDate?: string;
  delivery2Date?: string;
}) {
  const token = await getToken();
  const orgId = await getOrgId();
  const paymentDate = new Date().toISOString().split("T")[0];
  const delivery1 = params.deliveryDate ?? paymentDate;
  const delivery2 = params.delivery2Date;
  const paymentDt = paymentDate + "T00:00:00";
  const delivery1Dt = delivery1 + "T00:00:00";
  const rows = PLAN_ROWS[params.plan] ?? PLAN_ROWS.taman;

  const totalAmount = rows.reduce((sum, row) => {
    const tva = row.price * row.vatPercent / 100;
    return sum + (row.price + tva) * 2;
  }, 0);

  const body: any = {
    InvoiceType: "R",
    DocumentNumbering: { ID: 65500 },
    Customer: { ID: 4526294 },
    DateIssued: paymentDt,
    DateTransaction: delivery1Dt,
    DateTransactionFrom: delivery1Dt,
    DateDue: paymentDt,
    AddresseeName: params.customerName,
    AddresseeAddress: params.customerAddress,
    AddresseePostalCode: params.customerPostalCode || "10000",
    AddresseeCity: params.customerCity,
    AddresseeCountry: { ID: 95 },
    Currency: { ID: 7 },
    ExchangeRate: 1,
    IssuedInvoiceReportTemplate: { ID: 885995 },
    DeliveryNoteReportTemplate: { ID: 770988 },
    PricesOnInvoice: "N",
    RecurringInvoice: "N",
    Employee: { ID: 278563 },
    Note: `1. dostava: ${delivery1}${delivery2 ? ` | 2. dostava: ${delivery2}` : ""} — Hvala što svakom svojom kupnjom podupirete lokalne OPG-ove putem Verdi webshopa!`,
    IssuedInvoiceRows: rows.map((row, i) => ({
      RowNumber: i + 1,
      Item: { ID: row.itemId },
      Quantity: 2,
      Price: row.price,
      VatRate: { ID: row.vatRateId },
      VATPercent: row.vatPercent,
      Discount: 0,
      DiscountPercent: 0,
    })),
    IssuedInvoicePaymentMethods: [
      { RowNumber: 1, PaymentMethod: { ID: 207944 }, Amount: Math.round(totalAmount * 100) / 100, AmountInDomesticCurrency: Math.round(totalAmount * 100) / 100, AlreadyPaid: "N" },
    ],
  };

  const res = await fetch(`${BASE}/api/orgs/${orgId}/issuedinvoices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiniMax invoice error ${res.status}: ${err}`);
  }

  return await res.json();
}