const BASE = "https://moj.minimax.hr/HR/API";

let cachedToken: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.token;

  const res = await fetch(`${BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      username: process.env.MINIMAX_USERNAME!,
      password: process.env.MINIMAX_PASSWORD!,
      client_id: process.env.MINIMAX_CLIENT_ID!,
      client_secret: process.env.MINIMAX_CLIENT_SECRET!,
      scope: "minimax",
    }),
  });

  if (!res.ok) throw new Error(`MiniMax auth failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

async function getOrgId(): Promise<number> {
  const token = await getToken();
  const res = await fetch(`${BASE}/api/orgs/allOrgs?startRowIndex=0&endRowIndex=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`MiniMax orgs error: ${res.status}`);
  const data = await res.json();
  const org = data?.Rows?.[0] ?? data?.[0];
  if (!org) throw new Error("No MiniMax organisation found");
  return org.OrganisationId ?? org.organisationId;
}

const PLAN_LABEL: Record<string, string> = {
  taman: "Košara Taman – mjesečna pretplata",
  eko: "Košara Eko – mjesečna pretplata",
  super: "Košara Super – mjesečna pretplata",
};

const PLAN_PRICE: Record<string, number> = {
  taman: 62,
  eko: 66.5,
  super: 71,
};

export async function createMinimaxInvoice(params: {
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerEmail: string;
  plan: string;
}) {
  const token = await getToken();
  const orgId = await getOrgId();
  const today = new Date().toISOString().split("T")[0];
  const price = PLAN_PRICE[params.plan] ?? 0;
  const label = PLAN_LABEL[params.plan] ?? params.plan;

  const body = {
    DocumentDate: today,
    DueDate: today,
    Customer: {
      Name: params.customerName,
      Address: params.customerAddress,
      City: params.customerCity,
      CountryCode: "HR",
      Email: params.customerEmail,
    },
    IssuedInvoiceRows: [
      {
        Description: label,
        Quantity: 1,
        UnitOfMeasure: "kom",
        Price: price,
        VATRate: 25,
      },
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
