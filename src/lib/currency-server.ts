import { cookies } from "next/headers";
import { CURRENCY_COOKIE, type Currency } from "@/lib/currency";

/** RWF is the default — USD is the opt-in view for diaspora customers. */
export async function getCurrency(): Promise<Currency> {
  const store = await cookies();
  return store.get(CURRENCY_COOKIE)?.value === "USD" ? "USD" : "RWF";
}
