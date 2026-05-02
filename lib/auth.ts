import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";
import fs from "fs";
import path from "path";

const SECRET = process.env.AUTH_SECRET || "verdi-secret-key-2024";
const USERS_FILE = path.join(process.cwd(), "data", "users.json");

export type UserRole = "client" | "admin" | "livreur";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  passwordHash: string;
  createdAt: string;
  role: UserRole;
}

export function getUsers(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]) {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const inputHash = scryptSync(password, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(inputHash, "hex"));
  } catch {
    return false;
  }
}

export function createToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): string | null {
  try {
    const [payload, sig] = token.split(".");
    const expected = createHmac("sha256", SECRET).update(payload).digest("base64url");
    if (sig !== expected) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Date.now()) return null;
    return data.userId;
  } catch {
    return null;
  }
}
