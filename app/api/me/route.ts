import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getUsers } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("verdi_session")?.value;
  if (!token) return NextResponse.json({ user: null });

  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ user: null });

  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      role: user.role || "client",
    },
  });
}