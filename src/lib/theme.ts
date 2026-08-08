import { cookies } from "next/headers";
import { THEME_COOKIE, type Theme } from "@/lib/theme-constants";

export { THEME_COOKIE, type Theme } from "@/lib/theme-constants";

// Returns null when the visitor hasn't explicitly chosen — in that case the
// CSS `@media (prefers-color-scheme: dark)` rule picks the default, so we
// deliberately don't guess here (avoids baking a wrong choice into SSR).
export async function getTheme(): Promise<Theme | null> {
  const store = await cookies();
  const val = store.get(THEME_COOKIE)?.value;
  return val === "light" || val === "dark" ? val : null;
}
