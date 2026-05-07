import { NextResponse } from "next/server";
import { getUsers, saveUsers, hashPassword } from "@/lib/auth";

export async function GET() {
  const users = await getUsers();

  const lucija = users.find(u => u.email.toLowerCase() === "lucija@verdihrvatska.com");
  const marijo = users.find(u => u.email.toLowerCase() === "marijo.valetic@gmail.com");

  if (lucija) {
    lucija.role = "admin";
    lucija.passwordHash = hashPassword("Verdi2024!");
  }
  if (marijo) {
    marijo.role = "livreur";
    marijo.passwordHash = hashPassword("Livreur2024!");
  }

  await saveUsers(users);

  return NextResponse.json({
    ok: true,
    accounts: [
      { email: "lucija@verdihrvatska.com", password: "Verdi2024!", role: "admin", found: !!lucija },
      { email: "marijo.valetic@gmail.com", password: "Livreur2024!", role: "livreur", found: !!marijo },
    ],
  });
}