import { NextResponse } from "next/server";
import { getUsers, saveUsers, hashPassword } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function GET() {
  const users = await getUsers();

  const upsert = (email: string, fields: object) => {
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...fields };
    } else {
      users.push({ id: randomBytes(12).toString("hex"), email, createdAt: new Date().toISOString(), phone: "", address: "", city: "", ...fields } as any);
    }
  };

  upsert("lucija@verdihrvatska.com", {
    firstName: "Lucija",
    lastName: "Verdi",
    role: "admin",
    passwordHash: hashPassword("kinkyinky098!"),
  });

  upsert("marijo.valetic@gmail.com", {
    firstName: "Marijo",
    lastName: "Valetić",
    role: "livreur",
    passwordHash: hashPassword("MarijoVerdi061"),
  });

  await saveUsers(users);

  return NextResponse.json({ ok: true });
}