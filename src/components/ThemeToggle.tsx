"use client";

import { useRouter } from "next/navigation";
import { THEME_COOKIE, type Theme } from "@/lib/theme-constants";
import { setPreferenceCookie } from "@/lib/cookies";
import { cn } from "@/lib/cn";

export function ThemeToggle({ theme }: { theme: Theme | null }) {
  const router = useRouter();

  function setTheme(next: Theme) {
    setPreferenceCookie(THEME_COOKIE, next);
    router.refresh();
  }

  return (
    <div className="flex items-center rounded-full border border-current/20 text-xs font-semibold">
      <button
        type="button"
        aria-label="Light mode"
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          theme === "light" ? "bg-current/15" : "opacity-60 hover:opacity-100",
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 3v1.5M12 19.5V21M4.6 4.6l1.1 1.1M18.3 18.3l1.1 1.1M3 12h1.5M19.5 12H21M4.6 19.4l1.1-1.1M18.3 5.7l1.1-1.1"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          theme === "dark" ? "bg-current/15" : "opacity-60 hover:opacity-100",
        )}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M20.5 14.5a8.5 8.5 0 1 1-9-11 7 7 0 0 0 9 11Z" />
        </svg>
      </button>
    </div>
  );
}
