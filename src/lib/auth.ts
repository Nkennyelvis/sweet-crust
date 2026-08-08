import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { StaffRole } from "@/lib/enums";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const COOKIE_NAME = "sweetcrust_staff_session";

export type StaffSession = {
  staffId: string;
  name: string;
  role: StaffRole;
};

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signStaffSession(session: StaffSession) {
  return jwt.sign(session, JWT_SECRET, { expiresIn: "7d" });
}

export async function setStaffSessionCookie(session: StaffSession) {
  const store = await cookies();
  store.set(COOKIE_NAME, signStaffSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearStaffSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as StaffSession;
  } catch {
    return null;
  }
}

/**
 * Guard for every Server Action behind /admin. Server Actions are reachable by
 * direct POST, not just through our UI, so each one has to check for itself —
 * the layout guard only protects rendering.
 */
export async function requireStaff(): Promise<StaffSession> {
  const session = await getStaffSession();
  if (!session) throw new Error("Not authorised");
  return session;
}
