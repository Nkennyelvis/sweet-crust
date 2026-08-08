"use client";

import { useRouter } from "next/navigation";
import { CURRENCIES, CURRENCY_COOKIE, type Currency } from "@/lib/currency";
import { setPreferenceCookie } from "@/lib/cookies";
import { cn } from "@/lib/cn";

export function CurrencyToggle({ currency }: { currency: Currency }) {
  const router = useRouter();

  function setCurrency(next: Currency) {
    setPreferenceCookie(CURRENCY_COOKIE, next);
    // Prices are formatted on the server, so the tree has to re-render there.
    router.refresh();
  }

  return (
    <div className="flex items-center rounded-full border border-current/20 text-[11px] font-semibold">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={`Show prices in ${c}`}
          aria-pressed={currency === c}
          onClick={() => setCurrency(c)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            currency === c ? "bg-current/15" : "opacity-60 hover:opacity-100",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
