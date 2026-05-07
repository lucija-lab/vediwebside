const BASE = "https://moj.minimax.hr/HR/API";
const TOKEN_URL = "https://moj.minimax.hr/HR/AUT/oauth20/token";


let cachedToken: { token: string; expires: number } | null = null;
let cachedOrgId: number | null = null;
let cachedPremiseId: number | null = null;

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
  cachedOrgId = org.OrganisationId ?? org.organisationId;
  return cachedOrgId!;
}

async function getBusinessPremiseId(orgId: number): Promise<number> {
  if (cachedPremiseId) return cachedPremiseId;
  const token = await getToken();
  const res = await fetch(`${BASE}/api/orgs/${orgId}/issuedInvoices/businesspremises`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`MiniMax business premises error: ${res.status}`);
  const data = await res.json();
  const list: any[] = data?.Rows ?? data ?? [];
  // Oznaka poslovnog prostora = "01" (Verdi shop)
  const premise = list.find(p =>
    p.BusinessPremiseCode === "01" || p.Code === "01" || p.Oznaka === "01"
  );
  if (!premise) throw new Error("Business premise 01 not found in MiniMax");
  cachedPremiseId = premise.BusinessPremiseID ?? premise.Id ?? premise.id;
  return cachedPremiseId!;
}

// Facture mensuelle = 2 livraisons. Quantity: 2 sur chaque ligne.
// Taman: 2×€13.50 (5%) + 2×€13.46 (25%) = €62
// Eko:   2×€18.00 (5%) + 2×€11.48 (25%) = €66.50
// Super: 2×€19.50 (5%) + 2×€12.02 (25%) = €71
const PLAN_ROWS: Record<string, Array<{ Description: string; Price: number; VATRate: number }>> = {
  taman: [
    { Description: "Povrće – sezonska košarica Taman (OPG)", Price: 13.50, VATRate: 5 },
    { Description: "Verdi – dostava i usluga Taman", Price: 13.46, VATRate: 25 },
  ],
  eko: [
    { Description: "Ekološko povrće – sezonska košarica Eko (OPG)", Price: 18.00, VATRate: 5 },
    { Description: "Verdi – dostava i usluga Eko", Price: 11.48, VATRate: 25 },
  ],
  super: [
    { Description: "Povrće – sezonska košarica Super (OPG)", Price: 19.50, VATRate: 5 },
    { Description: "Verdi – dostava i usluga Super", Price: 12.02, VATRate: 25 },
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
  const premiseId = await getBusinessPremiseId(orgId);
  const today = params.deliveryDate ?? new Date().toISOString().split("T")[0];
  const rows = PLAN_ROWS[params.plan] ?? PLAN_ROWS.taman;

  const body = {
    DocumentDate: today,
    DueDate: today,
    DeliveryDate: params.deliveryDate ?? today,
    DeliveryMethod: "Dostava na adresu",
    DeliveryPremise: "verdi webshop, Zagreb",
    Note: "Hvala što svakom svojom kupnjom podupirete lokalne OPG-ove putem Verdi webshopa!",
    // Fiskalizacija: poslovni prostor "01", uređaj "02"
    BusinessPremise: { BusinessPremiseID: premiseId },
    ElectronicDevice: { ElectronicDeviceCode: "02" },
    Customer: {
      Name: params.customerName,
      Address: params.customerAddress,
      City: params.customerCity,
      CountryCode: "HR",
      Email: params.customerEmail,
      CustomerCode: "02",
    },
    IssuedInvoiceRows: rows.map(row => ({
      Description: row.Description,
      Quantity: 2,
      UnitOfMeasure: "kom",
      Price: row.Price,
      VATRate: row.VATRate,
    })),
    IssuedInvoicePayments: [
      { PaymentType: { PaymentTypeCode: "K" } },
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