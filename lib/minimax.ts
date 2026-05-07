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


// Item IDs from Minimax catalogue (discovered from existing invoice)
// VatRate ID 1 = 25% (S), VatRate ID 2 = 5% (0)
// DocumentNumbering ID: 62860
const PLAN_ROWS: Record<string, Array<{ itemId: number; price: number; vatRateId: number }>> = {
  taman: [
    { itemId: 3668110, price: 13.50, vatRateId: 2 }, // Taman Košarica (OPG) 5%
    { itemId: 3668111, price: 13.46, vatRateId: 1 }, // Taman Usluga (Verdi) 25%
  ],
  eko: [
    { itemId: 3671799, price: 18.00, vatRateId: 2 }, // Eko Košarica (OPG) 5%
    { itemId: 3671800, price: 11.48, vatRateId: 1 }, // Eko Usluga (Verdi) 25%
  ],
  super: [
    { itemId: 3668105, price: 19.50, vatRateId: 2 }, // Super Košarica (OPG) 5%
    { itemId: 3668106, price: 12.02, vatRateId: 1 }, // Super Usluga (Verdi) 25%
  ],
};

export async function createMinimaxInvoice(params: {
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerEmail: string;
  plan: string;
  deliveryDate?: string;
}) {
  const token = await getToken();
  const orgId = await getOrgId();
  const today = params.deliveryDate ?? new Date().toISOString().split("T")[0];
  const rows = PLAN_ROWS[params.plan] ?? PLAN_ROWS.taman;

  const body: any = {
    DateIssued: today,
    DateTransaction: today,
    DateDue: today,
    DocumentNumbering: { ID: 62860 },
    AddresseeName: params.customerName,
    AddresseeAddress: params.customerAddress,
    AddresseeCity: params.customerCity,
    AddresseeCountry: { ID: 95 },
    Note: "Hvala što svakom svojom kupnjom podupirete lokalne OPG-ove putem Verdi webshopa!",
    IssuedInvoiceRows: rows.map(row => ({
      Item: { ID: row.itemId },
      Quantity: 2,
      Price: row.price,
      VatRate: { ID: row.vatRateId },
    })),
    IssuedInvoicePaymentMethods: [
      { PaymentMethod: { ID: 207944 } },
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