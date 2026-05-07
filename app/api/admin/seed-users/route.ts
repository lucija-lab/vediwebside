import { NextResponse } from "next/server";
import { getUsers, saveUsers, hashPassword } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function GET() {
  const users = await getUsers();

  const upsert = (email: string, defaults: Omit<Parameters<typeof hashPassword>[0] extends string ? any : any, "passwordHash">) => {
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...defaults };
    } else {
      users.push({ id: randomBytes(12).toString("hex"), ...defaults, email, createdAt: new Date().toISOString() });
    }
  };

  upsert("admin@verdihrvatska.com", {
    firstName: "Admin",
    lastName: "Verdi",
    phone: "099 821 6219",
    address: "Zagreb",
    city: "Zagreb",
    role: "admin",
    passwordHash: hashPassword("Verdi2024!"),
  });

  upsert("livreur@verdihrvatska.com", {
    firstName: "Livreur",
    lastName: "Test",
    phone: "091 000 0000",
    address: "Zagreb",
    city: "Zagreb",
    role: "livreur",
    passwordHash: hashPassword("Livreur2024!"),
  });

  await saveUsers(users);

  return NextResponse.json({
    ok: true,
    accounts: [
      { email: "admin@verdihrvatska.com", password: "Verdi2024!", role: "admin" },
      { email: "livreur@verdihrvatska.com", password: "Livreur2024!", role: "livreur" },
    ],
  });
}