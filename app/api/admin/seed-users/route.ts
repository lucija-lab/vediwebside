import { NextResponse } from "next/server";
import { getUsers, saveUsers, hashPassword } from "@/lib/auth";

export async function GET() {
  const users = await getUsers();

  const lucija = users.find(u => u.email.toLowerCase() === "lucija@verdihrvatska.com");
  const marijo = users.find(u => u.email.toLowerCase() === "marijo.valetic@gmail.com");

  if (lucija) {
    lucija.role = "admin";
    lucija.passwordHash = hashPassword("kinkyinky098!");
  }
  if (marijo) {
    marijo.role = "livreur";
    marijo.passwordHash = hashPassword("MarijoVerdi061");
  }

  await saveUsers(users);

  return NextResponse.json({
    ok: true,
    accounts: [
      { email: "lucija@verdihrvatska.com", role: "admin", found: !!lucija },
      { email: "marijo.valetic@gmail.com", role: "livreur", found: !!marijo },
    ],
  });
}